'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function AuthCallbackPage() {
  const [status, setStatus] = useState('Verificando acesso...')

  useEffect(() => {
    const supabase = createClient()
    const params   = new URLSearchParams(window.location.search)
    const code       = params.get('code')
    const token_hash = params.get('token_hash')
    const type       = (params.get('type') ?? 'email') as 'email'

    async function handle() {
      try {
        // Log all URL params for debugging
        const allParams = Object.fromEntries(params.entries())
        const hashParams = new URLSearchParams(window.location.hash.replace('#', ''))
        console.log('[auth/callback] search params:', allParams)
        console.log('[auth/callback] hash params:', Object.fromEntries(hashParams.entries()))

        if (token_hash) {
          setStatus('Verificando token...')
          const { error } = await supabase.auth.verifyOtp({ token_hash, type })
          if (error) {
            setStatus('Erro no token: ' + error.message)
            console.error('[auth/callback] verifyOtp error:', error)
            return
          }
        } else if (code) {
          setStatus('Trocando código...')
          const { error } = await supabase.auth.exchangeCodeForSession(code)
          if (error) {
            setStatus('Erro no código: ' + error.message)
            console.error('[auth/callback] exchangeCode error:', error)
            return
          }
        } else if (hashParams.get('access_token')) {
          // Hash fragment flow (older Supabase format)
          setStatus('Lendo sessão do link...')
          const { data: { session }, error } = await supabase.auth.getSession()
          if (error || !session) {
            setStatus('Sessão não encontrada. Tente pedir um novo link.')
            return
          }
        } else {
          setStatus('Link inválido ou expirado. Peça um novo link de acesso.')
          return
        }

        setStatus('Entrando...')
        const next = params.get('next') ?? '/admin'
        window.location.href = next
      } catch (e: unknown) {
        setStatus('Erro inesperado: ' + String(e))
        console.error('[auth/callback] unexpected error:', e)
      }
    }

    handle()
  }, [])

  return (
    <div className="min-h-screen bg-forest flex items-center justify-center">
      <div className="text-center">
        <div className="w-6 h-6 border-2 border-sage/40 border-t-sage rounded-full animate-spin mx-auto mb-4" />
        <p className="text-cream/40 text-sm">{status}</p>
      </div>
    </div>
  )
}