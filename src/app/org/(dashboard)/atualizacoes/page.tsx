'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { useLanguage } from '@/lib/i18n/LanguageContext'

type Update = {
  id:           string
  title:        string
  content:      string
  author_name:  string
  image_url:    string | null
  created_at:   string
  project: { id: string; title: string; slug: string } | null
}

export default function OrgUpdatesListPage() {
  const { t } = useLanguage()
  const o = t.orgDash
  const router   = useRouter()
  const supabase = createClient()
  const [updates, setUpdates] = useState<Update[]>([])
  const [loading, setLoading] = useState(true)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  async function load() {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    const { data: org } = await supabase.from('organizations').select('id').eq('user_id', user.id).single()
    if (!org) return

    const { data: projects } = await supabase
      .from('projects')
      .select('id')
      .eq('organization_id', org.id)
    const projectIds = (projects ?? []).map(p => p.id)
    if (projectIds.length === 0) { setUpdates([]); setLoading(false); return }

    const { data } = await supabase
      .from('updates')
      .select('id, title, content, author_name, image_url, created_at, project:projects(id, title, slug)')
      .in('project_id', projectIds)
      .order('created_at', { ascending: false })

    setUpdates((data as unknown as Update[]) ?? [])
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  async function handleDelete(id: string) {
    if (!confirm('Excluir esta atualização?')) return
    setDeletingId(id)
    const { error } = await supabase.from('updates').delete().eq('id', id)
    setDeletingId(null)
    if (error) { alert(error.message); return }
    load()
    router.refresh()
  }

  if (loading) return <div className="text-cream/40 text-sm">Carregando…</div>

  return (
    <div className="max-w-4xl">
      <div className="flex items-center justify-between mb-10">
        <div>
          <h1 className="font-serif text-4xl font-light text-cream mb-2">Atualizações</h1>
          <p className="text-cream/40 text-sm">{updates.length} publicada{updates.length === 1 ? '' : 's'}</p>
        </div>
        <Link href="/org/atualizacoes/nova"
              className="text-[10px] tracking-widest uppercase bg-leaf text-cream px-4 py-2.5 rounded-sm hover:bg-sage transition-colors">
          + Nova atualização
        </Link>
      </div>

      {updates.length === 0 ? (
        <div className="bg-canopy/20 border border-white/[0.06] rounded-xl p-10 text-center">
          <p className="text-cream/30 text-sm mb-4">Nenhuma atualização ainda.</p>
          <Link href="/org/atualizacoes/nova" className="text-sage text-xs tracking-widest uppercase hover:underline">
            Criar primeira atualização →
          </Link>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {updates.map(u => (
            <div key={u.id} className="bg-canopy/30 border border-white/[0.06] rounded-xl px-6 py-4 flex items-center gap-6">
              {u.image_url && (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img src={u.image_url} alt="" className="w-14 h-14 rounded-sm object-cover flex-shrink-0" />
              )}
              <div className="flex-1 min-w-0">
                <p className="text-cream text-sm font-medium truncate">{u.title}</p>
                <p className="text-cream/40 text-xs mt-0.5 truncate">
                  {u.project?.title ?? '—'} · {u.author_name} · {new Date(u.created_at).toLocaleDateString('pt-BR')}
                </p>
              </div>
              <div className="flex items-center gap-3 flex-shrink-0">
                {u.project && (
                  <Link href={`/projetos/${u.project.slug}`}
                        className="text-cream/30 text-[10px] tracking-widest uppercase hover:text-cream transition-colors">
                    Ver
                  </Link>
                )}
                <Link href={`/org/atualizacoes/${u.id}/editar`}
                      className="text-sage/60 text-[10px] tracking-widest uppercase hover:text-sage transition-colors">
                  Editar
                </Link>
                <button onClick={() => handleDelete(u.id)} disabled={deletingId === u.id}
                        className="text-red-400/60 text-[10px] tracking-widest uppercase hover:text-red-400 transition-colors disabled:opacity-50">
                  {deletingId === u.id ? 'Excluindo…' : 'Excluir'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
