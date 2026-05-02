type Props = {
  projectCount: number
  totalRaised: number
  /** Países distintos onde há projetos. Se não passar, mostra valor fixo do dossiê. */
  countries?: number
  /** Quantidade de apoiadores únicos. Se não passar, mostra valor fixo do dossiê. */
  supporters?: number
}

function formatRaised(amount: number): string {
  if (amount >= 1_000_000) return `R$ ${(amount / 1_000_000).toFixed(1)}M`
  if (amount >= 1_000)     return `R$ ${(amount / 1_000).toFixed(1)}k`
  return `R$ ${amount.toFixed(0)}`
}

export default function StatsBar({ projectCount, totalRaised, countries = 68, supporters = 19_400 }: Props) {
  const stats = [
    { n: String(projectCount ?? 247),                        l: 'Projetos ativos', sub: 'verificados em campo'  },
    { n: String(countries),                                   l: 'Países',          sub: 'todos os continentes'  },
    { n: formatRaised(totalRaised),                           l: 'Arrecadados',     sub: 'direto às organizações' },
    { n: supporters >= 1000 ? `${(supporters / 1000).toFixed(1).replace('.', ',')}k` : String(supporters),
      l: 'Apoiadores',     sub: 'e crescendo' },
  ]

  return (
    <section
      className="relative"
      style={{ background: '#F5F5F5', padding: '120px 24px' }}
    >
      <div className="max-w-[1280px] mx-auto">
        {/* Header — eyebrow + título à esquerda, "Relatório 2026" à direita */}
        <div className="flex flex-wrap items-baseline justify-between gap-4 mb-14">
          <div>
            <p className="eyebrow mb-3.5">A Fauna em números</p>
            <h2 className="font-serif text-forest font-light leading-[1.1]"
                style={{ fontSize: 'clamp(48px, 6.5vw, 88px)' }}>
              Impacto
            </h2>
          </div>
          <div className="text-right font-mono text-[10px] tracking-[0.3em] uppercase text-forest/55">
            Relatório 2026<br/>
            <span className="text-sage">● dados atualizados</span>
          </div>
        </div>

        {/* Grid 4 colunas — divisores sutis, sem card */}
        <div className="grid grid-cols-2 md:grid-cols-4 mt-8">
          {stats.map((s, i) => (
            <div
              key={s.l}
              className="px-7 pt-9 pb-8 relative"
              style={{
                borderRight: i < stats.length - 1 ? '1px solid rgba(26,53,40,0.10)' : 'none',
              }}
            >
              <div
                className="font-serif text-forest font-light leading-none mb-5"
                style={{
                  fontSize:      'clamp(64px, 7.5vw, 112px)',
                  letterSpacing: '-0.02em',
                }}
              >
                {s.n}
              </div>
              <div className="font-mono text-[12px] tracking-[0.22em] uppercase text-forest mb-2">
                {s.l}
              </div>
              <div className="text-sm text-forest/60">
                {s.sub}
              </div>
            </div>
          ))}
        </div>

        {/* Caption inferior */}
        <div className="mt-12 pt-6 flex justify-end font-mono text-[9px] tracking-[0.28em] uppercase text-forest/45">
          Dados atualizados a cada 24h
        </div>
      </div>
    </section>
  )
}
