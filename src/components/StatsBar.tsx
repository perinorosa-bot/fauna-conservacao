'use client'

import { useTranslations, useFormatter } from 'next-intl'

type Props = {
  projectCount: number
  totalRaised: number
  /** Países distintos onde há projetos. */
  countries?: number
  /** Quantidade de apoiadores únicos. */
  supporters?: number
}

function formatRaised(amount: number): string {
  if (amount >= 1_000_000) return `R$ ${(amount / 1_000_000).toFixed(1)}M`
  if (amount >= 1_000)     return `R$ ${(amount / 1_000).toFixed(1)}k`
  return `R$ ${amount.toFixed(0)}`
}

export default function StatsBar({ projectCount, totalRaised, countries = 68, supporters = 19_400 }: Props) {
  const t = useTranslations('stats')
  const format = useFormatter()

  const supportersLabel = supporters >= 1000
    ? `${format.number(supporters / 1000, { maximumFractionDigits: 1 })}k`
    : format.number(supporters)

  const stats = [
    { n: format.number(projectCount ?? 247),  l: t('activeProjects'), sub: t('subActiveProjects') },
    { n: format.number(countries),             l: t('countries'),       sub: t('subCountries') },
    { n: formatRaised(totalRaised),            l: t('raised'),          sub: t('subRaised') },
    { n: supportersLabel,                       l: t('supporters'),      sub: t('subSupporters') },
  ]

  return (
    <section
      className="relative"
      style={{ background: '#F5F5F5', padding: '120px 24px' }}
    >
      <div className="max-w-[1280px] mx-auto">
        {/* Header — eyebrow + título à esquerda, "Relatório 2026" à direita */}
        <div className="flex flex-wrap items-baseline justify-between gap-4 mb-14">
          <div>
            <p className="eyebrow mb-3.5">{t('eyebrow')}</p>
            <h2 className="font-serif text-forest font-light leading-[1.1]"
                style={{ fontSize: 'clamp(48px, 6.5vw, 88px)' }}>
              {t('titleH2')}
            </h2>
          </div>
          <div className="text-right font-mono text-[10px] tracking-[0.3em] uppercase text-forest/55">
            {t('report')}<br/>
            <span className="text-sage">{t('dataLive')}</span>
          </div>
        </div>

        {/* Grid 4 colunas — divisores sutis, sem card */}
        <div className="grid grid-cols-2 md:grid-cols-4 mt-8">
          {stats.map((s, i) => (
            <div
              key={s.l}
              className="px-7 pt-9 pb-8 relative"
              style={{
                borderRight: i < stats.length - 1 ? '1px solid rgba(26,53,40,0.10)' : 'none',
              }}
            >
              <div
                className="font-serif text-forest font-light leading-none mb-5"
                style={{
                  fontSize:      'clamp(64px, 7.5vw, 112px)',
                  letterSpacing: '-0.02em',
                }}
              >
                {s.n}
              </div>
              <div className="font-mono text-[12px] tracking-[0.22em] uppercase text-forest mb-2">
                {s.l}
              </div>
              <div className="text-sm text-forest/60">
                {s.sub}
              </div>
            </div>
          ))}
        </div>

        {/* Caption inferior */}
        <div className="mt-12 pt-6 flex justify-end font-mono text-[9px] tracking-[0.28em] uppercase text-forest/45">
          {t('captionFooter')}
        </div>
      </div>
    </section>
  )
}
