'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { createClient } from '@/lib/supabase/client'

export default function OrgActions({ id, verified }: { id: string; verified: boolean }) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const t = useTranslations('adminDash.orgActions')

  async function toggleVerify() {
    setLoading(true)
    const supabase = createClient()
    await supabase.from('organizations').update({ verified: !verified }).eq('id', id)
    router.refresh()
    setLoading(false)
  }

  async function handleDelete() {
    if (!confirm(t('confirmDelete'))) return
    setLoading(true)
    const supabase = createClient()
    await supabase.from('organizations').delete().eq('id', id)
    router.refresh()
    setLoading(false)
  }

  return (
    <div className="flex items-center justify-end gap-2">
      <button
        onClick={toggleVerify}
        disabled={loading}
        className={`text-[9px] tracking-widest uppercase px-3 py-1.5 rounded-lg border transition-all duration-150 ${
          verified
            ? 'border-warm/30 text-warm/70 hover:bg-warm/10'
            : 'border-sage/30 text-sage hover:bg-sage/10'
        }`}
      >
        {verified ? t('revoke') : t('verify')}
      </button>
      <button
        onClick={handleDelete}
        disabled={loading}
        className="text-[9px] tracking-widest uppercase px-3 py-1.5 rounded-lg border border-red-500/20 text-red-400/60 hover:bg-red-500/10 hover:text-red-400 transition-all duration-150"
      >
        {t('delete')}
      </button>
    </div>
  )
}
