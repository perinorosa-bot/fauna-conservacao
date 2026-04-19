import { getTranslations } from 'next-intl/server'
import { createClient } from '@/lib/supabase/server'
import UserActions from '@/components/admin/UserActions'

export default async function AdminUsersPage() {
  const supabase = createClient()
  const t = await getTranslations('adminDash.users')

  const { data: profiles } = await supabase
    .from('profiles')
    .select('*')
    .order('id')

  const roleColor: Record<string, string> = {
    admin:        'bg-warm/15 text-warm',
    organization: 'bg-sage/15 text-sage',
    donor:        'bg-mist/15 text-mist',
  }
  const roleLabel: Record<string, string> = {
    admin:        t('roleLabels.admin'),
    organization: t('roleLabels.organization'),
    donor:        t('roleLabels.donor'),
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="font-serif text-3xl font-light text-cream">{t('title')}</h1>
        <p className="text-cream/40 text-sm mt-1">{t('subtitle', { count: profiles?.length ?? 0 })}</p>
      </div>

      <div className="bg-[#0d1610] border border-white/[0.06] rounded-xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/[0.06]">
              <th className="text-left text-[10px] tracking-widest uppercase text-cream/30 px-5 py-4">{t('cols.user')}</th>
              <th className="text-left text-[10px] tracking-widest uppercase text-cream/30 px-5 py-4">{t('cols.email')}</th>
              <th className="text-left text-[10px] tracking-widest uppercase text-cream/30 px-5 py-4">{t('cols.role')}</th>
              <th className="text-right text-[10px] tracking-widest uppercase text-cream/30 px-5 py-4">{t('cols.actions')}</th>
            </tr>
          </thead>
          <tbody>
            {profiles?.map(p => (
              <tr key={p.id} className="border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors">
                <td className="px-5 py-4">
                  <p className="text-cream/85 text-sm">{p.full_name ?? '—'}</p>
                  <p className="text-cream/25 text-xs font-mono truncate max-w-[160px]">{p.id}</p>
                </td>
                <td className="px-5 py-4 text-cream/50 text-sm">{p.email}</td>
                <td className="px-5 py-4">
                  <span className={`text-[9px] tracking-widest uppercase px-2.5 py-1 rounded-full ${roleColor[p.role] ?? 'bg-white/10 text-cream/40'}`}>
                    {roleLabel[p.role] ?? p.role}
                  </span>
                </td>
                <td className="px-5 py-4 text-right">
                  <UserActions id={p.id} role={p.role} />
                </td>
              </tr>
            ))}
            {!profiles?.length && (
              <tr>
                <td colSpan={4} className="px-5 py-12 text-center text-cream/25 text-sm">
                  {t('empty')}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
