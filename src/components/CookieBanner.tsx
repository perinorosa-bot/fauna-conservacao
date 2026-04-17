'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

export default function CookieBanner() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const consent = localStorage.getItem('fauna-cookie-consent')
    if (!consent) {
      // small delay so it doesn't flash on first paint
      const t = setTimeout(() => setVisible(true), 1200)
      return () => clearTimeout(t)
    }
  }, [])

  function accept() {
    localStorage.setItem('fauna-cookie-consent', 'accepted')
    setVisible(false)
  }

  function decline() {
    localStorage.setItem('fauna-cookie-consent', 'declined')
    setVisible(false)
  }

  if (!visible) return null

  return (
    <div
      className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[9999] w-[calc(100%-3rem)] max-w-2xl
                 bg-[#0e1a12]/95 backdrop-blur-md border border-white/[0.08] rounded-2xl
                 px-6 py-5 shadow-[0_8px_40px_rgba(0,0,0,0.55)]
                 flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6"
      role="dialog"
      aria-label="Consentimento de cookies"
    >
      {/* Icon */}
      <span className="text-xl flex-shrink-0">🍃</span>

      {/* Text */}
      <div className="flex-1 min-w-0">
        <p className="text-cream/85 text-xs leading-relaxed">
          Usamos cookies essenciais para autenticação e para lembrar suas preferências de idioma.
          Não usamos rastreamento ou publicidade.{' '}
          <Link href="/cookies" className="text-sage hover:underline">
            Saiba mais
          </Link>
        </p>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 flex-shrink-0">
        <button
          onClick={decline}
          className="text-cream/30 text-[10px] tracking-widest uppercase px-3 py-2
                     hover:text-cream/60 transition-colors"
        >
          Recusar
        </button>
        <button
          onClick={accept}
          className="bg-sage text-cream text-[10px] tracking-widest uppercase
                     px-5 py-2.5 rounded-sm hover:bg-leaf transition-colors whitespace-nowrap"
        >
          Aceitar
        </button>
      </div>
    </div>
  )
}
