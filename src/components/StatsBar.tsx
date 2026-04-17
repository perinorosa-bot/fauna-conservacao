'use client'

import Link from 'next/link'
import { useLanguage } from '@/lib/i18n/LanguageContext'

type Props = {
  projectCount: number
  totalRaised: number
}

/* Thin botanical branch SVG — decorative background element */
function BotanicalBg() {
  return (
    <svg
      className="absolute inset-0 w-full h-full pointer-events-none select-none"
      viewBox="0 0 1200 220"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden
    >
      {/* Faint horizontal field lines */}
      {[40, 80, 120, 160].map(y => (
        <line key={y} x1="0" y1={y} x2="1200" y2={y}
              stroke="rgba(237,229,208,0.04)" strokeWidth="0.5" strokeDasharray="4 8" />
      ))}
      {/* Specimen divider ticks between stats */}
      {[300, 600, 900].map(x => (
        <line key={x} x1={x} y1="60" x2={x} y2="160"
              stroke="rgba(237,229,208,0.07)" strokeWidth="0.6" />
      ))}
      {/* Corner marks */}
      <path d="M 20 20 L 20 5 L 35 5"  fill="none" stroke="rgba(196,82,42,0.25)" strokeWidth="1"/>
      <path d="M 1180 20 L 1180 5 L 1165 5" fill="none" stroke="rgba(196,82,42,0.25)" strokeWidth="1"/>
      <path d="M 20 200 L 20 215 L 35 215" fill="none" stroke="rgba(196,82,42,0.25)" strokeWidth="1"/>
      <path d="M 1180 200 L 1180 215 L 1165 215" fill="none" stroke="rgba(196,82,42,0.25)" strokeWidth="1"/>
    </svg>
  )
}

export default function StatsBar({ projectCount, totalRaised }: Props) {
  const { t } = useLanguage()

  const stats = [
    { n: projectCount ?? 247, l: t.stats.activeProjects, sub: 'projetos verificados' },
    { n: 68,                   l: t.stats.countries,      sub: 'em todos os continentes' },
    { n: `R$ ${(totalRaised / 1_000_000).toFixed(1)}M`, l: t.stats.raised, sub: 'direto ao campo' },
    { n: '19.400',             l: t.stats.supporters,    sub: 'e crescendo' },
  ]

  return (
    <>
      {/* ── Stats grid ─────────────────────────────────── */}
      <div className="relative bg-canopy overflow-hidden py-14 px-10">
        <BotanicalBg />

        {/* Catalog label */}
        <p className="relative z-10 font-mono text-cream/18 text-[8px] tracking-[0.35em]
                      uppercase text-center mb-10 select-none">
          FAUNA · DADOS DE CAMPO · ATUALIZADO {new Date().getFullYear()}
        </p>

        <div className="relative z-10 flex justify-center gap-8 md:gap-20 lg:gap-32 flex-wrap">
          {stats.map(({ n, l, sub }) => (
            <div key={l} className="text-center group min-w-[100px]">
              <span
                className="font-serif text-5xl md:text-6xl text-prussian block leading-none
                           transition-all duration-400 group-hover:text-terra group-hover:scale-105"
              >
                {n}
              </span>
              <span className="font-mono text-[10px] tracking-[0.2em] uppercase text-cream/55 mt-3 block">
                {l}
              </span>
              <span className="font-mono text-[8px] tracking-wider text-cream/20 mt-1 block">
                {sub}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Trust strip ────────────────────────────────── */}
      <div className="bg-forest border-y border-white/[0.04] py-8 px-10">
        <div className="max-w-2xl mx-auto flex flex-col sm:flex-row items-center gap-4 sm:gap-8 text-center sm:text-left">
          {/* Terra accent bar */}
          <div className="hidden sm:block w-0.5 h-8 bg-terra/40 flex-shrink-0" />
          <p className="font-serif text-cream/50 text-base md:text-lg font-light leading-relaxed">
            {t.trust.text}{' '}
            <Link
              href="/sobre"
              className="text-sage underline underline-offset-4 decoration-sage/30
                         hover:text-cream hover:decoration-cream/40 transition-all"
            >
              {t.trust.link}
            </Link>
          </p>
        </div>
      </div>
    </>
  )
}
