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

  if (!org?.stripe_account_id) return NextResponse.json({ connected: false, needsOnboarding: true })

  try {
    const account = await stripe.accounts.retrieve(org.stripe_account_id)

    const transfersStatus    = account.capabilities?.transfers     ?? 'inactive'
    const cardPaymentsStatus = account.capabilities?.card_payments ?? 'inactive'

    // A donation via PaymentIntent + transfer_data.destination requires BOTH
    // charges_enabled AND the transfers capability to be 'active'. Without
    // both, Stripe returns `insufficient_capabilities_for_transfer`.
    const connected =
      account.charges_enabled === true &&
      transfersStatus         === 'active'

    const currentlyDue = account.requirements?.currently_due ?? []
    const needsOnboarding = !connected && (
      !account.details_submitted || currentlyDue.length > 0
    )

    return NextResponse.json({
      connected,
      needsOnboarding,
      accountId:        org.stripe_account_id,
      chargesEnabled:   account.charges_enabled,
      payoutsEnabled:   account.payouts_enabled,
      detailsSubmitted: account.details_submitted,
      transfersStatus,
      cardPaymentsStatus,
      requirementsDue:  currentlyDue,
      disabledReason:   account.requirements?.disabled_reason ?? null,
    })
  } catch {
    return NextResponse.json({ connected: false })
  }
}
