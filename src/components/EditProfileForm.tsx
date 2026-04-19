'use client'

import { useState } from 'react'
import { useRouter } from '@/i18n/navigation'
import { createClient } from '@/lib/supabase/client'

export default function EditProfileForm({
  userId,
  initialName,
}: {
  userId: string
  initialName: string
}) {
  const router = useRouter()
  const [name, setName]     = useState(initialName)
  const [loading, setLoading] = useState(false)
  const [saved, setSaved]   = useState(false)
  const [error, setError]   = useState('')

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSaved(false)
    const supabase = createClient()
    const { error: dbError } = await supabase
      .from('profiles')
      .update({ full_name: name })
      .eq('id', userId)
    setLoading(false)
    if (dbError) { setError(dbError.message); return }
    setSaved(true)
    router.refresh()
    setTimeout(() => setSaved(false), 3000)
  }

  return (
    <form onSubmit={handleSave} className="flex items-end gap-4">
      <div className="flex-1">
        <label className="text-cream/50 text-xs tracking-wide block mb-1.5">Nome completo</label>
        <input
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="Seu nome"
          className="w-full bg-white/[0.06] border border-white/[0.10] rounded-sm px-4 py-3
                     text-cream text-sm placeholder:text-cream/25 focus:outline-none
                     focus:border-sage/50 transition-colors"
        />
      </div>
      <div className="flex flex-col gap-1 items-start">
        <button
          type="submit"
          disabled={loading}
          className="bg-leaf text-cream text-xs tracking-widest uppercase px-6 py-3 rounded-sm
                     hover:bg-sage transition-colors disabled:opacity-50"
        >
          {loading ? 'Salvando...' : 'Salvar'}
        </button>
        {saved && <span className="text-sage text-[10px]">Salvo</span>}
        {error && <span className="text-red-400 text-[10px]">{error}</span>}
      </div>
    </form>
  )
}
