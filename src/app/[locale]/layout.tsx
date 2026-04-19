import type { Metadata } from 'next'
import localFont from 'next/font/local'
import { Inter, IM_Fell_English } from 'next/font/google'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages, getTranslations, setRequestLocale } from 'next-intl/server'
import { notFound } from 'next/navigation'
import { routing, type Locale } from '@/i18n/routing'
import CookieBanner from '@/components/CookieBanner'
import Footer from '@/components/layout/Footer'
import '../globals.css'

const vaelia = localFont({
  src: [
    { path: '../../../public/fonts/Vaelia.woff2' },
    { path: '../../../public/fonts/Vaelia.woff'  },
  ],
  variable: '--font-vaelia',
  display: 'swap',
})

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const imFell = IM_Fell_English({
  subsets: ['latin'],
  weight: ['400'],
  style: ['normal', 'italic'],
  variable: '--font-im-fell',
  display: 'swap',
  adjustFontFallback: false,
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
    <html lang={HTML_LANG[locale as Locale]} className={`${vaelia.variable} ${inter.variable} ${imFell.variable}`}>
      <body className="bg-forest text-cream font-sans antialiased">
        <NextIntlClientProvider locale={locale} messages={messages}>
          {children}
          <Footer />
          <CookieBanner />
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
