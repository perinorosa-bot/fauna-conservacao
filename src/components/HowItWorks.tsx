'use client'

import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'

const STEP_ICONS = [
  /* 01 — Escolha */ (
    <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round">
      <circle cx="16" cy="16" r="12" strokeDasharray="3 4" opacity="0.4"/>
      <path d="M10 16 l4 4 l8-8" strokeWidth="1.5"/>
    </svg>
  ),
  /* 02 — Doe */ (
    <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round">
      <path d="M16 6 C10 6 6 10 6 14 C6 20 16 26 16 26 C16 26 26 20 26 14 C26 10 22 6 16 6Z" opacity="0.5"/>
      <path d="M13 14 l2 2 l4-4" strokeWidth="1.5"/>
    </svg>
  ),
  /* 03 — Acompanhe */ (
    <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round">
      <circle cx="16" cy="16" r="3"/>
      <circle cx="16" cy="16" r="7"  opacity="0.4"/>
      <circle cx="16" cy="16" r="12" opacity="0.2"/>
      <line x1="16" y1="4"  x2="16" y2="8"/>
      <line x1="16" y1="24" x2="16" y2="28"/>
      <line x1="4"  y1="16" x2="8"  y2="16"/>
      <line x1="24" y1="16" x2="28" y2="16"/>
    </svg>
  ),
]

type Step = { title: string; text: string; detail: string }

export default function HowItWorks() {
  const hw = useTranslations('howItWorks')
  const steps = hw.raw('steps') as Step[]

  return (
    <section
      id="como-funciona"
      className="relative py-20 md:py-28 px-10 overflow-hidden"
      style={{ backgroundColor: '#F5EFE0' }}
    >
      {/* Faint topo rings — top right */}
      <svg
        className="absolute top-0 right-0 w-72 h-72 pointer-events-none opacity-30"
        viewBox="0 0 200 200" aria-hidden
      >
        {[20,35,50,65,80,95].map((r,i) => (
          <circle key={i} cx="200" cy="0" r={r}
                  fill="none" stroke="rgba(26,53,40,0.12)" strokeWidth="0.6"/>
        ))}
      </svg>

      <div className="relative z-10 max-w-screen-xl mx-auto">

        {/* Header */}
        <div className="mb-14 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <div>
            <p className="font-mono text-terra/65 text-[9px] tracking-[0.35em] uppercase mb-4">
              {hw('eyebrow')}
            </p>
            <h2 className="font-serif text-4xl md:text-5xl text-forest leading-tight">
              {hw('title')}
            </h2>
          </div>
          <Link
            href="/sobre"
            className="font-mono text-forest/40 text-[9px] tracking-[0.25em] uppercase
                       flex items-center gap-2 hover:gap-4 hover:text-forest transition-all self-start md:self-auto group"
          >
            {hw('learnMore')}
            <span className="w-4 h-px bg-forest/30 group-hover:bg-forest transition-all" />
          </Link>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {steps.map((s, i) => (
            <div
              key={i}
              className="relative bg-white border border-forest/[0.08] rounded-none px-8 py-10
                         flex flex-col group
                         shadow-[0_2px_20px_rgba(26,53,40,0.05)]
                         hover:shadow-[0_6px_36px_rgba(26,53,40,0.12)]
                         hover:-translate-y-1 transition-all duration-300"
            >
              {/* Specimen catalog strip */}
              <div className="absolute top-0 left-0 right-0 h-0.5 bg-terra/0 group-hover:bg-terra/30 transition-colors duration-500" />

              {/* Step number — large, botanical */}
              <div className="flex items-start justify-between mb-8">
                <span
                  className="font-serif leading-none text-forest/10 group-hover:text-terra/20
                             transition-colors duration-300 select-none"
                  style={{ fontSize: 'clamp(56px, 7vw, 80px)' }}
                >
                  {String(i + 1).padStart(2, '0')}
                </span>
                {/* Icon */}
                <div className="w-8 h-8 text-sage/50 group-hover:text-terra/60 transition-colors duration-300 mt-2">
                  {STEP_ICONS[i]}
                </div>
              </div>

              <h3 className="font-serif text-xl text-forest mb-4 leading-snug">
                {s.title}
              </h3>
              <p className="text-sm text-forest/55 leading-loose mb-6 flex-1">
                {s.text}
              </p>

              {/* Detail — field note style */}
              <div className="border-t border-forest/[0.07] pt-4 flex items-start gap-2">
                <span className="text-terra/50 text-xs mt-0.5 flex-shrink-0">→</span>
                <p className="font-mono text-[10px] text-forest/45 tracking-wide leading-relaxed">
                  {s.detail}
                </p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}
