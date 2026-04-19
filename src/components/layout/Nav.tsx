'use client'

import { useEffect, useRef, useState } from 'react'
import clsx from 'clsx'
import { useTranslations, useLocale } from 'next-intl'
import { Link, usePathname, useRouter } from '@/i18n/navigation'
import { useNavTheme } from './NavTheme'
import type { Locale } from '@/i18n/routing'
import { createClient } from '@/lib/supabase/client'

const LOCALES: { code: Locale; label: string; flag: string }[] = [
  { code: 'pt', label: 'Português', flag: '🇧🇷' },
  { code: 'en', label: 'English',   flag: '🇺🇸' },
  { code: 'es', label: 'Español',   flag: '🇪🇸' },
]

const FLAG_LABELS: Record<Locale, string> = { pt: '🇧🇷', en: '🇺🇸', es: '🇪🇸' }

function useSoundscape() {
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [playing, setPlaying] = useState(false)

  function toggle() {
    if (!audioRef.current) {
      const audio = new Audio('/nature.mp3')
      audio.loop = true
      audio.volume = 0.55
      audioRef.current = audio
    }
    if (playing) { audioRef.current.pause(); setPlaying(false) }
    else          { audioRef.current.play();  setPlaying(true)  }
  }

  useEffect(() => { return () => { audioRef.current?.pause() } }, [])
  return { playing, toggle }
}

