import { createClient } from '@/lib/supabase/server'
import { stripe } from '@/lib/stripe'
import { NextRequest, NextResponse } from 'next/server'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export async function POST(req: NextRequest) {
  const { projectId, amount, currency = 'brl', donorName, donorEmail, message } = await req.json()

  if (!projectId || !amount || amount < 100) {
    return NextResponse.json({ error: 'Invalid parameters' }, { status: 400 })
  }

  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // Form value wins; fall back to the session email for logged-in donors.
  const email = (donorEmail ?? '').trim() || user?.email || ''
  if (!email || !EMAIL_RE.test(email)) {
    return NextResponse.json({ error: 'E-mail inválido.' }, { status: 400 })
  }

  // Get project + org stripe account
  const { data: project } = await supabase
    .from('projects')
    .select('id, title, organization:organizations(id, name, stripe_account_id)')
    .eq('id', projectId)
    .single()

  if (!project) return NextResponse.json({ error: 'Project not found' }, { status: 404 })

  const org = (project.organization as unknown) as { id: string; name: string; stripe_account_id: string | null } | null
  if (!org?.stripe_account_id) {
    return NextResponse.json({ error: 'Organization has not connected Stripe yet' }, { status: 400 })
  }

  const paymentIntent = await stripe.paymentIntents.create({
    amount,           // in cents: R$ 50 = 5000
    currency,
    receipt_email: email,
    transfer_data: {
      destination: org.stripe_account_id,
    },
    metadata: {
      project_id:   projectId,
      project_title: (project as any).title,
      org_id:       org.id,
      org_name:     org.name,
      donor_user_id: user?.id ?? '',
      donor_email:  email,
      donor_name:   donorName ?? '',
      message:      message ?? '',
    },
  })

  return NextResponse.json({ clientSecret: paymentIntent.client_secret })
}
