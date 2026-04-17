import { createClient } from '@/lib/supabase/server'
import OrgActions from '@/components/admin/OrgActions'

export default async function AdminOrganizationsPage() {
  const supabase = createClient()

  const { data: orgs } = await supabase
    .from('organizations')
    .select('*, projects(count)')
    .order('created_at', { ascending: false })

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="font-serif text-3xl font-light text-cream">Organizações</h1>
        <p className="text-cream/40 text-sm mt-1">{orgs?.length ?? 0} cadastradas</p>
      </div>

      <div className="bg-[#0d1610] border border-white/[0.06] rounded-xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/[0.06]">
              <th className="text-left text-[10px] tracking-widest uppercase text-cream/30 px-5 py-4">Organização</th>
              <th className="text-left text-[10px] tracking-widest uppercase text-cream/30 px-5 py-4">País</th>
              <th className="text-left text-[10px] tracking-widest uppercase text-cream/30 px-5 py-4">Projetos</th>
              <th className="text-left text-[10px] tracking-widest uppercase text-cream/30 px-5 py-4">Status</th>
              <th className="text-left text-[10px] tracking-widest uppercase text-cream/30 px-5 py-4">Cadastro</th>
              <th className="text-right text-[10px] tracking-widest uppercase text-cream/30 px-5 py-4">Ações</th>
            </tr>
          </thead>
          <tbody>
            {orgs?.map(org => (
              <tr key={org.id} className="border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors">
                <td className="px-5 py-4">
                  <p className="text-cream/85 text-sm font-medium">{org.name}</p>
                  {org.website && (
                    <a href={org.website} target="_blank" className="text-sage/60 text-xs hover:text-sage truncate block max-w-[180px]">
                      {org.website.replace('https://', '')}
                    </a>
                  )}
                </td>
                <td className="px-5 py-4 text-cream/50 text-sm">{org.country}</td>
                <td className="px-5 py-4 text-cream/50 text-sm">
                  {(org.projects as unknown as { count: number }[])?.[0]?.count ?? 0}
                </td>
                <td className="px-5 py-4">
                  <span className={`text-[9px] tracking-widest uppercase px-2.5 py-1 rounded-full ${org.verified ? 'bg-sage/15 text-sage' : 'bg-warm/15 text-warm'}`}>
                    {org.verified ? 'Verificada' : 'Pendente'}
                  </span>
                </td>
                <td className="px-5 py-4 text-cream/35 text-xs">
                  {new Date(org.created_at).toLocaleDateString('pt-BR')}
                </td>
                <td className="px-5 py-4 text-right">
                  <OrgActions id={org.id} verified={org.verified} />
                </td>
              </tr>
            ))}
            {!orgs?.length && (
              <tr>
                <td colSpan={6} className="px-5 py-12 text-center text-cream/25 text-sm">
                  Nenhuma organização cadastrada
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}