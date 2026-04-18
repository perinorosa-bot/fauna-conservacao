'use client'

import Nav from '@/components/layout/Nav'
import { NavTheme } from '@/components/layout/NavTheme'
import Link from 'next/link'
import { useLanguage } from '@/lib/i18n/LanguageContext'

export default function ComoFuncionaPage() {
  const { t } = useLanguage()
  const cf = t.comoFunciona

  return (
    <NavTheme theme="light">
    <main className="min-h-screen bg-cream">
      <Nav />

      {/* Hero */}
      <div className="pt-40 pb-20 px-10 max-w-screen-xl mx-auto">
        <span className="text-sage text-[10px] tracking-[0.25em] uppercase block mb-4">
          {cf.eyebrow}
        </span>
        <h1
          className="font-serif font-light text-forest leading-tight mb-6"
          style={{ fontSize: 'clamp(40px, 6vw, 80px)' }}
        >
          {cf.title}<br />
          <em className="italic text-sage">{cf.titleEm1}</em> {cf.titleConnector}{' '}
          <em className="italic text-sage">{cf.titleEm2}</em>
        </h1>
        <p className="text-forest/50 text-base leading-relaxed max-w-xl">
          {cf.subtitle}
        </p>
      </div>

      {/* Two tracks */}
      <div className="px-10 pb-24 max-w-screen-xl mx-auto grid md:grid-cols-2 gap-6">

        {/* Donors */}
        <div className="bg-white/60 border border-forest/[0.08] rounded-2xl p-10">
          <p className="text-sage text-[10px] tracking-widest uppercase mb-8">{cf.forDonors}</p>
          <div className="flex flex-col gap-10 mb-12">
            {cf.donorSteps.map((s, i) => (
              <div key={i} className="flex gap-5">
                <span className="font-serif text-4xl font-light italic text-sage/20 leading-none flex-shrink-0 w-10 select-none">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <div>
                  <h3 className="font-serif text-lg font-normal text-forest mb-2">{s.title}</h3>
                  <p className="text-forest/50 text-sm leading-relaxed">{s.text}</p>
                </div>
              </div>
            ))}
          </div>
          <Link href="/projetos" className="btn-primary inline-flex">
            {cf.exploreBtn}
          </Link>
        </div>

        {/* Organizations */}
        <div className="bg-white/60 border border-forest/[0.08] rounded-2xl p-10">
          <p className="text-warm text-[10px] tracking-widest uppercase mb-8">{cf.forOrgs}</p>
          <div className="flex flex-col gap-10 mb-12">
            {cf.orgSteps.map((s, i) => (
              <div key={i} className="flex gap-5">
                <span className="font-serif text-4xl font-light italic text-warm/20 leading-none flex-shrink-0 w-10 select-none">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <div>
                  <h3 className="font-serif text-lg font-normal text-forest mb-2">{s.title}</h3>
                  <p className="text-forest/50 text-sm leading-relaxed">{s.text}</p>
                  {s.detail && (
                    <p className="text-[10px] text-sage mt-2 tracking-wide">{s.detail}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
          <Link href="/organizacoes/cadastro" className="btn-outline-dark inline-flex">
            {cf.registerBtn}
          </Link>
        </div>
      </div>

      {/* Content types */}
      <div className="px-10 pb-24 max-w-screen-xl mx-auto">
        <div className="border-t border-forest/[0.08] pt-20">
          <p className="text-sage text-[10px] tracking-[0.25em] uppercase mb-4">{cf.feedEyebrow}</p>
          <h2 className="font-serif text-3xl md:text-4xl font-light text-forest mb-4">
            {cf.feedTitle}<br />
            <em className="italic text-sage">{cf.feedTitleEm}</em>
          </h2>
          <p className="text-forest/45 text-sm leading-relaxed max-w-xl mb-14">
            {cf.feedSub}
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {cf.contentTypes.map(c => (
              <div key={c.label} className="bg-white/70 border border-forest/[0.07] rounded-xl p-6">
                <span className="text-sage text-xl block mb-3">{c.icon}</span>
                <p className="text-forest text-sm font-medium mb-2">{c.label}</p>
                <p className="text-forest/40 text-xs leading-relaxed">{c.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Zero fee banner */}
      <div className="px-10 pb-28 max-w-screen-xl mx-auto">
        <div className="bg-forest rounded-2xl p-14 text-center">
          <h2 className="font-serif text-4xl font-light text-cream mb-4">
            {cf.zeroTitle}{' '}
            <em className="italic text-sage">{cf.zeroTitleEm}</em>
          </h2>
          <p className="text-cream/45 text-base leading-relaxed max-w-xl mx-auto mb-10">
            {cf.zeroSub}
          </p>
          <div className="flex gap-3 justify-center flex-wrap">
            <Link href="/projetos" className="btn-primary">{cf.exploreBtn}</Link>
            <Link href="/organizacoes/cadastro" className="btn-outline">{cf.registerBtn}</Link>
          </div>
        </div>
      </div>
    </main>
    </NavTheme>
  )
}
