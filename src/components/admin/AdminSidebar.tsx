'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import clsx from 'clsx'
import { createClient } from '@/lib/supabase/client'

const NAV = [
  { href: '/admin',               label: 'Dashboard',      icon: '◈' },
  { href: '/admin/organizations', label: 'Organizações',   icon: '◎' },
  { href: '/admin/projects',      label: 'Projetos',       icon: '◻' },
  { href: '/admin/updates',       label: 'Atualizações',   icon: '▤' },
  { href: '/admin/donations',     label: 'Doações',        icon: '◇' },
  { href: '/admin/users',         label: 'Usuários',       icon: '○' },
]

export default function AdminSidebar() {
  const path   = usePathname()
  const router = useRouter()

  async function handleLogout() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/admin/login')
  }

  return (
    <aside className="w-56 min-h-screen bg-[#0d1610] border-r border-white/[0.06] flex flex-col">
      {/* Logo */}
      <div className="px-6 py-7 border-b border-white/[0.06]">
        <span className="font-display text-cream tracking-[0.18em] uppercase text-lg">Fauna</span>
        <p className="text-sage/50 text-[9px] tracking-widest uppercase mt-0.5">Admin</p>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-5 flex flex-col gap-0.5">
        {NAV.map(({ href, label, icon }) => {
          const active = href === '/admin' ? path === '/admin' : path.startsWith(href)
          return (
            <Link
              key={href}
              href={href}
              className={clsx(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs tracking-wide transition-all duration-150',
                active
                  ? 'bg-sage/15 text-cream'
                  : 'text-cream/40 hover:text-cream/75 hover:bg-white/[0.04]',
              )}
            >
              <span className="text-sage text-sm w-4 text-center">{icon}</span>
              {label}
            </Link>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="px-3 py-5 border-t border-white/[0.06]">
        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-3 px-3 py-2 rounded-lg text-xs text-cream/35 hover:text-cream/60 transition-colors"
        >
          <span className="text-sm">↗</span> Ver site
        </Link>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs text-red-400/60 hover:text-red-400 transition-colors mt-0.5"
        >
          <span className="text-sm">→</span> Sair
        </button>
      </div>
    </aside>
  )
}