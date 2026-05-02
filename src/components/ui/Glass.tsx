import clsx from 'clsx'
import type { CSSProperties, ElementType, ReactNode } from 'react'

/* <Glass> — frosted glass reutilizável.
 *
 *   variant="card"    → vidro fosco branco (CSS de referência):
 *                       blur 27px, inner glow branco intenso, faixas
 *                       de luz no topo e na esquerda. overflow:hidden.
 *   variant="pill"    → pílula de vidro (sem glow forte).
 *   variant="button"  → botão de vidro (sem glow forte).
 *
 *   tone — só altera a cor base; o glow/edges do card seguem brancos:
 *     dark | light | accent | lightOnLight
 */

type Variant = 'card' | 'pill' | 'button'
type Tone    = 'dark' | 'light' | 'accent' | 'lightOnLight'

const RADIUS: Record<Variant, string> = {
  card:   '20px',
  pill:   '9999px',
  button: '4px',
}

const BG: Record<Tone, string> = {
  dark:         'rgba(11, 20, 16, 0.42)',
  light:        'rgba(255, 255, 255, 0.33)',
  accent:       'rgba(196, 82, 42, 0.55)',
  lightOnLight: 'rgba(255, 255, 255, 0.55)',
}

const PILL_BORDER: Record<Tone, string> = {
  dark:         'linear-gradient(135deg, rgba(255,255,255,0.30) 0%, rgba(255,255,255,0.05) 50%, rgba(255,255,255,0.18) 100%)',
  light:        'linear-gradient(135deg, rgba(255,255,255,0.40) 0%, rgba(255,255,255,0.08) 50%, rgba(255,255,255,0.22) 100%)',
  accent:       'linear-gradient(135deg, rgba(255,255,255,0.40) 0%, rgba(255,200,180,0.10) 50%, rgba(255,200,180,0.30) 100%)',
  lightOnLight: 'linear-gradient(135deg, rgba(26,53,40,0.25) 0%, rgba(26,53,40,0.05) 50%, rgba(26,53,40,0.18) 100%)',
}

type GlassProps = {
  variant?: Variant
  tone?: Tone
  as?: ElementType
  className?: string
  children?: ReactNode
  style?: CSSProperties
} & Record<string, any>

export function Glass({
  variant = 'card',
  tone    = 'light',
  as: Tag = 'div',
  className,
  children,
  style,
  ...rest
}: GlassProps) {

  if (variant === 'card') {
    return (
      <Tag
        className={clsx('relative overflow-hidden', className)}
        style={{
          background:           BG[tone],
          backdropFilter:       'blur(27px)',
          WebkitBackdropFilter: 'blur(27px)',
          border:               '1px solid rgba(255, 255, 255, 0.30)',
          // Box-shadow do CSS de referência: drop shadow + inset highlight
          // top + inset shadow bottom + inner glow branco intenso.
          boxShadow: `
            0 8px 32px rgba(0, 0, 0, 0.10),
            inset 0 1px 0 rgba(255, 255, 255, 0.50),
            inset 0 -1px 0 rgba(255, 255, 255, 0.10),
            inset 0 0 40px 20px rgba(255, 255, 255, 1)
          `,
          borderRadius: RADIUS[variant],
          ...style,
        }}
        {...rest}
      >
        {/* ::before — faixa de luz horizontal no topo */}
        <span
          aria-hidden
          style={{
            position:      'absolute',
            top:           0,
            left:          0,
            right:         0,
            height:        1,
            background:    'linear-gradient(90deg, transparent, rgba(255,255,255,0.8), transparent)',
            pointerEvents: 'none',
          }}
        />
        {/* ::after — faixa de luz vertical na esquerda */}
        <span
          aria-hidden
          style={{
            position:      'absolute',
            top:           0,
            left:          0,
            width:         1,
            height:        '100%',
            background:    'linear-gradient(180deg, rgba(255,255,255,0.8), transparent, rgba(255,255,255,0.3))',
            pointerEvents: 'none',
          }}
        />
        {children}
      </Tag>
    )
  }

  // pill / button — vidro mais discreto, sem inner glow forte (caso contrário
  // pílulas pequenas viram bolinhas brancas chapadas).
  return (
    <Tag
      className={clsx('relative', className)}
      style={{
        isolation:            'isolate',
        background:           BG[tone],
        backdropFilter:       'blur(20px) saturate(180%)',
        WebkitBackdropFilter: 'blur(20px) saturate(180%)',
        boxShadow: `
          inset 0 1px 0 0 rgba(255,255,255,0.10),
          0 8px 24px -6px rgba(0,0,0,0.30)
        `,
        borderRadius: RADIUS[variant],
        ...style,
      }}
      {...rest}
    >
      <span
        aria-hidden
        style={{
          position:            'absolute',
          inset:               0,
          borderRadius:        'inherit',
          padding:             '1px',
          background:          PILL_BORDER[tone],
          WebkitMask:          'linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)',
          WebkitMaskComposite: 'xor',
          maskComposite:       'exclude',
          pointerEvents:       'none',
          zIndex:              -1,
        }}
      />
      {children}
    </Tag>
  )
}
