import { createClient } from '@/lib/supabase/server'
import { stripe } from '@/lib/stripe'
import { NextResponse } from 'next/server'

// Creates a Stripe Connect onboarding link for the org
export async function POST() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data: org } = await supabase
    .from('organizations')
    .select('id, stripe_account_id')
    .eq('user_id', user.id)
    .single()

  if (!org) return NextResponse.json({ error: 'Organization not found' }, { status: 404 })

  // Re-use existing account or create new Express account
  let accountId = org.stripe_account_id
  if (!accountId) {
    try {
      const account = await stripe.accounts.create({ type: 'express' })
      accountId = account.id
      await supabase.from('organizations').update({ stripe_account_id: accountId }).eq('id', org.id)
    } catch (err: any) {
      console.error('[stripe/connect] accounts.create error:', err)
      return NextResponse.json({ error: err.message ?? 'Failed to create Stripe account' }, { status: 500 })
    }
  }

  const origin = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'
  try {
    const accountLink = await stripe.accountLinks.create({
      account: accountId,
      refresh_url: `${origin}/api/stripe/connect/refresh`,
      return_url:  `${origin}/api/stripe/connect/return`,
      type: 'account_onboarding',
    })
    return NextResponse.json({ url: accountLink.url })
  } catch (err: any) {
    console.error('[stripe/connect] accountLinks error:', err)
    return NextResponse.json({ error: err.message ?? 'Stripe error' }, { status: 500 })
  }
}
