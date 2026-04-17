import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

type CartItem = {
  id: string
  name: string
  subtitle: string
  price: number
  image: string
  qty: number
  selectedSize?: string
}

export async function POST(req: NextRequest) {
  try {
    const { items }: { items: CartItem[] } = await req.json()

    if (!items || items.length === 0) {
      return NextResponse.json({ error: 'Carrinho vazio.' }, { status: 400 })
    }

    const origin = req.nextUrl.origin

    const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] = items.map(item => ({
      quantity: item.qty,
      price_data: {
        currency: 'brl',
        unit_amount: Math.round(item.price * 100),
        product_data: {
          name: item.selectedSize ? `${item.name} — ${item.selectedSize}` : item.name,
          description: item.subtitle,
          images: [item.image],
        },
      },
    }))

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      line_items,
      shipping_address_collection: { allowed_countries: ['BR'] },
      shipping_options: [
        {
          shipping_rate_data: {
            type: 'fixed_amount',
            fixed_amount: { amount: 1900, currency: 'brl' },
            display_name: 'Entrega padrão',
            delivery_estimate: {
              minimum: { unit: 'business_day', value: 5 },
              maximum: { unit: 'business_day', value: 10 },
            },
          },
        },
        {
          shipping_rate_data: {
            type: 'fixed_amount',
            fixed_amount: { amount: 0, currency: 'brl' },
            display_name: 'Frete grátis (acima de R$ 200)',
            delivery_estimate: {
              minimum: { unit: 'business_day', value: 7 },
              maximum: { unit: 'business_day', value: 12 },
            },
          },
        },
      ],
      metadata: {
        source: 'fauna-shop',
        items: JSON.stringify(items.map(i => ({ id: i.id, qty: i.qty, size: i.selectedSize ?? '' }))),
      },
      success_url: `${origin}/loja/sucesso?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url:  `${origin}/loja`,
    })

    return NextResponse.json({ url: session.url })
  } catch (err: unknown) {
    console.error('[stripe/shop-checkout]', err)
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Erro interno.' },
      { status: 500 }
    )
  }
}
