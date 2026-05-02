import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { createClient } from '@/lib/supabase/server'
import { rateLimit } from '@/lib/rate-limit'
import { captureException } from '@/lib/observability'

// Stripe Customer Portal: dá ao doador uma UI hosted pela Stripe pra
// gerenciar assinaturas (cancelar, pausar), atualizar método de pagamento
// e ver histórico de cobranças. Sem UI custom da nossa parte.
//
// Pré-requisito: habilitar o portal em Stripe Dashboard → Settings →
// Billing → Customer Portal (test e live).
export async function POST(req: NextRequest) {
  const limited = await rateLimit(req, { key: 'stripe:portal', max: 10, windowSeconds: 60 })
  if (limited) return limited

  try {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { data: profile } = await supabase
      .from('profiles')
      .select('stripe_customer_id')
      .eq('id', user.id)
      .maybeSingle()

    if (!profile?.stripe_customer_id) {
      return NextResponse.json(
        { error: 'Nenhuma assinatura encontrada para este usuário.' },
        { status: 404 },
      )
    }

    const siteUrl   = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'
    const returnUrl = `${siteUrl}/perfil`

    const session = await stripe.billingPortal.sessions.create({
      customer:   profile.stripe_customer_id,
      return_url: returnUrl,
    })

    return NextResponse.json({ url: session.url })
  } catch (err: any) {
    await captureException(err, { scope: 'stripe:portal' })
    return NextResponse.json(
      { error: err?.message ?? 'Erro ao abrir o portal de cobranças.' },
      { status: 500 },
    )
  }
}
