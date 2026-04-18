'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function Footer() {
  const pathname = usePathname() ?? ''

  // Dashboards have their own chrome — no public footer there.
  if (pathname.startsWith('/admin') || pathname.startsWith('/org')) return null

  return (
    <footer className="px-10 py-12 border-t border-white/[0.05] bg-forest text-cream">
      <div className="flex flex-col sm:flex-row justify-between items-start gap-8 mb-10">
        <span className="font-display text-sm font-normal tracking-[0.28em] uppercase text-cream">
          Fauna
        </span>

        <div className="flex flex-wrap gap-x-10 gap-y-5">
          <div className="flex flex-col gap-2">
            <span className="text-[9px] tracking-widest uppercase text-cream/20 mb-1">Plataforma</span>
            <Link href="/projetos" className="text-[10px] tracking-widest uppercase text-cream/35 hover:text-cream/70 transition-colors">Projetos</Link>
            <Link href="/sobre" className="text-[10px] tracking-widest uppercase text-cream/35 hover:text-cream/70 transition-colors">Como funciona</Link>
            <Link href="/academy" className="text-[10px] tracking-widest uppercase text-cream/35 hover:text-cream/70 transition-colors">Academy</Link>
            <Link href="/organizacoes/cadastro" className="text-[10px] tracking-widest uppercase text-cream/35 hover:text-cream/70 transition-colors">Para organizações</Link>
            <a href="https://umapenca.com/fauna-conservacao" target="_blank" rel="noopener noreferrer" className="text-[10px] tracking-widest uppercase text-cream/35 hover:text-cream/70 transition-colors">Nossa loja</a>
            <Link href="/apoie" className="text-[10px] tracking-widest uppercase text-cream/35 hover:text-cream/70 transition-colors">Nos apoie</Link>
          </div>
          <div className="flex flex-col gap-2">
            <span className="text-[9px] tracking-widest uppercase text-cream/20 mb-1">Conta</span>
            <Link href="/entrar" className="text-[10px] tracking-widest uppercase text-cream/35 hover:text-cream/70 transition-colors">Entrar</Link>
            <Link href="/perfil" className="text-[10px] tracking-widest uppercase text-cream/35 hover:text-cream/70 transition-colors">Meu perfil</Link>
          </div>
          <div className="flex flex-col gap-2">
            <span className="text-[9px] tracking-widest uppercase text-cream/20 mb-1">Ajuda</span>
            <Link href="/faq" className="text-[10px] tracking-widest uppercase text-cream/35 hover:text-cream/70 transition-colors">FAQ</Link>
            <Link href="/contato" className="text-[10px] tracking-widest uppercase text-cream/35 hover:text-cream/70 transition-colors">Contato</Link>
            <Link href="/privacidade" className="text-[10px] tracking-widest uppercase text-cream/35 hover:text-cream/70 transition-colors">Privacidade</Link>
            <Link href="/cookies" className="text-[10px] tracking-widest uppercase text-cream/35 hover:text-cream/70 transition-colors">Cookies</Link>
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-center gap-2 border-t border-white/[0.04] pt-6">
        <span className="text-[10px] text-cream/18 tracking-wide">© 2025 Fauna Platform</span>
        <span className="text-[10px] text-cream/15 tracking-wide">Taxa zero sobre doações</span>
      </div>
    </footer>
  )
}
