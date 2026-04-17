'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { useLanguage } from '@/lib/i18n/LanguageContext'

type Project  = { id: string; title: string; slug: string; biome: string; status: string }
type Donation = { amount: number; currency: string; donor_name: string; created_at: string; project: { title: string } | null }

export default function OrgPainelPage() {
  const { t } = useLanguage()
  const o = t.orgDash
  const searchParams = useSearchParams()
  const stripeParam  = searchParams.get('stripe')
  const [projects, setProjects]   = useState<Project[]>([])
  const [donations, setDonations] = useState<Donation[]>([])
  const [verified, setVerified]   = useState(false)
  const [stripeConnected, setStripeConnected] = useState<boolean | null>(null)
  const [stripeLoading, setStripeLoading]     = useState(false)
  const [stripeError, setStripeError]         = useState('')
  const supabase = createClient()

  useEffect(() => {
    ;(async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data: org } = await supabase
        .from('organizations')
        .select('id, verified')
        .eq('user_id', user.id)
        .single()

      if (!org) return
      setVerified(org.verified)

      const [{ data: projs }, { data: dons }] = await Promise.all([
        supabase.from('projects')
          .select('id, title, slug, biome, status')
          .eq('organization_id', org.id)
          .order('created_at', { ascending: false }),
        supabase.from('donations')
          .select('amount, currency, donor_name, created_at, project:projects(title)')
          .in('project_id', (await supabase.from('projects').select('id').eq('organization_id', org.id)).data?.map(p => p.id) ?? [])
          .order('created_at', { ascending: false })
          .limit(8),
      ])

      setProjects(projs ?? [])
      setDonations((dons as unknown) as Donation[] ?? [])

      // Check Stripe Connect status
      const statusRes = await fetch('/api/stripe/connect/status')
      const statusData = await statusRes.json()
      setStripeConnected(statusData.connected)
    })()
  }, [])

  async function handleConnectStripe() {
    setStripeLoading(true)
    setStripeError('')
    try {
      const res = await fetch('/api/stripe/connect', { method: 'POST' })
      const data = await res.json()
      if (data.url) {
        window.location.href = data.url
      } else {
        setStripeError(data.error ?? 'Erro ao conectar Stripe.')
        setStripeLoading(false)
      }
    } catch {
      setStripeError('Erro de rede. Tente novamente.')
      setStripeLoading(false)
    }
  }

  return (
    <div className="max-w-4xl">
      <div className="mb-10">
        <h1 className="font-serif text-4xl font-light text-cream mb-2">{o.overview}</h1>
        {!verified && (
          <div className="mt-4 bg-amber-500/10 border border-amber-500/20 rounded-lg px-5 py-3 flex items-center gap-3">
            <span className="text-amber-400 text-sm">⚠</span>
            <p className="text-amber-300/80 text-xs leading-relaxed">{o.pendingVerification}</p>
          </div>
        )}
      </div>

      {/* Stripe return feedback */}
      {stripeParam === 'success' && (
        <div className="mb-6 bg-sage/10 border border-sage/25 rounded-xl px-5 py-3 flex items-center gap-3">
          <span className="text-sage text-sm">✓</span>
          <p className="text-sage/90 text-xs">Conta Stripe conectada com sucesso! Sua organização já pode receber doações.</p>
        </div>
      )}
      {stripeParam === 'refresh' && (
        <div className="mb-6 bg-amber-500/10 border border-amber-500/20 rounded-xl px-5 py-3 flex items-center gap-3">
          <span className="text-amber-400 text-sm">↻</span>
          <p className="text-amber-300/80 text-xs">O link do Stripe expirou. Clique em "Conectar Stripe" abaixo para gerar um novo.</p>
        </div>
      )}

      {/* Stripe Connect banner */}
      {stripeConnected === false && (
        <div className="mb-8 bg-sage/5 border border-sage/20 rounded-xl px-6 py-5 flex items-center justify-between gap-4">
          <div>
            <p className="text-sage text-xs tracking-widest uppercase mb-1">Receba doações</p>
            <p className="text-cream/70 text-sm leading-relaxed">
              Conecte sua conta Stripe para começar a receber doações diretamente.
            </p>
          </div>
          <div className="flex-shrink-0 flex flex-col items-end gap-1">
            <button onClick={handleConnectStripe} disabled={stripeLoading}
                    className="bg-sage text-cream text-xs tracking-widest uppercase
                               px-5 py-2.5 rounded-sm hover:bg-leaf transition-colors disabled:opacity-50 whitespace-nowrap">
              {stripeLoading ? 'Aguarde...' : 'Conectar Stripe →'}
            </button>
            {stripeError && <p className="text-red-400 text-[10px] max-w-xs text-right">{stripeError}</p>}
          </div>
        </div>
      )}
      {stripeConnected === true && (
        <div className="mb-8 bg-sage/5 border border-sage/20 rounded-xl px-6 py-4 flex items-center gap-3">
          <span className="text-sage text-sm">✓</span>
          <p className="text-sage/80 text-xs tracking-wide">Stripe conectado — sua organização pode receber doações.</p>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 mb-10">
        {[
          { label: o.activeProjects,   value: projects.filter(p => p.status === 'active').length },
          { label: o.donationsReceived, value: donations.length },
        ].map(s => (
          <div key={s.label} className="bg-canopy/40 border border-white/[0.06] rounded-xl p-5 text-center">
            <p className="font-serif text-3xl font-light text-sage mb-1">{s.value}</p>
            <p className="text-cream/35 text-xs tracking-widest uppercase">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Projects */}
      <div className="mb-10">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-serif text-2xl font-light text-cream">{o.yourProjects}</h2>
          <Link href="/org/projetos/novo"
                className="text-[10px] tracking-widest uppercase bg-leaf text-cream px-4 py-2 rounded-sm hover:bg-sage transition-colors">
            + {o.newProject}
          </Link>
        </div>

        {projects.length === 0 ? (
          <div className="bg-canopy/20 border border-white/[0.06] rounded-xl p-10 text-center">
            <p className="text-cream/30 text-sm mb-4">{o.noProjects}</p>
            <Link href="/org/projetos/novo"
                  className="text-sage text-xs tracking-widest uppercase hover:underline">
              {o.createFirst}
            </Link>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {projects.map(p => (
              <div key={p.id}
                   className="bg-canopy/30 border border-white/[0.06] rounded-xl px-6 py-4 flex items-center gap-6">
                <div className="flex-1 min-w-0">
                  <p className="text-cream text-sm font-medium truncate">{p.title}</p>
                  <p className="text-cream/35 text-xs mt-0.5">{p.biome}</p>
                </div>
                <span className={`text-[10px] tracking-widest uppercase px-2.5 py-1 rounded-full border ${
                  p.status === 'active'
                    ? 'border-sage/30 text-sage'
                    : 'border-white/10 text-cream/30'
                }`}>{p.status}</span>
                <div className="flex items-center gap-3">
                  <Link href={`/projetos/${p.slug}`}
                        className="text-cream/30 text-[10px] tracking-widest uppercase hover:text-cream transition-colors">
                    {o.view}
                  </Link>
                  <Link href={`/org/atualizacoes/nova?projeto=${p.id}`}
                        className="text-sage/50 text-[10px] tracking-widest uppercase hover:text-sage transition-colors">
                    + Update
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Recent donations */}
      {donations.length > 0 && (
        <div>
          <h2 className="font-serif text-2xl font-light text-cream mb-5">{o.recentDonations}</h2>
          <div className="bg-canopy/30 border border-white/[0.06] rounded-xl overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/[0.06]">
                  <th className="text-left text-[10px] tracking-widest uppercase text-cream/30 px-6 py-3">{o.colDonor}</th>
                  <th className="text-left text-[10px] tracking-widest uppercase text-cream/30 px-6 py-3">{o.colProject}</th>
                  <th className="text-left text-[10px] tracking-widest uppercase text-cream/30 px-6 py-3">{o.colAmount}</th>
                  <th className="text-left text-[10px] tracking-widest uppercase text-cream/30 px-6 py-3">{o.colDate}</th>
                </tr>
              </thead>
              <tbody>
                {donations.map((d, i) => (
                  <tr key={i} className="border-b border-white/[0.03] hover:bg-white/[0.02]">
                    <td className="px-6 py-3 text-cream/70 text-sm">{d.donor_name}</td>
                    <td className="px-6 py-3 text-cream/40 text-xs">{(d.project as any)?.title ?? '—'}</td>
                    <td className="px-6 py-3 text-sage text-sm">{d.currency} {Number(d.amount).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
                    <td className="px-6 py-3 text-cream/30 text-xs">{new Date(d.created_at).toLocaleDateString('pt-BR')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
