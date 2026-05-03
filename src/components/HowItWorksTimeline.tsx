'use client'

import { useEffect, useState } from 'react'
import clsx from 'clsx'

type PersonaId = 'doador' | 'ong' | 'empresa'

const FLOWS: Record<PersonaId, { label: string; sub: string; steps: { title: string; desc: string }[] }> = {
  doador: {
    label: 'Doador individual',
    sub:   'Apoie projetos que você acompanha de perto.',
    steps: [
      { title: 'Cadastre-se',         desc: 'Crie sua conta em segundos com um e-mail. Sem burocracia.' },
      { title: 'Escolha um projeto',  desc: 'Explore organizações verificadas por bioma, espécie ou país.' },
      { title: 'Faça a doação',       desc: 'Pagamento seguro via Stripe. A Fauna não cobra comissão sobre o valor doado.' },
      { title: 'Acompanhe',           desc: 'Receba as atualizações do projeto no seu perfil de doador.' },
    ],
  },
  ong: {
    label: 'ONG / projeto de conservação da fauna',
    sub:   'Receba doações diretas, sem intermediários.',
    steps: [
      { title: 'Cadastre sua ONG',       desc: 'Documentação passa por verificação em três níveis pela equipe Fauna.' },
      { title: 'Cadastre seus projetos', desc: 'Apresente contexto, equipe, metas e o impacto de campo.' },
      { title: 'Receba doações',         desc: 'Doações entram direto na sua conta Stripe Connect — sem repasse.' },
      { title: 'Atualize os doadores',   desc: 'Publique relatórios de campo com fotos, dados e métricas.' },
    ],
  },
  empresa: {
    label: 'Doador institucional',
    sub:   'Patrocine projetos e crie conexões institucionais.',
    steps: [
      { title: 'Escolha um projeto',  desc: 'Selecione a iniciativa de conservação da fauna alinhada à sua marca ou ESG.' },
      { title: 'Envie uma mensagem', desc: 'Conte pra gente o que você busca: patrocínio, parceria, ações conjuntas.' },
      { title: 'Fazemos a conexão',  desc: 'Articulamos a parceria diretamente com a organização responsável.' },
    ],
  },
}

const PERSONA_ORDER: PersonaId[] = ['doador', 'ong', 'empresa']

/* Transparência — info que doador/ONG precisa antes de decidir.
 * Refletir somente o que está confirmado como política da Fauna; texto público,
 * não inventar prazos ou números além do que foi validado. */
const TRANSPARENCY: Record<Exclude<PersonaId, 'empresa'>, { title: string; body: string }[]> = {
  doador: [
    {
      title: 'Para onde vai sua doação',
      body:  'A Fauna não fica com nenhum centavo — sem comissão, sem mensalidade. As taxas de processamento são cobradas pelo Stripe e você pode optar por cobri-las no checkout, para a organização receber o valor cheio.',
    },
    {
      title: 'Doação mensal',
      body:  'Apoie um projeto com um valor recorrente todo mês — é a forma mais útil de sustentar trabalho de campo, equipe e equipamento de longo prazo. Você ajusta, pausa ou cancela a qualquer momento no seu painel.',
    },
  ],
  ong: [
    {
      title: 'A Fauna não cobra nada',
      body:  'Sem comissão sobre doações, sem mensalidade, sem taxa de cadastro. Política permanente. O que entra na sua conta é o valor da doação, descontada apenas a taxa de processamento do Stripe — a mesma de qualquer cartão.',
    },
    {
      title: 'Verificação em até 48h',
      body:  'Análise de documentos (CNPJ, estatuto, OSCIP/CEBAS quando houver) e checagem do trabalho de campo. Em média, a equipe Fauna responde em dois dias úteis após o envio do cadastro.',
    },
    {
      title: 'Repasse direto via Stripe',
      body:  'As doações entram na conta Stripe Connect da sua organização — a Fauna não intermedia o dinheiro em nenhum momento. Saque em conta bancária pelos prazos padrão do Stripe Brasil.',
    },
  ],
}

