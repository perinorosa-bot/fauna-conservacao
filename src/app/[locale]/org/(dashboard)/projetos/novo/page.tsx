'use client'

import { useState, useRef } from 'react'
import { useRouter } from '@/i18n/navigation'
import { createClient } from '@/lib/supabase/client'
import { COUNTRIES } from '@/lib/countries'
import { BIOMES } from '@/lib/biomes'
import { useTranslations } from 'next-intl'

function slugify(str: string) {
  return str.toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

export default function NovoProjetoPage() {
  const o = useTranslations('orgDash')
  const router   = useRouter()
  const supabase = createClient()
  const fileRef  = useRef<HTMLInputElement>(null)

  const [title, setTitle]               = useState('')
  const [slug, setSlug]                 = useState('')
  const [description, setDescription]   = useState('')
  const [fullDesc, setFullDesc]         = useState('')
  const [species, setSpecies]           = useState('')
  const [biome, setBiome]               = useState('')
  const [country, setCountry]           = useState('Brasil')
  const [coverUrl, setCoverUrl]         = useState('')
  const [coverTab, setCoverTab]         = useState<'url' | 'upload'>('url')
  const [uploading, setUploading]       = useState(false)
  const [videoLinks, setVideoLinks]     = useState<string[]>([''])
  const [tagsInput, setTagsInput]       = useState('')
  const [loading, setLoading]           = useState(false)
  const [error, setError]               = useState('')

  async function handleImageUpload(file: File) {
    setUploading(true)
    setError('')
    const ext  = file.name.split('.').pop()
    const path = `projects/${Date.now()}.${ext}`
    const { data, error: upErr } = await supabase.storage
      .from('project-images')
      .upload(path, file, { upsert: true })

    setUploading(false)
    if (upErr) {
      setError('Erro no upload: ' + upErr.message + ' — crie um bucket público "project-images" no Supabase Storage.')
      return
    }
    const { data: { publicUrl } } = supabase.storage.from('project-images').getPublicUrl(data.path)
    setCoverUrl(publicUrl)
  }

  function addVideoLink() {
    setVideoLinks(prev => [...prev, ''])
  }

  function updateVideoLink(i: number, val: string) {
    setVideoLinks(prev => prev.map((v, idx) => idx === i ? val : v))
  }

  function removeVideoLink(i: number) {
    setVideoLinks(prev => prev.filter((_, idx) => idx !== i))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { setError('Sessão expirada.'); setLoading(false); return }

    const { data: org } = await supabase
      .from('organizations')
      .select('id')
      .eq('user_id', user.id)
      .single()

    if (!org) { setError('Organização não encontrada.'); setLoading(false); return }

    const tags  = tagsInput.split(',').map(t => t.trim()).filter(Boolean)
    const videos = videoLinks.filter(v => v.trim())

    const { error: dbError } = await supabase.from('projects').insert({
      organization_id:  org.id,
      title,
      slug:             slug || slugify(title),
      description,
      full_description: fullDesc || null,
      species:          species || null,
      biome:            biome || null,
      country,
      cover_image_url:  coverUrl || null,
      goal_amount:      0,
      raised_amount:    0,
      currency:         'BRL',
      status:           'active',
      tags,
      video_links:      videos.length ? videos : null,
    })

    setLoading(false)
    if (dbError) { setError(dbError.message); return }
    router.push('/org/painel')
  }

  const inputClass = `w-full bg-white/[0.06] border border-white/[0.10] rounded-sm px-4 py-3
    text-cream text-sm placeholder:text-cream/25 focus:outline-none focus:border-sage/50 transition-colors`

  return (
    <div className="max-w-2xl">
      <div className="mb-10">
        <h1 className="font-serif text-4xl font-light text-cream mb-2">{o('newProjectTitle')}</h1>
        <p className="text-cream/40 text-sm">{o('newProjectSub')}</p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        {/* Title */}
        <div>
          <label className="text-cream/50 text-xs tracking-wide block mb-1.5">{o('projectTitle')} {o('required')}</label>
          <input className={inputClass} type="text" placeholder="Ex: Monitoramento de Onças no Pantanal"
                 value={title}
                 onChange={e => { setTitle(e.target.value); setSlug(slugify(e.target.value)) }}
                 required />
        </div>

        {/* Slug */}
        <div>
          <label className="text-cream/50 text-xs tracking-wide block mb-1.5">
            URL — fauna.org/projetos/<span className="text-sage">{slug || 'seu-projeto'}</span>
          </label>
          <input className={inputClass} type="text" placeholder="seu-projeto"
                 value={slug} onChange={e => setSlug(slugify(e.target.value))} required />
        </div>

        {/* Description */}
        <div>
          <label className="text-cream/50 text-xs tracking-wide block mb-1.5">
            {o('shortDesc')} {o('required')} <span className="text-cream/25">{o('shortDescHint')}</span>
          </label>
          <textarea className={`${inputClass} resize-none`} rows={2}
                    placeholder="Uma frase que resume o projeto..."
                    value={description} onChange={e => setDescription(e.target.value)} required />
        </div>

        {/* Full description */}
        <div>
          <label className="text-cream/50 text-xs tracking-wide block mb-1.5">
            {o('fullDesc')} <span className="text-cream/25">{o('fullDescHint')}</span>
          </label>
          <textarea className={`${inputClass} resize-none`} rows={5}
                    placeholder="Contexto, metodologia, impacto esperado..."
                    value={fullDesc} onChange={e => setFullDesc(e.target.value)} />
        </div>

        {/* Species + Biome + Country */}
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="text-cream/50 text-xs tracking-wide block mb-1.5">{o('speciesFocus')}</label>
            <input className={inputClass} type="text" placeholder="Panthera onca"
                   value={species} onChange={e => setSpecies(e.target.value)} />
          </div>
          <div>
            <label className="text-cream/50 text-xs tracking-wide block mb-1.5">{o('biome')} {o('required')}</label>
            <select className={inputClass} value={biome} onChange={e => setBiome(e.target.value)} required>
              <option value="">—</option>
              {BIOMES.map(b => <option key={b} value={b}>{b}</option>)}
            </select>
          </div>
          <div>
            <label className="text-cream/50 text-xs tracking-wide block mb-1.5">{o('countryLabel')} {o('required')}</label>
            <select className={inputClass} value={country} onChange={e => setCountry(e.target.value)} required>
              {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        </div>

        {/* Cover image */}
        <div>
          <label className="text-cream/50 text-xs tracking-wide block mb-1.5">{o('coverImage')}</label>
          <div className="flex gap-2 mb-2">
            <button type="button" onClick={() => setCoverTab('url')}
                    className={`text-[10px] tracking-widest uppercase px-3 py-1.5 rounded-sm transition-colors ${
                      coverTab === 'url' ? 'bg-sage/20 text-sage' : 'text-cream/30 hover:text-cream'}`}>
              URL
            </button>
            <button type="button" onClick={() => setCoverTab('upload')}
                    className={`text-[10px] tracking-widest uppercase px-3 py-1.5 rounded-sm transition-colors ${
                      coverTab === 'upload' ? 'bg-sage/20 text-sage' : 'text-cream/30 hover:text-cream'}`}>
              Upload
            </button>
          </div>

          {coverTab === 'url' ? (
            <input className={inputClass} type="url" placeholder="https://..."
                   value={coverUrl} onChange={e => setCoverUrl(e.target.value)} />
          ) : (
            <div>
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={e => {
                  const file = e.target.files?.[0]
                  if (file) handleImageUpload(file)
                }}
              />
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                disabled={uploading}
                className="w-full border border-dashed border-white/[0.15] rounded-sm px-4 py-6
                           text-cream/30 text-xs tracking-wide hover:border-sage/40 hover:text-sage/60
                           transition-colors disabled:opacity-50 text-center"
              >
                {uploading ? o('uploading') : coverUrl ? o('imageUploaded') : o('selectImage')}
              </button>
              {coverUrl && !uploading && (
                <p className="text-sage text-[10px] mt-1.5 truncate">{coverUrl}</p>
              )}
            </div>
          )}
        </div>

        {/* Video links */}
        <div>
          <label className="text-cream/50 text-xs tracking-wide block mb-1.5">
            {o('videoLinks')} <span className="text-cream/25">{o('videoHint')}</span>
          </label>
          <div className="flex flex-col gap-2">
            {videoLinks.map((v, i) => (
              <div key={i} className="flex gap-2">
                <input
                  className={inputClass}
                  type="url"
                  placeholder="https://youtube.com/watch?v=..."
                  value={v}
                  onChange={e => updateVideoLink(i, e.target.value)}
                />
                {videoLinks.length > 1 && (
                  <button type="button" onClick={() => removeVideoLink(i)}
                          className="text-cream/25 hover:text-red-400 transition-colors px-2 flex-shrink-0">
                    ✕
                  </button>
                )}
              </div>
            ))}
            <button type="button" onClick={addVideoLink}
                    className="text-sage/50 text-[10px] tracking-widest uppercase hover:text-sage transition-colors text-left">
              {o('addVideo')}
            </button>
          </div>
        </div>

        {/* Tags */}
        <div>
          <label className="text-cream/50 text-xs tracking-wide block mb-1.5">
            {o('tags')} <span className="text-cream/25">{o('tagsHint')}</span>
          </label>
          <input className={inputClass} type="text" placeholder="onça-pintada, GPS, Pantanal"
                 value={tagsInput} onChange={e => setTagsInput(e.target.value)} />
        </div>

        {error && <p className="text-red-400 text-xs">{error}</p>}

        <div className="flex gap-4 pt-2">
          <button type="submit" disabled={loading || uploading}
                  className="bg-leaf text-cream text-xs tracking-widest uppercase px-8 py-3 rounded-sm
                             hover:bg-sage transition-colors disabled:opacity-50">
            {loading ? o('publishing') : o('publish')}
          </button>
          <button type="button" onClick={() => router.back()}
                  className="text-cream/30 text-xs tracking-widest uppercase hover:text-cream transition-colors">
            {o('cancel')}
          </button>
        </div>
      </form>
    </div>
  )
}
