import { Link } from '@/i18n/navigation'
import Nav from '@/components/layout/Nav'
import { NavTheme } from '@/components/layout/NavTheme'
import { getTranslations } from 'next-intl/server'

// Workshops are fixture data — title/description stay in pt until a real DB wires up.
type LevelKey = 'beginner' | 'intermediate' | 'advanced'

type Workshop = {
  id: string
  title: string
  date: string
  time: string
  duration: string
  host: string
  spots: number
  totalSpots: number
  price: number
  levelKey: LevelKey
  description: string
  topics: string[]
  past: boolean
}

const WORKSHOPS: Workshop[] = [
  {
    id: 'w1',
    title: 'Como montar sua primeira campanha de captação',
    date: '29 de abril de 2026',
    time: '19h – 21h (Brasília)',
    duration: '2h',
    host: 'Equipe Fauna Academy',
    spots: 32,
    totalSpots: 80,
    price: 0,
    levelKey: 'beginner',
    description: 'Workshop prático em que vamos construir juntos uma mini-campanha do zero. Você sai com um rascunho real para implementar.',
    topics: ['Definição de meta', 'Mensagem da campanha', 'Canais de distribuição', 'Cronograma prático'],
    past: false,
  },
  {
    id: 'w2',
    title: 'Storytelling para Relatórios de Impacto',
    date: '14 de maio de 2026',
    time: '19h – 21h (Brasília)',
    duration: '2h',
    host: 'Equipe Fauna Academy',
    spots: 48,
    totalSpots: 80,
    price: 97,
    levelKey: 'intermediate',
    description: 'Como estruturar relatórios de impacto que doadores realmente leem — e que geram renovações de doação.',
    topics: ['Estrutura do relatório', 'Dados + emoção', 'Design simples', 'Distribuição e follow-up'],
    past: false,
  },
  {
    id: 'w3',
    title: 'Abordagem e Reunião com Grandes Doadores',
    date: '4 de junho de 2026',
    time: '19h – 21h (Brasília)',
    duration: '2h',
    host: 'Equipe Fauna Academy',
    spots: 15,
    totalSpots: 40,
    price: 147,
    levelKey: 'advanced',
    description: 'Simulações de reuniões de captação com feedback ao vivo. Aprenda a pedir a doação sem desconforto.',
    topics: ['Pesquisa pré-reunião', 'Script de abordagem', 'Como pedir', 'Roleplay e feedback'],
    past: false,
  },
  {
    id: 'w4',
    title: 'Email Marketing para Captação',
    date: '12 de março de 2026',
    time: '19h – 21h (Brasília)',
    duration: '2h',
    host: 'Equipe Fauna Academy',
    spots: 0,
    totalSpots: 80,
    price: 0,
    levelKey: 'beginner',
    description: 'Sequências de email para nutrição e captação. Como escrever assuntos que abrem e conteúdo que converte.',
    topics: ['Sequência de boas-vindas', 'Newsletter mensal', 'Email de captação', 'Análise de métricas'],
    past: true,
  },
]

const LEVEL_COLORS: Record<LevelKey, string> = {
  beginner:     'text-leaf bg-leaf/10 border-leaf/25',
  intermediate: 'text-amber-700 bg-amber-50 border-amber-200',
  advanced:     'text-forest bg-forest/8 border-forest/20',
}

