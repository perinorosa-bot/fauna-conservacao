'use client'

import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'
import { translations, type Locale, type Translations } from './translations'

type LanguageContextType = {
  locale: Locale
  t: Translations
  setLocale: (l: Locale) => void
}

const LanguageContext = createContext<LanguageContextType>({
  locale: 'pt',
  t: translations.pt,
  setLocale: () => {},
})

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>('pt')

  useEffect(() => {
    const saved = document.cookie.match(/fauna-lang=([a-z]+)/)?.[1] as Locale | undefined
    if (saved && saved in translations) setLocaleState(saved)
  }, [])

  function setLocale(l: Locale) {
    setLocaleState(l)
    document.cookie = `fauna-lang=${l};path=/;max-age=31536000`
  }

  return (
    <LanguageContext.Provider value={{ locale, t: translations[locale], setLocale }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  return useContext(LanguageContext)
}