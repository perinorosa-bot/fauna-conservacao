'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { createClient } from '@/lib/supabase/client'

export default function AdminLoginPage() {
  const router = useRouter()
  const t = useTranslations('adminDash.login')
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState('')

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const supabase = createClient()
    const { error: authError } = await supabase.auth.signInWithPassword({ email, password })

    if (authError) {
      setError(t('invalidCredentials'))
      setLoading(false)
      return
    }

    // Full reload so middleware reads the new session cookie
    window.location.href = '/admin'
  }

  return (
    <div className="min-h-screen bg-forest flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="mb-10 text-center">
          <span className="font-display text-cream tracking-[0.18em] uppercase text-2xl block mb-2">
            {t('brand')}
          </span>
          <p className="text-cream/40 text-xs tracking-widest uppercase">{t('subtitle')}</p>
        </div>

        <div className="bg-canopy/50 border border-white/[0.08] rounded-xl p-8">
          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            <div>
              <label className="text-cream/50 text-xs tracking-wide block mb-1.5">{t('email')}</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                autoFocus
                placeholder={t('emailPlaceholder')}
                className="w-full bg-white/[0.06] border border-white/[0.12] rounded-lg px-4 py-3
                           text-cream text-sm placeholder:text-cream/25 focus:outline-none
                           focus:border-sage/50 transition-colors"
              />
            </div>

            <div>
              <label className="text-cream/50 text-xs tracking-wide block mb-1.5">{t('password')}</label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                className="w-full bg-white/[0.06] border border-white/[0.12] rounded-lg px-4 py-3
                           text-cream text-sm placeholder:text-cream/25 focus:outline-none
                           focus:border-sage/50 transition-colors"
              />
            </div>

            {error && <p className="text-red-400 text-xs">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-leaf text-cream text-xs tracking-widest uppercase py-3 rounded-lg
                         hover:bg-sage transition-colors duration-200 disabled:opacity-50"
            >
              {loading ? t('submitting') : t('submit')}
            </button>

            <p className="text-cream/20 text-xs text-center">
              {t('onlyAdmins')}
            </p>
          </form>
        </div>
      </div>
    </div>
  )
}
