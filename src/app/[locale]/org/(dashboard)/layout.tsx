'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname, Link } from '@/i18n/navigation'
import { createClient } from '@/lib/supabase/client'
import { useTranslations } from 'next-intl'

export default function OrgLayout({ children }: { children: React.ReactNode }) {
  const router   = useRouter()
  const pathname = usePathname()
  const o = useTranslations('orgDash')
  const [orgName, setOrgName] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const supabase = createClient()
    ;(async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/entrar'); return }

      const { data: org } = await supabase
        .from('organizations')
        .select('name')
        .eq('user_id', user.id)
        .single()

      if (!org) { router.push('/organizacoes/cadastro'); return }
      setOrgName(org.name)
      setLoading(false)
    })()
  }, [router])

  if (loading) {
    return (
      <div className="min-h-screen bg-forest flex items-center justify-center">
        <div className="w-5 h-5 border-2 border-sage/40 border-t-sage rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-forest flex">
      {/* Sidebar */}
      <aside className="w-60 bg-canopy/60 border-r border-white/[0.06] flex flex-col py-8 px-5 flex-shrink-0">
        <div className="mb-10">
          <span className="font-display text-cream tracking-[0.18em] uppercase text-xl block mb-1">Fauna</span>
          <span className="text-cream/30 text-[10px] tracking-widest uppercase">{o('panelLabel')}</span>
        </div>

        <p className="text-sage text-xs tracking-wide mb-6 truncate">{orgName}</p>

        <nav className="flex flex-col gap-1">
          {[
            { href: '/org/painel',            label: o('overview') },
            { href: '/org/projetos/novo',     label: o('newProject') },
            { href: '/org/atualizacoes/nova', label: o('newUpdate') },
            { href: '/org/perfil',            label: o('orgProfile') },
          ].map(item => (
            <Link
              key={item.href}
              href={item.href}
              className={`text-[11px] tracking-widest uppercase px-3 py-2.5 rounded-sm transition-colors ${
                pathname === item.href
                  ? 'bg-sage/15 text-sage'
                  : 'text-cream/40 hover:text-cream hover:bg-white/[0.04]'
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="mt-auto flex flex-col gap-3">
          <Link href="/projetos" className="text-[10px] tracking-widest uppercase text-cream/25 hover:text-cream/50 transition-colors">
            {o('viewPlatform')}
          </Link>
          <button
            onClick={async () => {
              const supabase = createClient()
              await supabase.auth.signOut()
              router.push('/')
            }}
            className="text-[10px] tracking-widest uppercase text-cream/20 hover:text-red-400 transition-colors text-left"
          >
            {o('signOut')}
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-auto p-10">
        {children}
      </main>
    </div>
  )
}