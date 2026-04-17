import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const supabase = createClient()
  const { searchParams } = new URL(request.url)

  const biome   = searchParams.get('biome')
  const country = searchParams.get('country')
  const limit   = Number(searchParams.get('limit') ?? 20)

  let query = supabase
    .from('projects')
    .select('*, organization:organizations(name, slug, logo_url)')
    .eq('status', 'active')
    .order('created_at', { ascending: false })
    .limit(limit)

  if (biome)   query = query.eq('biome', biome)
  if (country) query = query.eq('country', country)

  const { data, error } = await query

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

export async function POST(request: Request) {
  const supabase = createClient()

  // Verify auth
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })

  // Verify org ownership
  const { data: org } = await supabase
    .from('organizations')
    .select('id')
    .eq('user_id', user.id)
    .single()

  if (!org) return NextResponse.json({ error: 'Organização não encontrada' }, { status: 404 })

  const body = await request.json()

  const { title, slug, description, full_description, species, biome, country,
          lat, lng, cover_image_url, goal_amount, currency, tags } = body

  const { data, error } = await supabase
    .from('projects')
    .insert({
      organization_id: org.id,
      title, slug, description, full_description, species, biome, country,
      lat: lat ?? null,
      lng: lng ?? null,
      cover_image_url: cover_image_url ?? null,
      goal_amount,
      raised_amount: 0,
      currency: currency ?? 'BRL',
      status: 'active',
      tags: tags ?? [],
    })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data, { status: 201 })
}
