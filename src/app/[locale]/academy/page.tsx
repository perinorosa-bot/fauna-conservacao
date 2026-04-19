import { Link } from '@/i18n/navigation'
import Nav from '@/components/layout/Nav'
import { NavTheme } from '@/components/layout/NavTheme'
import { getTranslations } from 'next-intl/server'

type StatItem = { value: string; label: string }
type FeatureItem = { title: string; desc: string }
type ForWhoItem = { title: string; desc: string }
type FeaturedCourse = {
  slug: string
  title: string
  level: string
  duration: string
  price: string
  tag: string
}

// Icons for features — decoration only.
const FEATURE_ICONS = ['◎', '▶', '◈', '◻']

export default async function AcademyHomePage() {
  const t = await getTranslations('academy.home')
  const stats = t.raw('stats') as StatItem[]
  const features = t.raw('features.items') as FeatureItem[]
  const featuredCourses = t.raw('featured.courses') as FeaturedCourse[]
  const forWhoItems = t.raw('forWho.items') as ForWhoItem[]

  return (
    <NavTheme theme="light">
      <main className="min-h-screen bg-cream">
        <Nav />

        {/* ── Hero ──────────────────────────────────────────────────────────── */}
        <section className="relative bg-forest overflow-hidden pt-40 pb-28 px-10">
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-sage/5 rounded-full blur-[120px] pointer-events-none" />
          <div className="max-w-screen-lg mx-auto relative">
            <div className="inline-flex items-center gap-2 bg-sage/10 border border-sage/20 rounded-full px-4 py-1.5 mb-8">
              <span className="text-sage text-[9px] tracking-[0.2em] uppercase font-medium">{t('hero.badgeNew')}</span>
              <span className="text-cream/50 text-[11px]">{t('hero.badgeText')}</span>
            </div>
            <h1 className="font-serif text-5xl md:text-7xl font-light text-cream leading-[1.05] mb-6 max-w-3xl">
              {t('hero.titleBefore')}<em className="italic text-sage">{t('hero.titleEm')}</em>
            </h1>
            <p className="text-cream/55 text-lg max-w-xl leading-relaxed mb-10">
              {t('hero.subtitle')}
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/academy/cursos"
                    className="bg-sage text-cream text-[11px] tracking-widests uppercase px-8 py-4 rounded-sm
                               hover:bg-leaf transition-colors shadow-[0_4px_20px_rgba(107,142,90,0.4)]">
                {t('hero.ctaCourses')}
              </Link>
              <Link href="/academy/recursos"
                    className="border border-white/20 text-cream/70 text-[11px] tracking-widests uppercase
                               px-8 py-4 rounded-sm hover:border-white/40 hover:text-cream transition-colors">
                {t('hero.ctaResources')}
              </Link>
            </div>
          </div>
        </section>

        {/* ── Stats ─────────────────────────────────────────────────────────── */}
        <section className="bg-forest border-t border-white/[0.06] px-10 py-8">
          <div className="max-w-screen-lg mx-auto grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map(st => (
              <div key={st.label} className="text-center">
                <p className="font-serif text-3xl font-light text-sage mb-1">{st.value}</p>
                <p className="text-cream/35 text-[11px] tracking-widests uppercase">{st.label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── What you learn ────────────────────────────────────────────────── */}
        <section className="px-10 py-24 max-w-screen-lg mx-auto">
          <p className="text-[10px] tracking-[0.25em] uppercase text-forest/35 mb-4">{t('features.eyebrow')}</p>
          <h2 className="font-serif text-4xl font-light text-forest mb-14 max-w-lg leading-snug">
            {t('features.titleBefore')}<em className="italic text-leaf">{t('features.titleEm')}</em>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {features.map((f, i) => (
              <div key={f.title}
                   className="bg-white border border-forest/[0.08] rounded-2xl p-8 hover:shadow-md transition-shadow">
                <span className="text-leaf text-2xl block mb-4">{FEATURE_ICONS[i] ?? '•'}</span>
                <h3 className="font-serif text-xl font-light text-forest mb-2">{f.title}</h3>
                <p className="text-forest/50 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── Featured courses ──────────────────────────────────────────────── */}
        <section className="bg-forest/[0.03] border-y border-forest/[0.07] px-10 py-20">
          <div className="max-w-screen-lg mx-auto">
            <div className="flex items-end justify-between mb-12">
              <div>
                <p className="text-[10px] tracking-[0.25em] uppercase text-forest/35 mb-3">{t('featured.eyebrow')}</p>
                <h2 className="font-serif text-3xl font-light text-forest">{t('featured.title')}</h2>
              </div>
              <Link href="/academy/cursos"
                    className="text-[10px] tracking-widests uppercase text-leaf hover:underline hidden sm:block">
                {t('featured.seeAll')}
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {featuredCourses.map(c => {
                const isFreeCourse = c.slug === 'captacao-recursos-iniciantes'
                return (
                <Link key={c.slug} href={`/academy/cursos/${c.slug}`}
                      className="group bg-white border border-forest/[0.08] rounded-2xl overflow-hidden
                                 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300">
                  <div className="h-36 bg-gradient-to-br from-forest to-canopy relative flex items-end p-5">
                    {c.tag && (
                      <span className="absolute top-4 right-4 bg-sage text-cream text-[9px] tracking-widests uppercase px-2.5 py-1 rounded-full">
                        {c.tag}
                      </span>
                    )}
                    <span className="text-cream/30 text-[9px] tracking-widests uppercase border border-cream/20 px-2.5 py-1 rounded-full">
                      {c.level}
                    </span>
                  </div>
                  <div className="p-6">
                    <h3 className="font-serif text-lg font-light text-forest leading-snug mb-3 group-hover:text-leaf transition-colors">
                      {c.title}
                    </h3>
                    <div className="flex items-center justify-between">
                      <span className="text-forest/35 text-[11px]">{c.duration}</span>
                      <span className={`text-sm font-medium ${isFreeCourse ? 'text-leaf' : 'text-forest'}`}>
                        {c.price}
                      </span>
                    </div>
                  </div>
                </Link>
                )
              })}
            </div>
          </div>
        </section>

        {/* ── Próximo workshop ──────────────────────────────────────────────── */}
        <section className="px-10 py-20 max-w-screen-lg mx-auto">
          <div className="bg-forest rounded-3xl p-10 flex flex-col md:flex-row items-start gap-8 justify-between">
            <div>
              <p className="text-sage/70 text-[10px] tracking-[0.2em] uppercase mb-3">{t('nextWorkshop.eyebrow')}</p>
              <h2 className="font-serif text-3xl font-light text-cream mb-2">
                {t('nextWorkshop.title')}
              </h2>
              <p className="text-cream/45 text-sm mb-5">
                {t('nextWorkshop.when')}
              </p>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-sage/20 flex items-center justify-center flex-shrink-0">
                  <span className="text-sage text-xs">32</span>
                </div>
                <p className="text-cream/40 text-xs">{t('nextWorkshop.spotsLeft')}</p>
              </div>
            </div>
            <div className="flex flex-col gap-3 flex-shrink-0">
              <Link href="/academy/workshops"
                    className="bg-sage text-cream text-[10px] tracking-widests uppercase px-7 py-3.5 rounded-sm
                               hover:bg-leaf transition-colors whitespace-nowrap text-center">
                {t('nextWorkshop.ctaRegister')}
              </Link>
              <Link href="/academy/workshops"
                    className="text-cream/30 text-[10px] tracking-widests uppercase text-center hover:text-cream/60 transition-colors">
                {t('nextWorkshop.ctaAgenda')}
              </Link>
            </div>
          </div>
        </section>

        {/* ── For who ───────────────────────────────────────────────────────── */}
        <section className="bg-forest/[0.03] border-t border-forest/[0.07] px-10 py-20">
          <div className="max-w-screen-lg mx-auto text-center">
            <p className="text-[10px] tracking-[0.25em] uppercase text-forest/35 mb-4">{t('forWho.eyebrow')}</p>
            <h2 className="font-serif text-4xl font-light text-forest mb-14">
              {t('forWho.titleBefore')}<em className="italic text-leaf">{t('forWho.titleEm')}</em>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
              {forWhoItems.map(p => (
                <div key={p.title} className="bg-white border border-forest/[0.08] rounded-2xl p-7">
                  <div className="w-2 h-2 rounded-full bg-leaf mb-5" />
                  <h3 className="font-serif text-lg font-light text-forest mb-2">{p.title}</h3>
                  <p className="text-forest/50 text-sm leading-relaxed">{p.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA ───────────────────────────────────────────────────────────── */}
        <section className="px-10 py-24 max-w-screen-lg mx-auto text-center">
          <p className="text-[10px] tracking-[0.25em] uppercase text-forest/35 mb-4">{t('cta.eyebrow')}</p>
          <h2 className="font-serif text-4xl font-light text-forest mb-5">
            {t('cta.titleBefore')}<em className="italic text-leaf">{t('cta.titleEm')}</em>
          </h2>
          <p className="text-forest/50 text-base mb-10 max-w-md mx-auto">
            {t('cta.subtitle')}
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link href="/academy/cursos"
                  className="bg-forest text-cream text-[11px] tracking-widests uppercase px-8 py-4 rounded-sm
                             hover:bg-leaf transition-colors">
              {t('cta.exploreCourses')}
            </Link>
            <Link href="/academy/recursos"
                  className="border border-forest/20 text-forest/60 text-[11px] tracking-widests uppercase
                             px-8 py-4 rounded-sm hover:border-forest/40 hover:text-forest transition-colors">
              {t('cta.freeResources')}
            </Link>
          </div>
        </section>
      </main>
    </NavTheme>
  )
}
