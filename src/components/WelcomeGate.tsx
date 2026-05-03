'use client'

import { useEffect, useRef, useState } from 'react'
import clsx from 'clsx'
import * as soundscape from '@/lib/soundscape'
import { useLocale } from 'next-intl'
import { usePathname, useRouter } from '@/i18n/navigation'
import type { Locale } from '@/i18n/routing'

type AudienceId = 'doador' | 'ong' | 'empresa'

const LOCALES: { code: Locale; label: string; flag: string }[] = [
  { code: 'pt', label: 'Português', flag: '🇧🇷' },
  { code: 'en', label: 'English',   flag: '🇺🇸' },
  { code: 'es', label: 'Español',   flag: '🇪🇸' },
]

const FLAG_LABELS: Record<Locale, string> = { pt: '🇧🇷', en: '🇺🇸', es: '🇪🇸' }

const PROFILES: {
  id: AudienceId
  eyebrow: string
  title: string
  desc: string
  icon: JSX.Element
}[] = [
  {
    id: 'doador',
    eyebrow: 'Sou doador individual',
    title: 'Quero apoiar um projeto de conservação da fauna',
    desc:  'Explore organizações verificadas e doe direto, sem intermediário.',
    icon: (
      <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M32 50s-14-8-14-20a8 8 0 0 1 14-5 8 8 0 0 1 14 5c0 12-14 20-14 20z" />
      </svg>
    ),
  },
  {
    id: 'ong',
    eyebrow: 'Sou ONG ou tenho um projeto',
    title: 'Quero me cadastrar e receber apoio',
    desc:  'Verificação em até 48h. Doações entram direto na sua Stripe Connect.',
    icon: (
      <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 50V26l18-12 18 12v24" />
        <path d="M26 50V36h12v14" />
      </svg>
    ),
  },
  {
    id: 'empresa',
    eyebrow: 'Sou doador institucional',
    title: 'Quero apoiar pela minha instituição',
    desc:  'Patrocine projetos alinhados ao seu ESG. Articulamos a parceria.',
    icon: (
      <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <rect x="12" y="18" width="40" height="32" />
        <path d="M22 18v-6h20v6" />
        <path d="M22 30h6M36 30h6M22 40h6M36 40h6" />
      </svg>
    ),
  },
]

