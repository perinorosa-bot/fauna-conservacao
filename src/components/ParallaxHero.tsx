'use client'

import { useEffect, useRef } from 'react'
import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'

export default function ParallaxHero() {
  const contentRef = useRef<HTMLDivElement>(null)
  const t = useTranslations('hero')

  useEffect(() => {
    const timer = setTimeout(() => {
      contentRef.current?.classList.remove('opacity-0', 'translate-y-4')
    }, 200)
    return () => clearTimeout(timer)
  }, [])

  return (
    <section className="relative h-screen min-h-[600px] flex items-end overflow-hidden bg-forest">

      <video
        autoPlay loop muted playsInline
        className="absolute inset-0 w-full h-full object-cover object-center"
        poster="/arara-hero.jpg"
      >
        <source src="/arara-hero.mp4" type="video/mp4" />
        <source src="/arara-hero.mov" type="video/quicktime" />
      </video>

      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `
            radial-gradient(ellipse 90% 95% at 62% 45%, transparent 38%, #1A3528 82%),
            linear-gradient(to top, #1A3528 0%, rgba(26,53,40,0.55) 38%, transparent 65%)
          `,
        }}
      />

      <div
        ref={contentRef}
        className="relative z-10 w-full px-10 md:px-16 pb-16 md:pb-20
                   opacity-0 translate-y-4 transition-all duration-1000 ease-out"
      >
        <p className="font-mono text-cream/25 text-[9px] tracking-widest mb-8 select-none">
          15°47′S · 47°52′O · Cerrado Central · {new Date().getFullYear()}
        </p>

        <div className="max-w-2xl">
          <h1
            className="font-serif font-light text-cream leading-[1.05] mb-7"
            style={{ fontSize: 'clamp(44px, 7vw, 92px)', textShadow: '0 2px 32px rgba(0,0,0,0.5)' }}
          >
            {t('headline1')}<br />
            <em className="italic text-terra">{t('headline2')}</em>
          </h1>

          <p className="text-cream/55 text-sm leading-relaxed mb-10 max-w-sm">
            {t('sub')}
          </p>

          <div className="flex gap-3 flex-wrap">
            <Link href="/projetos" className="btn-primary">
              {t('cta')}
            </Link>
            <Link href="/sobre" className="btn-outline">
              {t('ctaSecondary')}
            </Link>
          </div>
        </div>
      </div>

      <div className="absolute bottom-8 right-10 z-10 flex flex-col items-center gap-2 pointer-events-none">
        <span className="text-cream/30 text-[9px] tracking-widest uppercase">{t('scroll')}</span>
        <div className="w-px h-10 overflow-hidden relative">
          <div
            className="absolute w-full h-1/2 bg-gradient-to-b from-transparent to-sage/50"
            style={{ animation: 'caretFall 2s ease-in-out infinite' }}
          />
        </div>
      </div>

      <style>{`
        @keyframes caretFall { 0% { top: -50% } 100% { top: 110% } }
      `}</style>
    </section>
  )
}
