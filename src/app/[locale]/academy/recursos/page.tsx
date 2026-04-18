import Link from 'next/link'
import Nav from '@/components/layout/Nav'
import { NavTheme } from '@/components/layout/NavTheme'

type ResourceType = 'template' | 'guia' | 'checklist' | 'planilha' | 'ebook'

const TYPE_LABELS: Record<ResourceType, string> = {
  template:  'Template',
  guia:      'Guia',
  checklist: 'Checklist',
  planilha:  'Planilha',
  ebook:     'E-book',
}

const TYPE_COLORS: Record<ResourceType, string> = {
  template:  'bg-blue-50 text-blue-700 border-blue-200',
  guia:      'bg-leaf/10 text-leaf border-leaf/25',
  checklist: 'bg-amber-50 text-amber-700 border-amber-200',
  planilha:  'bg-purple-50 text-purple-700 border-purple-200',
  ebook:     'bg-forest/8 text-forest border-forest/20',
}

const RESOURCES = [
  {
    type: 'template' as ResourceType,
    title: 'Template: Email de Captação',
    description: 'Estrutura de email para primeira abordagem a novos doadores. Inclui 3 variações por perfil.',
    downloads: 1240,
    new: false,
  },
  {
    type: 'guia' as ResourceType,
    title: 'Guia: Como Escrever um Projeto para Editais',
    description: 'Passo a passo completo com exemplos reais de projetos aprovados em fundações nacionais e internacionais.',
    downloads: 2180,
    new: false,
  },
  {
    type: 'checklist' as ResourceType,
    title: 'Checklist: Lançamento de Campanha',
    description: '47 pontos de verificação antes de lançar qualquer campanha de captação. Nunca esqueça nada importante.',
    downloads: 890,
    new: true,
  },
  {
    type: 'planilha' as ResourceType,
    title: 'Planilha: Gestão de Doadores',
    description: 'Controle todos os seus doadores, histórico de doações, próximos passos e lembretes de contato.',
    downloads: 1650,
    new: false,
  },
  {
    type: 'ebook' as ResourceType,
    title: 'E-book: 50 Ideias de Captação para Conservação',
    description: 'Coletânea de estratégias testadas por organizações de conservação ao redor do mundo. 68 páginas.',
    downloads: 3400,
    new: false,
  },
  {
    type: 'template' as ResourceType,
    title: 'Template: Relatório de Impacto Anual',
    description: 'Layout editável em Canva para seu relatório anual. Profissional e fácil de preencher.',
    downloads: 780,
    new: true,
  },
  {
    type: 'guia' as ResourceType,
    title: 'Guia: Doação Recorrente — Como Ativar',
    description: 'Como estruturar, comunicar e manter um programa de doação mensal na sua organização.',
    downloads: 1100,
    new: false,
  },
  {
    type: 'checklist' as ResourceType,
    title: 'Checklist: Verificação de Documentos para Cadastro',
    description: 'Lista completa de documentos necessários para cadastrar sua organização em plataformas de captação.',
    downloads: 560,
    new: true,
  },
  {
    type: 'planilha' as ResourceType,
    title: 'Planilha: Orçamento de Projeto de Conservação',
    description: 'Modelo de orçamento detalhado para projetos de campo, com categorias pré-definidas e fórmulas automáticas.',
    downloads: 920,
    new: false,
  },
]

export default function RecursosPage() {
  return (
    <NavTheme theme="light">
      <main className="min-h-screen bg-[#f5f4f0]">
        <Nav />

        {/* Header */}
        <section className="bg-forest pt-40 pb-16 px-10">
          <div className="max-w-screen-lg mx-auto">
            <p className="text-sage/60 text-[10px] tracking-[0.25em] uppercase mb-4">
              <Link href="/academy" className="hover:text-sage">Academy</Link> / Recursos
            </p>
            <h1 className="font-serif text-5xl font-light text-cream mb-4">
              Biblioteca <em className="italic text-sage">gratuita</em>
            </h1>
            <p className="text-cream/45 text-base max-w-lg">
              Templates, guias, planilhas e materiais prontos para baixar e usar na sua organização — sem custo.
            </p>
          </div>
        </section>

        {/* Filters */}
        <div className="px-10 pt-10 pb-2 max-w-screen-lg mx-auto">
          <div className="flex flex-wrap gap-2">
            {(['todos', ...Object.keys(TYPE_LABELS)] as const).map(t => (
              <span key={t}
                    className="text-[10px] tracking-widests uppercase px-4 py-2 rounded-full border
                               bg-white border-forest/15 text-forest/50 cursor-pointer
                               hover:border-forest/35 hover:text-forest transition-colors">
                {t === 'todos' ? 'Todos' : TYPE_LABELS[t as ResourceType]}
              </span>
            ))}
          </div>
        </div>

        {/* Grid */}
        <section className="px-10 py-10 max-w-screen-lg mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {RESOURCES.map((r, i) => (
              <div key={i}
                   className="group bg-white border border-forest/[0.08] rounded-2xl p-7 shadow-sm
                              hover:shadow-md hover:-translate-y-0.5 transition-all duration-300
                              flex flex-col">
                <div className="flex items-start justify-between mb-5">
                  <span className={`text-[9px] tracking-widests uppercase px-2.5 py-1 rounded-full border ${TYPE_COLORS[r.type]}`}>
                    {TYPE_LABELS[r.type]}
                  </span>
                  {r.new && (
                    <span className="text-[9px] tracking-widests uppercase text-sage bg-sage/10 px-2.5 py-1 rounded-full">
                      Novo
                    </span>
                  )}
                </div>

                <h3 className="font-serif text-lg font-light text-forest mb-2 leading-snug group-hover:text-leaf transition-colors flex-1">
                  {r.title}
                </h3>
                <p className="text-forest/50 text-sm leading-relaxed mb-5">
                  {r.description}
                </p>

                <div className="flex items-center justify-between mt-auto pt-4 border-t border-forest/[0.06]">
                  <span className="text-forest/30 text-[11px]">
                    {r.downloads.toLocaleString('pt-BR')} downloads
                  </span>
                  <button className="flex items-center gap-1.5 text-leaf text-[10px] tracking-widests uppercase
                                     hover:gap-2.5 transition-all group-hover:text-forest">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                      <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/>
                      <polyline points="7 10 12 15 17 10"/>
                      <line x1="12" y1="15" x2="12" y2="3"/>
                    </svg>
                    Baixar grátis
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="px-10 pb-24 max-w-screen-lg mx-auto">
          <div className="bg-forest rounded-2xl px-10 py-12 text-center">
            <p className="text-sage/70 text-[10px] tracking-[0.2em] uppercase mb-3">Quer aprender mais?</p>
            <h2 className="font-serif text-3xl font-light text-cream mb-4">
              Explore os cursos completos
            </h2>
            <p className="text-cream/40 text-sm mb-8 max-w-md mx-auto">
              Os recursos são um ponto de partida. Nos cursos você aprende com profundidade e recebe certificado.
            </p>
            <Link href="/academy/cursos"
                  className="bg-sage text-cream text-[10px] tracking-widests uppercase px-8 py-3.5 rounded-sm
                             hover:bg-leaf transition-colors">
              Ver todos os cursos →
            </Link>
          </div>
        </section>
      </main>
    </NavTheme>
  )
}
