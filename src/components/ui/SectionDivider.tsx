type Props = {
  num: string
  label: string
  light?: boolean
}

export function SectionDivider({ num, label, light = true }: Props) {
  const numColor = light ? 'text-forest/40' : 'text-cream/40'
  const ruleColor = light ? 'bg-forest/[0.12]' : 'bg-cream/[0.12]'

  return (
    <div className="flex items-center gap-4 my-14">
      <span className={`font-mono text-[10px] tracking-[0.18em] ${numColor}`}>{num}</span>
      <span className="text-[11px] tracking-[0.32em] uppercase text-terra font-medium">{label}</span>
      <span className={`flex-1 h-px ${ruleColor}`} />
    </div>
  )
}
