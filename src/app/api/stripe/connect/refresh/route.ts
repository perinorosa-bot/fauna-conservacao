import { NextResponse } from 'next/server'

// Stripe redirects here when onboarding link expires and needs to be re-generated.
export async function GET() {
  const origin = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'
  return NextResponse.redirect(`${origin}/org/painel?stripe=refresh`)
}
