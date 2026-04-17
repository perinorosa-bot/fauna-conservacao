import { createClient } from '@/lib/supabase/server'
import { stripe } from '@/lib/stripe'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const { projectId, amount, currency = 'brl', donorName, message } = await req.json()

  if (!projectId || !amount || amount < 100) {
    return NextResponse.json({ error: 'Invalid parameters' }, { status: 400 })
  }

  const supabase = createClient()

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

  // Get logged-in user if any
  const { data: { user } } = await supabase.auth.getUser()

  const paymentIntent = await stripe.paymentIntents.create({
    amount,           // in cents: R$ 50 = 5000
    currency,
    transfer_data: {
      destination: org.stripe_account_id,
    },
    metadata: {
      project_id:   projectId,
      project_title: (project as any).title,
      org_id:       org.id,
      org_name:     org.name,
      donor_user_id: user?.id ?? '',
      donor_name:   donorName ?? '',
      message:      message ?? '',
    },
  })

  return NextResponse.json({ clientSecret: paymentIntent.client_secret })
}
