/**
 * E-mails transacionais via Resend (https://resend.com).
 *
 * Sem RESEND_API_KEY configurada, todas as funções viram no-op silencioso —
 * o app continua funcionando, só não envia e-mail. Útil em dev.
 *
 * Uso:
 *   await sendEmail({ to, subject, html })
 *   await sendDonationEmails({ ... })
 */

import { createClient } from '@/lib/supabase/server'
import { captureException } from '@/lib/observability'

const RESEND_API_KEY = process.env.RESEND_API_KEY
const RESEND_FROM    = process.env.RESEND_FROM ?? 'Fauna <onboarding@resend.dev>'
const SITE_URL       = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'

type SendEmailArgs = {
  to:      string | string[]
  subject: string
  html:    string
  replyTo?: string
}

export async function sendEmail(args: SendEmailArgs): Promise<{ skipped: boolean; id?: string }> {
  if (!RESEND_API_KEY) {
    // Dev mode — só loga.
    console.log('[email:skipped]', { to: args.to, subject: args.subject })
    return { skipped: true }
  }

  try {
    const res = await fetch('https://api.resend.com/emails', {
      method:  'POST',
      headers: {
        Authorization:  `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from:     RESEND_FROM,
        to:       Array.isArray(args.to) ? args.to : [args.to],
        subject:  args.subject,
        html:     args.html,
        reply_to: args.replyTo,
      }),
    })

    if (!res.ok) {
      const text = await res.text()
      throw new Error(`Resend ${res.status}: ${text}`)
    }
    const data = await res.json() as { id: string }
    return { skipped: false, id: data.id }
  } catch (err) {
    await captureException(err, { scope: 'email:send', extra: { subject: args.subject } })
    return { skipped: true }
  }
}

// ── Templates ───────────────────────────────────────────────────

function layout(title: string, body: string): string {
  return `<!doctype html>
<html><body style="font-family: -apple-system, sans-serif; background: #f5f1e8; padding: 32px 16px; color: #1a1a1a;">
  <div style="max-width: 560px; margin: 0 auto; background: #fefcf6; border-radius: 8px; padding: 32px; border: 1px solid #e6dfc8;">
    <h1 style="font-family: Georgia, serif; font-weight: 300; font-size: 24px; margin: 0 0 16px; color: #2a3a2a;">${title}</h1>
    ${body}
    <hr style="border: none; border-top: 1px solid #e6dfc8; margin: 32px 0 16px;" />
    <p style="font-size: 12px; color: #888;">
      Fauna — plataforma para projetos de conservação da fauna<br/>
      <a href="${SITE_URL}" style="color: #5a7a5a;">${SITE_URL.replace(/^https?:\/\//, '')}</a>
    </p>
  </div>
</body></html>`
}

function fmtCurrency(amount: number, currency: string): string {
  try {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency }).format(amount)
  } catch {
    return `${currency} ${amount.toFixed(2)}`
  }
}

// ── Notificações ────────────────────────────────────────────────

type DonationEmailArgs = {
  donorEmail:   string
  donorName:    string
  amount:       number
  currency:     string
  projectTitle: string
  orgId:        string | null
}

/**
 * Dispara dois e-mails: um para o doador (confirmação) e um para a org (notificação).
 * Falhas são capturadas no Sentry — não relança.
 */
export async function sendDonationEmails(args: DonationEmailArgs) {
  const amountFmt = fmtCurrency(args.amount, args.currency)

  // E-mail ao doador.
  if (args.donorEmail) {
    await sendEmail({
      to:      args.donorEmail,
      subject: `Obrigado pela sua doação — ${args.projectTitle}`,
      html:    layout('Obrigado pela sua doação 🌱', `
        <p>Olá ${args.donorName || ''},</p>
        <p>Recebemos sua doação de <strong>${amountFmt}</strong> para o projeto
        <strong>${args.projectTitle}</strong>.</p>
        <p>Sua contribuição será aplicada diretamente no campo. Em breve você receberá
        atualizações do projeto por aqui.</p>
        <p style="margin-top: 24px;">
          <a href="${SITE_URL}/perfil" style="background: #5a7a5a; color: #fefcf6; padding: 10px 20px; text-decoration: none; border-radius: 4px; display: inline-block;">Ver minhas doações</a>
        </p>
      `),
    })
  }

  // E-mail à org — busca e-mail do dono.
  if (args.orgId) {
    try {
      const supabase = createClient()
      const { data: org } = await supabase
        .from('organizations')
        .select('name, user_id, profiles:profiles!user_id(email)')
        .eq('id', args.orgId)
        .single()

      const orgEmail = (org as any)?.profiles?.email
      const orgName  = (org as any)?.name ?? 'sua organização'

      if (orgEmail) {
        await sendEmail({
          to:      orgEmail,
          subject: `Nova doação recebida — ${args.projectTitle}`,
          html:    layout('Nova doação recebida 💚', `
            <p>Olá,</p>
            <p>${orgName} acabou de receber uma doação de <strong>${amountFmt}</strong>
            para o projeto <strong>${args.projectTitle}</strong>.</p>
            <p>Doador: ${args.donorName || 'Anônimo'}</p>
            <p style="margin-top: 24px;">
              <a href="${SITE_URL}/org/painel" style="background: #5a7a5a; color: #fefcf6; padding: 10px 20px; text-decoration: none; border-radius: 4px; display: inline-block;">Abrir painel</a>
            </p>
          `),
        })
      }
    } catch (err) {
      await captureException(err, { scope: 'email:donation:org', extra: { orgId: args.orgId } })
    }
  }
}

/**
 * Notifica a org quando admin marca como verified.
 * Chamar em /admin/organizations ao marcar verified=true.
 */
export async function sendOrgVerifiedEmail(orgEmail: string, orgName: string) {
  return sendEmail({
    to:      orgEmail,
    subject: `${orgName} foi verificada na Fauna`,
    html:    layout('Sua organização foi verificada ✓', `
      <p>Olá,</p>
      <p>A equipe da Fauna verificou <strong>${orgName}</strong>. Seu selo de organização
      verificada já aparece em todos os seus projetos.</p>
      <p>Próximos passos: conecte sua conta Stripe (se ainda não fez) para começar a receber doações.</p>
      <p style="margin-top: 24px;">
        <a href="${SITE_URL}/org/painel" style="background: #5a7a5a; color: #fefcf6; padding: 10px 20px; text-decoration: none; border-radius: 4px; display: inline-block;">Abrir painel</a>
      </p>
    `),
  })
}
