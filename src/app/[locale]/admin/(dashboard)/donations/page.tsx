import { getTranslations, getFormatter } from 'next-intl/server'
import { createClient } from '@/lib/supabase/server'

export default async function AdminDonationsPage() {
  const supabase = createClient()
  const t      = await getTranslations('adminDash.donations')
  const format = await getFormatter()

  const { data: donations } = await supabase
    .from('donations')
    .select('*, project:projects(title)')
    .order('created_at', { ascending: false })
    .limit(100)

  const total = donations?.reduce((s, d) => s + Number(d.amount), 0) ?? 0

  return (
    <div className="p-8">
      <div className="mb-8 flex items-end justify-between">
        <div>
          <h1 className="font-serif text-3xl font-light text-cream">{t('title')}</h1>
          <p className="text-cream/40 text-sm mt-1">{t('subtitle', { count: donations?.length ?? 0 })}</p>
        </div>
        <div className="text-right">
          <p className="text-cream/40 text-xs tracking-widest uppercase mb-1">{t('totalRaised')}</p>
          <p className="font-serif text-3xl font-light text-sage">
            {format.number(total, { style: 'currency', currency: 'BRL', minimumFractionDigits: 2 })}
          </p>
        </div>
      </div>

      <div className="bg-[#0d1610] border border-white/[0.06] rounded-xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/[0.06]">
              <th className="text-left text-[10px] tracking-widest uppercase text-cream/30 px-5 py-4">{t('cols.donor')}</th>
              <th className="text-left text-[10px] tracking-widest uppercase text-cream/30 px-5 py-4">{t('cols.email')}</th>
              <th className="text-left text-[10px] tracking-widest uppercase text-cream/30 px-5 py-4">{t('cols.project')}</th>
              <th className="text-left text-[10px] tracking-widest uppercase text-cream/30 px-5 py-4">{t('cols.amount')}</th>
              <th className="text-left text-[10px] tracking-widest uppercase text-cream/30 px-5 py-4">{t('cols.message')}</th>
              <th className="text-left text-[10px] tracking-widest uppercase text-cream/30 px-5 py-4">{t('cols.date')}</th>
            </tr>
          </thead>
          <tbody>
            {donations?.map(d => (
              <tr key={d.id} className="border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors">
                <td className="px-5 py-4">
                  <p className="text-cream/85 text-sm">{d.donor_name}</p>
                  {d.anonymous && <span className="text-[9px] text-warm/60 tracking-wide">{t('anonymous')}</span>}
                </td>
                <td className="px-5 py-4 text-cream/40 text-xs">{d.donor_email}</td>
                <td className="px-5 py-4 text-cream/50 text-sm max-w-[180px]">
                  <span className="truncate block">{(d.project as { title: string } | null)?.title ?? '—'}</span>
                </td>
                <td className="px-5 py-4">
                  <span className="text-sage text-sm font-medium">
                    {d.currency} {format.number(Number(d.amount), { minimumFractionDigits: 2 })}
                  </span>
                </td>
                <td className="px-5 py-4 text-cream/35 text-xs max-w-[160px]">
                  <span className="truncate block">{d.message ?? '—'}</span>
                </td>
                <td className="px-5 py-4 text-cream/35 text-xs whitespace-nowrap">
                  {format.dateTime(new Date(d.created_at), { dateStyle: 'medium' })}
                </td>
              </tr>
            ))}
            {!donations?.length && (
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
