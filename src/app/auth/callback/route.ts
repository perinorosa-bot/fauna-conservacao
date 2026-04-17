import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

async function redirectByRole(origin: string, fallback: string): Promise<string> {
  try {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single()
      if (profile?.role === 'organization') return `${origin}/org/painel`
      if (profile?.role === 'admin')        return `${origin}/admin`
    }
  } catch {}
  return `${origin}${fallback}`
}

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)
  const code       = searchParams.get('code')
  const token_hash = searchParams.get('token_hash')
  const type       = (searchParams.get('type') ?? 'email') as 'email'
  const next       = searchParams.get('next') ?? '/perfil'

  const supabase = createClient()

  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (error) return NextResponse.redirect(`${origin}/entrar?erro=link_invalido`)
    return NextResponse.redirect(await redirectByRole(origin, next))
  }

  if (token_hash) {
    const { error } = await supabase.auth.verifyOtp({ token_hash, type })
    if (error) return NextResponse.redirect(`${origin}/entrar?erro=link_invalido`)
    return NextResponse.redirect(await redirectByRole(origin, next))
  }

  return NextResponse.redirect(`${origin}/entrar?erro=link_invalido`)
}
