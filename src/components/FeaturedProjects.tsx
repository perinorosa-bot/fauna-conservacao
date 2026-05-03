import Link from 'next/link'
import { SpecimenLabel } from '@/components/ui/SpecimenLabel'
import type { Project, Organization } from '@/types'

type ProjectWithOrg = Project & { organization: Organization | null }

/* Mocks de fallback — usados se a org tiver <4 projetos cadastrados.
 * Quando ela cadastrar 4 projetos reais no Supabase, eles tomam o lugar. */
const MOCK_FEATURED: ProjectWithOrg[] = [
  {
    id: 'mock-feat-1', created_at: '2026-01-15', organization_id: '', slug: 'onca-pantanal',
    title: 'Monitoramento de Onças no Pantanal',
    description: 'Rastreamento por GPS e câmeras-trap.',
    full_description: '', species: 'Panthera onca', biome: 'Pantanal',
    country: 'Brasil', lat: null, lng: null,
    cover_image_url: 'https://images.unsplash.com/photo-1614027164847-1b28cfe1df60?w=900&auto=format&fit=crop&q=80',
    goal_amount: 100000, raised_amount: 73000, currency: 'BRL', status: 'active', tags: ['NT'],
    organization: null,
  },
  {
    id: 'mock-feat-2', created_at: '2026-02-10', organization_id: '', slug: 'tartarugas-lencois',
    title: 'Tartarugas Marinhas',
    description: 'Proteção de ninhos no litoral.',
    full_description: '', species: 'Caretta caretta', biome: 'Marinho',
    country: 'Brasil', lat: null, lng: null,
    cover_image_url: 'https://images.unsplash.com/photo-1518020382113-a7e8fc38eac9?w=900&auto=format&fit=crop&q=80',
    goal_amount: 80000, raised_amount: 50400, currency: 'BRL', status: 'active', tags: ['VU'],
    organization: null,
  },
  {
    id: 'mock-feat-3', created_at: '2026-03-01', organization_id: '', slug: 'mico-leao',
    title: 'Mico-leão-dourado na Mata Atlântica',
    description: 'Reprodução em cativeiro e soltura.',
    full_description: '', species: 'Leontopithecus rosalia', biome: 'Mata Atlântica',
    country: 'Brasil', lat: null, lng: null,
    cover_image_url: 'https://images.unsplash.com/photo-1540479859555-17af45c78602?w=900&auto=format&fit=crop&q=80',
    goal_amount: 120000, raised_amount: 97200, currency: 'BRL', status: 'active', tags: ['EN'],
    organization: null,
  },
  {
    id: 'mock-feat-4', created_at: '2026-03-20', organization_id: '', slug: 'arara-azul',
    title: 'Arara-azul no Cerrado',
    description: 'Conservação da fauna em ninhais ativos.',
    full_description: '', species: 'Anodorhynchus hyacinthinus', biome: 'Cerrado',
    country: 'Brasil', lat: null, lng: null,
    cover_image_url: 'https://images.unsplash.com/photo-1591608971362-f08b2a75731a?w=900&auto=format&fit=crop&q=80',
    goal_amount: 60000, raised_amount: 30000, currency: 'BRL', status: 'active', tags: ['VU'],
    organization: null,
  },
]

// Categorias da Lista Vermelha da IUCN — caso o projeto tenha alguma como tag.
const IUCN_TAGS = ['LC', 'NT', 'VU', 'EN', 'CR', 'EW', 'EX'] as const

function pickIucn(project: ProjectWithOrg): string | null {
  const found = (project.tags ?? []).find(t => IUCN_TAGS.includes(t.toUpperCase() as any))
  return found ? found.toUpperCase() : null
}

function ProjectCard({ project }: { project: ProjectWithOrg }) {
  const iucn = pickIucn(project)

  return (
    <Link
      href={`/projetos/${project.slug}`}
      className="group relative block overflow-hidden transition-all duration-300
                 hover:-translate-y-1.5 rounded-[28px]"
      style={{
        aspectRatio: '3 / 4',
        background:  'rgba(11, 20, 16, 0.94)',
        boxShadow:   '0 25px 50px -12px rgba(11, 20, 16, 0.35)',  // shadow-2xl em forest
      }}
    >
      {/* Foto de capa preenchendo o card */}
      {project.cover_image_url && (
        /* eslint-disable-next-line @next/next/no-img-element */
        <img
          src={project.cover_image_url}
          alt={project.title}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          style={{ filter: 'brightness(.85) contrast(1.05)' }}
        />
      )}

      {/* Specimen label TL — pílula de vidro */}
      <div
        className="absolute top-4 left-4 z-[3] inline-flex items-center rounded-full"
        style={{
          padding:              '6px 12px',
          background:           'rgba(11, 20, 16, 0.55)',
          backdropFilter:       'blur(14px) saturate(160%)',
          WebkitBackdropFilter: 'blur(14px) saturate(160%)',
          border:               '1px solid rgba(237, 229, 208, 0.18)',
        }}
      >
        <SpecimenLabel projectId={project.id} biome={project.biome} createdAt={project.created_at} />
      </div>

      {/* IUCN tag TR — pílula glass terra */}
      {iucn && (
        <div
          className="absolute top-4 right-4 z-[3] font-mono text-[9px] tracking-[0.22em]
                     uppercase text-cream rounded-full"
          style={{
            padding:              '6px 12px',
            background:           'rgba(196,82,42,0.85)',
            backdropFilter:       'blur(14px)',
            WebkitBackdropFilter: 'blur(14px)',
            border:               '1px solid rgba(255,255,255,0.20)',
          }}
        >
          {iucn}
        </div>
      )}

    </Link>
  )
}

type Props = {
  projects: ProjectWithOrg[]
  totalCount?: number
}

export default function FeaturedProjects({ projects, totalCount }: Props) {
  // Pega 4 projetos. Se houver menos que 4 reais, completa com mocks.
  const list: ProjectWithOrg[] = [
    ...projects.slice(0, 4),
    ...MOCK_FEATURED.slice(0, Math.max(0, 4 - projects.length)),
  ].slice(0, 4)

  const total = totalCount ?? projects.length ?? 247

  return (
    <section
      className="relative overflow-hidden"
      style={{ padding: '140px 24px', background: '#F5F5F5' }}
    >
      <div className="relative z-[2] max-w-[1280px] mx-auto">
        {/* Header */}
        <div className="flex flex-wrap items-end justify-between gap-10 mb-14">
          <div>
            <p className="eyebrow mb-3.5">Em destaque · Edição abril</p>
            <h2 className="font-sans text-forest font-light leading-[1.1]"
                style={{ fontSize: 'clamp(36px, 5vw, 56px)' }}>
              Projetos em destaque
            </h2>
          </div>
          <Link
            href="/projetos"
            className="font-mono text-[10px] tracking-[0.22em] uppercase
                       text-forest/75 px-7 py-3.5 rounded-[2px]
                       hover:text-forest transition-all"
            style={{
              background:           'rgba(26, 53, 40, 0.04)',
              backdropFilter:       'blur(14px) saturate(140%)',
              WebkitBackdropFilter: 'blur(14px) saturate(140%)',
              border:               '1px solid rgba(26, 53, 40, 0.18)',
              boxShadow:            'inset 0 1px 0 rgba(255,255,255,0.5)',
            }}
          >
            Ver todos os {total} →
          </Link>
        </div>

        {/* Grid 4 colunas (responsivo: 1→2→4) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {list.map(p => (
            <ProjectCard key={p.id} project={p} />
          ))}
        </div>
      </div>
    </section>
  )
}
