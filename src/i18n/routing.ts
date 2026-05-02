import { defineRouting } from 'next-intl/routing'

export const routing = defineRouting({
  locales: ['pt', 'en', 'es'],
  defaultLocale: 'pt',
  // pt stays at `/`, `/projetos`, etc. Only /en/* and /es/* carry a prefix.
  // Keeps existing links alive and gives SEO locale-correct URLs.
  localePrefix: 'as-needed',
})

export type Locale = (typeof routing.locales)[number]
