'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import type { Subscription } from '@/types'

type Row = Subscription & {
  project: { title: string; slug: string } | null
}

export default function SubscriptionsPanel({ userId }: { userId: string }) {
  const supabase = createClient()
  const [rows, setRows]       = useState<Row[]>([])
  const [loading, setLoading] = useState(true)
  const [busyId, setBusyId]   = useState<string | null>(null)
  const [error, setError]     = useState('')

  useEffect(() => {
    ;(async () => {
      const { data } = await supabase
        .from('subscriptions')
        .select('*, project:projects(title, slug)')
        .eq('donor_user_id', userId)
        .order('created_at', { ascending: false })
      setRows((data as unknown as Row[]) ?? [])
      setLoading(false)
    })()
  }, [userId])

  async function handleCancel(row: Row) {
    if (!confirm(`Cancelar a doação mensal de R$ ${Number(row.amount).toLocaleString('pt-BR', { minimumFractionDigits: 2 })} para "${row.project?.title}"?\n\nA próxima cobrança não será feita. O ciclo atual continua até ${row.current_period_end ? new Date(row.current_period_end).toLocaleDateString('pt-BR') : 'o fim do período'}.`)) return
    setBusyId(row.id)
    setError('')
    const res = await fetch('/api/subscriptions/cancel', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ subscriptionId: row.id }),
    })
    setBusyId(null)
    if (!res.ok) {
      const data = await res.json().catch(() => ({}))
      setError(data.error ?? 'Erro ao cancelar.')
      return
    }
    setRows(prev => prev.map(r => r.id === row.id ? { ...r, cancel_at_period_end: true } : r))
  }

  if (loading) return null

  // Doadores sem subscriptions: não renderizar nada (mantém /perfil enxuto).
  const visible = rows.filter(r => r.status !== 'incomplete' && r.status !== 'incomplete_expired')
  if (visible.length === 0) return null

  return (
    <div className="mb-14">
      <h2 className="font-serif text-2xl font-light text-cream mb-6">
        Doações <em className="italic text-sage">recorrentes</em>
      </h2>

      <div className="bg-canopy/30 border border-white/[0.06] rounded-xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/[0.06]">
              <th className="text-left text-[10px] tracking-widests uppercase text-cream/30 px-6 py-4">Projeto</th>
              <th className="text-left text-[10px] tracking-widests uppercase text-cream/30 px-6 py-4">Valor</th>
              <th className="text-left text-[10px] tracking-widests uppercase text-cream/30 px-6 py-4">Status</th>
              <th className="text-left text-[10px] tracking-widests uppercase text-cream/30 px-6 py-4">Próxima cobrança</th>
              <th className="text-right text-[10px] tracking-widests uppercase text-cream/30 px-6 py-4">Ações</th>
            </tr>
          </thead>
          <tbody>
            {visible.map(row => {
              const isCanceling = row.cancel_at_period_end && row.status === 'active'
              const isCanceled  = row.status === 'canceled'
              const statusLabel = isCanceled        ? 'Cancelada'
                                : isCanceling       ? 'Cancela no fim do ciclo'
                                : row.status === 'active'   ? 'Ativa'
                                : row.status === 'past_due' ? 'Pagamento atrasado'
                                : row.status === 'paused'   ? 'Pausada'
                                : row.status === 'unpaid'   ? 'Não paga'
                                : row.status === 'trialing' ? 'Em teste'
                                : row.status
              const statusColor = isCanceled || row.status === 'unpaid' ? 'text-red-400/80'
                                : isCanceling || row.status === 'past_due' ? 'text-ochre'
                                : 'text-sage'

              return (
                <tr key={row.id} className="border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors">
                  <td className="px-6 py-4">
                    {row.project ? (
                      <Link href={`/projetos/${row.project.slug}`}
                            className="text-cream/75 text-sm hover:text-cream transition-colors">
                        {row.project.title}
                      </Link>
                    ) : (
                      <span className="text-cream/30 text-sm">Projeto removido</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-sage text-sm font-medium">
                    {row.currency} {Number(row.amount).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    <span className="text-cream/35 text-xs">/mês</span>
                  </td>
                  <td className={`px-6 py-4 text-xs ${statusColor}`}>{statusLabel}</td>
                  <td className="px-6 py-4 text-cream/55 text-xs">
                    {isCanceled ? '—' : row.current_period_end
                      ? new Date(row.current_period_end).toLocaleDateString('pt-BR')
                      : '—'}
                  </td>
                  <td className="px-6 py-4 text-right">
                    {!isCanceled && !isCanceling && (
                      <button
                        onClick={() => handleCancel(row)}
                        disabled={busyId === row.id}
                        className="text-cream/40 text-[11px] tracking-widests uppercase
                                   hover:text-red-400 transition-colors disabled:opacity-50">
                        {busyId === row.id ? 'Cancelando...' : 'Cancelar'}
                      </button>
                    )}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {error && <p className="text-red-400 text-xs mt-3">{error}</p>}
    </div>
  )
}
