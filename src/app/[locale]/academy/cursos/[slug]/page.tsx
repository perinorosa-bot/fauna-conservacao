import Link from 'next/link'
import Nav from '@/components/layout/Nav'
import { NavTheme } from '@/components/layout/NavTheme'

// Static course data — swap for DB queries when ready
const COURSES: Record<string, {
  title: string
  subtitle: string
  description: string
  level: string
  duration: string
  modules: { title: string; lessons: string[] }[]
  price: number
  instructor: string
  instructorBio: string
  outcomes: string[]
}> = {
  'captacao-recursos-iniciantes': {
    title: 'Captação de Recursos para Iniciantes',
    subtitle: 'Do zero ao primeiro doador',
    description: 'Um guia completo para organizações que estão começando sua jornada de captação. Aprenda os fundamentos, conheça o perfil dos doadores e estruture sua primeira campanha do zero.',
    level: 'Iniciante',
    duration: '4h',
    instructor: 'Equipe Fauna Academy',
    instructorBio: 'Especialistas em captação de recursos para organizações de conservação com mais de 10 anos de experiência.',
    outcomes: [
      'Entender os diferentes modelos de captação de recursos',
      'Identificar o perfil ideal de doador para sua organização',
      'Criar sua primeira campanha de captação estruturada',
      'Medir e interpretar resultados de captação',
      'Construir um funil básico de relacionamento com doadores',
    ],
    modules: [
      {
        title: 'Fundamentos de captação',
        lessons: ['O que é captação de recursos', 'Modalidades: doação, grant, crowdfunding', 'Por onde começar', 'Erros comuns'],
      },
      {
        title: 'Conhecendo seu doador',
        lessons: ['Quem doa para conservação', 'Motivações e barreiras', 'Segmentação de públicos', 'Criando personas'],
      },
      {
        title: 'Sua primeira campanha',
        lessons: ['Definindo metas realistas', 'Construindo a mensagem', 'Escolhendo os canais', 'Cronograma e execução'],
      },
      {
        title: 'Métricas e próximos passos',
        lessons: ['KPIs de captação', 'Taxa de conversão', 'Custo por doador', 'Plano de crescimento'],
      },
    ],
    price: 0,
  },
  'narrativa-impacto': {
    title: 'Narrativa de Impacto para Doadores',
    subtitle: 'Histórias que movem pessoas',
    description: 'Aprenda a transformar dados científicos em narrativas emocionais que convencem e convertem. O curso mais completo de storytelling para organizações de conservação.',
    level: 'Intermediário',
    duration: '6h',
    instructor: 'Equipe Fauna Academy',
    instructorBio: 'Especialistas em comunicação de impacto para o terceiro setor.',
    outcomes: [
      'Dominar as estruturas narrativas que funcionam para o setor',
      'Transformar dados em histórias emocionantes',
      'Criar relatórios de impacto que os doadores querem ler',
      'Produzir fotos e vídeos de campo eficazes',
      'Escrever emails de captação com alta taxa de abertura',
    ],
    modules: [
      {
        title: 'Storytelling para conservação',
        lessons: ['Por que histórias funcionam', 'A jornada do herói adaptada', 'Protagonista: animal ou humano?', 'Estrutura narrativa em 5 atos'],
      },
      {
        title: 'Conteúdo visual',
        lessons: ['Fotografia de campo que converte', 'Vídeo em 60 segundos', 'Redes sociais para conservação', 'Antes e depois — o formato mais poderoso'],
      },
      {
        title: 'Relatórios e comunicados',
        lessons: ['Relatório de impacto anual', 'Newsletter para doadores', 'Atualização de projeto', 'Agradecimento eficaz'],
      },
      {
        title: 'Email marketing',
        lessons: ['Assuntos que abrem', 'Estrutura do email de captação', 'Sequência de boas-vindas', 'A/B testing simples'],
      },
    ],
    price: 197,
  },
  'grandes-doacoes': {
    title: 'Estratégias para Grandes Doações',
    subtitle: 'Major donors e financiadores institucionais',
    description: 'Como identificar, qualificar e cultivar relacionamentos com grandes doadores individuais, fundações privadas e organismos internacionais. O curso mais avançado da Academy.',
    level: 'Avançado',
    duration: '8h',
    instructor: 'Equipe Fauna Academy',
    instructorBio: 'Especialistas com experiência em captação junto a fundações nacionais e internacionais.',
    outcomes: [
      'Identificar e qualificar potenciais grandes doadores',
      'Conduzir reuniões de captação com confiança',
      'Criar propostas de parceria personalizadas',
      'Cultivar relacionamentos de longo prazo',
      'Navegar processos de fundações e órgãos multilaterais',
    ],
    modules: [
      {
        title: 'O universo dos grandes doadores',
        lessons: ['Quem são os major donors', 'Fundações privadas e familiares', 'Organismos internacionais', 'Diferença entre grant e doação'],
      },
      {
        title: 'Pesquisa e qualificação',
        lessons: ['Fontes de pesquisa', 'Scoring de prospects', 'Mapeamento de conexões', 'Quando abordar'],
      },
      {
        title: 'A reunião de captação',
        lessons: ['Preparação e pesquisa prévia', 'Como pedir a doação', 'Lidando com objeções', 'Pós-reunião e follow-up'],
      },
      {
        title: 'Cultivo e fidelização',
        lessons: ['Plano de cultivo', 'Reconhecimento e benefícios', 'Relatórios personalizados', 'Renovação e upgrade'],
      },
    ],
    price: 297,
  },
}

