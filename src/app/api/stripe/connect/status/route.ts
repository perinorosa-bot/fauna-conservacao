import { createClient } from '@/lib/supabase/server'
import { stripe } from '@/lib/stripe'
import { NextResponse } from 'next/server'

// Returns the org's Stripe Connect status
export async function GET() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ connected: false })

  const { data: org } = await supabase
    .from('organizations')
    .select('stripe_account_id')
    .eq('user_id', user.id)
    .single()

  if (!org?.stripe_account_id) return NextResponse.json({ connected: false })

  try {
    const account = await stripe.accounts.retrieve(org.stripe_account_id)
    const connected = account.details_submitted && !account.requirements?.currently_due?.length
    return NextResponse.json({
      connected,
      detailsSubmitted: account.details_submitted,
      accountId: org.stripe_account_id,
    })
  } catch {
    return NextResponse.json({ connected: false })
  }
}
