import { NextRequest, NextResponse } from 'next/server'
import type Stripe from 'stripe'
import { stripe } from '@/lib/stripe'
import { createClient } from '@/lib/supabase/server'
import { captureException } from '@/lib/observability'
import { sendDonationEmails } from '@/lib/email'

export async function POST(req: NextRequest) {
  const body      = await req.text()
  const signature = req.headers.get('stripe-signature') ?? ''
  const secret    = process.env.STRIPE_WEBHOOK_SECRET

  if (!secret) {
    await captureException(new Error('STRIPE_WEBHOOK_SECRET not set'), { scope: 'webhook:stripe' })
    return NextResponse.json({ error: 'Webhook secret not configured' }, { status: 500 })
  }

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(body, signature, secret)
  } catch (err) {
    await captureException(err, { scope: 'webhook:stripe', extra: { reason: 'signature' } })
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  const supabase = createClient()

  try {
    switch (event.type) {
      // ── One-time donations ─────────────────────────────────────
      case 'payment_intent.succeeded': {
        const pi   = event.data.object as Stripe.PaymentIntent
        const meta = pi.metadata ?? {}

        // Skip when this PaymentIntent belongs to a Subscription invoice —
        // the recurring branch (invoice.payment_succeeded) handles those,
        // and we don't want to double-insert.
        if ((pi as any).invoice) break
        if (!meta.project_id) break

        const { data: existing } = await supabase
          .from('donations')
          .select('id')
          .eq('stripe_payment_intent_id', pi.id)
          .maybeSingle()

        if (!existing) {
          const donorEmail = (meta.donor_email || pi.receipt_email || '') as string
          const donorName  = (meta.donor_name  || 'Anônimo') as string
          const amount     = pi.amount / 100
          const currency   = pi.currency.toUpperCase()

          const { error: insertErr } = await supabase.from('donations').insert({
            project_id:               meta.project_id,
            user_id:                  meta.donor_user_id || null,
            donor_name:               donorName,
            donor_email:              donorEmail,
            amount,
            currency,
            message:                  meta.message       || null,
            anonymous:                meta.anonymous === 'true',
            stripe_payment_intent_id: pi.id,
          })
          if (insertErr) throw insertErr
          // raised_amount is updated by the on_donation_created SQL trigger.

          // E-mail ao doador + à org (não bloqueia a resposta do webhook).
          sendDonationEmails({
            donorEmail,
            donorName,
            amount,
            currency,
            projectTitle: (meta.project_title as string) || '',
            orgId:        (meta.org_id as string) || null,
          }).catch(err => captureException(err, { scope: 'webhook:stripe:email' }))
        }
        break
      }

      // ── Recurring: each successful invoice (first + every renewal) ──
      case 'invoice.payment_succeeded': {
        const invoice = event.data.object as Stripe.Invoice
        const subId   = (invoice as any).subscription as string | null
        if (!subId) break

        // Fetch subscription so we have the canonical metadata + status
        const sub  = await stripe.subscriptions.retrieve(subId)
        const meta = sub.metadata ?? {}
        if (!meta.project_id) break

        // Idempotent insert keyed by invoice.id (UNIQUE in DB)
        const { data: existing } = await supabase
          .from('donations')
          .select('id')
          .eq('stripe_invoice_id', invoice.id)
          .maybeSingle()

        if (!existing) {
          // Resolve subscription row to link the donation back
          const { data: subRow } = await supabase
            .from('subscriptions')
            .select('id')
            .eq('stripe_subscription_id', sub.id)
            .maybeSingle()

          const donorEmail = (meta.donor_email || invoice.customer_email || '') as string
          const donorName  = (meta.donor_name  || 'Anônimo') as string
          const amount     = (invoice.amount_paid ?? 0) / 100
          const currency   = (invoice.currency ?? 'brl').toUpperCase()

          const { error: insertErr } = await supabase.from('donations').insert({
            project_id:               meta.project_id,
            user_id:                  meta.donor_user_id || null,
            donor_name:               donorName,
            donor_email:              donorEmail,
            amount,
            currency,
            message:                  meta.message       || null,
            anonymous:                meta.anonymous === 'true',
            stripe_invoice_id:        invoice.id,
            subscription_id:          subRow?.id ?? null,
          })
          if (insertErr) throw insertErr

          // E-mail por cada cobrança (primeira + renovações).
          sendDonationEmails({
            donorEmail,
            donorName,
            amount,
            currency,
            projectTitle: (meta.project_title as string) || '',
            orgId:        (meta.org_id as string) || null,
          }).catch(err => captureException(err, { scope: 'webhook:stripe:email' }))
        }

        // Sync subscription state (status moves to 'active' on first paid invoice)
        const periodEnd = (sub as any).current_period_end as number | null
        await supabase
          .from('subscriptions')
          .update({
            status:             sub.status,
            current_period_end: periodEnd ? new Date(periodEnd * 1000).toISOString() : null,
          })
          .eq('stripe_subscription_id', sub.id)
        break
      }

      // ── Subscription lifecycle (cancel_at_period_end toggle, paused, etc) ──
      case 'customer.subscription.updated': {
        const sub = event.data.object as Stripe.Subscription
        const periodEnd = (sub as any).current_period_end as number | null
        await supabase
          .from('subscriptions')
          .update({
            status:               sub.status,
            cancel_at_period_end: sub.cancel_at_period_end,
            current_period_end:   periodEnd ? new Date(periodEnd * 1000).toISOString() : null,
            canceled_at:          sub.canceled_at
              ? new Date(sub.canceled_at * 1000).toISOString()
              : null,
          })
          .eq('stripe_subscription_id', sub.id)
        break
      }

      case 'customer.subscription.deleted': {
        const sub = event.data.object as Stripe.Subscription
        await supabase
          .from('subscriptions')
          .update({
            status:      'canceled',
            canceled_at: new Date().toISOString(),
          })
          .eq('stripe_subscription_id', sub.id)
        break
      }
    }
  } catch (err) {
    await captureException(err, {
      scope: 'webhook:stripe',
      extra: { eventType: event.type, eventId: event.id },
    })
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }

  return NextResponse.json({ received: true })
}
