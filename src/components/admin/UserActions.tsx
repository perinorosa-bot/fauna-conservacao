'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { createClient } from '@/lib/supabase/client'

type Role = 'donor' | 'organization' | 'admin'

export default function UserActions({ id, role }: { id: string; role: Role }) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const t = useTranslations('adminDash.users.roleLabels')

  async function setRole(next: Role) {
    setLoading(true)
    const supabase = createClient()
    await supabase.from('profiles').update({ role: next }).eq('id', id)
    router.refresh()
    setLoading(false)
  }

  const options: { label: string; value: Role }[] = [
    { label: t('donor'),        value: 'donor'        },
    { label: t('organization'), value: 'organization' },
    { label: t('admin'),        value: 'admin'        },
  ]

  return (
    <select
      value={role}
      disabled={loading}
      onChange={e => setRole(e.target.value as Role)}
      className="text-[9px] tracking-widest uppercase px-2 py-1.5 rounded-lg border border-white/10 bg-transparent text-cream/50 hover:border-white/25 transition-all cursor-pointer focus:outline-none"
    >
      {options.map(o => (
        <option key={o.value} value={o.value} className="bg-[#0d1610]">{o.label}</option>
      ))}
    </select>
  )
}
