import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const supabase = createClient()
  const body = await request.json()

  const { project_id, donor_name, donor_email, amount, currency, message, anonymous } = body

  if (!project_id || !donor_name || !donor_email || !amount) {
    return NextResponse.json({ error: 'Campos obrigatórios faltando' }, { status: 400 })
  }

  if (amount <= 0) {
    return NextResponse.json({ error: 'Valor inválido' }, { status: 400 })
  }

  // Verify project exists
  const { data: project } = await supabase
    .from('projects')
    .select('id, status, raised_amount')
    .eq('id', project_id)
    .single()

  if (!project || project.status !== 'active') {
    return NextResponse.json({ error: 'Projeto não encontrado ou inativo' }, { status: 404 })
  }

  // Get user if logged in
  const { data: { user } } = await supabase.auth.getUser()

  const { data, error } = await supabase
    .from('donations')
    .insert({
      project_id,
      user_id:     user?.id ?? null,
      donor_name:  anonymous ? 'Anônimo' : donor_name,
      donor_email,
      amount:      Number(amount),
      currency:    currency ?? 'BRL',
      message:     message ?? null,
      anonymous:   anonymous ?? false,
    })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  // Actualiza el monto recaudado del proyecto
  await supabase
    .from('projects')
    .update({ raised_amount: project.raised_amount + Number(amount) })
    .eq('id', project_id)

  // TODO: Aqui entraria a integração com Stripe para processar o pagamento real

  return NextResponse.json(data, { status: 201 })
}

export async function GET(request: Request) {
  const supabase = createClient()
  const { searchParams } = new URL(request.url)
  const projectId = searchParams.get('project_id')

  if (!projectId) return NextResponse.json({ error: 'project_id obrigatório' }, { status: 400 })

  const { data, error } = await supabase
    .from('donations')
    .select('donor_name, amount, message, anonymous, created_at')
    .eq('project_id', projectId)
    .order('created_at', { ascending: false })
    .limit(20)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}
