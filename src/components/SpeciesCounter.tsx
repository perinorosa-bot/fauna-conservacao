'use client'

import { useEffect, useRef, useState } from 'react'
import { useLanguage } from '@/lib/i18n/LanguageContext'

const THREATENED_SPECIES = 44_016

/* ── Hook: count-up que dispara quando entra na tela ── */
function useCountUp(target: number, duration = 2800) {
  const [value, setValue] = useState(0)
  const ref     = useRef<HTMLElement | null>(null)
  const started = useRef(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || started.current) return
        started.current = true
        obs.disconnect()
        const startTime = performance.now()
        const tick = (now: number) => {
          const elapsed  = now - startTime
          const progress = Math.min(elapsed / duration, 1)
          const eased    = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress)
          setValue(Math.round(eased * target))
          if (progress < 1) requestAnimationFrame(tick)
        }
        requestAnimationFrame(tick)
      },
      { threshold: 0.25 },
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [target, duration])

  return { value, ref }
}

export default function SpeciesCounter() {
  const { value, ref } = useCountUp(THREATENED_SPECIES)
  const { locale }     = useLanguage()
  const formatted = new Intl.NumberFormat(
    locale === 'en' ? 'en-US' : locale === 'es' ? 'es-ES' : 'pt-BR',
  ).format(value)

  // Parallax entre -0.5 e 1.5 conforme a seção entra/sai da viewport.
  const [py, setPy] = useState(0.5)
  useEffect(() => {
    const onScroll = () => {
      const el = ref.current
      if (!el) return
      const rect = el.getBoundingClientRect()
      const vh   = window.innerHeight
      const p    = (vh - rect.top) / (vh + rect.height)
      setPy(Math.max(-0.5, Math.min(1.5, p)))
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [ref])

  return (
    <section
      ref={ref as React.RefObject<HTMLElement>}
      className="relative overflow-hidden"
      style={{ background: 'var(--basalt)', height: '100vh', minHeight: 680 }}
    >
      {/* Layer 1 — vídeo full-bleed com parallax */}
      <div
        className="absolute will-change-transform"
        style={{
          inset: '-10% -4%',
          transform: `translate3d(0, ${(py - 0.5) * -120}px, 0) scale(1.08)`,
        }}
      >
        <video
          src="/lobo-guara.mp4"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Conteúdo */}
      <div className="absolute inset-0 z-[3] flex flex-col justify-center items-center text-center px-6 md:px-14">
        <div className="max-w-[1280px] mx-auto w-full flex flex-col items-center">

          {/* Contador */}
          <div className="flex flex-col items-center" style={{ transform: `translateY(${(0.5 - py) * 30}px)` }}>
            <p className="eyebrow mb-5">IUCN Red List · abr. 2026</p>

            <div
              className="font-serif text-cream tabular-nums"
              style={{
                fontSize: 'clamp(72px, 13vw, 200px)',
                lineHeight: 0.92,
                letterSpacing: '-0.045em',
                fontWeight: 300,
                textShadow: '0 4px 48px rgba(0,0,0,0.5)',
              }}
            >
              {formatted}
            </div>

            <div className="mt-7 pt-7 border-t border-cream/[0.22] max-w-[760px] text-center">
              <p className="font-serif text-cream text-3xl md:text-5xl font-medium tracking-tight mb-7">
                Espécies ameaçadas de extinção
              </p>
              <p className="font-serif italic text-cream/[0.78] text-xl md:text-2xl leading-[1.5]">
                “Não estamos perdendo apenas espécies. Estamos perdendo o
                testemunho de milhões de anos de evolução.”
              </p>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
