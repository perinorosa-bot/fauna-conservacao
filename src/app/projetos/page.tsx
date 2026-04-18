import Nav from '@/components/layout/Nav'
import { NavTheme } from '@/components/layout/NavTheme'
import { createClient } from '@/lib/supabase/server'
import FilteredProjects from '@/components/FilteredProjects'
import ProjectsPageHeader from '@/components/ProjectsPageHeader'
import type { Project, Organization } from '@/types'

const MOCK_PROJECTS: (Project & { organization: Organization | null })[] = [
  {
    id: 'mock-1', created_at: '', organization_id: '', slug: 'onca-pintada-pantanal',
    title: 'Monitoramento de Onças no Pantanal Sul',
    description: 'Rastreamento por GPS e câmeras-trap para mapear corredores ecológicos.',
    full_description: '', species: 'Panthera onca', biome: 'Pantanal',
    country: 'Brasil', lat: null, lng: null,
    cover_image_url: 'https://images.unsplash.com/photo-1474511320723-9a56873867b5?w=600&auto=format&fit=crop&q=80',
    goal_amount: 120000, raised_amount: 87400, currency: 'BRL', status: 'active', tags: [],
    organization: { id: '', created_at: '', name: 'Instituto Onça Viva', slug: '', description: '', country: 'Brasil', website: null, logo_url: null, verified: true, user_id: '' },
  },
  {
    id: 'mock-2', created_at: '', organization_id: '', slug: 'tartarugas-lencois',
    title: 'Proteção de Tartarugas Marinhas nos Lençóis',
    description: 'Monitoramento de ninhos e reintrodução de filhotes no litoral maranhense.',
    full_description: '', species: 'Caretta caretta', biome: 'Marinho',
    country: 'Brasil', lat: null, lng: null,
    cover_image_url: 'https://images.unsplash.com/photo-1518020382113-a7e8fc38eac9?w=600&auto=format&fit=crop&q=80',
    goal_amount: 65000, raised_amount: 41200, currency: 'BRL', status: 'active', tags: [],
    organization: { id: '', created_at: '', name: 'Projeto Tamar', slug: '', description: '', country: 'Brasil', website: null, logo_url: null, verified: true, user_id: '' },
  },
  {
    id: 'mock-3', created_at: '', organization_id: '', slug: 'elefantes-amboseli',
    title: 'Corredores para Elefantes em Amboseli',
    description: 'Criação de rotas seguras entre reservas para reduzir conflitos humano-animal.',
    full_description: '', species: 'Loxodonta africana', biome: 'Savana',
    country: 'Quênia', lat: null, lng: null,
    cover_image_url: 'https://images.unsplash.com/photo-1564760055775-d63b17a55c44?w=600&auto=format&fit=crop&q=80',
    goal_amount: 200000, raised_amount: 134000, currency: 'USD', status: 'active', tags: [],
    organization: { id: '', created_at: '', name: 'Amboseli Trust', slug: '', description: '', country: 'Quênia', website: null, logo_url: null, verified: true, user_id: '' },
  },
  {
    id: 'mock-4', created_at: '', organization_id: '', slug: 'wolves-yellowstone',
    title: 'Reintrodução de Lobos em Yellowstone',
    description: 'Acompanhamento de alcateias reintroduzidas e seu impacto no ecossistema.',
    full_description: '', species: 'Canis lupus', biome: 'Floresta',
    country: 'EUA', lat: null, lng: null,
    cover_image_url: 'https://images.unsplash.com/photo-1474511320723-9a56873867b5?w=600&auto=format&fit=crop&q=80',
    goal_amount: 180000, raised_amount: 95000, currency: 'USD', status: 'active', tags: [],
    organization: { id: '', created_at: '', name: 'Yellowstone Wolf Project', slug: '', description: '', country: 'EUA', website: null, logo_url: null, verified: true, user_id: '' },
  },
  {
    id: 'mock-5', created_at: '', organization_id: '', slug: 'coral-grande-barreira',
    title: 'Restauração de Corais na Grande Barreira',
    description: 'Cultivo e transplante de corais resistentes ao branqueamento em áreas degradadas.',
    full_description: '', species: 'Acropora sp.', biome: 'Marinho',
    country: 'Austrália', lat: null, lng: null,
    cover_image_url: 'https://images.unsplash.com/photo-1682687982501-1e58ab814714?w=600&auto=format&fit=crop&q=80',
    goal_amount: 250000, raised_amount: 178000, currency: 'AUD', status: 'active', tags: [],
    organization: { id: '', created_at: '', name: 'Great Barrier Reef Foundation', slug: '', description: '', country: 'Austrália', website: null, logo_url: null, verified: true, user_id: '' },
  },
  {
    id: 'mock-6', created_at: '', organization_id: '', slug: 'orangotangos-borneo',
    title: 'Reflorestamento para Orangotangos em Bornéu',
    description: 'Plantio de corredores florestais ligando fragmentos de habitat isolados.',
    full_description: '', species: 'Pongo pygmaeus', biome: 'Floresta',
    country: 'Malásia', lat: null, lng: null,
    cover_image_url: 'https://images.unsplash.com/photo-1540573133985-87b6da6d54a9?w=600&auto=format&fit=crop&q=80',
    goal_amount: 90000, raised_amount: 52000, currency: 'USD', status: 'active', tags: [],
    organization: { id: '', created_at: '', name: 'Borneo Orangutan Survival', slug: '', description: '', country: 'Malásia', website: null, logo_url: null, verified: true, user_id: '' },
  },
  {
    id: 'mock-7', created_at: '', organization_id: '', slug: 'micos-leao-dourado',
    title: 'Micos-leão-dourados na Mata Atlântica',
    description: 'Programa de reprodução em cativeiro e soltura em remanescentes florestais.',
    full_description: '', species: 'Leontopithecus rosalia', biome: 'Mata Atlântica',
    country: 'Brasil', lat: null, lng: null,
    cover_image_url: 'https://images.unsplash.com/photo-1540479859555-17af45c78602?w=600&auto=format&fit=crop&q=80',
    goal_amount: 75000, raised_amount: 61000, currency: 'BRL', status: 'active', tags: [],
    organization: { id: '', created_at: '', name: 'AMLD Brasil', slug: '', description: '', country: 'Brasil', website: null, logo_url: null, verified: true, user_id: '' },
  },
  {
    id: 'mock-8', created_at: '', organization_id: '', slug: 'tigres-bengala',
    title: 'Monitoramento de Tigres de Bengala',
    description: 'Câmeras-trap e análise genética para estimar população real nas reservas indianas.',
    full_description: '', species: 'Panthera tigris', biome: 'Floresta',
    country: 'Índia', lat: null, lng: null,
    cover_image_url: 'https://images.unsplash.com/photo-1561731216-c3a4d99437d5?w=600&auto=format&fit=crop&q=80',
    goal_amount: 160000, raised_amount: 104000, currency: 'USD', status: 'active', tags: [],
    organization: { id: '', created_at: '', name: 'Wildlife Institute of India', slug: '', description: '', country: 'Índia', website: null, logo_url: null, verified: true, user_id: '' },
  },
]

export default async function ProjetosPage() {
  const supabase = createClient()

  const { data: realProjects } = await supabase
    .from('projects')
    .select('*, organization:organizations(*)')
    .eq('status', 'active')
    .order('created_at', { ascending: false })

  const realIds = new Set((realProjects ?? []).map(p => p.id))
  const combined = [
    ...(realProjects ?? []),
    ...MOCK_PROJECTS.filter(m => !realIds.has(m.id)),
  ]

  return (
    <NavTheme theme="light">
    <main className="min-h-screen bg-cream">
      <Nav />

      <div className="pt-40 pb-16 px-10 max-w-screen-xl mx-auto">
        <ProjectsPageHeader count={combined.length} />
      </div>

      <div id="projetos" className="px-10 pb-28 max-w-screen-xl mx-auto">
        <FilteredProjects projects={combined} light />
      </div>
    </main>
    </NavTheme>
  )
}