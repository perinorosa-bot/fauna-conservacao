import type { Metadata } from 'next'
import localFont from 'next/font/local'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages, getTranslations, setRequestLocale } from 'next-intl/server'
import { notFound } from 'next/navigation'
import { routing, type Locale } from '@/i18n/routing'
import CookieBanner from '@/components/CookieBanner'
import Footer from '@/components/layout/Footer'
import '../globals.css'

const spathafold = localFont({
  src: [
    { path: '../../../public/fonts/SpathaFold.woff2' },
    { path: '../../../public/fonts/SpathaFold.woff'  },
  ],
  variable: '--font-spathafold',
  display: 'swap',
})

export async function generateMetadata({
  params,
}: {
  params: { locale: string }
}): Promise<Metadata> {
  const { locale } = params
  const t = await getTranslations({ locale, namespace: 'meta.home' })
  return {
    title: t('title'),
    description: t('description'),
    alternates: {
      // hreflang tags — tells Google which URL serves which locale.
      // The default locale (pt) lives at `/`; en/es carry a prefix.
      languages: {
        'pt-BR': '/',
        'en-US': '/en',
        'es-ES': '/es',
      },
    },
  }
}

export function generateStaticParams() {
  return routing.locales.map(locale => ({ locale }))
}

// Full BCP-47 tags for screen readers / SEO.
const HTML_LANG: Record<Locale, string> = {
  pt: 'pt-BR',
  en: 'en-US',
  es: 'es-ES',
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: { locale: string }
}) {
  const { locale } = params

  if (!routing.locales.includes(locale as Locale)) notFound()

  setRequestLocale(locale)
  const messages = await getMessages()

  return (
    <html lang={HTML_LANG[locale as Locale]} className={spathafold.variable}>
      <body className="bg-moonstone text-forest font-sans antialiased">
        <NextIntlClientProvider locale={locale} messages={messages}>
          {children}
          <Footer />
          <CookieBanner />
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
