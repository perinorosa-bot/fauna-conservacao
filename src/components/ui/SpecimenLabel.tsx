type Props = {
  projectId: string
  biome?: string
  createdAt?: string
  light?: boolean
}

export function SpecimenLabel({ projectId, biome, createdAt, light = false }: Props) {
  const code = `ESP-${projectId.replace(/-/g, '').slice(0, 4).toUpperCase()}`
  const year = createdAt ? new Date(createdAt).getFullYear() : new Date().getFullYear()

  const rest = [biome, String(year)].filter(Boolean).join(' · ')

  return (
    <span className="font-mono text-[8px] tracking-widest uppercase leading-none">
      <span className="text-terra/70">{code}</span>
      {rest && (
        <span className={light ? 'text-forest/35' : 'text-cream/30'}> · {rest}</span>
      )}
    </span>
  )
}
