import { createClient } from '@/lib/supabase/server'
import ProjectActions from '@/components/admin/ProjectActions'

export default async function AdminProjectsPage() {
  const supabase = createClient()

  const { data: projects } = await supabase
    .from('projects')
    .select('*, organization:organizations(name)')
    .order('created_at', { ascending: false })

  const statusColor: Record<string, string> = {
    active:    'bg-sage/15 text-sage',
    paused:    'bg-warm/15 text-warm',
    completed: 'bg-mist/15 text-mist',
  }
  const statusLabel: Record<string, string> = {
    active: 'Ativo', paused: 'Pausado', completed: 'Concluído',
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="font-serif text-3xl font-light text-cream">Projetos</h1>
        <p className="text-cream/40 text-sm mt-1">{projects?.length ?? 0} cadastrados</p>
      </div>

      <div className="bg-[#0d1610] border border-white/[0.06] rounded-xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/[0.06]">
              <th className="text-left text-[10px] tracking-widest uppercase text-cream/30 px-5 py-4">Projeto</th>
              <th className="text-left text-[10px] tracking-widest uppercase text-cream/30 px-5 py-4">Organização</th>
              <th className="text-left text-[10px] tracking-widest uppercase text-cream/30 px-5 py-4">Bioma / País</th>
              <th className="text-left text-[10px] tracking-widest uppercase text-cream/30 px-5 py-4">Meta</th>
              <th className="text-left text-[10px] tracking-widest uppercase text-cream/30 px-5 py-4">Arrecadado</th>
              <th className="text-left text-[10px] tracking-widest uppercase text-cream/30 px-5 py-4">Status</th>
              <th className="text-right text-[10px] tracking-widest uppercase text-cream/30 px-5 py-4">Ações</th>
            </tr>
          </thead>
          <tbody>
            {projects?.map(p => {
              const pct = Math.round((p.raised_amount / p.goal_amount) * 100)
              return (
                <tr key={p.id} className="border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors">
                  <td className="px-5 py-4">
                    <p className="text-cream/85 text-sm font-medium max-w-[200px] truncate">{p.title}</p>
                    <p className="text-cream/30 text-xs">{p.species}</p>
                  </td>
                  <td className="px-5 py-4 text-cream/50 text-sm">
                    {(p.organization as { name: string } | null)?.name ?? '—'}
                  </td>
                  <td className="px-5 py-4">
                    <p className="text-cream/50 text-sm">{p.biome}</p>
                    <p className="text-cream/30 text-xs">{p.country}</p>
                  </td>
                  <td className="px-5 py-4 text-cream/50 text-sm">
                    {p.currency} {Number(p.goal_amount).toLocaleString('pt-BR')}
                  </td>
                  <td className="px-5 py-4">
                    <p className="text-sage text-sm">{pct}%</p>
                    <div className="w-16 h-0.5 bg-white/[0.08] rounded-full mt-1 overflow-hidden">
                      <div className="h-full bg-sage rounded-full" style={{ width: `${Math.min(pct, 100)}%` }} />
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <span className={`text-[9px] tracking-widest uppercase px-2.5 py-1 rounded-full ${statusColor[p.status]}`}>
                      {statusLabel[p.status]}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-right">
                    <ProjectActions id={p.id} status={p.status} slug={p.slug} />
                  </td>
                </tr>
              )
            })}
            {!projects?.length && (
              <tr>
                <td colSpan={7} className="px-5 py-12 text-center text-cream/25 text-sm">
                  Nenhum projeto cadastrado
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}