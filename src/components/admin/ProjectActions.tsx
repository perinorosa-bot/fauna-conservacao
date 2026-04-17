'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

type Status = 'active' | 'paused' | 'completed'

export default function ProjectActions({ id, status, slug }: { id: string; status: Status; slug: string }) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function setStatus(next: Status) {
    setLoading(true)
    const supabase = createClient()
    await supabase.from('projects').update({ status: next }).eq('id', id)
    router.refresh()
    setLoading(false)
  }

  async function handleDelete() {
    if (!confirm('Excluir projeto? Esta ação não pode ser desfeita.')) return
    setLoading(true)
    const supabase = createClient()
    await supabase.from('projects').delete().eq('id', id)
    router.refresh()
    setLoading(false)
  }

  const options: { label: string; value: Status; color: string }[] = [
    { label: 'Ativo',     value: 'active',    color: 'text-sage' },
    { label: 'Pausar',    value: 'paused',    color: 'text-warm' },
    { label: 'Concluído', value: 'completed', color: 'text-mist' },
  ]

  return (
    <div className="flex items-center justify-end gap-2">
      <a
        href={`/projetos/${slug}`}
        target="_blank"
        className="text-[9px] tracking-widest uppercase px-3 py-1.5 rounded-lg border border-white/10 text-cream/40 hover:text-cream hover:border-white/25 transition-all"
      >
        Ver
      </a>
      <select
        value={status}
        disabled={loading}
        onChange={e => setStatus(e.target.value as Status)}
        className="text-[9px] tracking-widest uppercase px-2 py-1.5 rounded-lg border border-white/10 bg-transparent text-cream/50 hover:border-white/25 transition-all cursor-pointer focus:outline-none"
      >
        {options.map(o => (
          <option key={o.value} value={o.value} className="bg-[#0d1610]">{o.label}</option>
        ))}
      </select>
      <button
        onClick={handleDelete}
        disabled={loading}
        className="text-[9px] tracking-widest uppercase px-3 py-1.5 rounded-lg border border-red-500/20 text-red-400/60 hover:bg-red-500/10 hover:text-red-400 transition-all"
      >
        Excluir
      </button>
    </div>
  )
}