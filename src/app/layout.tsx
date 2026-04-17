import type { Metadata } from 'next'
import localFont from 'next/font/local'
import { Inter, IM_Fell_English } from 'next/font/google'
import './globals.css'
import { LanguageProvider } from '@/lib/i18n/LanguageContext'
import CookieBanner from '@/components/CookieBanner'

const vaelia = localFont({
  src: [
    { path: '../../public/fonts/Vaelia.woff2' },
    { path: '../../public/fonts/Vaelia.woff'  },
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

export const metadata: Metadata = {
  title: 'Fauna — Conservação que você pode ver',
  description: 'Apoie projetos reais de conservação animal ao redor do mundo. Acompanhe o trabalho, entenda o impacto, doe com propósito.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={`${vaelia.variable} ${inter.variable} ${imFell.variable}`}>
      <body className="bg-forest text-cream font-sans antialiased">
        <LanguageProvider>
          {children}
          <CookieBanner />
        </LanguageProvider>
      </body>
    </html>
  )
}