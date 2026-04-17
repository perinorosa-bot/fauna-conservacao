import clsx from 'clsx'

type Props = {
  text: string       // text that arcs around the circle
  centerText?: string
  size?: number
  className?: string
}

export function StampBadge({ text, centerText, size = 96, className }: Props) {
  const cx = size / 2
  const cy = size / 2
  const r = size / 2 - 7   // inner radius for text path
  const rDash = size / 2 - 3 // radius for dotted border

  // Circular path going clockwise from left
  const pathD = `M ${cx - r} ${cy} A ${r} ${r} 0 1 1 ${cx + r - 0.01} ${cy}`
  const id = `stamp-path-${text.slice(0, 8).replace(/\s/g, '')}`

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      className={clsx('select-none', className)}
      aria-hidden
    >
      {/* Dotted border */}
      <circle
        cx={cx} cy={cy} r={rDash}
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
        strokeDasharray="2 3.5"
        opacity="0.45"
      />

      <defs>
        <path id={id} d={pathD} />
      </defs>

      {/* Arc text */}
      <text
        fontSize={size < 80 ? 7 : 8}
        letterSpacing="2.5"
        fill="currentColor"
        opacity="0.55"
        fontFamily="var(--font-inter)"
        textLength={Math.PI * r * 1.92}
        lengthAdjust="spacing"
      >
        <textPath href={`#${id}`} startOffset="0%">
          {text}
        </textPath>
      </text>

      {/* Center text */}
      {centerText && (
        <text
          x={cx} y={cy + 5}
          textAnchor="middle"
          fontSize={size < 80 ? 9 : 11}
          fontFamily="var(--font-im-fell)"
          fill="currentColor"
          opacity="0.7"
        >
          {centerText}
        </text>
      )}
    </svg>
  )
}