export default function WelcomeGate() {
  const [show, setShow]                 = useState(false)
  const [closing, setClosing]           = useState(false)
  const [musicPlaying, setMusicPlaying] = useState(false)
  const [langOpen, setLangOpen]         = useState(false)
  const langRef                         = useRef<HTMLDivElement>(null)
  const path                            = usePathname()
  const router                          = useRouter()
  const locale                          = useLocale() as Locale

  // Decide se mostra o gate (apenas quando não há perfil salvo).
  useEffect(() => {
    if (typeof window === 'undefined') return
    const saved = localStorage.getItem('fauna_audience')
    if (!saved) setShow(true)
  }, [])

  useEffect(() => soundscape.subscribe(setMusicPlaying), [])

  // Áudio da natureza: tenta autoplay imediato; se browser bloquear, dá play
  // no primeiro gesto do usuário — assim o som engata o mais cedo possível
  // sem violar políticas de autoplay.
  useEffect(() => {
    if (!show) return
    soundscape.play()

    function startOnGesture() { soundscape.play() }
    window.addEventListener('pointerdown', startOnGesture, { once: true })
    window.addEventListener('keydown',     startOnGesture, { once: true })
    window.addEventListener('touchstart',  startOnGesture, { once: true })
    return () => {
      window.removeEventListener('pointerdown', startOnGesture)
      window.removeEventListener('keydown',     startOnGesture)
      window.removeEventListener('touchstart',  startOnGesture)
    }
  }, [show])

  // Fecha o dropdown de idioma ao clicar fora.
  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (langRef.current && !langRef.current.contains(e.target as Node)) {
        setLangOpen(false)
      }
    }
    document.addEventListener('mousedown', onClick)
    return () => document.removeEventListener('mousedown', onClick)
  }, [])

  // Trava scroll do body enquanto o gate está aberto.
  useEffect(() => {
    if (!show) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = prev }
  }, [show])

  function pick(id: AudienceId) {
    if (typeof window !== 'undefined') {
      localStorage.setItem('fauna_audience', id)
      window.dispatchEvent(new CustomEvent('fauna:audience-changed', { detail: id }))
    }
    soundscape.play()
    setClosing(true)
    setTimeout(() => setShow(false), 450)
  }

  function skip() { pick('doador') }

  if (!show) return null

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Selecione seu perfil"
      className={clsx(
        'fixed inset-0 z-[200] overflow-y-auto bg-forest transition-opacity duration-500',
        closing ? 'opacity-0 pointer-events-none' : 'opacity-100',
      )}
    >
      {/* Vídeo de fundo — fixed para cobrir mesmo durante scroll.
          opacity + blur transformam a arara em ambiente, não em foco que
          briga com o texto. */}
      <video
        autoPlay loop muted playsInline
        className="fixed inset-0 w-full h-full object-cover object-center"
        poster="/arara-hero.jpg"
        style={{ opacity: 0.45, filter: 'blur(1px) saturate(0.85)' }}
      >
        <source src="/arara-hero.mp4" type="video/mp4" />
        <source src="/arara-hero.mov" type="video/quicktime" />
      </video>

      {/* Camada — escurecimento adicional uniforme para garantir contraste
          em qualquer enquadramento da arara. */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          background: `
            radial-gradient(ellipse 100% 100% at 50% 50%, rgba(11,20,16,0.25), rgba(11,20,16,0.55) 100%),
            linear-gradient(to top, #0F1A12 0%, rgba(15,26,18,0.65) 35%, rgba(26,53,40,0.35) 65%, rgba(11,20,16,0.45) 100%)
          `,
        }}
      />

      <div className="relative z-10 min-h-full flex flex-col">
        {/* ── Top bar ──────────────────────────────────────────────────── */}
        <div className="flex items-center justify-between px-5 sm:px-10 py-4 sm:py-6 gap-3">
          <span
            className="font-sans tracking-[0.2em] uppercase text-cream"
            style={{
              fontSize:   'clamp(18px, 2vw, 24px)',
              textShadow: '0 1px 8px rgba(0,0,0,0.7)',
            }}
          >
            Fauna
          </span>

          <div className="flex items-center gap-2">
            {/* Music toggle */}
            <button
              onClick={soundscape.toggle}
              title={musicPlaying ? 'Pausar sons da natureza' : 'Tocar sons da natureza'}
              aria-label={musicPlaying ? 'Pausar sons da natureza' : 'Tocar sons da natureza'}
              className={clsx(
                'flex items-center justify-center w-9 h-9 rounded-sm border transition-colors',
                musicPlaying
                  ? 'border-sage/50 bg-sage/15 text-sage'
                  : 'border-white/25 text-cream/80 hover:text-cream hover:border-white/45',
              )}
              style={{ backdropFilter: 'blur(8px)' }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                {musicPlaying ? (
                  <>
                    <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
                    <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
                  </>
                ) : (
                  <line x1="23" y1="9" x2="17" y2="15" />
                )}
              </svg>
            </button>

            {/* Language dropdown */}
            <div ref={langRef} className="relative">
              <button
                onClick={() => setLangOpen(v => !v)}
                aria-haspopup="listbox"
                aria-expanded={langOpen}
                className="flex items-center gap-1.5 px-2.5 h-9 rounded-sm border border-white/25 text-cream/80 hover:text-cream hover:border-white/45 transition-colors"
                style={{ backdropFilter: 'blur(8px)' }}
              >
                <span>{FLAG_LABELS[locale]}</span>
                <span className="font-mono text-[10px] tracking-widest uppercase">{locale.toUpperCase()}</span>
                <svg width="8" height="8" viewBox="0 0 8 8" fill="none" className={clsx('transition-transform', langOpen && 'rotate-180')}>
                  <path d="M1 2.5L4 5.5L7 2.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
                </svg>
              </button>

              {langOpen && (
                <div
                  role="listbox"
                  className="absolute right-0 top-full mt-1.5 min-w-[160px] z-20"
                  style={{
                    background:           'rgba(11,20,16,0.96)',
                    backdropFilter:       'blur(20px)',
                    WebkitBackdropFilter: 'blur(20px)',
                    border:               '1px solid rgba(237,229,208,0.12)',
                  }}
                >
                  {LOCALES.map(({ code, label, flag }) => (
                    <button
                      key={code}
                      onClick={() => { router.replace(path, { locale: code }); setLangOpen(false) }}
                      className={clsx(
                        'w-full flex items-center gap-3 px-4 py-3 text-left text-[12px] transition-colors',
                        locale === code
                          ? 'bg-sage/15 text-sage'
                          : 'text-cream/85 hover:bg-white/[0.06] hover:text-cream',
                      )}
                    >
                      <span className="text-base">{flag}</span>
                      <span className="tracking-wide">{label}</span>
                      {locale === code && <span className="ml-auto text-sage text-xs">✓</span>}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Skip — sempre visível, compacto no mobile */}
            <button
              onClick={skip}
              className="inline-flex items-center font-mono text-[10px] sm:text-[11px] tracking-[0.18em] sm:tracking-[0.22em] uppercase text-cream/85 hover:text-cream px-2.5 sm:px-3 h-9 rounded-sm border border-white/30 hover:border-white/55 transition-colors"
              style={{ backdropFilter: 'blur(8px)' }}
            >
              Pular →
            </button>
          </div>
        </div>

        {/* ── Conteúdo ──────────────────────────────────────────────────── */}
        <div className="flex-1 flex flex-col justify-end px-5 sm:px-10 md:px-16 pb-8 sm:pb-12 md:pb-14 max-w-[1400px] mx-auto w-full">
          <div className="max-w-3xl mb-8 sm:mb-10">
            <h1
              className="font-sans font-normal text-cream leading-[1.05]"
              style={{
                fontSize:   'clamp(34px, 5.4vw, 76px)',
                textShadow: '0 2px 24px rgba(0,0,0,0.85), 0 1px 4px rgba(0,0,0,0.85), 0 0 1px rgba(0,0,0,0.6)',
              }}
            >
              Como você quer<br />
              <em className="italic text-terra" style={{ textShadow: '0 2px 18px rgba(0,0,0,0.85), 0 1px 3px rgba(0,0,0,0.85)' }}>apoiar a conservação da fauna?</em>
            </h1>
          </div>

          {/* Cards de perfil */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4">
            {PROFILES.map(p => (
              <button
                key={p.id}
                onClick={() => pick(p.id)}
                className="group relative text-left p-5 sm:p-6 rounded-[3px] transition-all duration-300
                           hover:-translate-y-0.5 focus:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-terra/60"
                style={{
                  background:           'rgba(11,20,16,0.72)',
                  border:               '1px solid rgba(237,229,208,0.22)',
                  boxShadow:            '0 8px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.06)',
                  backdropFilter:       'blur(12px) saturate(140%)',
                  WebkitBackdropFilter: 'blur(12px) saturate(140%)',
                }}
              >
                <div className="flex items-center gap-4">
                  <div
                    className="w-11 h-11 flex-shrink-0 text-terra group-hover:text-cream transition-colors flex items-center justify-center rounded-full"
                    style={{
                      background: 'rgba(196,82,42,0.18)',
                      border:     '1px solid rgba(196,82,42,0.42)',
                    }}
                  >
                    <div className="w-6 h-6">{p.icon}</div>
                  </div>

                  <div className="flex-1 min-w-0">
                    <p
                      className="font-mono uppercase tracking-[0.22em] text-cream/75 mb-1.5 group-hover:text-terra transition-colors font-semibold"
                      style={{ fontSize: 10.5 }}
                    >
                      {p.eyebrow}
                    </p>
                    <h2
                      className="font-sans text-cream font-normal leading-[1.25]"
                      style={{ fontSize: 'clamp(16px, 1.4vw, 18px)' }}
                    >
                      {p.title}
                    </h2>
                  </div>
                </div>
              </button>
            ))}
          </div>

        </div>
      </div>
    </div>
  )
}
