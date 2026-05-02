import { createClient } from '@/lib/supabase/server'
import { stripe } from '@/lib/stripe'
import { rateLimit } from '@/lib/rate-limit'
import { captureException } from '@/lib/observability'
import { NextRequest, NextResponse } from 'next/server'
import type Stripe from 'stripe'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

// Single Stripe Product reused across every recurring donation, so we
// don't create a new Product per subscription. Each subscription still
// gets its own ad-hoc Price (donor picks the amount).
const RECURRING_PRODUCT_NAME = 'Doação recorrente Fauna'

async function getOrCreateRecurringProductId(): Promise<string> {
  const existing = await stripe.products.search({
    query: `active:'true' AND name:'${RECURRING_PRODUCT_NAME}'`,
    limit: 1,
  })
  if (existing.data[0]) return existing.data[0].id
  const product = await stripe.products.create({ name: RECURRING_PRODUCT_NAME })
  return product.id
}

async function getOrCreateCustomer(email: string, name: string): Promise<Stripe.Customer> {
  const found = await stripe.customers.list({ email, limit: 1 })
  if (found.data[0]) return found.data[0]
  return stripe.customers.create({ email, name: name || undefined })
}

export async function POST(req: NextRequest) {
  const limited = await rateLimit(req, { key: 'donations:create', max: 10, windowSeconds: 60 })
  if (limited) return limited

  try {
    const {
      projectId,
      amount,
      currency = 'brl',
      donorName,
      donorEmail,
      message,
      recurring = false,
    } = await req.json()

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

    const metadata: Record<string, string> = {
      project_id:    projectId,
      project_title: (project as any).title,
      org_id:        org.id,
      org_name:      org.name,
      donor_user_id: user?.id ?? '',
      donor_email:   email,
      donor_name:    donorName ?? '',
      message:       message ?? '',
    }

    // ── Recurring (Stripe Subscription with Connect destination charges) ──
    if (recurring) {
      const productId = await getOrCreateRecurringProductId()
      const customer  = await getOrCreateCustomer(email, donorName ?? '')

      const price = await stripe.prices.create({
        unit_amount: amount,
        currency,
        recurring: { interval: 'month' },
        product:   productId,
      })

      const subscription = await stripe.subscriptions.create({
        customer:        customer.id,
        items:           [{ price: price.id }],
        payment_behavior: 'default_incomplete',
        payment_settings: { save_default_payment_method: 'on_subscription' },
        expand:          ['latest_invoice.payment_intent'],
        transfer_data:   { destination: org.stripe_account_id },
        metadata,
      })

      // Stripe SDK v22 dropped these props from the type defs but they
      // are still returned at runtime when expand: 'latest_invoice.payment_intent'.
      const invoice = subscription.latest_invoice as Stripe.Invoice
      const pi      = (invoice as any)?.payment_intent as Stripe.PaymentIntent | null
      if (!pi?.client_secret) {
        return NextResponse.json({ error: 'Failed to initialize subscription payment' }, { status: 500 })
      }

      const periodEnd = (subscription as any).current_period_end as number | null

      // Persist subscription. Status will move from 'incomplete' to 'active'
      // when the first invoice's PaymentIntent succeeds (handled by webhook).
      const { error: insertErr } = await supabase.from('subscriptions').insert({
        donor_user_id:          user?.id ?? null,
        donor_email:            email,
        donor_name:             donorName ?? null,
        project_id:             projectId,
        organization_id:        org.id,
        stripe_subscription_id: subscription.id,
        stripe_customer_id:     customer.id,
        amount:                 amount / 100,
        currency:               currency.toUpperCase(),
        status:                 subscription.status,
        current_period_end:     periodEnd ? new Date(periodEnd * 1000).toISOString() : null,
      })
      if (insertErr) console.error('[donations/create] subscriptions insert failed', insertErr)

      return NextResponse.json({ clientSecret: pi.client_secret, subscriptionId: subscription.id })
    }

    // ── One-time (PaymentIntent) ──
    const paymentIntent = await stripe.paymentIntents.create({
      amount,           // in cents: R$ 50 = 5000
      currency,
      receipt_email: email,
      transfer_data: { destination: org.stripe_account_id },
      metadata,
    })

    return NextResponse.json({ clientSecret: paymentIntent.client_secret })
  } catch (err: any) {
    await captureException(err, { scope: 'donations:create' })
    return NextResponse.json(
      { error: err?.message ?? 'Erro ao iniciar doação.' },
      { status: 500 },
    )
  }
}
