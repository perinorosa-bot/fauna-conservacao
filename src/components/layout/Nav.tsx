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

type AudienceId = 'doador' | 'ong' | 'empresa'
const AUDIENCE_HREF: Record<AudienceId, string> = {
  doador:  '/projetos',
  ong:     '/organizacoes/cadastro',
  empresa: '/apoie',
}
const AUDIENCE_KEY: Record<AudienceId, 'donor' | 'ngo' | 'company'> = {
  doador:  'donor',
  ong:     'ngo',
  empresa: 'company',
}
const AUDIENCE_ORDER: AudienceId[] = ['doador', 'ong', 'empresa']

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
  const path                       = usePathname()
  const router                     = useRouter()
  const [scrolled, setScrolled]    = useState(false)
  const [visible, setVisible]      = useState(false)
  const [userEmail, setUserEmail]  = useState<string | null>(null)
  const [userRole, setUserRole]    = useState<string | null>(null)
  const [langOpen, setLangOpen]    = useState(false)
  const langRef                    = useRef<HTMLDivElement>(null)
  const [audience, setAudience]    = useState<AudienceId>('doador')
  const [audOpen, setAudOpen]      = useState(false)
  const audRef                     = useRef<HTMLDivElement>(null)
  const { playing, toggle }        = useSoundscape()
  const t                          = useTranslations('nav')
  const locale                     = useLocale() as Locale
  const navTheme                   = useNavTheme()

  function setLocale(code: Locale) {
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

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (langRef.current && !langRef.current.contains(e.target as Node)) {
        setLangOpen(false)
      }
      if (audRef.current && !audRef.current.contains(e.target as Node)) {
        setAudOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  useEffect(() => {
    const saved = (typeof window !== 'undefined' && localStorage.getItem('fauna_audience')) as AudienceId | null
    if (saved && AUDIENCE_ORDER.includes(saved)) setAudience(saved)
  }, [])

  function selectAudience(id: AudienceId) {
    setAudience(id)
    setAudOpen(false)
    if (typeof window !== 'undefined') localStorage.setItem('fauna_audience', id)
    router.push(AUDIENCE_HREF[id])
  }

  /* Cada perfil tem ações próprias, claras e não-redundantes:
   *   doador  → ação: explorar projetos / login passwordless
   *   ong     → ação: cadastrar ou entrar no painel
   *   empresa → ação: conhecer apoio / falar com a equipe */
  const action = (() => {
    if (audience === 'doador') {
      return {
        primaryLabel:   t('actions.donateNow'),
        primaryHref:    '/projetos',
        secondaryLabel: userEmail ? t('actions.myProfile') : t('actions.accessAccount'),
        secondaryHref:  userEmail ? '/perfil' : '/entrar',
      }
    }
    if (audience === 'ong') {
      const isOrgUser = !!userEmail && userRole === 'organization'
      return {
        primaryLabel:   isOrgUser ? t('actions.ngoDashboard') : t('actions.registerNgo'),
        primaryHref:    isOrgUser ? '/org/painel' : '/organizacoes/cadastro',
        secondaryLabel: t('actions.loginAsNgo'),
        secondaryHref:  '/org/login',
      }
    }
    return {
      primaryLabel:   t('actions.howToSupport'),
      primaryHref:    '/apoie',
      secondaryLabel: t('actions.talkToUs'),
      secondaryHref:  '/contato',
    }
  })()

  const isLight = navTheme === 'light' && !scrolled

  useEffect(() => {
    const showTimer = setTimeout(() => setVisible(true), 280)
    const onScroll  = () => setScrolled(window.scrollY > 48)
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => { clearTimeout(showTimer); window.removeEventListener('scroll', onScroll) }
  }, [])

  const logoColor    = isLight ? 'text-forest'                    : 'text-cream'
  const linkInactive = isLight
    ? 'text-forest/85 hover:text-forest'
    : 'text-cream/80 hover:text-cream drop-shadow-[0_1px_6px_rgba(0,0,0,0.6)]'

  return (
    <nav
      className={clsx(
        'fixed top-0 left-0 right-0 z-50 px-8 py-4 flex items-center gap-5 transition-all duration-500',
        scrolled
          ? 'border-b border-white/[0.10]'
          : isLight
            ? 'bg-transparent'
            : 'bg-gradient-to-b from-black/35 to-transparent',
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2',
      )}
      style={{
        transitionProperty: 'background, border-color, padding, opacity, transform, backdrop-filter',
        ...(scrolled && {
          background:           'rgba(11, 20, 16, 0.55)',
          backdropFilter:       'blur(20px) saturate(160%)',
          WebkitBackdropFilter: 'blur(20px) saturate(160%)',
          boxShadow:            '0 4px 30px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.06)',
        }),
      }}
    >
      {/* Logo */}
      <Link
        href="/"
        className={clsx(
          'font-display tracking-[0.18em] uppercase transition-all duration-300 hover:opacity-75 flex-shrink-0 mr-3',
          logoColor,
          !isLight && 'drop-shadow-[0_1px_8px_rgba(0,0,0,0.55)]',
        )}
        style={{ fontSize: 'clamp(18px, 2vw, 28px)', letterSpacing: '0.18em' }}
      >
        Fauna
      </Link>

      {/* Left nav links */}
      <Link href="/sobre"
            className={clsx('font-mono text-[11px] font-semibold tracking-[0.25em] uppercase transition-colors duration-200 whitespace-nowrap',
              path.startsWith('/sobre') ? 'text-sage' : linkInactive)}>
        {t('about')}
      </Link>

      <Link href="/projetos"
            className={clsx('font-mono text-[11px] font-semibold tracking-[0.25em] uppercase transition-colors duration-200 whitespace-nowrap',
              path.startsWith('/projetos') ? 'text-sage' : linkInactive)}>
        {t('projects')}
      </Link>

      <Link href="/academy"
            className={clsx('font-mono text-[11px] font-semibold tracking-[0.25em] uppercase transition-colors duration-200 whitespace-nowrap',
              path.startsWith('/academy') ? 'text-sage' : linkInactive)}>
        {t('academy')}
      </Link>

      <a href="https://umapenca.com/fauna-conservacao" target="_blank" rel="noopener noreferrer"
         className={clsx('font-mono text-[11px] font-semibold tracking-[0.25em] uppercase transition-colors duration-200 whitespace-nowrap', linkInactive)}>
        {t('shop')}
      </a>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Audience pill */}
      <div ref={audRef} className="relative hidden md:block">
        <button
          onClick={() => setAudOpen(v => !v)}
          className={clsx(
            'flex items-center gap-2 px-3.5 py-2.5 rounded-[2px] border transition-all duration-200',
            'font-mono text-[9.5px] tracking-[0.2em] uppercase whitespace-nowrap',
            isLight
              ? 'border-forest/20 text-forest/70 hover:border-forest/35 hover:text-forest'
              : 'border-white/[0.18] text-cream/70 hover:border-white/30 hover:text-cream',
          )}
        >
          <span className="block w-1.5 h-1.5 rounded-full bg-terra"
                style={{ boxShadow: '0 0 8px rgba(196,82,42,0.6)' }} />
          {t(`audience.${AUDIENCE_KEY[audience]}.label`)}
          <svg width="8" height="8" viewBox="0 0 8 8" fill="none"
               className={clsx('transition-transform duration-200', audOpen && 'rotate-180')}>
            <path d="M1 2.5L4 5.5L7 2.5" stroke="currentColor" strokeWidth="1.2" fill="none" strokeLinecap="round"/>
          </svg>
        </button>

        {audOpen && (
          <div
            className="absolute right-0 top-full mt-1.5 min-w-[240px] p-1.5 z-[60]"
            style={{
              background:           'rgba(11,20,16,0.96)',
              backdropFilter:       'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              border:               '1px solid rgba(237,229,208,0.10)',
            }}
          >
            {AUDIENCE_ORDER.map(id => (
              <button
                key={id}
                onClick={() => selectAudience(id)}
                className="block w-full text-left px-3.5 py-3 transition-colors"
                style={{
                  background: audience === id ? 'rgba(122,158,126,0.12)' : 'transparent',
                  borderLeft: audience === id ? '2px solid var(--sage)' : '2px solid transparent',
                }}
              >
                <div
                  className="font-mono text-[10px] tracking-[0.2em] uppercase mb-0.5"
                  style={{ color: audience === id ? 'var(--sage)' : 'var(--cream)' }}
                >
                  {t(`audience.${AUDIENCE_KEY[id]}.label`)}
                </div>
                <div className="text-[11px] text-cream/45">{t(`audience.${AUDIENCE_KEY[id]}.sub`)}</div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Ação primária */}
      <Link href={action.primaryHref}
            className="font-mono text-[10px] tracking-[0.22em] uppercase font-semibold bg-terra text-cream
                       px-5 py-2.5 rounded-[2px] hover:bg-[#A8431C] hover:-translate-y-px transition-all duration-200
                       hidden sm:inline-flex whitespace-nowrap shadow-[0_2px_14px_rgba(196,82,42,0.35)] hover:shadow-[0_6px_20px_rgba(196,82,42,0.45)]">
        {action.primaryLabel}
      </Link>

      {/* Ação secundária */}
      <Link href={action.secondaryHref}
            className={clsx(
              'font-mono text-[10px] tracking-[0.22em] uppercase px-4 py-2.5 rounded-[2px] transition-all duration-200 whitespace-nowrap hidden sm:inline-flex',
              isLight
                ? 'border border-forest/20 text-forest/60 hover:bg-forest/5 hover:text-forest hover:border-forest/40'
                : 'border border-white/20 text-cream/70 hover:bg-white/5 hover:text-cream hover:border-white/40',
            )}>
        {action.secondaryLabel}
      </Link>

      {/* Language dropdown */}
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

      {/* Music toggle */}
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
