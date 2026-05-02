import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { createClient } from '@/lib/supabase/server'

// Doador cancela uma doação recorrente. A próxima cobrança não acontece;
// o ciclo em curso é mantido (cancel_at_period_end). Stripe dispara
// customer.subscription.updated → webhook sincroniza a DB.
export async function POST(req: NextRequest) {
  const { subscriptionId } = await req.json().catch(() => ({}))
  if (!subscriptionId) {
    return NextResponse.json({ error: 'subscriptionId obrigatório' }, { status: 400 })
  }

  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  // RLS garante que só achamos rows do próprio doador.
  const { data: sub } = await supabase
    .from('subscriptions')
    .select('id, stripe_subscription_id, status, donor_user_id')
    .eq('id', subscriptionId)
    .maybeSingle()

  if (!sub || sub.donor_user_id !== user.id) {
    return NextResponse.json({ error: 'Subscription não encontrada' }, { status: 404 })
  }
  if (sub.status === 'canceled') {
    return NextResponse.json({ ok: true, alreadyCanceled: true })
  }

  await stripe.subscriptions.update(sub.stripe_subscription_id, {
    cancel_at_period_end: true,
  })

  // Optimistic update — webhook will reconfirm shortly.
  await supabase
    .from('subscriptions')
    .update({ cancel_at_period_end: true })
    .eq('id', sub.id)

  return NextResponse.json({ ok: true })
}
