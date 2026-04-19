'use client'

import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'

export default function CtaSection() {
  const c = useTranslations('cta')

  return (
    <section className="relative h-[80vh] min-h-[500px] flex items-center justify-center overflow-hidden text-center">

      {/* Drone video background */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover brightness-[0.35] saturate-[0.7]"
      >
        <source src="/cta-drone.mp4" type="video/mp4" />
      </video>

      {/* Gradient overlay */}
      <div
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(180deg, rgba(23,49,37,0.55) 0%, rgba(23,49,37,0.15) 40%, rgba(23,49,37,0.75) 100%)',
        }}
      />

      <div className="relative z-10 px-10 max-w-3xl mx-auto">

        <p className="text-sage text-[10px] tracking-widest uppercase mb-7">
          {c('eyebrow')}
        </p>

        <h2
          className="font-serif font-light text-cream leading-[1.2] mb-11"
          style={{ fontSize: 'clamp(16px, 1.6vw, 26px)' }}
        >
          {c('headline')} <span className="text-terra">{c('headlineEm')}</span>
        </h2>

        <div className="flex gap-3 justify-center flex-wrap">
          <Link href="/projetos" className="btn-terra">
            {c('cta1')}
          </Link>
          <Link href="/organizacoes/cadastro" className="btn-outline">
            {c('cta2')}
          </Link>
          <Link href="/apoie" className="btn-outline">
            {c('cta3')}
          </Link>
        </div>

        <p className="mt-10 text-cream/22 text-xs tracking-wide">
          {c('footnote')}
        </p>
      </div>
    </section>
  )
}
