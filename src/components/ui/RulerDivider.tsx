import clsx from 'clsx'

type Props = {
  className?: string
  light?: boolean
}

export function RulerDivider({ className, light = false }: Props) {
  const color = light ? 'rgba(26,53,40,0.18)' : 'rgba(237,229,208,0.15)'

  return (
    <div className={clsx('w-full overflow-hidden select-none', className)} aria-hidden>
      <svg width="100%" height="18" preserveAspectRatio="none">
        <defs>
          {/* 1 mm tick every 8px */}
          <pattern id="tick-sm" x="0" y="0" width="8" height="18" patternUnits="userSpaceOnUse">
            <line x1="0" y1="10" x2="0" y2="16" stroke={color} strokeWidth="0.6" />
          </pattern>
          {/* 5 mm tick every 40px */}
          <pattern id="tick-md" x="0" y="0" width="40" height="18" patternUnits="userSpaceOnUse">
            <line x1="0" y1="7" x2="0" y2="16" stroke={color} strokeWidth="0.8" />
          </pattern>
          {/* 10 mm tick every 80px */}
          <pattern id="tick-lg" x="0" y="0" width="80" height="18" patternUnits="userSpaceOnUse">
            <line x1="0" y1="4" x2="0" y2="16" stroke={color} strokeWidth="1" />
          </pattern>
        </defs>

        {/* baseline */}
        <line x1="0" y1="16" x2="100%" y2="16" stroke={color} strokeWidth="0.6" />

        {/* tick layers */}
        <rect width="100%" height="18" fill="url(#tick-sm)" />
        <rect width="100%" height="18" fill="url(#tick-md)" />
        <rect width="100%" height="18" fill="url(#tick-lg)" />
      </svg>
    </div>
  )
}
