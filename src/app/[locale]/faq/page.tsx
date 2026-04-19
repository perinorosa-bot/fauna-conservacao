'use client'

import { useState, useMemo } from 'react'
import Nav from '@/components/layout/Nav'
import { NavTheme } from '@/components/layout/NavTheme'
import { Link } from '@/i18n/navigation'
import { useTranslations } from 'next-intl'

// ─── Types ────────────────────────────────────────────────────────────────────

type FaqItem = { q: string; a: string }
type FaqSection = {
  id: string
  label: string
  description: string
  items: FaqItem[]
}

// Icons by section id — decoration only, not i18n.
const SECTION_ICONS: Record<string, JSX.Element> = {
  geral: (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/>
      <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/>
      <line x1="12" y1="17" x2="12.01" y2="17"/>
    </svg>
  ),
  organizacoes: (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
      <polyline points="9 22 9 12 15 12 15 22"/>
    </svg>
  ),
  doadores: (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
    </svg>
  ),
}

// ─── Accordion item ───────────────────────────────────────────────────────────

function AccordionItem({ q, a, section }: { q: string; a: string; section?: string }) {
  const [open, setOpen] = useState(false)

  return (
    <div className={`border-b border-forest/[0.08] last:border-0 ${open ? 'bg-leaf/[0.03]' : ''} transition-colors`}>
      <button
        onClick={() => setOpen(v => !v)}
        className="w-full flex items-start justify-between gap-5 px-6 py-5 text-left group"
      >
        <div className="flex-1">
          {section && (
            <span className="text-[9px] tracking-[0.2em] uppercase text-forest/30 block mb-1">{section}</span>
          )}
          <span className={`font-serif text-[17px] font-light leading-snug transition-colors duration-200 ${
            open ? 'text-leaf' : 'text-forest group-hover:text-forest/70'
          }`}>
            {q}
          </span>
        </div>
        <span className={`flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center mt-0.5 transition-all duration-300 ${
          open
            ? 'bg-leaf text-cream rotate-45'
            : 'bg-forest/8 text-forest/50 group-hover:bg-forest/12 group-hover:text-forest'
        }`}
          style={{ background: open ? undefined : 'rgba(17,51,25,0.07)' }}
        >
          <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
            <line x1="5.5" y1="1" x2="5.5" y2="10" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
            <line x1="1" y1="5.5" x2="10" y2="5.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
          </svg>
        </span>
      </button>

      <div className={`overflow-hidden transition-all duration-300 ease-in-out ${
        open ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
      }`}>
        <p className="text-forest/60 text-[15px] leading-relaxed px-6 pb-6 pr-16">
          {a}
        </p>
      </div>
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function FaqPage() {
  const t = useTranslations('faq')
  const sections = t.raw('sections') as FaqSection[]
  const allItems = sections.flatMap(s => s.items.map(item => ({ ...item, section: s.label })))

  const [query, setQuery]           = useState('')
  const [activeSection, setActive]  = useState<string | null>(null)

  const results = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return null
    return allItems.filter(
      item =>
        item.q.toLowerCase().includes(q) ||
        item.a.toLowerCase().includes(q)
    )
  }, [query, allItems])

  const visibleSection = activeSection
    ? sections.find(s => s.id === activeSection)!
    : null

  return (
    <NavTheme theme="light">
      <main className="min-h-screen bg-[#f5f4f0]">
        <Nav />

        {/* ── Hero + search ────────────────────────────────────────────────── */}
        <section className="bg-forest pt-36 pb-20 px-6">
          <div className="max-w-2xl mx-auto text-center">
            <p className="text-sage/70 text-[10px] tracking-[0.3em] uppercase mb-4">{t('hero.eyebrow')}</p>
            <h1 className="font-serif text-4xl md:text-5xl font-light text-cream mb-3 leading-tight">
              {t('hero.titleBefore')}<em className="italic text-sage">{t('hero.titleEm')}</em>
            </h1>
            <p className="text-cream/40 text-sm mb-10">
              {t('hero.subtitle')}
            </p>

            {/* Search bar */}
            <div className="relative max-w-xl mx-auto">
              <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none">
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                     strokeWidth="2" strokeLinecap="round" className="text-forest/40">
                  <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
                </svg>
              </div>
              <input
                type="text"
                value={query}
                onChange={e => { setQuery(e.target.value); setActive(null) }}
                placeholder={t('search.placeholder')}
                className="w-full bg-white text-forest text-sm pl-12 pr-5 py-4 rounded-xl
                           border-2 border-transparent focus:border-sage/40 focus:outline-none
                           placeholder:text-forest/30 shadow-lg shadow-black/20 transition-all"
              />
              {query && (
                <button
                  aria-label={t('search.clearAria')}
                  onClick={() => setQuery('')}
                  className="absolute inset-y-0 right-4 text-forest/30 hover:text-forest/60 text-lg"
                >×</button>
              )}
            </div>
          </div>
        </section>

        {/* ── Category cards ───────────────────────────────────────────────── */}
        {!results && (
          <section className="px-6 -mt-6 mb-12 max-w-screen-lg mx-auto">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {sections.map(s => (
                <button
                  key={s.id}
                  onClick={() => setActive(prev => prev === s.id ? null : s.id)}
                  className={`group text-left rounded-2xl p-7 border-2 transition-all duration-200 shadow-sm
                    ${activeSection === s.id
                      ? 'bg-forest border-forest text-cream shadow-lg shadow-forest/20'
                      : 'bg-white border-transparent hover:border-forest/15 hover:shadow-md'
                    }`}
                >
                  <div className={`mb-4 transition-colors ${
                    activeSection === s.id ? 'text-sage' : 'text-leaf group-hover:text-forest'
                  }`}>
                    {SECTION_ICONS[s.id]}
                  </div>
                  <h3 className={`font-serif text-xl font-light mb-1 ${
                    activeSection === s.id ? 'text-cream' : 'text-forest'
                  }`}>
                    {s.label}
                  </h3>
                  <p className={`text-[12px] leading-relaxed mb-4 ${
                    activeSection === s.id ? 'text-cream/55' : 'text-forest/45'
                  }`}>
                    {s.description}
                  </p>
                  <span className={`text-[10px] tracking-widest uppercase font-medium ${
                    activeSection === s.id ? 'text-sage' : 'text-leaf'
                  }`}>
                    {t('questionsCountArrow', { count: s.items.length })}
                  </span>
                </button>
              ))}
            </div>
          </section>
        )}

        {/* ── Search results ───────────────────────────────────────────────── */}
        {results && (
          <section className="px-6 py-10 max-w-screen-lg mx-auto">
            <p className="text-forest/40 text-sm mb-6">
              {results.length === 0
                ? t('noResultsPrefix')
                : results.length === 1
                  ? t('resultsOne', { count: results.length })
                  : t('resultsOther', { count: results.length })}
              <strong className="text-forest">"{query}"</strong>
            </p>

            {results.length === 0 ? (
              <div className="bg-white rounded-2xl border border-forest/[0.08] p-12 text-center shadow-sm">
                <p className="text-forest/30 text-sm mb-2">{t('noResultsTitle')}</p>
                <p className="text-forest/40 text-sm">
                  {t('noResultsHint')}
                  <Link href="/contato" className="text-leaf hover:underline">{t('noResultsHintLink')}</Link>.
                </p>
              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-forest/[0.08] shadow-sm overflow-hidden">
                {results.map((item, i) => (
                  <AccordionItem key={i} q={item.q} a={item.a} section={item.section} />
                ))}
              </div>
            )}
          </section>
        )}

        {/* ── Section FAQ (when card is clicked) ───────────────────────────── */}
        {!results && visibleSection && (
          <section className="px-6 pb-10 max-w-screen-lg mx-auto">
            <div className="flex items-center gap-3 mb-6">
              <div className="text-leaf">{SECTION_ICONS[visibleSection.id]}</div>
              <h2 className="font-serif text-2xl font-light text-forest">{visibleSection.label}</h2>
              <span className="text-[10px] tracking-widest text-forest/30 uppercase bg-forest/5 px-3 py-1 rounded-full ml-1">
                {t('questionsCount', { count: visibleSection.items.length })}
              </span>
            </div>
            <div className="bg-white rounded-2xl border border-forest/[0.08] shadow-sm overflow-hidden">
              {visibleSection.items.map((item, i) => (
                <AccordionItem key={i} q={item.q} a={item.a} />
              ))}
            </div>
          </section>
        )}

        {/* ── All FAQs (default, no search, no section selected) ───────────── */}
        {!results && !visibleSection && (
          <section className="px-6 pb-12 max-w-screen-lg mx-auto">
            <p className="text-[10px] tracking-widest uppercase text-forest/30 mb-6">
              {t('popular')}
            </p>
            <div className="bg-white rounded-2xl border border-forest/[0.08] shadow-sm overflow-hidden">
              {sections.flatMap(s => s.items.slice(0, 2)).slice(0, 6).map((item, i) => (
                <AccordionItem key={i} q={item.q} a={item.a} section={sections.find(s => s.items.includes(item))?.label} />
              ))}
            </div>
            <p className="text-center text-forest/30 text-xs mt-5">
              {t('categoryHint')}
            </p>
          </section>
        )}

        {/* ── Contact CTA — full-width banner ──────────────────────────────── */}
        <section className="bg-forest mt-6 px-6 py-20 text-center">
          <h2 className="font-serif text-4xl md:text-5xl font-light text-cream mb-4">
            {t('cta.title')}
          </h2>
          <p className="text-cream/50 text-base mb-10">
            {t('cta.subtitle')}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/contato"
              className="bg-sage text-cream text-[11px] tracking-[0.18em] uppercase font-medium
                         px-12 py-5 rounded-sm hover:bg-leaf transition-colors
                         shadow-[0_4px_20px_rgba(107,142,90,0.35)]"
            >
              {t('cta.button')}
            </Link>
            <a
              href="mailto:contatofauna@proton.me"
              className="text-cream/40 text-xs hover:text-sage transition-colors tracking-wide"
            >
              contatofauna@proton.me
            </a>
          </div>
        </section>
      </main>
    </NavTheme>
  )
}
