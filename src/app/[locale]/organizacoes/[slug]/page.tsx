import Nav from '@/components/layout/Nav'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import type { Project } from '@/types'

export default async function OrganizationPage({ params }: { params: { slug: string } }) {
  const supabase = createClient()

  const { data: org } = await supabase
    .from('organizations')
    .select('*')
    .eq('slug', params.slug)
    .single()

  if (!org) notFound()

  const { data: projects } = await supabase
    .from('projects')
    .select('*')
    .eq('organization_id', org.id)
    .order('created_at', { ascending: false })

  const projectList: Project[] = projects ?? []
  const activeProjects = projectList.filter(p => p.status === 'active')
  const totalRaised = projectList.reduce((sum, p) => sum + Number(p.raised_amount), 0)

  // Currency for stats: pega da maioria dos projetos; fallback BRL.
  const currencyCount = projectList.reduce<Record<string, number>>((acc, p) => {
    acc[p.currency] = (acc[p.currency] ?? 0) + 1
    return acc
  }, {})
  const primaryCurrency = Object.entries(currencyCount).sort((a, b) => b[1] - a[1])[0]?.[0] ?? 'BRL'
  const formatMoney = (n: number) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: primaryCurrency, maximumFractionDigits: 0 }).format(n)

  return (
    <main className="min-h-screen bg-moonstone">
      <Nav />

      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <section className="pt-40 pb-16 px-10 max-w-screen-xl mx-auto">
        <div className="flex flex-col md:flex-row gap-10 items-start">

          {/* Logo */}
          <div className="w-28 h-28 md:w-36 md:h-36 rounded-2xl overflow-hidden bg-forest/5 border border-forest/10 flex items-center justify-center flex-shrink-0">
            {org.logo_url ? (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img src={org.logo_url} alt={org.name} className="w-full h-full object-cover" />
            ) : (
              <span className="font-sans text-4xl font-light text-forest/30">
                {org.name.charAt(0).toUpperCase()}
              </span>
            )}
          </div>

          {/* Identidade */}
          <div className="flex-1">
            <p className="text-[10px] tracking-[0.25em] uppercase text-forest/40 mb-3">
              Organização · {org.country}
            </p>
            <h1 className="font-sans text-5xl md:text-6xl font-light text-forest leading-[1.05] mb-4">
              {org.name}
            </h1>

            <div className="flex flex-wrap items-center gap-3 mb-6">
              {org.verified && (
                <span className="inline-flex items-center gap-1.5 text-[10px] tracking-widest uppercase
                                 text-sage bg-sage/10 border border-sage/25 px-3 py-1.5 rounded-full">
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                       strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  Verificada pela Fauna
                  {org.verified_at && (
                    <span className="text-sage/70 normal-case tracking-normal">
                      · {new Date(org.verified_at).toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}
                    </span>
                  )}
                </span>
              )}
              {org.website && (
                <a href={org.website} target="_blank" rel="noopener noreferrer"
                   className="inline-flex items-center gap-1.5 text-[10px] tracking-widest uppercase
                              text-forest/60 hover:text-forest border border-forest/15 hover:border-forest/35
                              px-3 py-1.5 rounded-full transition-colors">
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                       strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"/>
                    <line x1="2" y1="12" x2="22" y2="12"/>
                    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
                  </svg>
                  Site oficial →
                </a>
              )}
            </div>

            <p className="text-forest/70 text-base leading-relaxed max-w-2xl">
              {org.description}
            </p>
          </div>
        </div>
      </section>

      {/* ── Stats ─────────────────────────────────────────────────────────── */}
      {projectList.length > 0 && (
        <section className="px-10 pb-12 max-w-screen-xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 border-t border-forest/[0.10]">
            {[
              { value: String(projectList.length),     label: 'Projetos cadastrados' },
              { value: String(activeProjects.length),  label: 'Ativos agora'         },
              { value: formatMoney(totalRaised),       label: 'Já arrecadado'        },
            ].map((s, i, arr) => (
              <div key={s.label}
                   className="px-7 pt-9 pb-8 relative"
                   style={{ borderRight: i < arr.length - 1 ? '1px solid rgba(26,53,40,0.10)' : 'none' }}>
                <div className="font-sans text-forest font-light leading-none mb-3"
                     style={{ fontSize: 'clamp(32px, 4vw, 48px)', letterSpacing: '-0.02em' }}>
                  {s.value}
                </div>
                <div className="font-mono text-[10px] tracking-[0.22em] uppercase text-forest/55">
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ── Projects ──────────────────────────────────────────────────────── */}
      <section className="px-10 pb-28 max-w-screen-xl mx-auto">
        <div className="border-t border-forest/[0.10] pt-14 mb-10">
          <p className="text-[10px] tracking-[0.25em] uppercase text-forest/40 mb-3">Projetos</p>
          <h2 className="font-sans text-3xl md:text-4xl font-light text-forest">
            Iniciativas desta organização
          </h2>
        </div>

        {projectList.length === 0 ? (
          <div className="bg-white/60 border border-forest/[0.08] rounded-2xl p-12 text-center">
            <p className="text-forest/40 text-sm">
              {org.name} ainda não publicou projetos na Fauna.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {projectList.map(p => (
              <ProjectCard key={p.id} project={p} />
            ))}
          </div>
        )}
      </section>

      {/* ── CTA ───────────────────────────────────────────────────────────── */}
      <section className="bg-forest px-10 py-20 text-center">
        <h2 className="font-sans text-3xl md:text-4xl font-light text-cream mb-4">
          Apoie o trabalho de <em className="italic text-sage">{org.name}</em>
        </h2>
        <p className="text-cream/45 text-sm leading-relaxed max-w-md mx-auto mb-10">
          Escolha um projeto ativo para apoiar diretamente, ou entre em contato sobre parcerias.
        </p>
        <div className="flex gap-4 justify-center flex-wrap">
          {activeProjects[0] && (
            <Link href={`/projetos/${activeProjects[0].slug}`}
                  className="bg-sage text-cream text-[10px] tracking-widest uppercase px-7 py-3.5 rounded-sm
                             hover:bg-leaf transition-colors">
              Ver projeto em destaque
            </Link>
          )}
          <Link href="/contato"
                className="border border-white/25 text-cream/70 text-[10px] tracking-widest uppercase
                           px-7 py-3.5 rounded-sm hover:border-white/50 hover:text-cream transition-colors">
            Contato institucional
          </Link>
        </div>
      </section>
    </main>
  )
}

/* Card minimalista para listar projetos da própria ONG.
 * Sem barra de progresso ou meta — a Fauna não trabalha com goal_amount por projeto. */
function ProjectCard({ project }: { project: Project }) {
  const formatMoney = (n: number) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: project.currency, maximumFractionDigits: 0 }).format(n)

  return (
    <Link href={`/projetos/${project.slug}`}
          className="group block bg-white/70 border border-forest/[0.08] rounded-2xl overflow-hidden
                     hover:-translate-y-1 transition-transform duration-300 shadow-sm">
      {project.cover_image_url && (
        <div className="relative aspect-[4/3] overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={project.cover_image_url} alt={project.title}
               className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
          {project.status !== 'active' && (
            <span className="absolute top-3 left-3 text-[9px] tracking-widest uppercase
                             bg-forest/85 text-cream/90 px-2.5 py-1 rounded-full">
              {project.status === 'completed' ? 'Concluído' : 'Pausado'}
            </span>
          )}
        </div>
      )}
      <div className="p-5">
        <p className="font-mono text-[9px] tracking-[0.2em] uppercase text-forest/45 mb-1.5">
          {project.species} · {project.biome}
        </p>
        <h3 className="font-sans text-lg font-normal text-forest leading-snug mb-3 line-clamp-2">
          {project.title}
        </h3>

        {Number(project.raised_amount) > 0 && (
          <p className="text-forest/65 text-sm">
            <span className="text-forest font-medium">{formatMoney(Number(project.raised_amount))}</span>
            <span className="text-forest/40 text-xs"> arrecadados até aqui</span>
          </p>
        )}
      </div>
    </Link>
  )
}
