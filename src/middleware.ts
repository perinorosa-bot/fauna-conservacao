import { createServerClient } from '@supabase/ssr'
import createIntlMiddleware from 'next-intl/middleware'
import { NextResponse, type NextRequest } from 'next/server'
import { routing, type Locale } from './i18n/routing'

const intlMiddleware = createIntlMiddleware(routing)

// Strips a leading /en, /es, /pt (if present) so auth guards can match
// on the logical path regardless of locale.
function stripLocale(pathname: string) {
  const m = pathname.match(/^\/(pt|en|es)(?=\/|$)/)
  if (!m) return { locale: routing.defaultLocale, rest: pathname || '/' }
  const rest = pathname.slice(m[0].length) || '/'
  return { locale: m[1] as Locale, rest }
}

// Build a URL preserving the current locale prefix (empty for defaultLocale
// when localePrefix is 'as-needed').
function localizedUrl(locale: Locale, path: string, base: string) {
  const prefix = locale === routing.defaultLocale ? '' : `/${locale}`
  return new URL(`${prefix}${path}`, base)
}

export async function middleware(request: NextRequest) {
  // Legacy-cookie migration: the previous custom LanguageContext used
  // `fauna-lang`. Carry it over once to `NEXT_LOCALE` (what next-intl reads)
  // and delete the old cookie. Self-heals on first visit per user.
  const legacyLang = request.cookies.get('fauna-lang')?.value
  const nextLocale = request.cookies.get('NEXT_LOCALE')?.value
  if (legacyLang && !nextLocale && ['pt', 'en', 'es'].includes(legacyLang)) {
    request.cookies.set('NEXT_LOCALE', legacyLang)
  }

  const intlResponse = intlMiddleware(request)

  if (legacyLang && !nextLocale && ['pt', 'en', 'es'].includes(legacyLang)) {
    intlResponse.cookies.set('NEXT_LOCALE', legacyLang, {
      path: '/',
      maxAge: 60 * 60 * 24 * 365,
      sameSite: 'lax',
    })
    intlResponse.cookies.delete('fauna-lang')
  } else if (legacyLang && nextLocale) {
    // Old cookie no longer needed
    intlResponse.cookies.delete('fauna-lang')
  }

  // If next-intl wants to redirect (locale detection / negotiation), honour it
  // before running any auth logic.
  if (intlResponse.status >= 300 && intlResponse.status < 400) {
    return intlResponse
  }

  const { pathname } = request.nextUrl
  const { locale, rest } = stripLocale(pathname)

  const onlyAuthGated =
    rest.startsWith('/admin') || rest.startsWith('/org/')
  if (!onlyAuthGated) return intlResponse

  // Supabase session refresh. We pipe cookie mutations into BOTH the request
  // (so downstream reads see them) and the intl response (so the browser
  // receives the refreshed session).
  let response = intlResponse
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return request.cookies.getAll() },
        setAll(cookiesToSet: { name: string; value: string; options?: object }[]) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options as any)
          )
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()

  // Admin guards
  const isAdminLogin = rest === '/admin/login'
  const isAdminRoute = rest.startsWith('/admin') && !isAdminLogin

  if (isAdminRoute) {
    if (!user) {
      return NextResponse.redirect(localizedUrl(locale, '/admin/login', request.url))
    }
    const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
    if (!profile || profile.role !== 'admin') {
      return NextResponse.redirect(localizedUrl(locale, '/', request.url))
    }
  }

  // Org guards
  const isOrgLogin = rest === '/org/login'
  const isOrgRoute = rest.startsWith('/org/') && !isOrgLogin

  if (isOrgRoute) {
    if (!user) {
      return NextResponse.redirect(localizedUrl(locale, '/entrar', request.url))
    }
    const { data: org } = await supabase.from('organizations').select('id').eq('user_id', user.id).single()
    if (!org) {
      return NextResponse.redirect(localizedUrl(locale, '/organizacoes/cadastro', request.url))
    }
  }

  return response
}

// Match everything except static assets and API routes.
// Explicitly excluded: _next, _vercel, static files with extensions,
// API routes and the auth callback (they don't need locale routing).
export const config = {
  matcher: ['/((?!api|auth|_next|_vercel|.*\\..*).*)'],
}
