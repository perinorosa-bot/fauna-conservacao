'use client'

import { useEffect, useRef, useState } from 'react'
import { useLanguage } from '@/lib/i18n/LanguageContext'

const THREATENED_SPECIES = 44_016

function useCountUp(target: number, duration = 2800) {
  const [value, setValue] = useState(0)
  const ref     = useRef<HTMLDivElement>(null)
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
      { threshold: 0.25 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [target, duration])

  return { value, ref }
}

/* ── Topographic background ─────────────────────────── */
function TopoBackground() {
  const sectionRef = useRef<SVGSVGElement>(null)

  useEffect(() => {
    const onScroll = () => {
      if (!sectionRef.current) return
      const rect   = sectionRef.current.closest('section')?.getBoundingClientRect()
      if (!rect) return
      const pct    = Math.max(0, -rect.top / rect.height)
      sectionRef.current.style.transform = `translateY(${pct * 40}px)`
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const stroke = 'rgba(237,229,208,0.07)'
  const cx = 50
  const cy = 50

  return (
    <svg
      ref={sectionRef}
      className="absolute inset-0 w-full h-full pointer-events-none will-change-transform"
      viewBox="0 0 100 100"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden
    >
      {/* Latitude-like grid */}
      {[20, 35, 50, 65, 80].map(y => (
        <line key={y} x1="0" y1={y} x2="100" y2={y}
              stroke={stroke} strokeWidth="0.15" strokeDasharray="0.5 1.5" />
      ))}
      {/* Longitude-like grid */}
      {[15, 30, 45, 60, 75, 90].map(x => (
        <line key={x} x1={x} y1="0" x2={x} y2="100"
              stroke={stroke} strokeWidth="0.15" strokeDasharray="0.5 1.5" />
      ))}

      {/* Topographic contour rings — concentric, irregular ellipses */}
      {[
        [6,  3.5, 0.14],
        [11, 6.5, 0.12],
        [17, 10,  0.10],
        [24, 14,  0.09],
        [32, 19,  0.08],
        [41, 25,  0.06],
        [52, 32,  0.05],
        [64, 40,  0.04],
        [78, 49,  0.03],
      ].map(([rx, ry, op], i) => (
        <ellipse key={i}
          cx={cx} cy={cy - 2}
          rx={rx} ry={ry}
          fill="none"
          stroke={`rgba(237,229,208,${op})`}
          strokeWidth="0.3"
        />
      ))}

      {/* Crosshair at centre */}
      <line x1={cx - 3} y1={cy - 2} x2={cx + 3} y2={cy - 2}
            stroke="rgba(237,229,208,0.18)" strokeWidth="0.2" />
      <line x1={cx} y1={cy - 5} x2={cx} y2={cy + 1}
            stroke="rgba(237,229,208,0.18)" strokeWidth="0.2" />

      {/* Corner coord labels */}
      <text x="1.5" y="4" fontSize="1.4" fill="rgba(237,229,208,0.2)"
            fontFamily="monospace" letterSpacing="0.05">15°47′S</text>
      <text x="1.5" y="6" fontSize="1.4" fill="rgba(237,229,208,0.15)"
            fontFamily="monospace" letterSpacing="0.05">47°52′O</text>
      <text x="72" y="98" fontSize="1.4" fill="rgba(237,229,208,0.2)"
            fontFamily="monospace" letterSpacing="0.05">CERRADO · BR</text>
    </svg>
  )
}

/* ── Compass rose ────────────────────────────────────── */
function Compass() {
  return (
    <div className="absolute bottom-8 right-8 md:bottom-12 md:right-12 pointer-events-none select-none"
         aria-hidden>
      <svg width="72" height="72" viewBox="0 0 72 72">
        {/* Outer dotted ring */}
        <circle cx="36" cy="36" r="33" fill="none"
                stroke="rgba(237,229,208,0.18)" strokeWidth="0.8"
                strokeDasharray="2 3" />
        {/* Inner ring */}
        <circle cx="36" cy="36" r="26" fill="none"
                stroke="rgba(237,229,208,0.10)" strokeWidth="0.5" />

        {/* Cardinal ticks */}
        {[0, 45, 90, 135, 180, 225, 270, 315].map(deg => {
          const rad   = (deg * Math.PI) / 180
          const isMaj = deg % 90 === 0
          const r1    = isMaj ? 28 : 29.5
          const r2    = 33
          return (
            <line key={deg}
              x1={36 + r1 * Math.sin(rad)} y1={36 - r1 * Math.cos(rad)}
              x2={36 + r2 * Math.sin(rad)} y2={36 - r2 * Math.cos(rad)}
              stroke={`rgba(237,229,208,${isMaj ? 0.45 : 0.2})`}
              strokeWidth={isMaj ? 1 : 0.6}
            />
          )
        })}

        {/* N S E W labels */}
        {[
          { l: 'N', x: 36,    y: 10,   color: 'rgba(196,82,42,0.75)' },
          { l: 'S', x: 36,    y: 65.5, color: 'rgba(237,229,208,0.35)' },
          { l: 'E', x: 63,   y: 39,   color: 'rgba(237,229,208,0.35)' },
          { l: 'O', x: 9,    y: 39,   color: 'rgba(237,229,208,0.35)' },
        ].map(({ l, x, y, color }) => (
          <text key={l} x={x} y={y} textAnchor="middle"
                fontSize="6" fontFamily="monospace"
                fill={color} letterSpacing="0.5">
            {l}
          </text>
        ))}

        {/* Needle — north in terra, south in cream */}
        <polygon points="36,16 33.5,36 36,34 38.5,36"
                 fill="rgba(196,82,42,0.8)" />
        <polygon points="36,56 33.5,36 36,38 38.5,36"
                 fill="rgba(237,229,208,0.35)" />

        {/* Centre dot */}
        <circle cx="36" cy="36" r="2.5" fill="rgba(237,229,208,0.5)" />
        <circle cx="36" cy="36" r="1"   fill="rgba(26,53,40,1)" />

        <style>{`
          @keyframes compassPulse {
            0%, 100% { opacity: 0.75 }
            50%       { opacity: 1   }
          }
        `}</style>
      </svg>
    </div>
  )
}

export default function SpeciesCounter() {
  const { value, ref } = useCountUp(THREATENED_SPECIES)
  const { locale, t } = useLanguage()
  const formatted = new Intl.NumberFormat(
    locale === 'en' ? 'en-US' : locale === 'es' ? 'es-ES' : 'pt-BR'
  ).format(value)

  return (
    <section className="relative bg-forest overflow-hidden border-t border-white/[0.04]">

      <TopoBackground />

      {/* Vignette gradient */}
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 60% 55% at 50% 48%, transparent 35%, rgba(26,53,40,0.65) 100%)' }}
      />

      <div ref={ref} className="relative z-10 max-w-screen-xl mx-auto px-8 md:px-16 py-16 md:py-20">
        <div className="flex flex-col items-center text-center">

          <p className="font-mono text-cream/55 text-[11px] tracking-[0.28em] uppercase mb-8">
            {t.species.eyebrow}
          </p>

          <span
            className="font-serif text-cream tabular-nums leading-none mb-5"
            style={{ fontSize: 'clamp(72px, 12vw, 152px)', letterSpacing: '-0.03em' }}
          >
            {formatted}
          </span>

          <div className="w-10 h-px bg-sage/30 mb-5" />

          <p className="font-mono text-cream/60 text-xs tracking-[0.28em] uppercase">
            {t.species.label}
          </p>

        </div>
      </div>

      <Compass />
    </section>
  )
}
