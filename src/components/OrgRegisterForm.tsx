'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from '@/i18n/navigation'
import { useTranslations } from 'next-intl'
import { createClient } from '@/lib/supabase/client'
import { COUNTRIES } from '@/lib/countries'

export default function OrgRegisterForm() {
  const router = useRouter()
  const supabase = createClient()
  const t = useTranslations('authForms.orgRegister.form')

  const [step, setStep]     = useState<'account' | 'confirm' | 'org'>('account')
  const [loading, setLoading] = useState(false)
  const [error, setError]   = useState('')
  const [userId, setUserId] = useState<string | null>(null)

  // If user is already logged in (e.g. returned after email confirmation),
  // skip straight to the org creation step
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) {
        setUserId(data.user.id)
        setStep('org')
      }
    })
  }, [])

  // Account fields
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')

  // Org fields
  const [orgName, setOrgName]         = useState('')
  const [orgSlug, setOrgSlug]         = useState('')
  const [orgDesc, setOrgDesc]         = useState('')
  const [orgCountry, setOrgCountry]   = useState('')
  const [orgWebsite, setOrgWebsite]   = useState('')
  const [logoUrl, setLogoUrl]         = useState('')
  const [logoTab, setLogoTab]         = useState<'url' | 'upload'>('url')
  const [uploading, setUploading]     = useState(false)
  const fileRef                       = useRef<HTMLInputElement>(null)

  async function handleLogoUpload(file: File) {
    setUploading(true)
    setError('')
    const ext  = file.name.split('.').pop()
    const path = `logos/${Date.now()}.${ext}`
    const { data, error: upErr } = await supabase.storage
      .from('project-images')
      .upload(path, file, { upsert: true })
    setUploading(false)
    if (upErr) { setError(t('uploadError', { message: upErr.message })); return }
    const { data: { publicUrl } } = supabase.storage.from('project-images').getPublicUrl(data.path)
    setLogoUrl(publicUrl)
  }

  function slugify(str: string) {
    return str.toLowerCase()
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
  }

  async function handleAccount(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const { data, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName },
        emailRedirectTo: `${window.location.origin}/auth/callback?next=/organizacoes/cadastro`,
      },
    })

    setLoading(false)
    if (authError) { setError(authError.message); return }

    if (!data.session) {
      // Supabase requires email confirmation before creating session
      setStep('confirm')
      return
    }

    setUserId(data.user?.id ?? null)
    setStep('org')
  }

  async function handleOrg(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const uid = userId ?? (await supabase.auth.getUser()).data.user?.id
    if (!uid) { setError(t('sessionExpired')); setLoading(false); return }

    const { error: dbError } = await supabase.from('organizations').insert({
      user_id:     uid,
      name:        orgName,
      slug:        orgSlug || slugify(orgName),
      description: orgDesc,
      country:     orgCountry,
      website:     orgWebsite || null,
      logo_url:    logoUrl || null,
    })

    if (dbError) { setError(dbError.message); setLoading(false); return }

    // Set profile role to organization
    await supabase.from('profiles').update({ role: 'organization' }).eq('id', uid)

    setLoading(false)
    router.push('/org/painel')
  }

  const inputClass = `w-full bg-white/[0.06] border border-white/[0.12] rounded-sm px-4 py-3
    text-cream text-sm placeholder:text-cream/25 focus:outline-none
    focus:border-sage/50 transition-colors`

  if (step === 'confirm') {
    return (
      <div className="text-center py-8">
        <div className="text-sage text-4xl mb-4">✉</div>
        <h3 className="font-serif text-xl text-cream mb-2">{t('confirmTitle')}</h3>
        <p className="text-cream/50 text-sm leading-relaxed">
          {t('confirmDesc', { email })}
        </p>
        <button
          onClick={() => setStep('org')}
          className="btn-outline mt-8 text-xs">
          {t('confirmCta')}
        </button>
      </div>
    )
  }

  if (step === 'account') {
    return (
      <form onSubmit={handleAccount} className="flex flex-col gap-4">
        <div>
          <label className="text-cream/50 text-xs tracking-wide block mb-1.5">{t('fullNameLabel')}</label>
          <input className={inputClass} type="text" placeholder={t('fullNamePlaceholder')}
                 value={fullName} onChange={e => setFullName(e.target.value)} required/>
        </div>
        <div>
          <label className="text-cream/50 text-xs tracking-wide block mb-1.5">{t('emailLabel')}</label>
          <input className={inputClass} type="email" placeholder={t('emailPlaceholder')}
                 value={email} onChange={e => setEmail(e.target.value)} required/>
        </div>
        <div>
          <label className="text-cream/50 text-xs tracking-wide block mb-1.5">{t('passwordLabel')}</label>
          <input className={inputClass} type="password" placeholder={t('passwordPlaceholder')}
                 value={password} onChange={e => setPassword(e.target.value)} required minLength={8}/>
        </div>

        {error && <p className="text-red-400 text-xs">{error}</p>}

        <button type="submit" disabled={loading} className="btn-primary w-full justify-center mt-2">
          {loading ? t('creatingAccount') : t('createAccount')}
        </button>

        <p className="text-center text-cream/30 text-xs">
          {t('alreadyHaveAccount')}{' '}
          <a href="/org/login" className="text-sage hover:underline">{t('signIn')}</a>
        </p>
      </form>
    )
  }

  return (
    <form onSubmit={handleOrg} className="flex flex-col gap-4">
      <p className="text-sage text-xs tracking-wide mb-2">
        {t('accountCreated')}
      </p>
      <div>
        <label className="text-cream/50 text-xs tracking-wide block mb-1.5">{t('orgNameLabel')}</label>
        <input className={inputClass} type="text" placeholder={t('orgNamePlaceholder')}
               value={orgName}
               onChange={e => { setOrgName(e.target.value); setOrgSlug(slugify(e.target.value)) }}
               required/>
      </div>
      <div>
        <label className="text-cream/50 text-xs tracking-wide block mb-1.5">
          {t('slugLabel')}<span className="text-sage">{orgSlug || t('slugFallback')}</span>
        </label>
        <input className={inputClass} type="text" placeholder={t('slugPlaceholder')}
               value={orgSlug} onChange={e => setOrgSlug(slugify(e.target.value))} required/>
      </div>
      <div>
        <label className="text-cream/50 text-xs tracking-wide block mb-1.5">{t('countryLabel')}</label>
        <select
          className={`${inputClass} appearance-none`}
          value={orgCountry}
          onChange={e => setOrgCountry(e.target.value)}
          required
        >
          <option value="" disabled>{t('countryPlaceholder')}</option>
          {COUNTRIES.map(c => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>
      <div>
        <label className="text-cream/50 text-xs tracking-wide block mb-1.5">{t('descLabel')}</label>
        <textarea className={`${inputClass} resize-none`} rows={3}
                  placeholder={t('descPlaceholder')}
                  value={orgDesc} onChange={e => setOrgDesc(e.target.value)} required/>
      </div>
      <div>
        <label className="text-cream/50 text-xs tracking-wide block mb-1.5">{t('websiteLabel')}</label>
        <input className={inputClass} type="url" placeholder={t('websitePlaceholder')}
               value={orgWebsite} onChange={e => setOrgWebsite(e.target.value)}/>
      </div>

      <div>
        <label className="text-cream/50 text-xs tracking-wide block mb-1.5">{t('logoLabel')}</label>
        <div className="flex gap-2 mb-2">
          <button type="button" onClick={() => setLogoTab('url')}
                  className={`text-[10px] tracking-widest uppercase px-3 py-1.5 rounded-sm transition-colors ${
                    logoTab === 'url' ? 'bg-sage/20 text-sage' : 'text-cream/30 hover:text-cream'}`}>
            {t('logoTabUrl')}
          </button>
          <button type="button" onClick={() => setLogoTab('upload')}
                  className={`text-[10px] tracking-widests uppercase px-3 py-1.5 rounded-sm transition-colors ${
                    logoTab === 'upload' ? 'bg-sage/20 text-sage' : 'text-cream/30 hover:text-cream'}`}>
            {t('logoTabUpload')}
          </button>
        </div>
        {logoTab === 'url' ? (
          <input className={inputClass} type="url" placeholder={t('logoUrlPlaceholder')}
                 value={logoUrl} onChange={e => setLogoUrl(e.target.value)}/>
        ) : (
          <div>
            <input ref={fileRef} type="file" accept="image/*" className="hidden"
                   onChange={e => { const f = e.target.files?.[0]; if (f) handleLogoUpload(f) }}/>
            <button type="button" onClick={() => fileRef.current?.click()} disabled={uploading}
                    className="w-full border border-dashed border-white/[0.15] rounded-sm px-4 py-5
                               text-cream/30 text-xs tracking-wide hover:border-sage/40 hover:text-sage/60
                               transition-colors disabled:opacity-50 text-center">
              {uploading ? t('logoUploading') : logoUrl ? t('logoUploaded') : t('logoSelect')}
            </button>
            {logoUrl && !uploading && (
              <p className="text-sage text-[10px] mt-1.5 truncate">{logoUrl}</p>
            )}
          </div>
        )}
      </div>

      {error && <p className="text-red-400 text-xs">{error}</p>}

      <button type="submit" disabled={loading} className="btn-primary w-full justify-center mt-2">
        {loading ? t('submitting') : t('submit')}
      </button>
    </form>
  )
}
