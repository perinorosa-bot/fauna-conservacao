import type { Metadata } from 'next'
import localFont from 'next/font/local'
import './globals.css'
import { LanguageProvider } from '@/lib/i18n/LanguageContext'
import CookieBanner from '@/components/CookieBanner'
import Footer from '@/components/layout/Footer'

const spathafold = localFont({
  src: [
    { path: '../../public/fonts/SpathaFold.woff2' },
    { path: '../../public/fonts/SpathaFold.woff'  },
  ],
  variable: '--font-spathafold',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Fauna — Conservação que você pode ver',
  description: 'Apoie projetos reais de conservação animal ao redor do mundo. Acompanhe o trabalho, entenda o impacto, doe com propósito.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={spathafold.variable}>
      <body className="bg-moonstone text-forest font-sans antialiased">
        <LanguageProvider>
          {children}
          <Footer />
          <CookieBanner />
        </LanguageProvider>
      </body>
    </html>
  )
}