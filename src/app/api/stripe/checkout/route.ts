import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createClient } from '@/lib/supabase/server'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

export async function POST(req: NextRequest) {
  try {
    const { project_id, amount, currency, donor_name, donor_email, message, anonymous } =
      await req.json()

    if (!project_id || !amount || !currency || !donor_email) {
      return NextResponse.json({ error: 'Campos obrigatórios faltando.' }, { status: 400 })
    }

    // Fetch project info for the Stripe line item label
    const supabase = createClient()
    const { data: project } = await supabase
      .from('projects')
      .select('title, slug')
      .eq('id', project_id)
      .single()

    if (!project) {
      return NextResponse.json({ error: 'Projeto não encontrado.' }, { status: 404 })
    }

    // Stripe expects amounts in the smallest currency unit (centavos for BRL)
    const unitAmount = Math.round(Number(amount) * 100)

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      customer_email: donor_email,
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: currency.toLowerCase(),
            unit_amount: unitAmount,
            product_data: {
              name: `Doação — ${project.title}`,
              description: 'Taxa zero. 100% vai para o projeto.',
            },
          },
        },
      ],
      metadata: {
        project_id,
        donor_name: donor_name ?? donor_email.split('@')[0],
        donor_email,
        amount: String(amount),
        currency,
        message: message ?? '',
        anonymous: String(!!anonymous),
      },
      success_url: `${req.nextUrl.origin}/doacao/sucesso?projeto=${project.slug}`,
      cancel_url:  `${req.nextUrl.origin}/projetos/${project.slug}`,
    })

    return NextResponse.json({ url: session.url })
  } catch (err: unknown) {
    console.error('[stripe/checkout]', err)
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Erro interno.' },
      { status: 500 }
    )
  }
}