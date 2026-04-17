import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { createClient } from '@/lib/supabase/server'

export async function POST(req: NextRequest) {
  const body      = await req.text()
  const signature = req.headers.get('stripe-signature') ?? ''
  const secret    = process.env.STRIPE_WEBHOOK_SECRET

  if (!secret) return NextResponse.json({ error: 'Webhook secret not configured' }, { status: 500 })

  let event
  try {
    event = stripe.webhooks.constructEvent(body, signature, secret)
  } catch (err) {
    console.error('[webhook] signature error', err)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  // Donation via Checkout Session
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object
    const meta    = session.metadata ?? {}
    const supabase = createClient()

    if (meta.project_id) {
      await supabase.from('donations').insert({
        project_id:                meta.project_id,
        user_id:                   meta.donor_user_id || null,
        donor_name:                meta.donor_name    || 'Anônimo',
        donor_email:               meta.donor_email   || '',
        amount:                    Number(meta.amount),
        currency:                  (meta.currency    || 'BRL').toUpperCase(),
        message:                   meta.message       || null,
        anonymous:                 meta.anonymous === 'true',
        stripe_payment_intent_id:  typeof session.payment_intent === 'string'
                                     ? session.payment_intent
                                     : null,
      })

      // Update raised_amount on the project
      const { data: project } = await supabase
        .from('projects')
        .select('raised_amount')
        .eq('id', meta.project_id)
        .single()

      if (project) {
        await supabase
          .from('projects')
          .update({ raised_amount: project.raised_amount + Number(meta.amount) })
          .eq('id', meta.project_id)
      }
    }
  }

  return NextResponse.json({ received: true })
}
