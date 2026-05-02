'use client'

import { Link } from '@/i18n/navigation'
import { useTranslations, useFormatter, useNow } from 'next-intl'
import type { Update, Project, Organization } from '@/types'

type UpdateWithProject = Update & {
  project: (Project & { organization: Organization | null }) | null
}

export default function FeedSection({ updates }: { updates: UpdateWithProject[] }) {
  const t = useTranslations('feed')
  const now = useNow()
  if (!updates.length) return null

  const items = updates.slice(0, 5)

  return (
    <section
      style={{ padding: '120px 24px', background: '#F5F5F5' }}
    >
      <div className="max-w-[1280px] mx-auto">
        {/* Header */}
        <div className="mb-10">
          <p className="eyebrow mb-3.5">{t('eyebrow')}</p>
          <h2 className="font-serif text-forest font-light leading-[1.1]"
              style={{ fontSize: 'clamp(32px, 4vw, 48px)' }}>
            {t('title')}
          </h2>
        </div>

        {/* Mosaico: 1 grande à esquerda + 2x2 à direita */}
        <div className="grid gap-4
                        grid-cols-1
                        md:[grid-template-columns:1.6fr_1fr_1fr]
                        md:[grid-auto-rows:1fr]">
          {items.map((u, i) => {
            const isFeatured = i === 0
            return <FeedCard key={u.id} update={u} featured={isFeatured} now={now} />
          })}
        </div>
      </div>
    </section>
  )
}

function FeedCard({ update, featured, now }: { update: UpdateWithProject; featured: boolean; now: Date }) {
  const format = useFormatter()
  const project = update.project
  const org     = project?.organization
  const href    = project ? `/projetos/${project.slug}` : '/projetos'

  return (
    <Link
      href={href}
      className={`group relative overflow-hidden bg-basalt border border-white/[0.08] block
                  ${featured ? 'md:[grid-column:1] md:[grid-row:span_2] md:min-h-[600px]' : ''}`}
      style={featured ? undefined : { aspectRatio: '4 / 3' }}
    >
      {update.image_url ? (
        /* eslint-disable-next-line @next/next/no-img-element */
        <img
          src={update.image_url}
          alt={update.title}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          style={{ filter: 'brightness(.7)' }}
        />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-canopy to-forest" />
      )}

      {/* Date tag TL */}
      <div className="absolute top-3.5 left-3.5 z-[3]">
        <span
          className="font-mono text-[9px] tracking-[0.2em] uppercase text-terra"
          style={{
            background: 'rgba(11,20,16,0.65)',
            backdropFilter: 'blur(6px)',
            WebkitBackdropFilter: 'blur(6px)',
            padding: '4px 8px',
          }}
        >
          {update.created_at ? format.relativeTime(new Date(update.created_at), now) : ''}
        </span>
      </div>

      {/* Bottom gradient */}
      <div
        className="absolute inset-0 z-[2]"
        style={{
          background: 'linear-gradient(to top, rgba(11,20,16,0.95), transparent 55%)',
        }}
      />

      {/* Content */}
      <div className="absolute bottom-0 left-0 right-0 p-5 z-[3]">
        <div className="label-mono mb-2">
          {org?.name ?? update.author_name ?? ''}
        </div>
        <h3
          className="font-serif text-cream font-light leading-[1.2] mb-2 line-clamp-2"
          style={{ fontSize: featured ? 32 : 18 }}
        >
          {update.title}
        </h3>
        {featured && update.content && (
          <p className="text-cream/70 text-sm leading-[1.6] line-clamp-3 max-w-[460px]">
            {update.content}
          </p>
        )}
      </div>
    </Link>
  )
}
