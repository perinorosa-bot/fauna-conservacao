import Nav from '@/components/layout/Nav'
import { NavTheme } from '@/components/layout/NavTheme'
import { Link } from '@/i18n/navigation'
import { getTranslations } from 'next-intl/server'

export const metadata = { title: 'Cookie Policy — Fauna' }

type CookieRow = {
  cookie: string
  type: string
  purpose: string
  duration: string
}

export default async function CookiesPage() {
  const t = await getTranslations('legal.cookies')
  const disclaimer = t('disclaimer')
  const tableHeaders = t.raw('table.headers') as {
    cookie: string; type: string; purpose: string; duration: string
  }
  const tableRows = t.raw('table.rows') as CookieRow[]
  const dontUseList = t.raw('dontUseList') as string[]

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
            <h2>{t('whatTitle')}</h2>
            <p>{t('whatBody')}</p>

            <h2>{t('weUseTitle')}</h2>
            <div className="overflow-x-auto mb-8">
              <table>
                <thead>
                  <tr>
                    <th>{tableHeaders.cookie}</th>
                    <th>{tableHeaders.type}</th>
                    <th>{tableHeaders.purpose}</th>
                    <th>{tableHeaders.duration}</th>
                  </tr>
                </thead>
                <tbody>
                  {tableRows.map((row, i) => (
                    <tr key={i}>
                      <td><code>{row.cookie}</code></td>
                      <td>{row.type}</td>
                      <td>{row.purpose}</td>
                      <td>{row.duration}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <h2>{t('thirdPartyTitle')}</h2>
            <p>
              {t('thirdPartyBody')} <a href="https://stripe.com/privacy" target="_blank" rel="noopener">{t('thirdPartyLink')}</a>.
            </p>

            <h2>{t('dontUseTitle')}</h2>
            <ul>
              {dontUseList.map((li, i) => <li key={i}>{li}</li>)}
            </ul>

            <h2>{t('controlTitle')}</h2>
            <p>
              {t('controlBody')}
            </p>
            <ul>
              <li><a href="https://support.google.com/chrome/answer/95647" target="_blank" rel="noopener">Chrome</a></li>
              <li><a href="https://support.mozilla.org/pt-BR/kb/ative-e-desative-os-cookies-que-os-sites-usam" target="_blank" rel="noopener">Firefox</a></li>
              <li><a href="https://support.apple.com/pt-br/guide/safari/sfri11471/mac" target="_blank" rel="noopener">Safari</a></li>
            </ul>

            <h2>{t('doubtsTitle')}</h2>
            <p>
              {t('doubtsBody').split(t('doubtsContactLink'))[0]}
              <Link href="/contato">{t('doubtsContactLink')}</Link>
              {t('doubtsBody').split(t('doubtsContactLink'))[1]}
            </p>
          </div>
        </div>
      </main>
    </NavTheme>
  )
}
