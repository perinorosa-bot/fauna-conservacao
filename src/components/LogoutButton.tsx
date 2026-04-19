'use client'

import { useRouter } from '@/i18n/navigation'
import { createClient } from '@/lib/supabase/client'

export default function LogoutButton() {
  const router = useRouter()

  async function handleLogout() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  return (
    <div className="mt-14 pt-8 border-t border-white/[0.05] text-center">
      <button
        onClick={handleLogout}
        className="text-cream/25 text-xs tracking-widest uppercase hover:text-red-400 transition-colors"
      >
        Sair da conta
      </button>
    </div>
  )
}