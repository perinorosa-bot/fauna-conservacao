'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useLanguage } from '@/lib/i18n/LanguageContext'
import type { Project, Organization } from '@/types'
import { SpecimenLabel } from '@/components/ui/SpecimenLabel'

type ProjectWithOrg = Project & { organization: Organization | null }

type FilterKey = 'all' | 'brazil' | 'africa' | 'oceania' | 'asia' | 'marine' | 'forest' | 'savanna'

const FILTERS: { key: FilterKey; field: 'country' | 'biome' | null; value: string | null }[] = [
  { key: 'all',     field: null,      value: null },
  { key: 'brazil',  field: 'country', value: 'Brasil' },
  { key: 'africa',  field: 'country', value: 'África' },
  { key: 'oceania', field: 'country', value: 'Oceania' },
  { key: 'asia',    field: 'country', value: 'Ásia' },
  { key: 'marine',  field: 'biome',   value: 'Marinho' },
  { key: 'forest',  field: 'biome',   value: 'Floresta' },
  { key: 'savanna', field: 'biome',   value: 'Savana' },
]

export default function FilteredProjects({ projects, light }: { projects: ProjectWithOrg[]; light?: boolean }) {
  const { t } = useLanguage()
  const [active, setActive] = useState<FilterKey>('all')

  const filtered = active === 'all'
    ? projects
    : projects.filter(p => {
        const f = FILTERS.find(f => f.key === active)
        if (!f || !f.field) return true
        return p[f.field] === f.value
      })

  return (
    <>
      {/* Filter pills */}
      <div className="flex gap-2 mb-10 flex-wrap">
        {FILTERS.map(({ key }) => (
          <button
            key={key}
            onClick={() => setActive(key)}
            className={`text-[10px] tracking-widest uppercase border px-4 py-2 rounded-full transition-all duration-200 ${
              active === key
                ? 'border-sage bg-sage/15 text-sage'
                : light
                  ? 'border-forest/30 text-forest/55 hover:border-forest/60 hover:text-forest'
                  : 'border-white/[0.12] text-cream/45 hover:border-sage/40 hover:text-cream'
            }`}
          >
            {t.filters[key]}
          </button>
        ))}
      </div>

      {/* Card grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {filtered.map(project => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>

      {filtered.length === 0 && (
        <p className={`text-sm text-center py-24 ${light ? 'text-forest/30' : 'text-cream/30'}`}>
          {t.projetos.noResults}
        </p>
      )}
    </>
  )
}

function ProjectCard({ project }: { project: ProjectWithOrg }) {
  return (
    <Link
      href={`/projetos/${project.slug}`}
      className="group relative rounded-2xl overflow-hidden bg-canopy aspect-[3/4]
                 flex flex-col justify-end cursor-pointer"
    >
      {project.cover_image_url ? (
        <Image
          src={project.cover_image_url}
          alt={project.title}
          fill
          className="object-cover brightness-[0.82] group-hover:scale-105
                     transition-transform duration-700 ease-out"
        />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-canopy to-forest" />
      )}

      {/* Arrow top-right on hover */}
      <div className="absolute top-3 right-3 z-10
                      w-8 h-8 rounded-full bg-terra text-cream
                      flex items-center justify-center text-xs
                      opacity-0 group-hover:opacity-100
                      translate-y-1 group-hover:translate-y-0
                      transition-all duration-300">
        ↗
      </div>

      {/* Specimen catalog label — top left */}
      <div className="absolute top-3 left-3 z-10">
        <SpecimenLabel
          projectId={project.id}
          biome={project.biome}
          createdAt={project.created_at}
        />
      </div>

      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

      <div className="relative z-10 p-4">
        {project.species && (
          <span className="text-cream/55 text-[9px] tracking-widest uppercase block mb-1">
            {project.species.split(' ')[0]}
          </span>
        )}
        <h3 className="font-serif text-cream text-base font-light leading-snug line-clamp-2 mb-2">
          {project.title}
        </h3>
        <p className="text-cream/45 text-[10px] truncate">
          {project.organization?.name}
        </p>
        {project.lat != null && project.lng != null && (
          <p className="font-mono text-cream/22 text-[8px] mt-1.5 tracking-wider">
            {Math.abs(project.lat).toFixed(2)}°{project.lat < 0 ? 'S' : 'N'}{' '}
            {Math.abs(project.lng).toFixed(2)}°{project.lng < 0 ? 'O' : 'L'}
          </p>
        )}
      </div>
    </Link>
  )
}
