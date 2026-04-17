import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return request.cookies.getAll() },
        setAll(cookiesToSet: { name: string; value: string; options?: object }[]) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options as any)
          )
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()
  const path = request.nextUrl.pathname

  // ── Admin routes ──────────────────────────────────────────────
  const isAdminLogin = path === '/admin/login'
  const isAdminRoute = path.startsWith('/admin') && !isAdminLogin

  if (isAdminRoute) {
    if (!user) {
      return NextResponse.redirect(new URL('/admin/login', request.url))
    }
    const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
    if (!profile || profile.role !== 'admin') {
      return NextResponse.redirect(new URL('/', request.url))
    }
  }

  // ── Org routes ────────────────────────────────────────────────
  const isOrgLogin  = path === '/org/login'
  const isOrgRoute  = path.startsWith('/org/') && !isOrgLogin

  if (isOrgRoute) {
    if (!user) {
      return NextResponse.redirect(new URL('/entrar', request.url))
    }
    // Must have an organization record
    const { data: org } = await supabase.from('organizations').select('id').eq('user_id', user.id).single()
    if (!org) {
      return NextResponse.redirect(new URL('/organizacoes/cadastro', request.url))
    }
  }

  return supabaseResponse
}

export const config = {
  matcher: ['/admin/:path*', '/org/:path*'],
}