import { getTranslations, getFormatter } from 'next-intl/server'
import { createClient } from '@/lib/supabase/server'
import OrgActions from '@/components/admin/OrgActions'

export default async function AdminOrganizationsPage() {
  const supabase = createClient()
  const t      = await getTranslations('adminDash.orgs')
  const format = await getFormatter()

  const { data: orgs } = await supabase
    .from('organizations')
    .select('*, projects(count)')
    .order('created_at', { ascending: false })

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="font-serif text-3xl font-light text-cream">{t('title')}</h1>
        <p className="text-cream/40 text-sm mt-1">{t('subtitle', { count: orgs?.length ?? 0 })}</p>
      </div>

      <div className="bg-[#0d1610] border border-white/[0.06] rounded-xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/[0.06]">
              <th className="text-left text-[10px] tracking-widest uppercase text-cream/30 px-5 py-4">{t('cols.organization')}</th>
              <th className="text-left text-[10px] tracking-widest uppercase text-cream/30 px-5 py-4">{t('cols.country')}</th>
              <th className="text-left text-[10px] tracking-widest uppercase text-cream/30 px-5 py-4">{t('cols.projects')}</th>
              <th className="text-left text-[10px] tracking-widest uppercase text-cream/30 px-5 py-4">{t('cols.status')}</th>
              <th className="text-left text-[10px] tracking-widest uppercase text-cream/30 px-5 py-4">{t('cols.createdAt')}</th>
              <th className="text-right text-[10px] tracking-widest uppercase text-cream/30 px-5 py-4">{t('cols.actions')}</th>
            </tr>
          </thead>
          <tbody>
            {orgs?.map(org => (
              <tr key={org.id} className="border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors">
                <td className="px-5 py-4">
                  <p className="text-cream/85 text-sm font-medium">{org.name}</p>
                  {org.website && (
                    <a href={org.website} target="_blank" className="text-sage/60 text-xs hover:text-sage truncate block max-w-[180px]">
                      {org.website.replace('https://', '')}
                    </a>
                  )}
                </td>
                <td className="px-5 py-4 text-cream/50 text-sm">{org.country}</td>
                <td className="px-5 py-4 text-cream/50 text-sm">
                  {(org.projects as unknown as { count: number }[])?.[0]?.count ?? 0}
                </td>
                <td className="px-5 py-4">
                  <span className={`text-[9px] tracking-widest uppercase px-2.5 py-1 rounded-full ${org.verified ? 'bg-sage/15 text-sage' : 'bg-warm/15 text-warm'}`}>
                    {org.verified ? t('verified') : t('pending')}
                  </span>
                </td>
                <td className="px-5 py-4 text-cream/35 text-xs">
                  {format.dateTime(new Date(org.created_at), { dateStyle: 'medium' })}
                </td>
                <td className="px-5 py-4 text-right">
                  <OrgActions id={org.id} verified={org.verified} />
                </td>
              </tr>
            ))}
            {!orgs?.length && (
              <tr>
                <td colSpan={6} className="px-5 py-12 text-center text-cream/25 text-sm">
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