export default function CourseDetailPage({ params }: { params: { slug: string } }) {
  const course = COURSES[params.slug]

  if (!course) {
    return (
      <NavTheme theme="light">
        <main className="min-h-screen bg-cream flex items-center justify-center">
          <Nav />
          <div className="text-center pt-32">
            <p className="text-forest/40 text-sm mb-4">Curso não encontrado.</p>
            <Link href="/academy/cursos" className="text-leaf hover:underline text-sm">← Ver todos os cursos</Link>
          </div>
        </main>
      </NavTheme>
    )
  }

  return (
    <NavTheme theme="light">
      <main className="min-h-screen bg-[#f5f4f0]">
        <Nav />

        {/* Hero */}
        <section className="bg-forest pt-40 pb-16 px-10">
          <div className="max-w-screen-lg mx-auto">
            <p className="text-sage/60 text-[10px] tracking-[0.25em] uppercase mb-5">
              <Link href="/academy" className="hover:text-sage">Academy</Link>
              {' '}/ <Link href="/academy/cursos" className="hover:text-sage">Cursos</Link>
              {' '}/ {course.title}
            </p>
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-12 items-start">
              <div>
                <span className="text-[9px] tracking-widests uppercase border border-white/20 text-cream/50 px-2.5 py-1 rounded-full mr-2">
                  {course.level}
                </span>
                <span className="text-[9px] tracking-widests uppercase border border-white/20 text-cream/50 px-2.5 py-1 rounded-full">
                  {course.duration}
                </span>
                <h1 className="font-serif text-4xl md:text-5xl font-light text-cream mt-5 mb-3 leading-tight">
                  {course.title}
                </h1>
                <p className="text-cream/45 text-base leading-relaxed max-w-lg mb-6">
                  {course.description}
                </p>
                <p className="text-sage/70 text-xs">por {course.instructor}</p>
              </div>

              {/* Enroll card */}
              <div className="bg-white rounded-2xl p-7 shadow-xl shadow-black/15 border border-forest/[0.08]">
                <p className="font-serif text-4xl font-light text-forest mb-1">
                  {course.price === 0 ? 'Gratuito' : `R$ ${course.price}`}
                </p>
                {course.price > 0 && (
                  <p className="text-forest/35 text-xs mb-5">acesso vitalício · certificado incluso</p>
                )}
                <button className="w-full bg-forest text-cream text-[11px] tracking-widests uppercase py-4 rounded-lg
                                   hover:bg-leaf transition-colors mb-3 mt-4">
                  {course.price === 0 ? 'Acessar gratuitamente →' : 'Comprar curso →'}
                </button>
                {course.price > 0 && (
                  <p className="text-center text-forest/30 text-[10px]">Garantia de 7 dias · Cancele quando quiser</p>
                )}
                <div className="mt-5 pt-5 border-t border-forest/[0.07] flex flex-col gap-2">
                  {[
                    `${course.modules.reduce((s, m) => s + m.lessons.length, 0)} aulas gravadas`,
                    `${course.duration} de conteúdo`,
                    `${course.modules.length} módulos`,
                    'Certificado de conclusão',
                    'Acesso vitalício',
                  ].map(f => (
                    <div key={f} className="flex items-center gap-2">
                      <span className="text-leaf text-xs">✓</span>
                      <span className="text-forest/55 text-xs">{f}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className="px-10 py-14 max-w-screen-lg mx-auto grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-12">
          <div>
            {/* Learning outcomes */}
            <div className="bg-white rounded-2xl border border-forest/[0.08] p-8 mb-8">
              <h2 className="font-serif text-2xl font-light text-forest mb-6">O que você vai aprender</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {course.outcomes.map(o => (
                  <div key={o} className="flex items-start gap-3">
                    <span className="text-leaf text-sm mt-0.5 flex-shrink-0">✓</span>
                    <span className="text-forest/65 text-sm leading-relaxed">{o}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Curriculum */}
            <div className="bg-white rounded-2xl border border-forest/[0.08] overflow-hidden">
              <div className="px-8 py-6 border-b border-forest/[0.07]">
                <h2 className="font-serif text-2xl font-light text-forest">Conteúdo do curso</h2>
                <p className="text-forest/35 text-sm mt-1">
                  {course.modules.length} módulos · {course.modules.reduce((s, m) => s + m.lessons.length, 0)} aulas · {course.duration}
                </p>
              </div>
              {course.modules.map((mod, i) => (
                <div key={i} className="border-b border-forest/[0.06] last:border-0">
                  <div className="px-8 py-4 flex items-center justify-between bg-forest/[0.02]">
                    <div className="flex items-center gap-3">
                      <span className="text-[10px] text-forest/30 font-medium w-5">{String(i + 1).padStart(2, '0')}</span>
                      <h3 className="text-forest font-medium text-sm">{mod.title}</h3>
                    </div>
                    <span className="text-forest/30 text-[11px]">{mod.lessons.length} aulas</span>
                  </div>
                  {mod.lessons.map((lesson, j) => (
                    <div key={j} className="px-8 py-3 flex items-center gap-4 border-t border-forest/[0.04]">
                      <span className="text-forest/20 text-[10px] w-5 text-center">▶</span>
                      <span className="text-forest/55 text-sm">{lesson}</span>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>

          {/* Instructor (sticky) */}
          <div>
            <div className="bg-white rounded-2xl border border-forest/[0.08] p-7 sticky top-24">
              <h3 className="font-serif text-lg font-light text-forest mb-4">Instrutor</h3>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-forest/10 flex items-center justify-center flex-shrink-0">
                  <span className="font-serif text-lg text-forest/40">F</span>
                </div>
                <div>
                  <p className="text-forest text-sm font-medium">{course.instructor}</p>
                  <p className="text-forest/35 text-xs">Fauna Academy</p>
                </div>
              </div>
              <p className="text-forest/55 text-sm leading-relaxed">{course.instructorBio}</p>
            </div>
          </div>
        </div>
      </main>
    </NavTheme>
  )
}
