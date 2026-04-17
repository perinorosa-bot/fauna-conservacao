import { NextResponse } from 'next/server'

// Stripe redirects here after onboarding completes.
// Using an API route avoids locale-prefix 404s that can occur with direct page redirects.
export async function GET() {
  const origin = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'
  return NextResponse.redirect(`${origin}/org/painel?stripe=success`)
}
