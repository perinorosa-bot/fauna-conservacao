import { NextRequest, NextResponse } from 'next/server'
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

  let event
  try {
    event = stripe.webhooks.constructEvent(body, signature, secret)
  } catch (err) {
    await captureException(err, { scope: 'webhook:stripe', extra: { reason: 'signature' } })
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  const supabase = createClient()

  try {
    if (event.type === 'payment_intent.succeeded') {
      const pi   = event.data.object
      const meta = pi.metadata ?? {}

      if (meta.project_id) {
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
