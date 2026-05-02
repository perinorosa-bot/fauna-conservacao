import { createClient } from '@/lib/supabase/server'
import { rateLimit } from '@/lib/rate-limit'
import { captureException } from '@/lib/observability'
import { sendOrgVerifiedEmail } from '@/lib/email'
import { NextRequest, NextResponse } from 'next/server'

/**
 * Admin marca/desmarca verificação de uma org. Quando verifica (true),
 * dispara e-mail para a org.
 *
 * RLS: a policy "admin manages organizations" (migration 004) já permite o update.
 */
export async function POST(req: NextRequest) {
  const limited = await rateLimit(req, { key: 'admin:org-verify', max: 30, windowSeconds: 60 })
  if (limited) return limited

  try {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (profile?.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { orgId, verified } = await req.json()
    if (!orgId || typeof verified !== 'boolean') {
      return NextResponse.json({ error: 'Invalid parameters' }, { status: 400 })
    }

    const { error: updErr } = await supabase
      .from('organizations')
      .update({ verified })
      .eq('id', orgId)
    if (updErr) throw updErr

    if (verified) {
      const { data: org } = await supabase
        .from('organizations')
        .select('name, user_id, profiles:profiles!user_id(email)')
        .eq('id', orgId)
        .single()

      const orgEmail = (org as any)?.profiles?.email
      const orgName  = (org as any)?.name
      if (orgEmail && orgName) {
        // Não bloqueia a resposta — falha de e-mail vai pro Sentry.
        sendOrgVerifiedEmail(orgEmail, orgName).catch(err =>
          captureException(err, { scope: 'admin:org-verify:email', extra: { orgId } }),
        )
      }
    }

    return NextResponse.json({ ok: true })
  } catch (err) {
    await captureException(err, { scope: 'admin:org-verify' })
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}
