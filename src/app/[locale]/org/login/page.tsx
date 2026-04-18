'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'

export default function OrgLoginPage() {
  const router = useRouter()
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
    setLoading(false)
    if (authError) { setError('E-mail ou senha incorretos.'); return }
    router.push('/org/painel')
    router.refresh()
  }

  const inputClass = `w-full bg-white/[0.06] border border-white/[0.12] rounded-sm px-4 py-3
    text-cream text-sm placeholder:text-cream/25 focus:outline-none focus:border-sage/50 transition-colors`

  return (
    <div className="min-h-screen bg-forest flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="mb-10 text-center">
          <Link href="/" className="font-display text-cream tracking-[0.18em] uppercase text-2xl block mb-2">
            Fauna
          </Link>
          <p className="text-cream/40 text-xs tracking-widest uppercase">Painel da organização</p>
        </div>

        <div className="bg-canopy/50 border border-white/[0.08] rounded-xl p-8">
          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            <div>
              <label className="text-cream/50 text-xs tracking-wide block mb-1.5">E-mail</label>
              <input className={inputClass} type="email" placeholder="org@email.com"
                     value={email} onChange={e => setEmail(e.target.value)} required autoFocus />
            </div>
            <div>
              <label className="text-cream/50 text-xs tracking-wide block mb-1.5">Senha</label>
              <input className={inputClass} type="password" placeholder="••••••••"
                     value={password} onChange={e => setPassword(e.target.value)} required />
            </div>

            {error && <p className="text-red-400 text-xs">{error}</p>}

            <button type="submit" disabled={loading}
                    className="w-full bg-leaf text-cream text-xs tracking-widest uppercase py-3.5 rounded-sm
                               hover:bg-sage transition-colors disabled:opacity-50 mt-1">
              {loading ? 'Entrando...' : 'Entrar'}
            </button>
          </form>

          <div className="mt-6 pt-5 border-t border-white/[0.06] flex justify-between text-xs">
            <Link href="/organizacoes/cadastro" className="text-sage/60 hover:text-sage transition-colors">
              Criar conta →
            </Link>
            <Link href="/" className="text-cream/25 hover:text-cream/50 transition-colors">
              Voltar ao site
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
