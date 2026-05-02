'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from '@/i18n/navigation'
import { useParams } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { createClient } from '@/lib/supabase/client'

type Project = { id: string; title: string }

export default function EditarAtualizacaoPage() {
  const o = useTranslations('orgDash')
  const router   = useRouter()
  const params   = useParams<{ id: string }>()
  const supabase = createClient()
  const fileRef  = useRef<HTMLInputElement>(null)

  const [loading, setLoading]       = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [deleting, setDeleting]     = useState(false)
  const [notFound, setNotFound]     = useState(false)
  const [error, setError]           = useState('')

  const [projects, setProjects]     = useState<Project[]>([])
  const [projectId, setProjectId]   = useState('')
  const [title, setTitle]           = useState('')
  const [content, setContent]       = useState('')
  const [authorName, setAuthorName] = useState('')
  const [imageUrl, setImageUrl]     = useState('')
  const [imageTab, setImageTab]     = useState<'url' | 'upload'>('url')
  const [uploading, setUploading]   = useState(false)
  const [videoLinks, setVideoLinks] = useState<string[]>([''])

  useEffect(() => {
    ;(async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/entrar'); return }

      const { data: org } = await supabase.from('organizations').select('id').eq('user_id', user.id).single()
      if (!org) { router.push('/organizacoes/cadastro'); return }

      const { data: projs } = await supabase.from('projects').select('id, title').eq('organization_id', org.id)
      setProjects(projs ?? [])

      // RLS already restricts read access to updates within the org's own projects;
      // we additionally verify the join here as a defence-in-depth check.
      const orgProjectIds = (projs ?? []).map(p => p.id)
      const { data: upd } = await supabase
        .from('updates')
        .select('*')
        .eq('id', params.id)
        .single()

      if (!upd || !orgProjectIds.includes(upd.project_id)) {
        setNotFound(true); setLoading(false); return
      }

      setProjectId(upd.project_id)
      setTitle(upd.title ?? '')
      setContent(upd.content ?? '')
      setAuthorName(upd.author_name ?? '')
      setImageUrl(upd.image_url ?? '')
      setVideoLinks(upd.video_links?.length ? upd.video_links : [''])
      setLoading(false)
    })()
  }, [params.id, router])

  async function handleImageUpload(file: File) {
    setUploading(true); setError('')
    const ext  = file.name.split('.').pop()
    const path = `updates/${Date.now()}.${ext}`
    const { data, error: upErr } = await supabase.storage.from('project-images').upload(path, file, { upsert: true })
    setUploading(false)
    if (upErr) { setError(o('uploadErrorPrefix') + upErr.message); return }
    const { data: { publicUrl } } = supabase.storage.from('project-images').getPublicUrl(data.path)
    setImageUrl(publicUrl)
  }

  function addVideoLink()                          { setVideoLinks(prev => [...prev, '']) }
  function updateVideoLink(i: number, val: string) { setVideoLinks(prev => prev.map((v, idx) => idx === i ? val : v)) }
  function removeVideoLink(i: number)              { setVideoLinks(prev => prev.filter((_, idx) => idx !== i)) }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitting(true); setError('')

    const videos = videoLinks.filter(v => v.trim())

    const { error: dbError } = await supabase
      .from('updates')
      .update({
        project_id:  projectId,
        title,
        content,
        author_name: authorName,
        image_url:   imageUrl || null,
        video_links: videos.length ? videos : null,
      })
      .eq('id', params.id)

    setSubmitting(false)
    if (dbError) { setError(dbError.message); return }
    router.push('/org/atualizacoes')
    router.refresh()
  }

  async function handleDelete() {
    if (!confirm(o('confirmDeleteUpdateLong'))) return
    setDeleting(true)
    const { error: delErr } = await supabase.from('updates').delete().eq('id', params.id)
    setDeleting(false)
    if (delErr) { setError(delErr.message); return }
    router.push('/org/atualizacoes')
    router.refresh()
  }

  const inputClass = `w-full bg-white/[0.06] border border-white/[0.10] rounded-sm px-4 py-3
    text-cream text-sm placeholder:text-cream/25 focus:outline-none focus:border-sage/50 transition-colors`

  if (loading) return <div className="text-cream/40 text-sm">{o('loading')}</div>
  if (notFound) {
    return (
      <div className="max-w-2xl">
        <p className="text-cream/60">{o('updateNotFound')}</p>
      </div>
    )
  }

  return (
    <div className="max-w-2xl">
      <div className="mb-10">
        <h1 className="font-serif text-4xl font-light text-cream mb-2">{o('editUpdateTitle')}</h1>
        <p className="text-cream/40 text-sm">{o('editUpdateSubtitle')}</p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <div>
          <label className="text-cream/50 text-xs tracking-wide block mb-1.5">{o('selectProject')}</label>
          <select className={inputClass} value={projectId} onChange={e => setProjectId(e.target.value)} required>
            <option value="">{o('selectProjectPh')}</option>
            {projects.map(p => <option key={p.id} value={p.id}>{p.title}</option>)}
          </select>
        </div>

        <div>
          <label className="text-cream/50 text-xs tracking-wide block mb-1.5">{o('updateTitle')}</label>
          <input className={inputClass} type="text" value={title} onChange={e => setTitle(e.target.value)} required />
        </div>

        <div>
          <label className="text-cream/50 text-xs tracking-wide block mb-1.5">{o('content')}</label>
          <textarea className={`${inputClass} resize-none`} rows={6}
                    value={content} onChange={e => setContent(e.target.value)} required />
        </div>

        <div>
          <label className="text-cream/50 text-xs tracking-wide block mb-1.5">{o('authorName')}</label>
          <input className={inputClass} type="text" value={authorName} onChange={e => setAuthorName(e.target.value)} required />
        </div>

        <div>
          <label className="text-cream/50 text-xs tracking-wide block mb-1.5">{o('imageLabel')}</label>
          <div className="flex gap-2 mb-2">
            <button type="button" onClick={() => setImageTab('url')}
                    className={`text-[10px] tracking-widest uppercase px-3 py-1.5 rounded-sm transition-colors ${
                      imageTab === 'url' ? 'bg-sage/20 text-sage' : 'text-cream/30 hover:text-cream'}`}>URL</button>
            <button type="button" onClick={() => setImageTab('upload')}
                    className={`text-[10px] tracking-widest uppercase px-3 py-1.5 rounded-sm transition-colors ${
                      imageTab === 'upload' ? 'bg-sage/20 text-sage' : 'text-cream/30 hover:text-cream'}`}>Upload</button>
          </div>
          {imageTab === 'url' ? (
            <input className={inputClass} type="url" value={imageUrl} onChange={e => setImageUrl(e.target.value)} />
          ) : (
            <div>
              <input ref={fileRef} type="file" accept="image/*" className="hidden"
                     onChange={e => { const f = e.target.files?.[0]; if (f) handleImageUpload(f) }} />
              <button type="button" onClick={() => fileRef.current?.click()} disabled={uploading}
                      className="w-full border border-dashed border-white/[0.15] rounded-sm px-4 py-6
                                 text-cream/30 text-xs tracking-wide hover:border-sage/40 hover:text-sage/60
                                 transition-colors disabled:opacity-50 text-center">
                {uploading ? o('uploading') : imageUrl ? o('imageUploaded') : o('selectImage')}
              </button>
              {imageUrl && !uploading && <p className="text-sage text-[10px] mt-1.5 truncate">{imageUrl}</p>}
            </div>
          )}
        </div>

        <div>
          <label className="text-cream/50 text-xs tracking-wide block mb-1.5">{o('videoLinks')}</label>
          <div className="flex flex-col gap-2">
            {videoLinks.map((v, i) => (
              <div key={i} className="flex gap-2">
                <input className={inputClass} type="url" value={v} onChange={e => updateVideoLink(i, e.target.value)} />
                {videoLinks.length > 1 && (
                  <button type="button" onClick={() => removeVideoLink(i)}
                          className="text-cream/25 hover:text-red-400 transition-colors px-2 flex-shrink-0">✕</button>
                )}
              </div>
            ))}
            <button type="button" onClick={addVideoLink}
                    className="text-sage/50 text-[10px] tracking-widest uppercase hover:text-sage transition-colors text-left">
              {o('addVideo')}
            </button>
          </div>
        </div>

        {error && <p className="text-red-400 text-xs">{error}</p>}

        <div className="flex items-center justify-between pt-2">
          <div className="flex gap-4">
            <button type="submit" disabled={submitting || uploading || deleting}
                    className="bg-leaf text-cream text-xs tracking-widest uppercase px-8 py-3 rounded-sm
                               hover:bg-sage transition-colors disabled:opacity-50">
              {submitting ? o('saving') : o('saveChanges')}
            </button>
            <button type="button" onClick={() => router.back()}
                    className="text-cream/30 text-xs tracking-widest uppercase hover:text-cream transition-colors">
              {o('cancel')}
            </button>
          </div>
          <button type="button" onClick={handleDelete} disabled={deleting || submitting}
                  className="text-[10px] tracking-widest uppercase px-4 py-2 rounded-sm
                             border border-red-500/30 text-red-400/80
                             hover:bg-red-500/10 hover:text-red-400 transition-colors disabled:opacity-50">
            {deleting ? o('deletingBtn') : o('deleteBtn')}
          </button>
        </div>
      </form>
    </div>
  )
}
