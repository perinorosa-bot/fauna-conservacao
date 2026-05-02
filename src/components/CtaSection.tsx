'use client'

import { Link } from '@/i18n/navigation'
import { useTranslations } from 'next-intl'

export default function CtaSection() {
  const t = useTranslations('cta')

  return (
    <section
      className="relative flex items-center justify-center overflow-hidden text-center"
      style={{
        height:    '70vh',
        minHeight: 480,
        background: '#000',
      }}
    >
      <video
        autoPlay
        loop
        muted
        playsInline
        poster="https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=2200&auto=format&fit=crop&q=85"
        className="absolute inset-0 w-full h-full object-cover"
        style={{ filter: 'brightness(.42) saturate(.85)' }}
      >
        <source src="/cta-drone.mp4" type="video/mp4" />
      </video>

      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(180deg, rgba(11,20,16,0.55), rgba(11,20,16,0.2) 40%, rgba(11,20,16,0.85))',
        }}
      />

      <div
        className="relative z-10 max-w-[760px] mx-6 md:mx-10 px-8 md:px-12 py-14 md:py-16 rounded-[4px]"
        style={{
          background:           'rgba(11, 20, 16, 0.42)',
          backdropFilter:       'blur(22px) saturate(140%)',
          WebkitBackdropFilter: 'blur(22px) saturate(140%)',
          border:               '1px solid rgba(237, 229, 208, 0.18)',
          boxShadow:            'inset 0 1px 0 rgba(255,255,255,0.08), 0 12px 48px rgba(0,0,0,0.4)',
        }}
      >
        <p className="eyebrow mb-7" style={{ color: 'var(--sage)' }}>
          {t('eyebrow')}
        </p>

        <h2
          className="font-serif font-light mb-11"
          style={{
            fontSize:   'clamp(28px, 3.5vw, 44px)',
            lineHeight: 1.25,
            color:      'rgb(168, 67, 28)',
            textShadow: '0 2px 14px rgba(0,0,0,0.4)',
          }}
        >
          {t('headline')}
        </h2>

        <div className="flex gap-3 justify-center flex-wrap">
          <Link
            href="/projetos"
            className="font-mono text-[10px] tracking-[0.22em] uppercase font-semibold
                       bg-terra text-cream px-7 py-3.5 rounded-[2px]
                       hover:bg-[#A8431C] hover:-translate-y-px transition-all duration-200
                       shadow-[0_2px_14px_rgba(196,82,42,0.35)] hover:shadow-[0_6px_20px_rgba(196,82,42,0.45)]"
          >
            {t('cta1')}
          </Link>
          <Link
            href="/organizacoes/cadastro"
            className="font-mono text-[10px] tracking-[0.22em] uppercase
                       text-cream/80 px-7 py-3.5 rounded-[2px]
                       hover:text-cream transition-all"
            style={{
              background:           'rgba(237, 229, 208, 0.06)',
              backdropFilter:       'blur(14px) saturate(140%)',
              WebkitBackdropFilter: 'blur(14px) saturate(140%)',
              border:               '1px solid rgba(237, 229, 208, 0.22)',
            }}
          >
            {t('cta2')}
          </Link>
        </div>
      </div>
    </section>
  )
}
