'use client'

import Link from 'next/link'
import Image from 'next/image'
import type { Update, Project, Organization } from '@/types'
import { useLanguage } from '@/lib/i18n/LanguageContext'
import { SpecimenLabel } from '@/components/ui/SpecimenLabel'

type UpdateWithProject = Update & {
  project: (Project & { organization: Organization }) | null
}

export default function FeedSection({ updates }: { updates: UpdateWithProject[] }) {
  const { t } = useLanguage()

  if (!updates.length) return null

  return (
    <section id="projetos" className="px-8 md:px-10 py-24 md:py-28 max-w-screen-xl mx-auto">

      {/* Section header */}
      <div className="flex items-end justify-between mb-12">
        <div>
          <p className="font-mono text-terra/65 text-[9px] tracking-[0.35em] uppercase mb-4">
            {t.feed.eyebrow}
          </p>
          <h2 className="font-serif text-4xl md:text-5xl text-cream leading-tight">
            {t.feed.title}<br />
            <em className="italic text-terra">{t.feed.titleEm}</em>
          </h2>
        </div>
        <Link
          href="/projetos"
          className="flex items-center gap-2 border border-white/15 text-cream/60
                     font-mono text-[9px] tracking-[0.25em] uppercase px-5 py-3
                     hover:border-terra/40 hover:text-cream transition-all duration-200 flex-shrink-0 mb-1 group"
        >
          {t.feed.seeAll}
          <span className="w-4 h-px bg-cream/30 group-hover:w-6 group-hover:bg-terra/60 transition-all duration-300" />
        </Link>
      </div>

      {/* Cards grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {updates.map((update) => {
          const project = update.project
          const org     = project?.organization
          const pct     = project
            ? Math.round((project.raised_amount / project.goal_amount) * 100)
            : 0

          return (
            <Link
              key={update.id}
              href={project ? `/projetos/${project.slug}` : '/projetos'}
              className="group relative rounded-2xl overflow-hidden bg-canopy aspect-[3/4]
                         flex flex-col justify-end cursor-pointer"
            >
              {update.image_url ? (
                <Image
                  src={update.image_url}
                  alt={update.title}
                  fill
                  className="object-cover brightness-[0.82] group-hover:scale-105
                             transition-transform duration-700 ease-out"
                />
              ) : (
                <div className="absolute inset-0 bg-gradient-to-br from-canopy to-forest" />
              )}

              {/* Specimen label top-left */}
              {project && (
                <div className="absolute top-3 left-3 z-10">
                  <SpecimenLabel
                    projectId={project.id}
                    biome={project.biome}
                    createdAt={project.created_at}
                  />
                </div>
              )}

              <div className="absolute top-3 right-3 z-10
                              w-8 h-8 rounded-full bg-terra text-cream
                              flex items-center justify-center text-xs
                              opacity-0 group-hover:opacity-100
                              translate-y-1 group-hover:translate-y-0
                              transition-all duration-300">
                ↗
              </div>

              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />

              <div className="relative z-10 p-4">
                {project?.species && (
                  <span className="text-cream/60 text-[9px] tracking-widest uppercase block mb-1">
                    {project.species.split(' ')[0]}
                  </span>
                )}
                <h3 className="font-serif text-cream text-lg font-light leading-snug line-clamp-2 mb-1">
                  {project?.title ?? update.title}
                </h3>
                <p className="text-cream/55 text-[11px]">
                  {org?.name ?? ''}
                  {pct > 0 && (
                    <span className="text-terra ml-2">{pct}% {t.feed.funded}</span>
                  )}
                </p>
              </div>
            </Link>
          )
        })}
      </div>

      <div className="mt-10 text-center flex flex-col items-center gap-3">
        <Link href="/projetos" className="btn-primary">
          {t.feed.seeAllBtn}
        </Link>
        <p className="font-mono text-cream/20 text-[8px] tracking-[0.3em] uppercase">
          {new Date().getFullYear()} · Fauna Conservation Platform
        </p>
      </div>
    </section>
  )
}