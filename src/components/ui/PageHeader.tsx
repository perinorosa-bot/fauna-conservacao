type Props = {
  eyebrow?: string
  title: string
  subtitle?: string
  meta?: string
}

export function PageHeader({ eyebrow, title, subtitle, meta }: Props) {
  return (
    <header className="text-center mb-20">
      {eyebrow && <div className="eyebrow mb-6">{eyebrow}</div>}
      <h1 className="text-[64px] font-light tracking-[-0.02em] leading-[1.05] text-forest m-0 mb-5 max-md:text-[44px]">
        {title}
      </h1>
      {subtitle && (
        <p className="text-sm text-forest/55 max-w-[560px] mx-auto leading-[1.6]">
          {subtitle}
        </p>
      )}
      {meta && (
        <div className="mt-8 font-mono text-[10px] tracking-[0.2em] uppercase text-forest/40">
          {meta}
        </div>
      )}
    </header>
  )
}
