import Nav from '@/components/layout/Nav'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { formatDistanceToNow } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import DonationForm from '@/components/DonationForm'
import type { Project, Organization } from '@/types'

type ProjectWithOrg = Project & { organization: Organization | null }

const MOCK_PROJECTS: ProjectWithOrg[] = [
  {
    id: 'mock-1', created_at: '', organization_id: '', slug: 'onca-pintada-pantanal',
    title: 'Monitoramento de Onças no Pantanal Sul',
    description: 'Rastreamento por GPS e câmeras-trap para mapear corredores ecológicos vitais para a sobrevivência da onça-pintada no Pantanal.',
    full_description: 'O projeto utiliza coleiras GPS de última geração e uma rede de 120 câmeras-trap distribuídas em 3.200 km² de Pantanal sul-matogrossense para identificar, nomear e acompanhar individualmente cada onça da região. Os dados alimentam modelos de corredores ecológicos que guiam negociações com fazendeiros para preservar passagens naturais entre reservas.',
    species: 'Panthera onca', biome: 'Pantanal', country: 'Brasil',
    lat: null, lng: null,
    cover_image_url: 'https://images.unsplash.com/photo-1474511320723-9a56873867b5?w=1200&auto=format&fit=crop&q=80',
    goal_amount: 120000, raised_amount: 87400, currency: 'BRL', status: 'active', tags: ['onça-pintada', 'GPS', 'câmeras-trap', 'corredor ecológico'],
    organization: { id: '', created_at: '', name: 'Instituto Onça Viva', slug: '', description: '', country: 'Brasil', website: null, logo_url: null, verified: true, user_id: '' },
  },
  {
    id: 'mock-2', created_at: '', organization_id: '', slug: 'tartarugas-lencois',
    title: 'Proteção de Tartarugas Marinhas nos Lençóis',
    description: 'Monitoramento de ninhos e reintrodução de filhotes no litoral maranhense.',
    full_description: 'Equipes de voluntários patrulham 42 km de praias durante toda a temporada de desova (outubro–março), catalogam e protegem cada ninho encontrado, e acompanham os filhotes até o mar. Dados de geolocalização por satélite revelam rotas migratórias e áreas de alimentação, informando políticas de pesca sustentável.',
    species: 'Caretta caretta', biome: 'Marinho', country: 'Brasil',
    lat: null, lng: null,
    cover_image_url: 'https://images.unsplash.com/photo-1518020382113-a7e8fc38eac9?w=1200&auto=format&fit=crop&q=80',
    goal_amount: 65000, raised_amount: 41200, currency: 'BRL', status: 'active', tags: ['tartaruga', 'desova', 'litoral', 'marinho'],
    organization: { id: '', created_at: '', name: 'Projeto Tamar', slug: '', description: '', country: 'Brasil', website: null, logo_url: null, verified: true, user_id: '' },
  },
  {
    id: 'mock-3', created_at: '', organization_id: '', slug: 'elefantes-amboseli',
    title: 'Corredores para Elefantes em Amboseli',
    description: 'Criação de rotas seguras entre reservas para reduzir conflitos humano-animal.',
    full_description: 'O projeto mapeia movimentos de mais de 1.600 elefantes identificados individualmente no ecossistema de Amboseli, negocia servidões de passagem com comunidades Maasai, e instala sistemas de alerta precoce que notificam fazendeiros por SMS quando elefantes se aproximam de lavouras — reduzindo retaliações e perdas econômicas.',
    species: 'Loxodonta africana', biome: 'Savana', country: 'Quênia',
    lat: null, lng: null,
    cover_image_url: 'https://images.unsplash.com/photo-1564760055775-d63b17a55c44?w=1200&auto=format&fit=crop&q=80',
    goal_amount: 200000, raised_amount: 134000, currency: 'USD', status: 'active', tags: ['elefante', 'conflito', 'savana', 'Quênia'],
    organization: { id: '', created_at: '', name: 'Amboseli Trust', slug: '', description: '', country: 'Quênia', website: null, logo_url: null, verified: true, user_id: '' },
  },
  {
    id: 'mock-4', created_at: '', organization_id: '', slug: 'wolves-yellowstone',
    title: 'Reintrodução de Lobos em Yellowstone',
    description: 'Acompanhamento de alcateias reintroduzidas e seu impacto no ecossistema.',
    full_description: 'Desde a reintrodução histórica de 1995, o projeto monitora cada alcateia do parque com radiotelemetria e câmeras remotas, documentando o "efeito trófico em cascata": como a presença dos lobos reequilibrou populações de alces, regenerou vegetação ripária e trouxe de volta castores e aves aquáticas.',
    species: 'Canis lupus', biome: 'Floresta', country: 'EUA',
    lat: null, lng: null,
    cover_image_url: 'https://images.unsplash.com/photo-1474511320723-9a56873867b5?w=1200&auto=format&fit=crop&q=80',
    goal_amount: 180000, raised_amount: 95000, currency: 'USD', status: 'active', tags: ['lobo', 'Yellowstone', 'trófico', 'reintrodução'],
    organization: { id: '', created_at: '', name: 'Yellowstone Wolf Project', slug: '', description: '', country: 'EUA', website: null, logo_url: null, verified: true, user_id: '' },
  },
  {
    id: 'mock-5', created_at: '', organization_id: '', slug: 'coral-grande-barreira',
    title: 'Restauração de Corais na Grande Barreira',
    description: 'Cultivo e transplante de corais resistentes ao branqueamento em áreas degradadas.',
    full_description: 'Laboratórios subaquáticos produzem milhões de larvas de coral a partir de colônias com resistência genética ao calor. Após crescimento em viveiros, os corais são transplantados em módulos tridimensionais impressos em 3D, criando recifes artificiais que aceleram a recuperação de áreas destruídas pelo branqueamento.',
    species: 'Acropora sp.', biome: 'Marinho', country: 'Austrália',
    lat: null, lng: null,
    cover_image_url: 'https://images.unsplash.com/photo-1682687982501-1e58ab814714?w=1200&auto=format&fit=crop&q=80',
    goal_amount: 250000, raised_amount: 178000, currency: 'AUD', status: 'active', tags: ['coral', 'recife', 'branqueamento', 'Austrália'],
    organization: { id: '', created_at: '', name: 'Great Barrier Reef Foundation', slug: '', description: '', country: 'Austrália', website: null, logo_url: null, verified: true, user_id: '' },
  },
  {
    id: 'mock-6', created_at: '', organization_id: '', slug: 'orangotangos-borneo',
    title: 'Reflorestamento para Orangotangos em Bornéu',
    description: 'Plantio de corredores florestais ligando fragmentos de habitat isolados.',
    full_description: 'Com menos de 100.000 indivíduos restantes, o orangotango-de-bornéu enfrenta a extinção pela expansão de plantações de óleo de palma. O projeto planta espécies nativas selecionadas por preferência alimentar dos orangotangos, criando corredores verdes que permitem às populações isoladas se reencontrar e manter diversidade genética.',
    species: 'Pongo pygmaeus', biome: 'Floresta', country: 'Malásia',
    lat: null, lng: null,
    cover_image_url: 'https://images.unsplash.com/photo-1540573133985-87b6da6d54a9?w=1200&auto=format&fit=crop&q=80',
    goal_amount: 90000, raised_amount: 52000, currency: 'USD', status: 'active', tags: ['orangotango', 'Bornéu', 'reflorestamento', 'floresta'],
    organization: { id: '', created_at: '', name: 'Borneo Orangutan Survival', slug: '', description: '', country: 'Malásia', website: null, logo_url: null, verified: true, user_id: '' },
  },
  {
    id: 'mock-7', created_at: '', organization_id: '', slug: 'micos-leao-dourado',
    title: 'Micos-leão-dourados na Mata Atlântica',
    description: 'Programa de reprodução em cativeiro e soltura em remanescentes florestais.',
    full_description: 'Com apenas 4% da Mata Atlântica original, o mico-leão-dourado quase desapareceu. O programa criou uma metapopulação gerenciada entre zoológicos e florestas protegidas, com mais de 200 animais monitorados por radiotransmissores. Hoje a população selvagem supera 3.700 indivíduos — um dos maiores sucessos de conservação da história.',
    species: 'Leontopithecus rosalia', biome: 'Mata Atlântica', country: 'Brasil',
    lat: null, lng: null,
    cover_image_url: 'https://images.unsplash.com/photo-1540479859555-17af45c78602?w=1200&auto=format&fit=crop&q=80',
    goal_amount: 75000, raised_amount: 61000, currency: 'BRL', status: 'active', tags: ['mico-leão', 'Mata Atlântica', 'reintrodução', 'Brasil'],
    organization: { id: '', created_at: '', name: 'AMLD Brasil', slug: '', description: '', country: 'Brasil', website: null, logo_url: null, verified: true, user_id: '' },
  },
  {
    id: 'mock-8', created_at: '', organization_id: '', slug: 'tigres-bengala',
    title: 'Monitoramento de Tigres de Bengala',
    description: 'Câmeras-trap e análise genética para estimar população real nas reservas indianas.',
    full_description: 'Redes de câmeras-trap cobrem mais de 380.000 km² de habitat potencial na Índia. Algoritmos de reconhecimento de padrões identificam tigres individualmente pelas listras, enquanto amostras fecais revelam estrutura genética das populações — dados essenciais para planejar corredores entre reservas e evitar endocruzamento.',
    species: 'Panthera tigris', biome: 'Floresta', country: 'Índia',
    lat: null, lng: null,
    cover_image_url: 'https://images.unsplash.com/photo-1561731216-c3a4d99437d5?w=1200&auto=format&fit=crop&q=80',
    goal_amount: 160000, raised_amount: 104000, currency: 'USD', status: 'active', tags: ['tigre', 'Índia', 'câmeras-trap', 'genética'],
    organization: { id: '', created_at: '', name: 'Wildlife Institute of India', slug: '', description: '', country: 'Índia', website: null, logo_url: null, verified: true, user_id: '' },
  },
]

