const STEPS = [
  {
    title:  'Escolha um projeto',
    text:   'Explore organizações verificadas, filtradas por bioma, espécie ou país. Cada ficha traz dados científicos, equipe e histórico em campo.',
    detail: 'Verificação em três níveis: documental, financeira e técnica.',
  },
  {
    title:  'Doe ou patrocine',
    text:   'Doação única ou mensal. Pagamento via Pix, cartão de crédito, débito ou boleto. Taxa zero: 100% vai à organização.*',
    detail: '*Pagamentos processados pela Stripe. Taxas de processamento podem ser aplicáveis.',
  },
  {
    title:  'Acompanhe os resultados',
    text:   'Receba relatórios trimestrais com fotos, dados de monitoramento e métricas de impacto. Cada doação é rastreável.',
    detail: 'Dashboard pessoal com histórico, certificados e doações.',
  },
]

export default function HowItWorks() {
  return (
    <section
      id="como-funciona"
      className="relative overflow-hidden border-t border-b border-forest/10"
      style={{
        // Gradiente claro: pergaminho no topo → creme um tom mais quente embaixo.
        background: 'linear-gradient(to bottom, var(--parchment) 0%, var(--cream) 100%)',
        color:      'var(--forest)',
        padding:    '120px 24px',
      }}
    >
      {/* Anéis topográficos discretos no canto superior direito */}
      <svg
        className="absolute top-0 right-0 pointer-events-none"
        style={{ width: 320, height: 320, opacity: 0.3 }}
        viewBox="0 0 200 200"
        aria-hidden
      >
        {[20, 35, 50, 65, 80, 95, 110].map((r, i) => (
          <circle key={i} cx="200" cy="0" r={r}
                  fill="none" stroke="rgba(26,53,40,0.18)" strokeWidth="0.6" />
        ))}
      </svg>

      <div className="relative z-10 max-w-[1280px] mx-auto">
        {/* Header */}
        <div className="mb-14">
          <p className="font-mono text-[10px] tracking-[0.32em] uppercase mb-3.5"
             style={{ color: 'rgba(196,82,42,0.85)' }}>
            Sobre
          </p>
          <h2 className="font-serif font-light text-forest"
              style={{ fontSize: 'clamp(36px, 5vw, 56px)', lineHeight: 1.1 }}>
            Como funciona
          </h2>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {STEPS.map((s, i) => (
            <div
              key={i}
              className="relative bg-moonstone px-8 py-9 border border-forest/10
                         transition-all duration-300 hover:-translate-y-1"
              style={{ boxShadow: '0 2px 24px rgba(26,53,40,0.05)' }}
            >
              <div
                className="font-serif font-light leading-none select-none"
                style={{ fontSize: 72, color: 'rgba(26,53,40,0.10)' }}
              >
                {String(i + 1).padStart(2, '0')}
              </div>

              <h3 className="font-serif text-forest mt-6 mb-3.5"
                  style={{ fontSize: 22, fontWeight: 400 }}>
                {s.title}
              </h3>

              <p className="text-forest/[0.66] mb-5"
                 style={{ fontSize: 14, lineHeight: 1.75 }}>
                {s.text}
              </p>

              <div className="pt-3.5 border-t border-forest/[0.08] flex gap-2 items-start">
                <span className="text-terra/70 text-xs mt-0.5">→</span>
                <p className="font-mono text-[10px] text-forest/50 leading-[1.6]">
                  {s.detail}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
