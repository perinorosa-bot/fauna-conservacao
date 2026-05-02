import { getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import Nav from '@/components/layout/Nav'

export default async function DoacaoSucessoPage({
  searchParams,
}: {
  searchParams: { projeto?: string }
}) {
  const slug = searchParams.projeto
  const t = await getTranslations('donationForm.success')

  return (
    <main className="min-h-screen bg-forest">
      <Nav />
      <div className="flex items-center justify-center min-h-screen px-4">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 rounded-full bg-sage/15 border border-sage/30 flex items-center justify-center mx-auto mb-8">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                 strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
                 className="text-sage">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>

          <h1 className="font-serif text-4xl font-light text-cream mb-4">
            {t('titleBefore')}<em className="italic text-sage">{t('titleEm')}</em>
          </h1>
          <p className="text-cream/50 text-sm leading-relaxed mb-10">
            {t('description')}
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            {slug && (
              <Link
                href={`/projetos/${slug}`}
                className="bg-leaf text-cream text-xs tracking-widest uppercase px-6 py-3 rounded-sm
                           hover:bg-sage transition-colors"
              >
                {t('viewProject')}
              </Link>
            )}
            <Link
              href="/projetos"
              className="border border-white/20 text-cream/60 text-xs tracking-widest uppercase px-6 py-3 rounded-sm
                         hover:bg-white/5 hover:text-cream transition-colors"
            >
              {t('exploreOthers')}
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}
