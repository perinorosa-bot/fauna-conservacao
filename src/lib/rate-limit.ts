import { NextRequest, NextResponse } from 'next/server'

/**
 * Rate limiter com dois modos:
 * 1. Upstash REST (produção) — se UPSTASH_REDIS_REST_URL/TOKEN estiverem setadas.
 * 2. In-memory (dev) — fallback. Não funciona em múltiplas instâncias serverless;
 *    ainda assim protege contra spam acidental durante desenvolvimento.
 */

type Bucket = { count: number; resetAt: number }
const memoryStore = new Map<string, Bucket>()

const UPSTASH_URL   = process.env.UPSTASH_REDIS_REST_URL
const UPSTASH_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN
const upstashEnabled = !!(UPSTASH_URL && UPSTASH_TOKEN)

function getIp(req: NextRequest): string {
  const fwd = req.headers.get('x-forwarded-for')
  if (fwd) return fwd.split(',')[0].trim()
  return req.headers.get('x-real-ip') ?? 'unknown'
}

async function upstashIncr(key: string, windowSeconds: number): Promise<number> {
  // INCR + EXPIRE na primeira ocorrência. Pipeline de 2 comandos.
  const res = await fetch(`${UPSTASH_URL}/pipeline`, {
    method:  'POST',
    headers: { Authorization: `Bearer ${UPSTASH_TOKEN}`, 'Content-Type': 'application/json' },
    body:    JSON.stringify([['INCR', key], ['EXPIRE', key, String(windowSeconds), 'NX']]),
    cache:   'no-store',
  })
  if (!res.ok) throw new Error(`Upstash error: ${res.status}`)
  const data = await res.json() as Array<{ result: number }>
  return data[0]?.result ?? 0
}

function memoryIncr(key: string, windowSeconds: number): number {
  const now    = Date.now()
  const bucket = memoryStore.get(key)
  if (!bucket || bucket.resetAt < now) {
    memoryStore.set(key, { count: 1, resetAt: now + windowSeconds * 1000 })
    return 1
  }
  bucket.count++
  return bucket.count
}

export type RateLimitConfig = {
  /** Identificador da rota (ex: 'donations:create') — vira parte da chave. */
  key:     string
  /** Máximo de requisições permitidas na janela. */
  max:     number
  /** Janela em segundos. */
  windowSeconds: number
}

/**
 * Retorna NextResponse com 429 se o limite foi excedido, ou null se OK.
 * Use no início do handler:
 *
 *   const limited = await rateLimit(req, { key: 'donations:create', max: 5, windowSeconds: 60 })
 *   if (limited) return limited
 */
export async function rateLimit(
  req: NextRequest,
  config: RateLimitConfig,
): Promise<NextResponse | null> {
  const ip       = getIp(req)
  const fullKey  = `rl:${config.key}:${ip}`

  let count: number
  try {
    count = upstashEnabled
      ? await upstashIncr(fullKey, config.windowSeconds)
      : memoryIncr(fullKey, config.windowSeconds)
  } catch (err) {
    // Se o Upstash falhar, não derruba a requisição — apenas loga.
    console.error('[rate-limit] store failed', err)
    return null
  }

  if (count > config.max) {
    return NextResponse.json(
      { error: 'Muitas requisições. Tente novamente em alguns instantes.' },
      {
        status:  429,
        headers: {
          'Retry-After':           String(config.windowSeconds),
          'X-RateLimit-Limit':     String(config.max),
          'X-RateLimit-Remaining': '0',
        },
      },
    )
  }
  return null
}
