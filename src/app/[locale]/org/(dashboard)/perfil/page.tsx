'use client'

import { useState, useEffect, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import { COUNTRIES } from '@/lib/countries'
import { useTranslations } from 'next-intl'

export default function OrgPerfilPage() {
  const o = useTranslations('orgDash')
  const supabase = createClient()
  const fileRef  = useRef<HTMLInputElement>(null)

  const [orgName, setOrgName]       = useState('')
  const [orgDesc, setOrgDesc]       = useState('')
  const [orgWebsite, setOrgWebsite] = useState('')
  const [orgCountry, setOrgCountry] = useState('')
  const [logoUrl, setLogoUrl]       = useState('')
  const [logoTab, setLogoTab]       = useState<'url' | 'upload'>('url')
  const [uploading, setUploading]   = useState(false)
  const [orgId, setOrgId]           = useState('')
  const [loading, setLoading]       = useState(false)
  const [saved, setSaved]           = useState(false)
  const [error, setError]           = useState('')

  useEffect(() => {
    ;(async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      const { data: org } = await supabase.from('organizations').select('*').eq('user_id', user.id).single()
      if (!org) return
      setOrgId(org.id)
      setOrgName(org.name ?? '')
      setOrgDesc(org.description ?? '')
      setOrgWebsite(org.website ?? '')
      setOrgCountry(org.country ?? '')
      setLogoUrl(org.logo_url ?? '')
    })()
  }, [])

  async function handleLogoUpload(file: File) {
    setUploading(true)
    setError('')
    const ext  = file.name.split('.').pop()
    const path = `logos/${Date.now()}.${ext}`
    const { data, error: upErr } = await supabase.storage
      .from('project-images')
      .upload(path, file, { upsert: true })
    setUploading(false)
    if (upErr) { setError(o('uploading') + ' ' + upErr.message); return }
    const { data: { publicUrl } } = supabase.storage.from('project-images').getPublicUrl(data.path)
    setLogoUrl(publicUrl)
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSaved(false)
    const { error: dbError } = await supabase.from('organizations').update({
      name:        orgName,
      description: orgDesc,
      website:     orgWebsite || null,
      country:     orgCountry,
      logo_url:    logoUrl || null,
    }).eq('id', orgId)
    setLoading(false)
    if (dbError) { setError(dbError.message); return }
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  const inputClass = `w-full bg-white/[0.06] border border-white/[0.10] rounded-sm px-4 py-3
    text-cream text-sm placeholder:text-cream/25 focus:outline-none focus:border-sage/50 transition-colors`

  return (
    <div className="max-w-xl">
      <div className="mb-10">
        <h1 className="font-serif text-4xl font-light text-cream mb-2">{o('orgProfile')}</h1>
        <p className="text-cream/40 text-sm">{o('profileSubtitle')}</p>
      </div>

      <form onSubmit={handleSave} className="flex flex-col gap-5">
        <div>
          <label className="text-cream/50 text-xs tracking-wide block mb-1.5">{o('orgName')}</label>
          <input className={inputClass} type="text" value={orgName}
                 onChange={e => setOrgName(e.target.value)} required />
        </div>
        <div>
          <label className="text-cream/50 text-xs tracking-wide block mb-1.5">{o('country')}</label>
          <select className={inputClass} value={orgCountry}
                  onChange={e => setOrgCountry(e.target.value)} required>
            <option value="" disabled>Selecione um país</option>
            {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div>
          <label className="text-cream/50 text-xs tracking-wide block mb-1.5">{o('description')}</label>
          <textarea className={`${inputClass} resize-none`} rows={4}
                    value={orgDesc} onChange={e => setOrgDesc(e.target.value)} required />
        </div>
        <div>
          <label className="text-cream/50 text-xs tracking-wide block mb-1.5">{o('website')}</label>
          <input className={inputClass} type="url" placeholder="https://suaorg.org"
                 value={orgWebsite} onChange={e => setOrgWebsite(e.target.value)} />
        </div>

        <div>
          <label className="text-cream/50 text-xs tracking-wide block mb-1.5">{o('logo')}</label>
          <div className="flex gap-2 mb-2">
            <button type="button" onClick={() => setLogoTab('url')}
                    className={`text-[10px] tracking-widest uppercase px-3 py-1.5 rounded-sm transition-colors ${
                      logoTab === 'url' ? 'bg-sage/20 text-sage' : 'text-cream/30 hover:text-cream'}`}>
              URL
            </button>
            <button type="button" onClick={() => setLogoTab('upload')}
                    className={`text-[10px] tracking-widest uppercase px-3 py-1.5 rounded-sm transition-colors ${
                      logoTab === 'upload' ? 'bg-sage/20 text-sage' : 'text-cream/30 hover:text-cream'}`}>
              {o('uploadBtn')}
            </button>
          </div>
          {logoTab === 'url' ? (
            <input className={inputClass} type="url" placeholder="https://suaorg.org/logo.png"
                   value={logoUrl} onChange={e => setLogoUrl(e.target.value)} />
          ) : (
            <div>
              <input ref={fileRef} type="file" accept="image/*" className="hidden"
                     onChange={e => { const f = e.target.files?.[0]; if (f) handleLogoUpload(f) }}/>
              <button type="button" onClick={() => fileRef.current?.click()} disabled={uploading}
                      className="w-full border border-dashed border-white/[0.15] rounded-sm px-4 py-5
                                 text-cream/30 text-xs tracking-wide hover:border-sage/40 hover:text-sage/60
                                 transition-colors disabled:opacity-50 text-center">
                {uploading ? o('uploading') : logoUrl ? o('logoUploaded') : o('selectLogo')}
              </button>
              {logoUrl && !uploading && (
                <p className="text-sage text-[10px] mt-1.5 truncate">{logoUrl}</p>
              )}
            </div>
          )}
        </div>

        {error && <p className="text-red-400 text-xs">{error}</p>}
        {saved && <p className="text-sage text-xs">{o('savedSuccess')}</p>}

        <button type="submit" disabled={loading}
                className="bg-leaf text-cream text-xs tracking-widest uppercase px-8 py-3 rounded-sm
                           hover:bg-sage transition-colors disabled:opacity-50 w-fit">
          {loading ? o('saving') : o('saveChanges')}
        </button>
      </form>
    </div>
  )
}
