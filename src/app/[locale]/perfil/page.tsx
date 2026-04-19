'use client'

import { useEffect, useState } from 'react'
import { useRouter } from '@/i18n/navigation'
import { createClient } from '@/lib/supabase/client'
import { useTranslations, useFormatter } from 'next-intl'
import Nav from '@/components/layout/Nav'
import { Link } from '@/i18n/navigation'
import Image from 'next/image'

type Profile  = { id: string; full_name: string | null }
type Donation = { id: string; amount: number; currency: string; message: string | null; created_at: string; project: { title: string; slug: string; cover_image_url: string | null; biome: string | null } | null }

export default function PerfilPage() {
  const d = useTranslations('donorProfile')
  const format = useFormatter()
  const router = useRouter()
  const supabase = createClient()

  const [userId, setUserId]     = useState<string | null>(null)
  const [email, setEmail]       = useState('')
  const [profile, setProfile]   = useState<Profile | null>(null)
  const [donations, setDonations] = useState<Donation[]>([])
  const [name, setName]         = useState('')
  const [saving, setSaving]     = useState(false)
  const [saved, setSaved]       = useState(false)
  const [saveError, setSaveError] = useState('')

  useEffect(() => {
    ;(async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/entrar'); return }
      setUserId(user.id)
      setEmail(user.email ?? '')

      const [{ data: prof }, { data: dons }] = await Promise.all([
        supabase.from('profiles').select('id, full_name').eq('id', user.id).single(),
        supabase.from('donations')
          .select('id, amount, currency, message, created_at, project:projects(title, slug, cover_image_url, biome)')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false }),
      ])

      setProfile(prof)
      setName(prof?.full_name ?? '')
      setDonations((dons as unknown as Donation[]) ?? [])
    })()
  }, [])

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    if (!userId) return
    setSaving(true)
    setSaveError('')
    setSaved(false)
    const { error } = await supabase.from('profiles').update({ full_name: name }).eq('id', userId)
    setSaving(false)
    if (error) { setSaveError(error.message); return }
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  async function handleLogout() {
    await supabase.auth.signOut()
    router.push('/')
  }

  const totalDonated = donations.reduce((s, d) => s + Number(d.amount), 0)
  const projectsSupported = new Map<string, NonNullable<Donation['project']>>()
  donations.forEach(don => {
    if (don.project && !projectsSupported.has(don.project.slug)) {
      projectsSupported.set(don.project.slug, don.project)
    }
  })

  const inputClass = `w-full bg-white/[0.06] border border-white/[0.10] rounded-sm px-4 py-3
    text-cream text-sm placeholder:text-cream/25 focus:outline-none focus:border-sage/50 transition-colors`

  return (
    <main className="min-h-screen bg-forest">
      <Nav />
      <div className="pt-36 pb-24 px-10 max-w-screen-lg mx-auto">

        {/* Header */}
        <div className="flex items-center gap-6 mb-14">
          <div className="w-16 h-16 rounded-full bg-canopy border border-white/10 flex items-center justify-center flex-shrink-0">
            <span className="font-serif text-2xl text-cream/50">
              {(name || email || '?')[0].toUpperCase()}
            </span>
          </div>
          <div>
            <h1 className="font-serif text-3xl font-light text-cream">
              {name || d('myProfile')}
            </h1>
            <p className="text-cream/40 text-sm">{email}</p>
          </div>
        </div>

        {/* Edit profile */}
        <div className="mb-14 bg-canopy/30 border border-white/[0.06] rounded-xl p-6">
          <h2 className="font-serif text-xl font-light text-cream mb-5">{d('editProfile')}</h2>
          <form onSubmit={handleSave} className="flex items-end gap-4">
            <div className="flex-1">
              <label className="text-cream/50 text-xs tracking-wide block mb-1.5">{d('nameLabel')}</label>
              <input type="text" value={name} onChange={e => setName(e.target.value)}
                     placeholder={d('namePlaceholder')} className={inputClass} />
            </div>
            <div className="flex flex-col gap-1 items-start">
              <button type="submit" disabled={saving}
                      className="bg-leaf text-cream text-xs tracking-widests uppercase px-6 py-3 rounded-sm
                                 hover:bg-sage transition-colors disabled:opacity-50">
                {saving ? d('saving') : d('save')}
              </button>
              {saved     && <span className="text-sage text-[10px]">{d('saved')}</span>}
              {saveError && <span className="text-red-400 text-[10px]">{saveError}</span>}
            </div>
          </form>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-14">
          {[
            { label: d('totalDonated'),      value: format.number(totalDonated, { style: 'currency', currency: 'BRL', minimumFractionDigits: 2 }) },
            { label: d('donationsMade'),     value: donations.length },
            { label: d('projectsSupported'), value: projectsSupported.size },
          ].map(s => (
            <div key={s.label} className="bg-canopy/40 border border-white/[0.06] rounded-xl p-5 text-center">
              <p className="font-serif text-3xl font-light text-sage mb-1">{s.value}</p>
              <p className="text-cream/35 text-xs tracking-widests uppercase">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Projects supported */}
        {projectsSupported.size > 0 && (
          <div className="mb-14">
            <h2 className="font-serif text-2xl font-light text-cream mb-6">
              {d('supportTitle')} <em className="italic text-sage">{d('supportTitleEm')}</em>
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {Array.from(projectsSupported.values()).map(p => (
                <Link key={p.slug} href={`/projetos/${p.slug}`}
                      className="group relative rounded-2xl overflow-hidden bg-canopy aspect-[3/4] flex flex-col justify-end">
                  {p.cover_image_url && (
                    <Image src={p.cover_image_url} alt={p.title} fill
                      className="object-cover brightness-75 group-hover:scale-105 transition-transform duration-700" />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  <div className="relative z-10 p-4">
                    {p.biome && <span className="text-[9px] tracking-widests uppercase text-cream/55 block mb-1">{p.biome}</span>}
                    <h3 className="font-serif text-cream text-base font-light leading-snug line-clamp-2">{p.title}</h3>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Donation history */}
        <div>
          <h2 className="font-serif text-2xl font-light text-cream mb-6">
            {d('historyTitle')} <em className="italic text-sage">{d('historyTitleEm')}</em>
          </h2>

          {donations.length ? (
            <div className="bg-canopy/30 border border-white/[0.06] rounded-xl overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/[0.06]">
                    <th className="text-left text-[10px] tracking-widests uppercase text-cream/30 px-6 py-4">{d('colProject')}</th>
                    <th className="text-left text-[10px] tracking-widests uppercase text-cream/30 px-6 py-4">{d('colAmount')}</th>
                    <th className="text-left text-[10px] tracking-widests uppercase text-cream/30 px-6 py-4">{d('colDate')}</th>
                  </tr>
                </thead>
                <tbody>
                  {donations.map(don => (
                    <tr key={don.id} className="border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors">
                      <td className="px-6 py-4">
                        {don.project ? (
                          <Link href={`/projetos/${don.project.slug}`}
                                className="text-cream/75 text-sm hover:text-cream transition-colors">
                            {don.project.title}
                          </Link>
                        ) : (
                          <span className="text-cream/30 text-sm">{d('removedProject')}</span>
                        )}
                        {don.message && <p className="text-cream/30 text-xs mt-0.5 italic">"{don.message}"</p>}
                      </td>
                      <td className="px-6 py-4 text-sage text-sm font-medium">
                        {don.currency} {format.number(Number(don.amount), { minimumFractionDigits: 2 })}
                      </td>
                      <td className="px-6 py-4 text-cream/35 text-xs">
                        {format.dateTime(new Date(don.created_at), { dateStyle: 'medium' })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="bg-canopy/30 border border-white/[0.06] rounded-xl p-12 text-center">
              <p className="text-cream/30 text-sm mb-4">{d('noDonations')}</p>
              <Link href="/projetos" className="btn-primary inline-flex">{d('exploreProjects')}</Link>
            </div>
          )}
        </div>

        {/* Sign out */}
        <div className="mt-14 pt-8 border-t border-white/[0.05] text-center">
          <button onClick={handleLogout}
                  className="text-cream/25 text-xs tracking-widests uppercase hover:text-red-400 transition-colors">
            {d('signOut')}
          </button>
        </div>

      </div>
    </main>
  )
}