export default async function WorkshopsPage() {
  const t = await getTranslations('academy.workshops')
  const upcoming = WORKSHOPS.filter(w => !w.past)
  const past     = WORKSHOPS.filter(w => w.past)

  return (
    <NavTheme theme="light">
      <main className="min-h-screen bg-[#f5f4f0]">
        <Nav />

        {/* Header */}
        <section className="bg-forest pt-40 pb-16 px-10">
          <div className="max-w-screen-lg mx-auto">
            <p className="text-sage/60 text-[10px] tracking-[0.25em] uppercase mb-4">
              <Link href="/academy" className="hover:text-sage">{t('breadcrumb')}</Link> / {t('breadcrumbCurrent')}
            </p>
            <h1 className="font-serif text-5xl font-light text-cream mb-4">
              {t('titleBefore')}<em className="italic text-sage">{t('titleEm')}</em>
            </h1>
            <p className="text-cream/45 text-base max-w-lg">
              {t('subtitle')}
            </p>
          </div>
        </section>

        {/* Upcoming */}
        <section className="px-10 py-14 max-w-screen-lg mx-auto">
          <h2 className="font-serif text-2xl font-light text-forest mb-8">{t('upcoming')}</h2>

          <div className="flex flex-col gap-5">
            {upcoming.map(w => {
              const pct = Math.round(((w.totalSpots - w.spots) / w.totalSpots) * 100)
              const urgent = w.spots < 20
              const levelLabel = t(`levels.${w.levelKey}`)

              return (
                <div key={w.id}
                     className="bg-white border border-forest/[0.08] rounded-2xl p-8 flex flex-col md:flex-row gap-8 shadow-sm">
                  {/* Date block */}
                  <div className="flex-shrink-0 w-20 text-center">
                    <div className="bg-forest rounded-xl p-3">
                      <p className="text-sage text-[10px] tracking-widests uppercase">
                        {w.date.split(' ')[2]}
                      </p>
                      <p className="font-serif text-3xl font-light text-cream leading-none my-1">
                        {w.date.split(' ')[0]}
                      </p>
                      <p className="text-cream/50 text-[11px]">
                        {w.date.split(' ')[1].replace('de', '')}
                      </p>
                    </div>
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap gap-2 mb-3">
                      <span className={`text-[9px] tracking-widests uppercase px-2.5 py-1 rounded-full border ${LEVEL_COLORS[w.levelKey]}`}>
                        {levelLabel}
                      </span>
                      <span className="text-[9px] tracking-widests uppercase px-2.5 py-1 rounded-full border border-forest/15 text-forest/40">
                        {w.time}
                      </span>
                      <span className="text-[9px] tracking-widests uppercase px-2.5 py-1 rounded-full border border-forest/15 text-forest/40">
                        {w.duration}
                      </span>
                    </div>

                    <h3 className="font-serif text-xl font-light text-forest mb-2">{w.title}</h3>
                    <p className="text-forest/50 text-sm leading-relaxed mb-4">{w.description}</p>

                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {w.topics.map(topic => (
                        <span key={topic} className="text-[10px] text-forest/40 bg-forest/[0.05] px-2 py-0.5 rounded-full">
                          {topic}
                        </span>
                      ))}
                    </div>

                    {/* Spots bar */}
                    <div className="flex items-center gap-3">
                      <div className="flex-1 h-1.5 bg-forest/[0.08] rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all ${urgent ? 'bg-amber-400' : 'bg-leaf'}`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                      <p className={`text-[11px] whitespace-nowrap ${urgent ? 'text-amber-600 font-medium' : 'text-forest/35'}`}>
                        {w.spots} {t('spotsLeft')}
                      </p>
                    </div>
                  </div>

                  {/* CTA */}
                  <div className="flex flex-col justify-center gap-2 flex-shrink-0 min-w-[140px]">
                    <p className={`font-serif text-2xl font-light text-center mb-1 ${w.price === 0 ? 'text-leaf' : 'text-forest'}`}>
                      {w.price === 0 ? t('free') : `R$ ${w.price}`}
                    </p>
                    <button className="bg-forest text-cream text-[10px] tracking-widests uppercase px-6 py-3 rounded-lg
                                       hover:bg-leaf transition-colors whitespace-nowrap">
                      {t('register')}
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        </section>

        {/* Past */}
        {past.length > 0 && (
          <section className="px-10 pb-20 max-w-screen-lg mx-auto">
            <h2 className="font-serif text-xl font-light text-forest/40 mb-6">{t('past')}</h2>
            <div className="flex flex-col gap-3">
              {past.map(w => (
                <div key={w.id}
                     className="bg-white/60 border border-forest/[0.06] rounded-2xl px-8 py-5 flex items-center justify-between gap-6 opacity-60">
                  <div>
                    <p className="text-forest text-sm font-medium">{w.title}</p>
                    <p className="text-forest/40 text-xs mt-0.5">{w.date} · {w.time}</p>
                  </div>
                  <span className="text-[9px] tracking-widests uppercase text-forest/30 border border-forest/15 px-2.5 py-1 rounded-full whitespace-nowrap">
                    {t('closed')}
                  </span>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>
    </NavTheme>
  )
}
