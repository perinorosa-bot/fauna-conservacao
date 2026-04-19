'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useTranslations } from 'next-intl'
import { Link, useRouter } from '@/i18n/navigation'
import Nav from '@/components/layout/Nav'

type Mode = null | 'donor' | 'org'

export default function EntrarPage() {
  const router = useRouter()
  const t = useTranslations('authForms.enter')
  const tCommon = useTranslations('common')
  const [mode, setMode]       = useState<Mode>(null)

  // Donor state
  const [donorEmail, setDonorEmail]   = useState('')
  const [donorSent, setDonorSent]     = useState(false)
  const [donorLoading, setDonorLoading] = useState(false)
  const [donorError, setDonorError]   = useState('')

  // Org state
  const [orgEmail, setOrgEmail]       = useState('')
  const [orgPassword, setOrgPassword] = useState('')
  const [orgLoading, setOrgLoading]   = useState(false)
  const [orgError, setOrgError]       = useState('')

  async function handleDonorSubmit(ev: React.FormEvent) {
    ev.preventDefault()
    setDonorLoading(true)
    setDonorError('')
    const supabase = createClient()
    const { error } = await supabase.auth.signInWithOtp({
      email: donorEmail,
      options: { emailRedirectTo: `${window.location.origin}/auth/callback?next=/perfil` },
    })
    setDonorLoading(false)
    if (error) setDonorError(error.message)
    else setDonorSent(true)
  }

  async function handleOrgLogin(ev: React.FormEvent) {
    ev.preventDefault()
    setOrgLoading(true)
    setOrgError('')
    const supabase = createClient()
    const { error } = await supabase.auth.signInWithPassword({ email: orgEmail, password: orgPassword })
    setOrgLoading(false)
    if (error) { setOrgError(t('invalidCredentials')); return }
    router.push('/org/painel')
    router.refresh()
  }

  const inputClass = `w-full bg-white/[0.06] border border-white/[0.10] rounded-xl px-4 py-3
    text-cream text-sm placeholder:text-cream/25 focus:outline-none focus:border-sage/50 transition-colors`

  return (
    <main className="min-h-screen bg-forest">
      <Nav />
      <div className="flex items-center justify-center min-h-screen px-4 py-24">
        <div className="w-full max-w-md">

          {/* Step 1 — choose who you are */}
          {mode === null && (
            <>
              <div className="text-center mb-10">
                <h1 className="font-serif text-4xl font-light text-cream mb-3">
                  {t('welcomeTitle')}
                </h1>
                <p className="text-cream/40 text-sm leading-relaxed">
                  {t('welcomeSub')}
                </p>
              </div>

              <div className="flex flex-col gap-4">
                {/* Donor card */}
                <button
                  onClick={() => setMode('donor')}
                  className="group bg-canopy/40 border border-white/[0.07] hover:border-sage/30
                             rounded-2xl p-7 text-left transition-all duration-200 hover:bg-canopy/60"
                >
                  <p className="text-sage text-xs tracking-widest uppercase mb-2">{t('donorEyebrow')}</p>
                  <p className="text-cream font-serif text-xl font-light mb-1">
                    {t('donorTitle')}
                  </p>
                  <p className="text-cream/35 text-xs leading-relaxed">
                    {t('donorDesc')}
                  </p>
                  <span className="mt-4 inline-block text-sage/60 text-xs tracking-widest uppercase
                                   group-hover:text-sage transition-colors">
                    {t('donorCta')}
                  </span>
                </button>

                {/* Org card */}
                <button
                  onClick={() => setMode('org')}
                  className="group bg-canopy/40 border border-white/[0.07] hover:border-sage/30
                             rounded-2xl p-7 text-left transition-all duration-200 hover:bg-canopy/60"
                >
                  <p className="text-sage text-xs tracking-widest uppercase mb-2">{t('orgEyebrow')}</p>
                  <p className="text-cream font-serif text-xl font-light mb-1">
                    {t('orgTitle')}
                  </p>
                  <p className="text-cream/35 text-xs leading-relaxed">
                    {t('orgDesc')}
                  </p>
                  <span className="mt-4 inline-block text-sage/60 text-xs tracking-widest uppercase
                                   group-hover:text-sage transition-colors">
                    {t('orgCta')}
                  </span>
                </button>
              </div>
            </>
          )}

          {/* Step 2A — Donor login */}
          {mode === 'donor' && (
            <>
              <button onClick={() => setMode(null)}
                      className="text-cream/30 text-xs tracking-widest uppercase hover:text-cream/60
                                 transition-colors mb-8 flex items-center gap-1.5">
                {tCommon('back')}
              </button>

              <div className="text-center mb-10">
                <p className="text-sage text-xs tracking-widest uppercase mb-3">{t('donorEyebrow')}</p>
                <h1 className="font-serif text-3xl font-light text-cream mb-3">
                  {t('donorStepTitle')}
                </h1>
                <p className="text-cream/40 text-sm leading-relaxed">
                  {t('donorStepSub')}
                </p>
              </div>

              <div className="bg-canopy/40 border border-white/[0.07] rounded-2xl p-8">
                {donorSent ? (
                  <div className="text-center py-4">
                    <p className="text-sage text-3xl mb-4">✉</p>
                    <p className="text-cream/80 text-sm mb-2 font-medium">{t('sentTitle')}</p>
                    <p className="text-cream/40 text-xs leading-relaxed">
                      {t('sentDesc', { email: donorEmail })}
                    </p>
                    <button onClick={() => setDonorSent(false)}
                            className="mt-6 text-sage/60 text-xs hover:text-sage transition-colors">
                      {t('useOther')}
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleDonorSubmit} className="flex flex-col gap-4">
                    <div>
                      <label className="text-cream/50 text-xs tracking-wide block mb-1.5">{t('emailLabel')}</label>
                      <input type="email" value={donorEmail}
                             onChange={ev => setDonorEmail(ev.target.value)}
                             required autoFocus placeholder={t('emailPlaceholder')}
                             className={inputClass} />
                    </div>
                    {donorError && <p className="text-red-400 text-xs">{donorError}</p>}
                    <button type="submit" disabled={donorLoading}
                            className="w-full bg-leaf text-cream text-xs tracking-widest uppercase
                                       py-3.5 rounded-xl hover:bg-sage transition-colors disabled:opacity-50">
                      {donorLoading ? tCommon('sending') : t('submit')}
                    </button>
                    <p className="text-cream/25 text-xs text-center leading-relaxed">
                      {t('terms')}
                    </p>
                  </form>
                )}
              </div>
            </>
          )}

          {/* Step 2B — Org login */}
          {mode === 'org' && (
            <>
              <button onClick={() => setMode(null)}
                      className="text-cream/30 text-xs tracking-widest uppercase hover:text-cream/60
                                 transition-colors mb-8 flex items-center gap-1.5">
                {tCommon('back')}
              </button>

              <div className="text-center mb-10">
                <p className="text-sage text-xs tracking-widest uppercase mb-3">{t('orgEyebrow')}</p>
                <h1 className="font-serif text-3xl font-light text-cream mb-3">
                  {t('orgStepTitle')}
                </h1>
                <p className="text-cream/40 text-sm leading-relaxed">
                  {t('orgStepSub')}
                </p>
              </div>

              <div className="bg-canopy/40 border border-white/[0.07] rounded-2xl p-8">
                <form onSubmit={handleOrgLogin} className="flex flex-col gap-4">
                  <div>
                    <label className="text-cream/50 text-xs tracking-wide block mb-1.5">{t('orgEmailLabel')}</label>
                    <input type="email" value={orgEmail}
                           onChange={ev => setOrgEmail(ev.target.value)}
                           required autoFocus placeholder={t('orgEmailPlaceholder')}
                           className={inputClass} />
                  </div>
                  <div>
                    <label className="text-cream/50 text-xs tracking-wide block mb-1.5">{t('orgPasswordLabel')}</label>
                    <input type="password" value={orgPassword}
                           onChange={ev => setOrgPassword(ev.target.value)}
                           required placeholder={t('orgPasswordPlaceholder')}
                           className={inputClass} />
                  </div>
                  {orgError && <p className="text-red-400 text-xs">{orgError}</p>}
                  <button type="submit" disabled={orgLoading}
                          className="w-full bg-leaf text-cream text-xs tracking-widest uppercase
                                     py-3.5 rounded-xl hover:bg-sage transition-colors disabled:opacity-50 mt-1">
                    {orgLoading ? t('orgSubmitting') : t('orgSubmit')}
                  </button>
                </form>

                <div className="mt-6 pt-5 border-t border-white/[0.06] text-center">
                  <p className="text-cream/30 text-xs mb-1">{t('noAccount')}</p>
                  <Link href="/organizacoes/cadastro"
                        className="text-sage/70 text-xs tracking-widest uppercase hover:text-sage transition-colors">
                    {t('registerOrg')}
                  </Link>
                </div>
              </div>
            </>
          )}

        </div>
      </div>
    </main>
  )
}