export default function Nav() {
  const path                      = usePathname()
  const router                    = useRouter()
  const [scrolled, setScrolled]   = useState(false)
  const [visible, setVisible]     = useState(false)
  const [userEmail, setUserEmail]  = useState<string | null>(null)
  const [userRole, setUserRole]    = useState<string | null>(null)
  const [langOpen, setLangOpen]    = useState(false)
  const langRef                    = useRef<HTMLDivElement>(null)
  const { playing, toggle }       = useSoundscape()
  const t                         = useTranslations('nav')
  const locale                    = useLocale() as Locale
  const navTheme                  = useNavTheme()

  function setLocale(code: Locale) {
    // URL-driven locale switch: preserves current path + history entry.
    router.replace(path, { locale: code })
  }

  useEffect(() => {
    const supabase = createClient()

    async function loadUser(userId: string | undefined) {
      if (!userId) { setUserEmail(null); setUserRole(null); return }
      const { data: profile } = await supabase.from('profiles').select('role').eq('id', userId).single()
      setUserRole(profile?.role ?? null)
    }

    supabase.auth.getSession().then(({ data: { session } }) => {
      setUserEmail(session?.user?.email ?? null)
      loadUser(session?.user?.id)
    })
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUserEmail(session?.user?.email ?? null)
      loadUser(session?.user?.id)
    })
    return () => subscription.unsubscribe()
  }, [])

  // Close lang dropdown on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (langRef.current && !langRef.current.contains(e.target as Node)) {
        setLangOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const isLight = navTheme === 'light' && !scrolled

  useEffect(() => {
    const showTimer = setTimeout(() => setVisible(true), 280)
    const onScroll  = () => setScrolled(window.scrollY > 48)
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => { clearTimeout(showTimer); window.removeEventListener('scroll', onScroll) }
  }, [])

  // Colour tokens
  const logoColor    = isLight ? 'text-forest'                    : 'text-cream'
  // Dark theme: bumped from /50 to /80 + drop-shadow halo so links stay
  // readable on medium-green backgrounds where the nav used to disappear.
  const linkInactive = isLight
    ? 'text-forest/50 hover:text-forest'
    : 'text-cream/80 hover:text-cream drop-shadow-[0_1px_6px_rgba(0,0,0,0.6)]'

  const outlineBtn = isLight
    ? 'border border-forest/20 text-forest/60 hover:bg-forest/5 hover:text-forest hover:border-forest/40'
    : 'border border-white/20 text-cream/70 hover:bg-white/5 hover:text-cream hover:border-white/40'

  const authHref = !userEmail
    ? '/entrar'
    : userRole === 'organization' ? '/org/painel' : '/perfil'

  return (
    <nav
      className={clsx(
        'fixed top-0 left-0 right-0 z-50 px-8 py-4 flex items-center gap-5 transition-all duration-500',
        scrolled
          ? 'bg-black/45 backdrop-blur-md border-b border-white/[0.06]'
          // Unscrolled: a soft top-down gradient guarantees contrast on any
          // page background (issue #10 — nav invisible on green-bg pages).
          : isLight
            ? 'bg-transparent'
            : 'bg-gradient-to-b from-black/35 to-transparent',
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2',
      )}
      style={{ transitionProperty: 'background, border-color, padding, opacity, transform' }}
    >
      {/* ── Logo ──────────────────────────────────────────────────────────── */}
      <Link
        href="/"
        className={clsx(
          'font-display tracking-[0.18em] uppercase transition-all duration-300 hover:opacity-75 flex-shrink-0 mr-2',
          logoColor,
          !isLight && 'drop-shadow-[0_1px_8px_rgba(0,0,0,0.55)]',
        )}
        style={{ fontSize: 'clamp(18px, 2vw, 28px)', letterSpacing: '0.18em' }}
      >
        Fauna
      </Link>

      {/* ── Left nav links ────────────────────────────────────────────────── */}
      <Link href="/sobre"
            className={clsx('text-[10px] tracking-widest uppercase transition-colors duration-200 whitespace-nowrap',
              path.startsWith('/sobre') ? 'text-sage' : linkInactive)}>
        {t('about')}
      </Link>

      <Link href="/projetos"
            className={clsx('text-[10px] tracking-widest uppercase transition-colors duration-200 whitespace-nowrap',
              path.startsWith('/projetos') ? 'text-sage' : linkInactive)}>
        {t('projects')}
      </Link>

      <Link href="/academy"
            className={clsx('text-[10px] tracking-widest uppercase transition-colors duration-200 whitespace-nowrap',
              path.startsWith('/academy') ? 'text-sage' : linkInactive)}>
        {t('academy')}
      </Link>

      <a href="https://umapenca.com/fauna-conservacao" target="_blank" rel="noopener noreferrer"
         className={clsx('text-[10px] tracking-widest uppercase transition-colors duration-200 whitespace-nowrap', linkInactive)}>
        {t('shop')}
      </a>

      {/* ── Spacer ────────────────────────────────────────────────────────── */}
      <div className="flex-1" />

      {/* ── Right side buttons ────────────────────────────────────────────── */}

      {/* Nos apoie */}
      <Link href="/apoie"
            className={clsx(
              'text-[10px] tracking-widest uppercase px-4 py-2.5 rounded-sm transition-all duration-200 whitespace-nowrap hidden lg:inline-flex',
              outlineBtn,
            )}>
        {t('support')}
      </Link>

      {/* Doe agora */}
      {path.startsWith('/projetos') ? (
        <a href="#projetos"
           className="text-[10px] tracking-widest uppercase font-medium bg-terra text-cream
                      px-5 py-2.5 rounded-sm hover:bg-[#A8431C] transition-colors duration-200
                      hidden sm:inline-flex whitespace-nowrap shadow-[0_2px_12px_rgba(196,82,42,0.4)]">
          {t('donate')}
        </a>
      ) : (
        <Link href="/projetos"
              className="text-[10px] tracking-widest uppercase font-medium bg-terra text-cream
                         px-5 py-2.5 rounded-sm hover:bg-leaf transition-colors duration-200
                         hidden sm:inline-flex whitespace-nowrap shadow-[0_2px_12px_rgba(107,142,90,0.4)]">
          {t('donate')}
        </Link>
      )}

      {/* Tem um projeto de conservação? */}
      <Link href="/organizacoes/cadastro"
            className={clsx(
              'text-[10px] tracking-widest uppercase px-4 py-2.5 rounded-sm transition-all duration-200 whitespace-nowrap hidden xl:inline-flex',
              outlineBtn,
            )}>
        {t('haveProject')}
      </Link>

      {/* Entrar / Meu perfil */}
      <Link href={authHref}
            className={clsx(
              'text-[10px] tracking-widest uppercase px-4 py-2.5 rounded-sm transition-all duration-200 whitespace-nowrap hidden sm:inline-flex',
              isLight
                ? 'border border-forest/20 text-forest/60 hover:bg-forest/5 hover:text-forest hover:border-forest/40'
                : 'border border-white/20 text-cream/70 hover:bg-white/5 hover:text-cream hover:border-white/40',
            )}>
        {userEmail ? t('myProfile') : t('signIn')}
      </Link>

      {/* ── Language dropdown ─────────────────────────────────────────────── */}
      <div ref={langRef} className="relative hidden sm:block">
        <button
          onClick={() => setLangOpen(v => !v)}
          className={clsx(
            'flex items-center gap-1.5 text-[11px] px-2.5 py-2 rounded-sm border transition-all duration-200',
            isLight
              ? 'border-forest/[0.18] text-forest/50 hover:border-forest/35 hover:text-forest'
              : 'border-white/[0.15] text-cream/50 hover:border-white/30 hover:text-cream',
          )}
        >
          <span>{FLAG_LABELS[locale]}</span>
          <span className="text-[9px] tracking-widest uppercase">{locale.toUpperCase()}</span>
          <svg width="8" height="8" viewBox="0 0 8 8" fill="none" className={clsx('transition-transform duration-200', langOpen && 'rotate-180')}>
            <path d="M1 2.5L4 5.5L7 2.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
          </svg>
        </button>

        {langOpen && (
          <div className="absolute right-0 top-full mt-1.5 bg-[#0e1a12]/95 backdrop-blur-md border border-white/[0.08]
                          rounded-xl overflow-hidden shadow-xl min-w-[140px]">
            {LOCALES.map(({ code, label, flag }) => (
              <button
                key={code}
                onClick={() => { setLocale(code); setLangOpen(false) }}
                className={clsx(
                  'w-full flex items-center gap-3 px-4 py-3 text-left text-[11px] transition-colors',
                  locale === code
                    ? 'bg-sage/15 text-sage'
                    : 'text-cream/55 hover:bg-white/[0.05] hover:text-cream',
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

      {/* ── Music toggle ──────────────────────────────────────────────────── */}
      <button
        onClick={toggle}
        title={playing ? t('pauseSounds') : t('playSounds')}
        className={clsx(
          'flex items-center gap-1.5 transition-all duration-200',
          playing ? 'text-sage' : isLight ? 'text-forest/40 hover:text-forest/70' : 'text-cream/40 hover:text-cream/70',
        )}
      >
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
          {playing ? (
            <>
              <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
              <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
            </>
          ) : (
            <line x1="23" y1="9" x2="17" y2="15" />
          )}
        </svg>
        {playing && (
          <span className="flex gap-0.5 items-end h-3">
            {[0, 0.2, 0.4].map(d => (
              <span key={d} className="w-0.5 bg-sage rounded-full"
                style={{ animation: `soundBar 0.8s ease-in-out ${d}s infinite alternate`, height: '6px' }} />
            ))}
          </span>
        )}
      </button>

      <style>{`
        @keyframes soundBar {
          from { transform: scaleY(0.3); }
          to   { transform: scaleY(1.4); }
        }
      `}</style>
    </nav>
  )
}
