'use client'

import { useLanguage } from '@/lib/i18n/LanguageContext'

export default function ProjectsPageHeader({ count }: { count: number }) {
  const { t } = useLanguage()
  const p = t.projetos

  return (
    <div className="mb-12 border-b border-forest/[0.08] pb-10">
      <span className="text-sage text-[10px] tracking-[0.25em] uppercase block mb-4">
        {p.eyebrow}
      </span>
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <h1 className="font-serif text-5xl md:text-6xl font-light text-forest">
          {p.title} <em className="italic text-sage">{p.titleEm}</em>
        </h1>
        <p className="text-forest/35 text-sm tracking-wide self-end mb-1">
          {count} {p.countSuffix}
        </p>
      </div>
      <p className="mt-5 text-forest/45 text-sm leading-loose max-w-xl">
        {p.subtitle}
      </p>
    </div>
  )
}
