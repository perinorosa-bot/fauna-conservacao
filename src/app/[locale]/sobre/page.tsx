'use client'

import { useState, useEffect, useRef } from 'react'
import Nav from '@/components/layout/Nav'
import { NavTheme } from '@/components/layout/NavTheme'
import { Link } from '@/i18n/navigation'
import { useTranslations } from 'next-intl'

type StatItem = { value: string; label: string }
type ValueItem = { title: string; desc: string }
type TeamMember = { name: string; role: string; bio: string }

export default function SobrePage() {
  const cf = useTranslations('comoFunciona')
  const s  = useTranslations('sobre')
  const [activeTab, setActiveTab] = useState('sobre')
  const [tabBarSticky, setTabBarSticky] = useState(false)
  const tabBarRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLDivElement>(null)

  const TABS = [
    { id: 'sobre',    label: s('tabs.about')      },
    { id: 'funciona', label: s('tabs.howItWorks') },
    { id: 'quem',     label: s('tabs.whoWeAre')   },
  ]

  const aboutStats = s.raw('about.stats') as StatItem[]
  const aboutValues = s.raw('about.values') as ValueItem[]
  const teamMembers = s.raw('team.members') as TeamMember[]

  useEffect(() => {
    const el = triggerRef.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => setTabBarSticky(!entry.isIntersecting),
      { threshold: 0 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  return (
    <NavTheme theme="light">
      <main className="min-h-screen bg-cream">
        <Nav />

        {/* ── Hero image ────────────────────────────────────────────────────── */}
        <div className="relative h-[55vh] min-h-[400px] overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=1600&auto=format&fit=crop&q=80"
            alt="Fauna"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/10 to-black/50" />
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
            <p className="text-cream/60 text-[10px] tracking-[0.3em] uppercase mb-3">{s('hero.eyebrowLabel')}</p>
            <h1 className="font-serif text-5xl md:text-6xl font-light text-cream leading-tight">
              Fauna
            </h1>
            <p className="text-cream/55 text-base mt-3 max-w-md">
              {s('hero.subtitle')}
            </p>
          </div>
        </div>

        {/* Intersection trigger — detects when tab bar should stick */}
        <div ref={triggerRef} className="h-px" />

        {/* ── Tab bar ───────────────────────────────────────────────────────── */}
        <div
          ref={tabBarRef}
          className={`z-40 bg-forest transition-shadow ${
            tabBarSticky ? 'sticky top-0 shadow-lg' : ''
          }`}
        >
          <div className="max-w-screen-lg mx-auto px-10 flex">
            {TABS.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`relative text-[11px] tracking-[0.18em] uppercase font-medium py-5 px-8
                            transition-colors duration-200 ${
                  activeTab === tab.id
                    ? 'text-sage after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-sage'
                    : 'text-cream/40 hover:text-cream/70'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* ── Tab content ───────────────────────────────────────────────────── */}

        {/* SOBRE NÓS */}
        {activeTab === 'sobre' && (
          <section className="px-10 py-20 max-w-screen-lg mx-auto">

            {/* Mission */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-16 mb-20 items-center">
              <div>
                <p className="text-[10px] tracking-[0.25em] uppercase text-forest/35 mb-4">{s('about.missionEyebrow')}</p>
                <h2 className="font-serif text-4xl font-light text-forest leading-tight mb-6">
                  {s('about.missionTitleBefore')}<em className="italic text-leaf">{s('about.missionTitleEm')}</em>{s('about.missionTitleAfter')}
                </h2>
                <p className="text-forest/60 text-base leading-relaxed mb-4">
                  {s('about.missionP1')}
                </p>
                <p className="text-forest/60 text-base leading-relaxed">
                  {s('about.missionP2')}
                </p>
              </div>
              <div className="relative rounded-2xl overflow-hidden aspect-[4/3]">
                <img
                  src="https://images.unsplash.com/photo-1474511320723-9a56873867b5?w=800&auto=format&fit=crop&q=80"
                  alt="Fauna"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 mb-20">
              {aboutStats.map(stat => (
                <div key={stat.label}
                     className="bg-white border border-forest/[0.08] rounded-2xl p-8 text-center shadow-sm">
                  <p className="font-serif text-4xl font-light text-leaf mb-2">{stat.value}</p>
                  <p className="text-forest/45 text-sm leading-tight">{stat.label}</p>
                </div>
              ))}
            </div>

            {/* Values */}
            <p className="text-[10px] tracking-[0.25em] uppercase text-forest/35 mb-4">{s('about.valuesEyebrow')}</p>
            <h2 className="font-serif text-3xl font-light text-forest mb-10">{s('about.valuesTitle')}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-16">
              {aboutValues.map(v => (
                <div key={v.title}
                     className="bg-white border border-forest/[0.08] rounded-2xl p-8 shadow-sm">
                  <div className="w-2 h-2 rounded-full bg-leaf mb-5" />
                  <h3 className="font-serif text-xl font-light text-forest mb-2">{v.title}</h3>
                  <p className="text-forest/50 text-sm leading-relaxed">{v.desc}</p>
                </div>
              ))}
            </div>

            {/* CTA */}
            <div className="flex flex-wrap gap-4">
              <Link href="/projetos"
                    className="bg-forest text-cream text-[10px] tracking-widests uppercase px-8 py-4 rounded-sm
                               hover:bg-leaf transition-colors">
                {s('about.ctaExplore')}
              </Link>
              <Link href="/apoie"
                    className="border border-forest/20 text-forest/60 text-[10px] tracking-widests uppercase
                               px-8 py-4 rounded-sm hover:border-forest/40 hover:text-forest transition-colors">
                {s('about.ctaSupport')}
              </Link>
            </div>
          </section>
        )}

        {/* COMO FUNCIONA */}
        {activeTab === 'funciona' && (
          <section className="px-10 py-20 max-w-screen-lg mx-auto">
            <p className="text-[10px] tracking-[0.25em] uppercase text-forest/35 mb-4">
              {cf('eyebrow')}
            </p>
            <h2 className="font-serif text-4xl font-light text-forest leading-tight mb-4">
              {cf('title')}{' '}
              <em className="italic text-leaf">{cf('titleEm1')}</em>{' '}
              {cf('titleConnector')}{' '}
              <em className="italic text-leaf">{cf('titleEm2')}</em>
            </h2>
            <p className="text-forest/50 text-base leading-relaxed max-w-xl mb-16">
              {cf('subtitle')}
            </p>

            {/* Two tracks */}
            <div className="grid md:grid-cols-2 gap-6 mb-20">
              {/* Donors */}
              <div className="bg-white border border-forest/[0.08] rounded-2xl p-10 shadow-sm">
                <p className="text-leaf text-[10px] tracking-widests uppercase mb-8">{cf('forDonors')}</p>
                <div className="flex flex-col gap-10 mb-12">
                  {(cf.raw('donorSteps') as Array<{title: string, text: string}>).map((st, i) => (
                    <div key={i} className="flex gap-5">
                      <span className="font-serif text-4xl font-light italic text-leaf/20 leading-none flex-shrink-0 w-10 select-none">
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      <div>
                        <h3 className="font-serif text-lg font-normal text-forest mb-2">{st.title}</h3>
                        <p className="text-forest/50 text-sm leading-relaxed">{st.text}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <Link href="/projetos"
                      className="bg-forest text-cream text-[10px] tracking-widests uppercase px-6 py-3 rounded-sm
                                 hover:bg-leaf transition-colors inline-flex">
                  {cf('exploreBtn')}
                </Link>
              </div>

              {/* Organizations */}
              <div className="bg-white border border-forest/[0.08] rounded-2xl p-10 shadow-sm">
                <p className="text-amber-600 text-[10px] tracking-widests uppercase mb-8">{cf('forOrgs')}</p>
                <div className="flex flex-col gap-10 mb-12">
                  {(cf.raw('orgSteps') as Array<{title: string, text: string, detail?: string}>).map((st, i) => (
                    <div key={i} className="flex gap-5">
                      <span className="font-serif text-4xl font-light italic text-amber-300/40 leading-none flex-shrink-0 w-10 select-none">
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      <div>
                        <h3 className="font-serif text-lg font-normal text-forest mb-2">{st.title}</h3>
                        <p className="text-forest/50 text-sm leading-relaxed">{st.text}</p>
                        {st.detail && (
                          <p className="text-[10px] text-leaf mt-2 tracking-wide">{st.detail}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                <Link href="/organizacoes/cadastro"
                      className="border border-forest/20 text-forest/60 text-[10px] tracking-widests uppercase
                                 px-6 py-3 rounded-sm hover:border-forest/40 hover:text-forest transition-colors inline-flex">
                  {cf('registerBtn')}
                </Link>
              </div>
            </div>

            {/* Content types */}
            <div className="border-t border-forest/[0.08] pt-16 mb-16">
              <p className="text-[10px] tracking-[0.25em] uppercase text-forest/35 mb-4">{cf('feedEyebrow')}</p>
              <h2 className="font-serif text-3xl font-light text-forest mb-4">
                {cf('feedTitle')}{' '}
                <em className="italic text-leaf">{cf('feedTitleEm')}</em>
              </h2>
              <p className="text-forest/45 text-sm leading-relaxed max-w-xl mb-10">{cf('feedSub')}</p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {(cf.raw('contentTypes') as Array<{icon: string, label: string, desc: string}>).map(c => (
                  <div key={c.label}
                       className="bg-white border border-forest/[0.07] rounded-xl p-6 shadow-sm">
                    <span className="text-leaf text-xl block mb-3">{c.icon}</span>
                    <p className="text-forest text-sm font-medium mb-2">{c.label}</p>
                    <p className="text-forest/40 text-xs leading-relaxed">{c.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Zero fee */}
            <div className="bg-forest rounded-2xl p-14 text-center">
              <h2 className="font-serif text-4xl font-light text-cream mb-4">
                {cf('zeroTitle')}{' '}
                <em className="italic text-sage">{cf('zeroTitleEm')}</em>
              </h2>
              <p className="text-cream/45 text-base leading-relaxed max-w-xl mx-auto mb-10">
                {cf('zeroSub')}
              </p>
              <div className="flex gap-3 justify-center flex-wrap">
                <Link href="/projetos"
                      className="bg-sage text-cream text-[10px] tracking-widests uppercase px-7 py-3.5 rounded-sm
                                 hover:bg-leaf transition-colors">
                  {cf('exploreBtn')}
                </Link>
                <Link href="/organizacoes/cadastro"
                      className="border border-white/25 text-cream/70 text-[10px] tracking-widests uppercase
                                 px-7 py-3.5 rounded-sm hover:border-white/50 hover:text-cream transition-colors">
                  {cf('registerBtn')}
                </Link>
              </div>
            </div>
          </section>
        )}

        {/* QUEM SOMOS */}
        {activeTab === 'quem' && (
          <section className="px-10 py-20 max-w-screen-lg mx-auto">

            {/* Origin story */}
            <div className="max-w-2xl mb-20">
              <p className="text-[10px] tracking-[0.25em] uppercase text-forest/35 mb-4">{s('team.storyEyebrow')}</p>
              <h2 className="font-serif text-4xl font-light text-forest leading-tight mb-6">
                {s('team.storyTitleBefore')}<em className="italic text-leaf">{s('team.storyTitleEm')}</em>
              </h2>
              <p className="text-forest/60 text-base leading-relaxed mb-4">
                {s('team.storyP1')}
              </p>
              <p className="text-forest/60 text-base leading-relaxed mb-4">
                {s('team.storyP2')}
              </p>
              <p className="text-forest/60 text-base leading-relaxed">
                {s('team.storyP3')}
              </p>
            </div>

            {/* Team */}
            <p className="text-[10px] tracking-[0.25em] uppercase text-forest/35 mb-8">{s('team.teamEyebrow')}</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-20">
              {teamMembers.map(p => (
                <div key={p.name}
                     className="bg-white border border-forest/[0.08] rounded-2xl p-8 shadow-sm">
                  <div className="w-14 h-14 rounded-full bg-forest/8 flex items-center justify-center mb-5">
                    <span className="font-serif text-xl text-forest/40">{p.name[0]}</span>
                  </div>
                  <h3 className="font-serif text-xl font-light text-forest mb-1">{p.name}</h3>
                  <p className="text-leaf text-[10px] tracking-widests uppercase mb-3">{p.role}</p>
                  <p className="text-forest/50 text-sm leading-relaxed">{p.bio}</p>
                </div>
              ))}
            </div>

            {/* Join */}
            <div className="bg-forest rounded-2xl p-14 text-center">
              <p className="text-sage/70 text-[10px] tracking-[0.2em] uppercase mb-3">{s('team.joinEyebrow')}</p>
              <h2 className="font-serif text-4xl font-light text-cream mb-4">
                {s('team.joinTitleBefore')}<em className="italic text-sage">{s('team.joinTitleEm')}</em>
              </h2>
              <p className="text-cream/40 text-base mb-10 max-w-md mx-auto">
                {s('team.joinSubtitle')}
              </p>
              <div className="flex flex-wrap gap-4 justify-center">
                <Link href="/projetos"
                      className="bg-sage text-cream text-[10px] tracking-widests uppercase px-7 py-3.5 rounded-sm
                                 hover:bg-leaf transition-colors">
                  {s('team.joinCtaProjects')}
                </Link>
                <Link href="/contato"
                      className="border border-white/25 text-cream/70 text-[10px] tracking-widests uppercase
                                 px-7 py-3.5 rounded-sm hover:border-white/50 hover:text-cream transition-colors">
                  {s('team.joinCtaContact')}
                </Link>
              </div>
            </div>
          </section>
        )}

      </main>
    </NavTheme>
  )
}