export default function HowItWorksTimeline() {
  const [persona, setPersona] = useState<PersonaId>('doador')

  useEffect(() => {
    const saved = (typeof window !== 'undefined' && localStorage.getItem('fauna_audience')) as PersonaId | null
    if (saved && PERSONA_ORDER.includes(saved)) setPersona(saved)

    function onChange(e: Event) {
      const id = (e as CustomEvent<PersonaId>).detail
      if (id && PERSONA_ORDER.includes(id)) setPersona(id)
    }
    window.addEventListener('fauna:audience-changed', onChange)
    return () => window.removeEventListener('fauna:audience-changed', onChange)
  }, [])

  const flow = FLOWS[persona]
  const cols = flow.steps.length === 3 ? 'md:grid-cols-3' : 'md:grid-cols-4'

  return (
    <section
      className="relative overflow-hidden"
      style={{ padding: '160px 24px', background: '#F5F5F5' }}
    >
      <div className="relative z-[2] max-w-[1280px] mx-auto">
        {/* Header — maior */}
        <div className="mb-14">
          <p className="font-mono uppercase tracking-[0.32em] text-terra mb-5"
             style={{ fontSize: 12 }}>
            Como funciona
          </p>
          <h2
            className="font-sans text-forest font-light leading-[1.05]"
            style={{ fontSize: 'clamp(44px, 6vw, 80px)' }}
          >
            Três caminhos para apoiar conservação da fauna
          </h2>
        </div>

        {/* Label de instrução — deixa explícito que as tabs são uma escolha */}
        <p
          className="font-sans text-forest/70 mb-5"
          style={{ fontSize: 'clamp(18px, 1.5vw, 22px)' }}
        >
          Eu sou…
        </p>

        {/* Tabs por perfil — três pílulas independentes */}
        <div className="relative z-10 flex flex-wrap gap-3 mb-12">
          {PERSONA_ORDER.map(id => (
            <button
              key={id}
              type="button"
              onClick={() => setPersona(id)}
              aria-pressed={persona === id}
              className={clsx(
                'relative z-10 cursor-pointer font-mono tracking-[0.18em] uppercase px-7 py-4 rounded-[8px] transition-all',
                persona === id
                  ? 'bg-terra text-cream'
                  : 'bg-forest text-cream/90 hover:text-cream hover:bg-forest/90 ring-1 ring-cream/30 hover:ring-cream/55',
              )}
              style={{
                fontSize: 15,
                boxShadow: persona === id
                  ? '0 4px 18px rgba(196,82,42,0.45)'
                  : '0 2px 10px rgba(26,53,40,0.18)',
              }}
            >
              {FLOWS[id].label}
            </button>
          ))}
        </div>

        {/* Sub-frase do perfil */}
        <p className="font-sans text-forest/75 mb-20 max-w-[680px]"
           style={{ fontSize: 'clamp(20px, 2vw, 26px)' }}>
          {flow.sub}
        </p>

        {/* Timeline com círculos de vidro */}
        <div className="relative">
          {/* Linha conectora horizontal — alinhada ao centro das bolinhas pequenas */}
          <div
            className="absolute left-[12%] right-[12%] h-px bg-forest/20 hidden md:block"
            style={{ top: 17 }}
            aria-hidden
          />

          <div className={clsx('grid grid-cols-1 gap-y-16 md:gap-x-6 relative', cols)}>
            {flow.steps.map((s, i) => (
              <div key={i} className="flex flex-col items-center text-center">

                {/* Bola pequena numerada (no topo da coluna) */}
                <div
                  className="relative z-[2] w-9 h-9 rounded-full flex items-center justify-center
                             font-mono text-cream"
                  style={{
                    background: 'var(--terra)',
                    fontSize:   13,
                    boxShadow:  '0 0 0 6px #F5F5F5, 0 4px 16px rgba(196,82,42,0.4)',
                  }}
                >
                  {i + 1}
                </div>

                {/* Linha vertical conectando bola → círculo grande */}
                <div className="w-px h-12 bg-forest/20" aria-hidden />

                {/* CÍRCULO GRANDE em verde forest sólido — fundo branco
                   precisa de cor cheia (translúcido vira cinza). */}
                <div
                  className="aspect-square w-full max-w-[260px] rounded-full
                             flex items-center justify-center transition-all duration-500
                             hover:scale-[1.02]"
                  style={{
                    background: 'var(--forest)',
                    border:     '1px solid rgba(237, 229, 208, 0.28)',
                    boxShadow:  `
                      inset 0 1px 0 rgba(255,255,255,0.12),
                      inset 0 -1px 0 rgba(0,0,0,0.25),
                      0 12px 36px rgba(26,53,40,0.25)
                    `,
                  }}
                >
                  <span
                    className="font-sans text-cream font-light px-6 leading-[1.15]"
                    style={{
                      fontSize:   'clamp(22px, 2.4vw, 32px)',
                      textShadow: '0 2px 12px rgba(0,0,0,0.5)',
                    }}
                  >
                    {s.title}
                  </span>
                </div>

                {/* Linha vertical descendente + ponto */}
                <div className="w-px h-8 bg-forest/20" aria-hidden />
                <span
                  className="block w-2 h-2 rounded-full border border-forest/35 -mt-1 mb-4"
                  style={{ background: 'rgba(26,53,40,0.15)' }}
                  aria-hidden
                />

                {/* Descrição */}
                <p
                  className="text-forest/75 max-w-[280px] leading-[1.65]"
                  style={{ fontSize: 16 }}
                >
                  {s.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Bloco Transparência — só doador / ong; empresa não tem equivalente. */}
        {persona !== 'empresa' && (
          <div className="mt-28 pt-14">
            <p
              className="font-mono uppercase tracking-[0.32em] text-terra mb-10"
              style={{ fontSize: 11 }}
            >
              Transparência · {persona === 'doador' ? 'Doador individual' : 'Organização'}
            </p>

            <div
              className={clsx(
                'grid grid-cols-1 gap-x-12 gap-y-12',
                TRANSPARENCY[persona].length === 2 ? 'md:grid-cols-2' : 'md:grid-cols-3',
              )}
            >
              {TRANSPARENCY[persona].map((item, i) => (
                <div key={item.title} className="flex flex-col">
                  <div
                    className="font-mono text-[10px] tracking-[0.28em] uppercase text-forest/45 mb-4"
                  >
                    {String(i + 1).padStart(2, '0')}
                  </div>
                  <h3
                    className="font-sans text-forest font-light leading-[1.2] mb-4"
                    style={{ fontSize: 'clamp(22px, 2vw, 26px)' }}
                  >
                    {item.title}
                  </h3>
                  <p
                    className="text-forest/75 leading-[1.65]"
                    style={{ fontSize: 15 }}
                  >
                    {item.body}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
