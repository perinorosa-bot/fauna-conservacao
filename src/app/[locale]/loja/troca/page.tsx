import Nav from '@/components/layout/Nav'
import { NavTheme } from '@/components/layout/NavTheme'
import { Link } from '@/i18n/navigation'
import { getTranslations } from 'next-intl/server'

export const metadata = { title: 'Exchange Policy — Fauna Shop' }

type ExchangeSection = {
  heading: string
  body?: string
  list?: string[]
  orderedList?: string[]
  contactLink?: string
}

// Renders inline **bold** + preserves line breaks.
function renderBody(text: string) {
  const lines = text.split('\n')
  return lines.map((line, li) => {
    const parts = line.split(/(\*\*[^*]+\*\*)/g)
    return (
      <span key={li}>
        {parts.map((p, i) =>
          p.startsWith('**') && p.endsWith('**')
            ? <strong key={i}>{p.slice(2, -2)}</strong>
            : <span key={i}>{p}</span>
        )}
        {li < lines.length - 1 && <br />}
      </span>
    )
  })
}

export default async function TrocaPage() {
  const t = await getTranslations('loja.exchange')
  const sections = t.raw('sections') as ExchangeSection[]

  return (
    <NavTheme theme="light">
      <main className="min-h-screen bg-cream">
        <Nav />
        <div className="pt-40 pb-28 px-10 max-w-screen-md mx-auto">
          <span className="text-sage text-[10px] tracking-[0.25em] uppercase block mb-5">{t('eyebrow')}</span>
          <h1 className="font-serif text-5xl font-light text-forest mb-3">
            {t('titleBefore')}<em className="italic text-leaf">{t('titleEm')}</em>
          </h1>
          <p className="text-forest/40 text-sm mb-14">{t('lastUpdated')}</p>

          <div className="prose-fauna">
            {sections.map((section, i) => (
              <div key={i}>
                <h2>{section.heading}</h2>
                {section.body && !section.contactLink && <p>{renderBody(section.body)}</p>}
                {section.list && (
                  <ul>
                    {section.list.map((li, j) => <li key={j}>{li}</li>)}
                  </ul>
                )}
                {section.orderedList && (
                  <ol>
                    {section.orderedList.map((li, j) => {
                      // Replace loja@fauna.org with a mailto link when found in the string.
                      const parts = li.split(/(loja@fauna\.org)/g)
                      return (
                        <li key={j}>
                          {parts.map((p, k) =>
                            p === 'loja@fauna.org'
                              ? <a key={k} href="mailto:loja@fauna.org">loja@fauna.org</a>
                              : <span key={k}>{p}</span>
                          )}
                        </li>
                      )
                    })}
                  </ol>
                )}
                {section.body && section.contactLink && (
                  <p>
                    {section.body.split(section.contactLink)[0]}
                    <Link href="/contato">{section.contactLink}</Link>
                    {section.body.split(section.contactLink)[1]?.split('loja@fauna.org')[0]}
                    <a href="mailto:loja@fauna.org">loja@fauna.org</a>
                    {section.body.split('loja@fauna.org')[1]}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </main>
    </NavTheme>
  )
}
