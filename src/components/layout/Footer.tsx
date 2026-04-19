'use client'

import { useTranslations } from 'next-intl'
import { Link, usePathname } from '@/i18n/navigation'

export default function Footer() {
  const pathname = usePathname() ?? ''
  const t = useTranslations('footer')

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
            <span className="text-[9px] tracking-widest uppercase text-cream/20 mb-1">{t('sections.platform')}</span>
            <Link href="/projetos" className="text-[10px] tracking-widest uppercase text-cream/35 hover:text-cream/70 transition-colors">{t('platform.projects')}</Link>
            <Link href="/sobre" className="text-[10px] tracking-widest uppercase text-cream/35 hover:text-cream/70 transition-colors">{t('platform.howItWorks')}</Link>
            <Link href="/academy" className="text-[10px] tracking-widest uppercase text-cream/35 hover:text-cream/70 transition-colors">{t('platform.academy')}</Link>
            <Link href="/organizacoes/cadastro" className="text-[10px] tracking-widest uppercase text-cream/35 hover:text-cream/70 transition-colors">{t('platform.forOrgs')}</Link>
            <a href="https://umapenca.com/fauna-conservacao" target="_blank" rel="noopener noreferrer" className="text-[10px] tracking-widest uppercase text-cream/35 hover:text-cream/70 transition-colors">{t('platform.shop')}</a>
            <Link href="/apoie" className="text-[10px] tracking-widest uppercase text-cream/35 hover:text-cream/70 transition-colors">{t('platform.support')}</Link>
          </div>
          <div className="flex flex-col gap-2">
            <span className="text-[9px] tracking-widest uppercase text-cream/20 mb-1">{t('sections.account')}</span>
            <Link href="/entrar" className="text-[10px] tracking-widest uppercase text-cream/35 hover:text-cream/70 transition-colors">{t('account.signIn')}</Link>
            <Link href="/perfil" className="text-[10px] tracking-widest uppercase text-cream/35 hover:text-cream/70 transition-colors">{t('account.myProfile')}</Link>
          </div>
          <div className="flex flex-col gap-2">
            <span className="text-[9px] tracking-widest uppercase text-cream/20 mb-1">{t('sections.help')}</span>
            <Link href="/faq" className="text-[10px] tracking-widest uppercase text-cream/35 hover:text-cream/70 transition-colors">{t('help.faq')}</Link>
            <Link href="/contato" className="text-[10px] tracking-widest uppercase text-cream/35 hover:text-cream/70 transition-colors">{t('help.contact')}</Link>
            <Link href="/privacidade" className="text-[10px] tracking-widest uppercase text-cream/35 hover:text-cream/70 transition-colors">{t('help.privacy')}</Link>
            <Link href="/cookies" className="text-[10px] tracking-widest uppercase text-cream/35 hover:text-cream/70 transition-colors">{t('help.cookies')}</Link>
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-center gap-2 border-t border-white/[0.04] pt-6">
        <span className="text-[10px] text-cream/18 tracking-wide">{t('rights')}</span>
        <span className="text-[10px] text-cream/15 tracking-wide">{t('zeroFee')}</span>
      </div>
    </footer>
  )
}
