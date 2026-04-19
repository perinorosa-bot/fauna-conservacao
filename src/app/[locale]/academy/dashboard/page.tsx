'use client'

import { useEffect, useState } from 'react'
import { useRouter } from '@/i18n/navigation'
import { Link } from '@/i18n/navigation'
import Nav from '@/components/layout/Nav'
import { NavTheme } from '@/components/layout/NavTheme'
import { createClient } from '@/lib/supabase/client'
import { useTranslations } from 'next-intl'

// Mock enrolled courses — replace with real DB query when purchases are wired
const MOCK_ENROLLMENTS = [
  {
    slug: 'captacao-recursos-iniciantes',
    title: 'Captação de Recursos para Iniciantes',
    progress: 75,
    totalLessons: 16,
    completedLessons: 12,
    lastLesson: 'Métricas básicas de captação',
  },
  {
    slug: 'narrativa-impacto',
    title: 'Narrativa de Impacto para Doadores',
    progress: 20,
    totalLessons: 24,
    completedLessons: 5,
    lastLesson: 'A jornada do herói adaptada',
  },
]

export default function AcademyDashboardPage() {
  const t = useTranslations('academy.dashboard')
  const router   = useRouter()
  const supabase = createClient()
  const [userEmail, setUserEmail] = useState<string | null>(null)
  const [loading, setLoading]     = useState(true)

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) { router.push('/entrar'); return }
      setUserEmail(user.email ?? null)
      setLoading(false)
    })
  }, [])

  if (loading) {
    return (
      <NavTheme theme="light">
        <main className="min-h-screen bg-[#f5f4f0]">
          <Nav />
          <div className="flex items-center justify-center min-h-screen">
            <div className="w-6 h-6 border-2 border-leaf border-t-transparent rounded-full animate-spin" />
          </div>
        </main>
      </NavTheme>
    )
  }

  return (
    <NavTheme theme="light">
      <main className="min-h-screen bg-[#f5f4f0]">
        <Nav />

        {/* Header */}
        <section className="bg-forest pt-40 pb-12 px-10">
          <div className="max-w-screen-lg mx-auto flex items-end justify-between">
            <div>
              <p className="text-sage/60 text-[10px] tracking-[0.25em] uppercase mb-3">
                <Link href="/academy" className="hover:text-sage">{t('breadcrumb')}</Link> / {t('breadcrumbCurrent')}
              </p>
              <h1 className="font-serif text-4xl font-light text-cream">
                {t('titleBefore')}<em className="italic text-sage">{t('titleEm')}</em>
              </h1>
              {userEmail && (
                <p className="text-cream/35 text-sm mt-2">{userEmail}</p>
              )}
            </div>
            <Link href="/academy/cursos"
                  className="hidden sm:block bg-sage/20 text-sage text-[10px] tracking-widests uppercase
                             px-5 py-2.5 rounded-sm hover:bg-sage/30 transition-colors">
              {t('newCourse')}
            </Link>
          </div>
        </section>

        <div className="px-10 py-12 max-w-screen-lg mx-auto">

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
            {[
              { label: t('stats.inProgress'),         value: MOCK_ENROLLMENTS.length },
              { label: t('stats.completedLessons'),   value: MOCK_ENROLLMENTS.reduce((s, e) => s + e.completedLessons, 0) },
              { label: t('stats.certificates'),       value: 0 },
              { label: t('stats.downloadedResources'), value: 3 },
            ].map(s => (
              <div key={s.label}
                   className="bg-white border border-forest/[0.08] rounded-2xl p-6 text-center shadow-sm">
                <p className="font-serif text-3xl font-light text-forest mb-1">{s.value}</p>
                <p className="text-forest/35 text-[11px] tracking-widests uppercase leading-tight">{s.label}</p>
              </div>
            ))}
          </div>

          {/* Enrolled courses */}
          <h2 className="font-serif text-2xl font-light text-forest mb-6">{t('myCourses')}</h2>

          {MOCK_ENROLLMENTS.length === 0 ? (
            <div className="bg-white border border-forest/[0.08] rounded-2xl p-16 text-center shadow-sm">
              <p className="text-forest/30 text-sm mb-5">{t('emptyCourses')}</p>
              <Link href="/academy/cursos"
                    className="bg-forest text-cream text-[10px] tracking-widests uppercase px-6 py-3 rounded-sm
                               hover:bg-leaf transition-colors">
                {t('exploreCourses')}
              </Link>
            </div>
          ) : (
            <div className="flex flex-col gap-4 mb-12">
              {MOCK_ENROLLMENTS.map(e => (
                <div key={e.slug}
                     className="bg-white border border-forest/[0.08] rounded-2xl p-7 shadow-sm flex flex-col md:flex-row gap-6 items-start md:items-center">
                  {/* Circle progress */}
                  <div className="relative w-14 h-14 flex-shrink-0">
                    <svg className="w-14 h-14 -rotate-90" viewBox="0 0 56 56">
                      <circle cx="28" cy="28" r="22" fill="none" stroke="rgba(17,51,25,0.08)" strokeWidth="4"/>
                      <circle cx="28" cy="28" r="22" fill="none" stroke="#6b8a5a" strokeWidth="4"
                              strokeDasharray={`${2 * Math.PI * 22}`}
                              strokeDashoffset={`${2 * Math.PI * 22 * (1 - e.progress / 100)}`}
                              strokeLinecap="round"/>
                    </svg>
                    <span className="absolute inset-0 flex items-center justify-center text-[11px] font-medium text-forest">
                      {e.progress}%
                    </span>
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-serif text-lg font-light text-forest mb-1">{e.title}</h3>
                    <p className="text-forest/40 text-sm mb-3">
                      {t('lessonsProgress', { done: e.completedLessons, total: e.totalLessons })}
                    </p>
                    {/* Progress bar */}
                    <div className="h-1.5 bg-forest/[0.07] rounded-full overflow-hidden max-w-sm">
                      <div className="h-full bg-leaf rounded-full" style={{ width: `${e.progress}%` }} />
                    </div>
                    <p className="text-forest/30 text-[11px] mt-2">
                      {t('lastLesson')} <span className="text-forest/50">{e.lastLesson}</span>
                    </p>
                  </div>

                  {/* CTA */}
                  <Link href={`/academy/cursos/${e.slug}`}
                        className="bg-forest text-cream text-[10px] tracking-widests uppercase px-6 py-3 rounded-lg
                                   hover:bg-leaf transition-colors whitespace-nowrap flex-shrink-0">
                    {t('continue')}
                  </Link>
                </div>
              ))}
            </div>
          )}

          {/* Workshops registered */}
          <h2 className="font-serif text-2xl font-light text-forest mb-6">{t('workshopsTitle')}</h2>
          <div className="bg-white border border-forest/[0.08] rounded-2xl p-16 text-center shadow-sm">
            <p className="text-forest/30 text-sm mb-5">{t('emptyWorkshops')}</p>
            <Link href="/academy/workshops"
                  className="text-leaf text-xs tracking-widests uppercase hover:underline">
              {t('seeAgenda')}
            </Link>
          </div>
        </div>
      </main>
    </NavTheme>
  )
}
