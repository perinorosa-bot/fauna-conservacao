import { createClient } from '@/lib/supabase/server'
import UpdateActions from '@/components/admin/UpdateActions'

export default async function AdminUpdatesPage() {
  const supabase = createClient()

  const { data: updates } = await supabase
    .from('updates')
    .select('*, project:projects(title, organization:organizations(name))')
    .order('created_at', { ascending: false })
    .limit(100)

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="font-serif text-3xl font-light text-cream">Atualizações do feed</h1>
        <p className="text-cream/40 text-sm mt-1">{updates?.length ?? 0} publicadas</p>
      </div>

      <div className="flex flex-col gap-4">
        {updates?.map(u => {
          const project  = u.project as { title: string; organization: { name: string } | null } | null
          return (
            <div key={u.id} className="bg-[#0d1610] border border-white/[0.06] rounded-xl p-5 flex gap-5">
              {/* Thumbnail */}
              {u.image_url && (
                <img
                  src={u.image_url}
                  alt={u.title}
                  className="w-20 h-20 object-cover rounded-lg flex-shrink-0 brightness-75"
                />
              )}

              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-4 mb-2">
                  <div>
                    <p className="text-cream/85 text-sm font-medium">{u.title}</p>
                    <p className="text-cream/35 text-xs mt-0.5">
                      {project?.organization?.name ?? '—'} · {project?.title ?? '—'} · por {u.author_name}
                    </p>
                  </div>
                  <p className="text-cream/25 text-xs whitespace-nowrap flex-shrink-0">
                    {new Date(u.created_at).toLocaleDateString('pt-BR')}
                  </p>
                </div>
                <p className="text-cream/40 text-sm leading-relaxed line-clamp-2 mb-3">{u.content}</p>
                <UpdateActions id={u.id} />
              </div>
            </div>
          )
        })}
        {!updates?.length && (
          <div className="bg-[#0d1610] border border-white/[0.06] rounded-xl px-5 py-12 text-center">
            <p className="text-cream/25 text-sm">Nenhuma atualização publicada</p>
          </div>
        )}
      </div>
    </div>
  )
}