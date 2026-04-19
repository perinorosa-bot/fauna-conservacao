import { Link } from '@/i18n/navigation'
import Nav from '@/components/layout/Nav'
import { NavTheme } from '@/components/layout/NavTheme'
import { getTranslations } from 'next-intl/server'

// Level keys map to i18n labels. Titles/topics remain as fixture data (pt) —
// real catalog should come from DB eventually.
type LevelKey = 'beginner' | 'intermediate' | 'advanced'

type Course = {
  slug: string
  title: string
  description: string
  levelKey: LevelKey
  duration: string
  modules: number
  price: number
  tagKey: 'free' | 'mostPopular' | 'new' | null
  topics: string[]
}

const COURSES: Course[] = [
  {
    slug: 'captacao-recursos-iniciantes',
    title: 'Captação de Recursos para Iniciantes',
    description: 'Do zero ao primeiro doador. Aprenda os fundamentos de captação, as principais modalidades e como estruturar sua primeira campanha.',
    levelKey: 'beginner',
    duration: '4h',
    modules: 8,
    price: 0,
    tagKey: 'mostPopular',
    topics: ['Fundamentos de captação', 'Perfil do doador', 'Primeira campanha', 'Métricas básicas'],
  },
  {
    slug: 'narrativa-impacto',
    title: 'Narrativa de Impacto para Doadores',
    description: 'Aprenda a contar histórias que movem pessoas. Como transformar dados científicos em narrativas emocionais que convertem.',
    levelKey: 'intermediate',
    duration: '6h',
    modules: 10,
    price: 197,
    tagKey: null,
    topics: ['Storytelling para conservação', 'Fotos e vídeos de impacto', 'Relatórios para doadores', 'Email marketing'],
  },
  {
    slug: 'grandes-doacoes',
    title: 'Estratégias para Grandes Doações',
    description: 'Como identificar, abordar e cultivar relacionamentos com grandes doadores, fundações e financiadores institucionais.',
    levelKey: 'advanced',
    duration: '8h',
    modules: 12,
    price: 297,
    tagKey: 'new',
    topics: ['Major donors', 'Fundações e editais', 'Reuniões de captação', 'Cultivo de relacionamento'],
  },
  {
    slug: 'plataformas-digitais',
    title: 'Captação Digital e Plataformas Online',
    description: 'Use a internet a favor do seu projeto. Redes sociais, crowdfunding, doação recorrente e otimização de páginas de captação.',
    levelKey: 'beginner',
    duration: '5h',
    modules: 9,
    price: 147,
    tagKey: null,
    topics: ['Redes sociais para captação', 'Crowdfunding', 'Página de projeto', 'Doação recorrente'],
  },
  {
    slug: 'editais-grants',
    title: 'Como Escrever Projetos para Editais e Grants',
    description: 'Estrutura, linguagem e estratégia para escrever projetos competitivos para editais nacionais e internacionais.',
    levelKey: 'intermediate',
    duration: '7h',
    modules: 11,
    price: 247,
    tagKey: null,
    topics: ['Busca de editais', 'Estrutura do projeto', 'Orçamento e cronograma', 'Avaliação de impacto'],
  },
  {
    slug: 'comunicacao-organizacao',
    title: 'Comunicação Estratégica para Organizações',
    description: 'Como construir uma identidade de marca forte, posicionar sua organização e comunicar com diferentes públicos.',
    levelKey: 'intermediate',
    duration: '5h',
    modules: 8,
    price: 0,
    tagKey: 'free',
    topics: ['Branding para ONGs', 'Mensagem central', 'Públicos-alvo', 'Materiais de comunicação'],
  },
]

const LEVEL_COLORS: Record<LevelKey, string> = {
  beginner:     'text-leaf bg-leaf/10 border-leaf/20',
  intermediate: 'text-amber-600 bg-amber-50 border-amber-200',
  advanced:     'text-forest bg-forest/8 border-forest/15',
}

export default async function CursosPage() {
  const t = await getTranslations('academy.courses')

  const tagLabel = (key: Course['tagKey']) => {
    if (!key) return null
    if (key === 'free') return t('tagFree')
    if (key === 'mostPopular') return t('tagMostPopular')
    return t('tagNew')
  }

  return (
    <NavTheme theme="light">
      <main className="min-h-screen bg-[#f5f4f0]">
        <Nav />

        {/* Header */}
        <section className="bg-forest pt-40 pb-16 px-10">
          <div className="max-w-screen-lg mx-auto">
            <p className="text-sage/60 text-[10px] tracking-[0.25em] uppercase mb-4">
              <Link href="/academy" className="hover:text-sage transition-colors">{t('breadcrumb')}</Link>
              {' '}/{' '}{t('breadcrumbCurrent')}
            </p>
            <h1 className="font-serif text-5xl font-light text-cream mb-4">
              {t('titleBefore')}<em className="italic text-sage">{t('titleEm')}</em>
            </h1>
            <p className="text-cream/45 text-base max-w-lg">
              {t('subtitle', { count: COURSES.length })}
            </p>
          </div>
        </section>

        {/* Grid */}
        <section className="px-10 py-14 max-w-screen-lg mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {COURSES.map(c => {
              const levelLabel = t(`levels.${c.levelKey}`)
              const tag = tagLabel(c.tagKey)
              return (
              <Link key={c.slug} href={`/academy/cursos/${c.slug}`}
                    className="group bg-white border border-forest/[0.08] rounded-2xl overflow-hidden
                               hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 flex flex-col">
                {/* card top */}
                <div className="h-40 bg-gradient-to-br from-forest to-canopy relative flex flex-col justify-between p-5">
                  {tag && (
                    <span className={`self-start text-[9px] tracking-widests uppercase px-2.5 py-1 rounded-full ${
                      c.tagKey === 'free' ? 'bg-leaf text-cream' : 'bg-sage text-cream'
                    }`}>
                      {tag}
                    </span>
                  )}
                  {!tag && <div />}
                  <span className={`self-start text-[9px] tracking-widests uppercase px-2.5 py-1 rounded-full border ${LEVEL_COLORS[c.levelKey]}`}>
                    {levelLabel}
                  </span>
                </div>

                {/* body */}
                <div className="p-6 flex flex-col flex-1">
                  <h3 className="font-serif text-lg font-light text-forest leading-snug mb-2 group-hover:text-leaf transition-colors">
                    {c.title}
                  </h3>
                  <p className="text-forest/50 text-sm leading-relaxed mb-5 flex-1">
                    {c.description}
                  </p>

                  {/* topics */}
                  <div className="flex flex-wrap gap-1.5 mb-5">
                    {c.topics.map(topic => (
                      <span key={topic} className="text-[10px] text-forest/45 bg-forest/[0.05] px-2 py-0.5 rounded-full">
                        {topic}
                      </span>
                    ))}
                  </div>

                  {/* footer */}
                  <div className="flex items-center justify-between border-t border-forest/[0.07] pt-4">
                    <div className="flex items-center gap-3">
                      <span className="text-forest/35 text-[11px]">{c.duration}</span>
                      <span className="text-forest/20">·</span>
                      <span className="text-forest/35 text-[11px]">{c.modules} {t('modulesSuffix')}</span>
                    </div>
                    <span className={`text-base font-medium font-serif ${c.price === 0 ? 'text-leaf' : 'text-forest'}`}>
                      {c.price === 0 ? t('priceFree') : `R$ ${c.price}`}
                    </span>
                  </div>
                </div>
              </Link>
              )
            })}
          </div>
        </section>
      </main>
    </NavTheme>
  )
}