export default async function ProjectPage({ params }: { params: { slug: string } }) {
  const supabase = createClient()

  const { data: dbProject } = await supabase
    .from('projects')
    .select('*, organization:organizations(*)')
    .eq('slug', params.slug)
    .single()

  const project: ProjectWithOrg | null =
    dbProject ?? MOCK_PROJECTS.find(m => m.slug === params.slug) ?? null

  if (!project) notFound()

  const isMock = project.id.startsWith('mock-')

  const { data: updates } = isMock ? { data: null } : await supabase
    .from('updates')
    .select('*')
    .eq('project_id', project.id)
    .order('created_at', { ascending: false })

  const { data: donors } = isMock ? { data: null } : await supabase
    .from('donations')
    .select('donor_name, amount, message, anonymous, created_at')
    .eq('project_id', project.id)
    .order('created_at', { ascending: false })
    .limit(10)

  return (
    <main className="min-h-screen">
      <Nav />

      {/* Hero */}
      <div className="relative h-[60vh] overflow-hidden">
        {project.cover_image_url && (
          <Image
            src={project.cover_image_url}
            alt={project.title}
            fill
            className="object-cover brightness-50"
            priority
          />
        )}
        <div className="absolute inset-0"
             style={{ background: 'linear-gradient(to top, rgba(10,18,10,1) 0%, transparent 60%)' }}/>
        <div className="absolute bottom-0 left-0 right-0 px-14 pb-14">
          <p className="text-warm text-xs tracking-widest uppercase mb-3">
            {project.organization?.name} · {project.biome} · {project.country}
          </p>
          <h1 className="font-serif font-light text-cream leading-tight"
              style={{ fontSize: 'clamp(32px, 5vw, 64px)' }}>
            {project.title}
          </h1>
        </div>
      </div>

      {/* Content + Sidebar */}
      <div className="px-14 py-16 max-w-screen-xl mx-auto grid gap-16"
           style={{ gridTemplateColumns: '1fr 360px' }}>

        {/* Left: description + updates */}
        <div>
          <p className="text-cream/70 text-base leading-loose mb-12 max-w-2xl">
            {project.full_description || project.description}
          </p>

          {/* Tags */}
          {project.tags.length > 0 && (
            <div className="flex gap-2 flex-wrap mb-14">
              {project.tags.map((tag: string) => (
                <span key={tag}
                      className="text-xs border border-white/15 text-cream/50 px-3 py-1.5 rounded-sm tracking-wide">
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Updates feed */}
          {!isMock && (
            <>
              <h2 className="font-serif text-3xl font-light mb-8">
                Atualizações do <em className="italic text-sage">campo</em>
              </h2>
              <div className="flex flex-col gap-8">
                {(updates ?? []).length === 0 ? (
                  <p className="text-cream/25 text-sm">Nenhuma atualização ainda.</p>
                ) : (updates ?? []).map((u: any) => (
                  <div key={u.id} className="border-l-2 border-sage/30 pl-6 py-1">
                    <p className="text-cream/30 text-xs mb-2">
                      {formatDistanceToNow(new Date(u.created_at), { addSuffix: true, locale: ptBR })}
                      {' · '}{u.author_name}
                    </p>
                    <h3 className="font-serif text-xl font-normal text-cream mb-3">{u.title}</h3>
                    {u.image_url && (
                      <div className="relative h-64 rounded overflow-hidden mb-4">
                        <Image src={u.image_url} alt={u.title} fill className="object-cover brightness-85"/>
                      </div>
                    )}
                    <p className="text-cream/55 text-sm leading-loose">{u.content}</p>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Right: donation sidebar */}
        <div className="sticky top-28 h-fit">
          <div className="bg-canopy/50 border border-white/[0.08] rounded-lg p-7 mb-6">
            {isMock ? (
              <div className="text-center py-4">
                <p className="text-cream/40 text-sm mb-4">
                  Este é um projeto de demonstração. Cadastre-se para apoiar projetos reais.
                </p>
                <a href="/entrar"
                   className="inline-flex items-center gap-2 bg-leaf text-cream text-xs tracking-widest uppercase
                              px-6 py-3 rounded-sm hover:bg-sage transition-colors">
                  Criar conta gratuita
                </a>
              </div>
            ) : (
              <DonationForm
                projectId={project.id}
                orgHasStripe={!!(project.organization as any)?.stripe_account_id}
              />
            )}
          </div>

          {/* Recent donors */}
          {!isMock && (donors ?? []).length > 0 && (
            <div>
              <p className="text-xs tracking-widest uppercase text-cream/30 mb-4">
                Apoiadores recentes
              </p>
              <div className="flex flex-col gap-3">
                {donors!.map((d: any) => (
                  <div key={d.created_at} className="flex justify-between items-start">
                    <div>
                      <p className="text-cream/70 text-sm">
                        {d.anonymous ? 'Anônimo' : d.donor_name}
                      </p>
                      {d.message && (
                        <p className="text-cream/30 text-xs mt-0.5 italic">"{d.message}"</p>
                      )}
                    </div>
                    <span className="text-sage text-sm">
                      {new Intl.NumberFormat('pt-BR', {
                        style: 'currency', currency: project.currency, maximumFractionDigits: 0
                      }).format(d.amount)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}