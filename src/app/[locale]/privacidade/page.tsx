import Nav from '@/components/layout/Nav'
import { NavTheme } from '@/components/layout/NavTheme'
import { Link } from '@/i18n/navigation'
import { getTranslations } from 'next-intl/server'

type PrivacySection = {
  heading: string
  body?: string
  list?: string[]
  footer?: string
  cookiesLink?: string
}

export async function generateMetadata({
  params,
}: {
  params: { locale: string }
}) {
  const t = await getTranslations({ locale: params.locale, namespace: 'meta.privacy' })
  return {
    title: t('title'),
    description: t('description'),
    alternates: {
      languages: {
        'pt-BR': '/privacidade',
        'en-US': '/en/privacidade',
        'es-ES': '/es/privacidade',
      },
    },
  }
}

// Renders inline **bold** markdown markers into <strong> tags.
function renderBold(text: string) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g)
  return parts.map((p, i) =>
    p.startsWith('**') && p.endsWith('**')
      ? <strong key={i}>{p.slice(2, -2)}</strong>
      : <span key={i}>{p}</span>
  )
}

export default async function PrivacidadePage() {
  const t = await getTranslations('legal.privacy')
  const sections = t.raw('sections') as PrivacySection[]
  const disclaimer = t('disclaimer')

  return (
    <NavTheme theme="light">
      <main className="min-h-screen bg-cream">
        <Nav />
        <div className="pt-40 pb-28 px-10 max-w-screen-md mx-auto">
          <span className="text-sage text-[10px] tracking-[0.25em] uppercase block mb-5">{t('eyebrow')}</span>
          <h1 className="font-serif text-5xl font-light text-forest mb-3">
            {t('titleBefore')}<em className="italic text-sage">{t('titleEm')}</em>
          </h1>
          <p className="text-forest/40 text-sm mb-14">{t('lastUpdated')}</p>

          {disclaimer && (
            <div className="mb-10 p-4 border-l-4 border-amber-400 bg-amber-50/60 rounded-sm">
              <p className="text-amber-900 text-xs leading-relaxed">
                <strong className="uppercase tracking-wide mr-1">Note:</strong>
                {disclaimer}
              </p>
            </div>
          )}

          <div className="prose-fauna">
            {sections.map((section, i) => (
              <div key={i}>
                <h2>{section.heading}</h2>
                {section.body && <p>{renderBold(section.body)}</p>}
                {section.list && (
                  <ul>
                    {section.list.map((li, j) => (
                      <li key={j}>{renderBold(li)}</li>
                    ))}
                  </ul>
                )}
                {section.footer && <p>{renderBold(section.footer)}</p>}
                {section.cookiesLink && (
                  <p>
                    <Link href="/cookies">{section.cookiesLink}</Link>
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
