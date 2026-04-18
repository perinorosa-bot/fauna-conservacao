'use client'

import Nav from '@/components/layout/Nav'
import { NavTheme } from '@/components/layout/NavTheme'
import Link from 'next/link'
import { useLanguage } from '@/lib/i18n/LanguageContext'

export default function ApoiePage() {
  const { t } = useLanguage()
  const a = t.apoie

  return (
    <NavTheme theme="light">
      <main className="min-h-screen bg-cream">
        <Nav />

        {/* Hero */}
        <section className="pt-40 pb-24 px-10 max-w-screen-lg mx-auto">
          <span className="text-sage text-[10px] tracking-[0.25em] uppercase block mb-5">{a.missionEyebrow}</span>
          <h1 className="font-serif text-6xl md:text-7xl font-light text-forest leading-[1.05] mb-8 max-w-3xl">
            {a.missionTitle} <em className="italic text-sage">{a.missionTitleEm}</em> merece
          </h1>
          <p className="text-forest/55 text-base leading-loose max-w-xl">
            {a.missionSub}
          </p>
        </section>

        {/* How it works financially */}
        <section className="bg-forest px-10 py-20">
          <div className="max-w-screen-lg mx-auto grid md:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="font-serif text-4xl font-light text-cream mb-6">
                {a.finTitle} <em className="italic text-sage">{a.finTitleEm}</em>
              </h2>
              <p className="text-cream/55 text-sm leading-loose mb-6">{a.finP1}</p>
              <p className="text-cream/55 text-sm leading-loose">{a.finP2}</p>
            </div>
            <div className="flex flex-col gap-5">
              {a.stats.map(s => (
                <div key={s.label} className="bg-canopy/50 border border-white/[0.08] rounded-xl px-7 py-5 flex items-center justify-between">
                  <span className="text-cream/55 text-sm">{s.label}</span>
                  <span className="font-serif text-3xl font-light text-sage">{s.value}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="px-10 py-24 max-w-screen-lg mx-auto">
          <h2 className="font-serif text-4xl font-light text-forest mb-14">
            {a.valuesTitle} <em className="italic text-sage">{a.valuesTitleEm}</em>
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            {a.values.map(v => (
              <div key={v.title} className="border-t border-forest/[0.10] pt-7">
                <div className="w-1.5 h-1.5 rounded-full bg-sage mb-5" />
                <h3 className="font-serif text-xl font-light text-forest mb-3">{v.title}</h3>
                <p className="text-forest/50 text-sm leading-loose">{v.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Support tiers */}
        <section className="bg-cream border-t border-forest/[0.07] px-10 py-24">
          <div className="max-w-screen-lg mx-auto">
            <div className="text-center mb-14">
              <h2 className="font-serif text-5xl font-light text-forest mb-4">
                {a.tiersTitle} <em className="italic text-sage">{a.tiersTitleEm}</em>
              </h2>
              <p className="text-forest/45 text-sm leading-loose max-w-md mx-auto">
                {a.tiersSub}
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6 mb-14">
              {a.tiers.map(tier => (
                <div
                  key={tier.name}
                  className={`rounded-2xl p-8 border flex flex-col ${
                    tier.highlight
                      ? 'bg-forest border-forest text-cream'
                      : 'bg-white/60 border-forest/[0.10] text-forest'
                  }`}
                >
                  <span className={`text-[10px] tracking-widest uppercase mb-2 ${tier.highlight ? 'text-sage' : 'text-forest/35'}`}>
                    {tier.name}
                  </span>
                  <p className={`font-serif text-3xl font-light mb-8 ${tier.highlight ? 'text-cream' : 'text-forest'}`}>
                    {tier.price}
                  </p>
                  <ul className="flex flex-col gap-3 flex-1 mb-8">
                    {tier.perks.map(perk => (
                      <li key={perk} className="flex items-start gap-3">
                        <span className={`mt-1 flex-shrink-0 w-1.5 h-1.5 rounded-full ${tier.highlight ? 'bg-sage' : 'bg-sage/60'}`} />
                        <span className={`text-sm leading-relaxed ${tier.highlight ? 'text-cream/75' : 'text-forest/55'}`}>{perk}</span>
                      </li>
                    ))}
                  </ul>
                  <Link
                    href="/contato?assunto=apoio"
                    className={`w-full text-center text-[10px] tracking-widest uppercase py-3.5 rounded-sm transition-colors ${
                      tier.highlight
                        ? 'bg-sage text-cream hover:bg-leaf'
                        : 'border border-forest/25 text-forest/60 hover:bg-forest/5 hover:text-forest hover:border-forest/40'
                    }`}
                  >
                    {a.tierCta}
                  </Link>
                </div>
              ))}
            </div>

            <div className="text-center">
              <p className="text-forest/35 text-xs mb-4">{a.corpNote}</p>
              <Link href="/contato" className="text-sage text-xs tracking-widest uppercase hover:underline">
                {a.corpLink}
              </Link>
            </div>
          </div>
        </section>

        {/* Footer CTA */}
        <section className="bg-forest px-10 py-20 text-center">
          <h2 className="font-serif text-4xl font-light text-cream mb-5">
            {a.footerTitle} <em className="italic text-sage">{a.footerTitleEm}</em>
          </h2>
          <p className="text-cream/45 text-sm leading-loose max-w-md mx-auto mb-10">
            {a.footerSub}
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link href="/projetos" className="btn-outline">{a.footerBtn1}</Link>
            <Link href="/contato" className="bg-sage text-cream text-xs tracking-widest uppercase px-8 py-3.5 rounded-sm hover:bg-leaf transition-colors">
              {a.footerBtn2}
            </Link>
          </div>
        </section>

      </main>
    </NavTheme>
  )
}
