'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { createClient } from '@/lib/supabase/client'

export default function UpdateActions({ id }: { id: string }) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const t = useTranslations('adminDash.updates')

  async function handleDelete() {
    if (!confirm(t('confirmDelete'))) return
    setLoading(true)
    const supabase = createClient()
    await supabase.from('updates').delete().eq('id', id)
    router.refresh()
    setLoading(false)
  }

  return (
    <button
      onClick={handleDelete}
      disabled={loading}
      className="text-[9px] tracking-widest uppercase px-3 py-1.5 rounded-lg border border-red-500/20 text-red-400/60 hover:bg-red-500/10 hover:text-red-400 transition-all"
    >
      {loading ? t('deleting') : t('delete')}
    </button>
  )
}
