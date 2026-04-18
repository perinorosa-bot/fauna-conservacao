import { createClient } from '@/lib/supabase/server'

export default async function AdminDonationsPage() {
  const supabase = createClient()

  const { data: donations } = await supabase
    .from('donations')
    .select('*, project:projects(title)')
    .order('created_at', { ascending: false })
    .limit(100)

  const total = donations?.reduce((s, d) => s + Number(d.amount), 0) ?? 0

  return (
    <div className="p-8">
      <div className="mb-8 flex items-end justify-between">
        <div>
          <h1 className="font-serif text-3xl font-light text-cream">Doações</h1>
          <p className="text-cream/40 text-sm mt-1">{donations?.length ?? 0} registradas</p>
        </div>
        <div className="text-right">
          <p className="text-cream/40 text-xs tracking-widest uppercase mb-1">Total arrecadado</p>
          <p className="font-serif text-3xl font-light text-sage">
            R$ {total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </p>
        </div>
      </div>

      <div className="bg-[#0d1610] border border-white/[0.06] rounded-xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/[0.06]">
              <th className="text-left text-[10px] tracking-widest uppercase text-cream/30 px-5 py-4">Doador</th>
              <th className="text-left text-[10px] tracking-widest uppercase text-cream/30 px-5 py-4">E-mail</th>
              <th className="text-left text-[10px] tracking-widest uppercase text-cream/30 px-5 py-4">Projeto</th>
              <th className="text-left text-[10px] tracking-widest uppercase text-cream/30 px-5 py-4">Valor</th>
              <th className="text-left text-[10px] tracking-widest uppercase text-cream/30 px-5 py-4">Mensagem</th>
              <th className="text-left text-[10px] tracking-widest uppercase text-cream/30 px-5 py-4">Data</th>
            </tr>
          </thead>
          <tbody>
            {donations?.map(d => (
              <tr key={d.id} className="border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors">
                <td className="px-5 py-4">
                  <p className="text-cream/85 text-sm">{d.donor_name}</p>
                  {d.anonymous && <span className="text-[9px] text-warm/60 tracking-wide">Anônimo</span>}
                </td>
                <td className="px-5 py-4 text-cream/40 text-xs">{d.donor_email}</td>
                <td className="px-5 py-4 text-cream/50 text-sm max-w-[180px]">
                  <span className="truncate block">{(d.project as { title: string } | null)?.title ?? '—'}</span>
                </td>
                <td className="px-5 py-4">
                  <span className="text-sage text-sm font-medium">
                    {d.currency} {Number(d.amount).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </span>
                </td>
                <td className="px-5 py-4 text-cream/35 text-xs max-w-[160px]">
                  <span className="truncate block">{d.message ?? '—'}</span>
                </td>
                <td className="px-5 py-4 text-cream/35 text-xs whitespace-nowrap">
                  {new Date(d.created_at).toLocaleDateString('pt-BR')}
                </td>
              </tr>
            ))}
            {!donations?.length && (
              <tr>
                <td colSpan={6} className="px-5 py-12 text-center text-cream/25 text-sm">
                  Nenhuma doação registrada
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}