'use client'

import { useEffect, useRef, useState } from 'react'

type Props = {
  value: number      // 0–100
  raised: number
  currency: string
}

export default function ProgressBar({ value, raised, currency }: Props) {
  const [width, setWidth] = useState(0)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setWidth(value); obs.disconnect() } },
      { threshold: 0.5 }
    )
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [value])

  const formatted = new Intl.NumberFormat('pt-BR', {
    style: 'currency', currency, maximumFractionDigits: 0
  }).format(raised)

  return (
    <div ref={ref} className="w-28">
      <div className="flex justify-between text-xs text-cream/38 mb-1.5">
        <span>{formatted}</span>
        <span>{value}%</span>
      </div>
      <div className="h-0.5 bg-white/[0.08] rounded-full">
        <div className="h-full rounded-full bg-gradient-to-r from-leaf to-sage progress-fill"
             style={{ width: `${width}%` }}/>
      </div>
    </div>
  )
}
