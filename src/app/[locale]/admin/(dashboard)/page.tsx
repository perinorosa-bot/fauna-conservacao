import { getTranslations, getLocale } from 'next-intl/server'
import { createClient } from '@/lib/supabase/server'

function localeToBcp47(locale: string): string {
  if (locale === 'pt') return 'pt-BR'
  if (locale === 'es') return 'es-ES'
  return 'en-US'
}

export default async function AdminDashboard() {
  const supabase = createClient()
  const t       = await getTranslations('adminDash.home')
  const locale  = await getLocale()
  const bcp47   = localeToBcp47(locale)

  const [
    { count: orgCount },
    { count: projectCount },
    { count: donationCount },
    { count: userCount },
    { count: pendingOrgs },
    { data: recentDonations },
    { data: recentOrgs },
  ] = await Promise.all([
    supabase.from('organizations').select('*', { count: 'exact', head: true }),
    supabase.from('projects').select('*', { count: 'exact', head: true }),
    supabase.from('donations').select('*', { count: 'exact', head: true }),
    supabase.from('profiles').select('*', { count: 'exact', head: true }),
    supabase.from('organizations').select('*', { count: 'exact', head: true }).eq('verified', false),
    supabase.from('donations').select('donor_name, amount, currency, created_at').order('created_at', { ascending: false }).limit(5),
    supabase.from('organizations').select('name, country, verified, created_at').order('created_at', { ascending: false }).limit(5),
  ])

  const { data: totalData } = await supabase.from('donations').select('amount')
  const totalRaised = totalData?.reduce((s, d) => s + Number(d.amount), 0) ?? 0

  const stats = [
    {
      label: t('stats.organizations'),
      value: orgCount ?? 0,
      sub: `${pendingOrgs ?? 0} ${t('stats.pendingSuffix')}`,
      color: 'text-sage',
    },
    {
      label: t('stats.activeProjects'),
      value: projectCount ?? 0,
      sub: t('stats.inProgress'),
      color: 'text-cream',
    },
    {
      label: t('stats.donationsReceived'),
      value: donationCount ?? 0,
      sub: `R$ ${(totalRaised / 1000).toFixed(1)}k ${t('stats.totalSuffix')}`,
      color: 'text-warm',
    },
    {
      label: t('stats.users'),
      value: userCount ?? 0,
      sub: t('stats.registered'),
      color: 'text-mist',
    },
  ]

  const pendingCount = pendingOrgs ?? 0

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="font-serif text-3xl font-light text-cream">{t('title')}</h1>
        <p className="text-cream/40 text-sm mt-1">{t('subtitle')}</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {stats.map(s => (
          <div key={s.label} className="bg-[#0d1610] border border-white/[0.06] rounded-xl p-5">
            <p className="text-cream/40 text-xs tracking-wide mb-3">{s.label}</p>
            <p className={`font-serif text-4xl font-light ${s.color} leading-none mb-1`}>{s.value}</p>
            <p className="text-cream/25 text-xs">{s.sub}</p>
          </div>
        ))}
      </div>

      {/* Pending orgs alert */}
      {pendingCount > 0 && (
        <div className="mb-8 bg-warm/10 border border-warm/20 rounded-xl px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-warm text-lg">⚠</span>
            <p className="text-cream/80 text-sm">
              {pendingCount === 1
                ? t('pendingOne', { count: pendingCount })
                : t('pendingOther', { count: pendingCount })}
            </p>
          </div>
          <a href="/admin/organizations" className="text-warm text-xs tracking-widest uppercase hover:underline">
            {t('review')}
          </a>
        </div>
      )}

      {/* Recent activity */}
      <div className="grid md:grid-cols-2 gap-6">

        {/* Recent donations */}
        <div className="bg-[#0d1610] border border-white/[0.06] rounded-xl p-5">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-cream/80 text-sm font-medium">{t('recentDonations')}</h2>
            <a href="/admin/donations" className="text-sage text-[10px] tracking-widest uppercase hover:underline">{t('seeAll')}</a>
          </div>
          <div className="flex flex-col gap-3">
            {recentDonations?.length ? recentDonations.map((d, i) => (
              <div key={i} className="flex items-center justify-between py-2 border-b border-white/[0.04] last:border-0">
                <p className="text-cream/70 text-sm">{d.donor_name}</p>
                <span className="text-sage text-sm font-medium">
                  {d.currency} {Number(d.amount).toLocaleString(bcp47)}
                </span>
              </div>
            )) : (
              <p className="text-cream/25 text-sm text-center py-4">{t('noDonationsYet')}</p>
            )}
          </div>
        </div>

        {/* Recent orgs */}
        <div className="bg-[#0d1610] border border-white/[0.06] rounded-xl p-5">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-cream/80 text-sm font-medium">{t('recentOrgs')}</h2>
            <a href="/admin/organizations" className="text-sage text-[10px] tracking-widest uppercase hover:underline">{t('seeAll')}</a>
          </div>
          <div className="flex flex-col gap-3">
            {recentOrgs?.length ? recentOrgs.map((o, i) => (
              <div key={i} className="flex items-center justify-between py-2 border-b border-white/[0.04] last:border-0">
                <div>
                  <p className="text-cream/70 text-sm">{o.name}</p>
                  <p className="text-cream/30 text-xs">{o.country}</p>
                </div>
                <span className={`text-[9px] tracking-widest uppercase px-2 py-1 rounded-full ${o.verified ? 'bg-sage/15 text-sage' : 'bg-warm/15 text-warm'}`}>
                  {o.verified ? t('verified') : t('pending')}
                </span>
              </div>
            )) : (
              <p className="text-cream/25 text-sm text-center py-4">{t('noOrgsYet')}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
