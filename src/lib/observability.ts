/**
 * Camada fina sobre Sentry para captura de erros em produção.
 *
 * Como instalar (recomendado em produção):
 *   npm install @sentry/nextjs
 *   npx @sentry/wizard@latest -i nextjs
 *
 * Sem o SDK instalado ou sem NEXT_PUBLIC_SENTRY_DSN setado, esta camada
 * apenas chama console.error — o app não quebra.
 */

const SENTRY_DSN = process.env.NEXT_PUBLIC_SENTRY_DSN
const enabled    = !!SENTRY_DSN

// Tipagem mínima do que usamos do Sentry (evita exigir @sentry/nextjs no build).
type SentryLike = {
  withScope:        (cb: (scope: SentryScope) => void) => void
  captureException: (err: unknown) => void
  captureMessage:   (msg: string) => void
}
type SentryScope = {
  setTag:    (k: string, v: string) => void
  setUser:   (user: { id: string }) => void
  setExtras: (data: Record<string, unknown>) => void
}

let sentryModule: SentryLike | null = null
let sentryLoadAttempted = false

async function loadSentry(): Promise<SentryLike | null> {
  if (sentryLoadAttempted) return sentryModule
  sentryLoadAttempted = true
  if (!enabled) return null
  try {
    // Sentry é dependência opcional. webpackIgnore evita resolução em build-time
    // e a string indireta esconde o módulo do typecheck (sem precisar dos types).
    const moduleName = '@sentry/nextjs'
    sentryModule = (await import(/* webpackIgnore: true */ moduleName).catch(() => null)) as SentryLike | null
  } catch {
    sentryModule = null
  }
  return sentryModule
}

export type ErrorContext = {
  /** Tag livre da rota/contexto, ex: 'webhook:stripe' */
  scope?:  string
  /** Dados adicionais (body, ids, etc) — não inclua segredos. */
  extra?:  Record<string, unknown>
  /** ID do usuário, se houver. */
  userId?: string
}

export async function captureException(err: unknown, ctx: ErrorContext = {}) {
  // Sempre loga no console — útil em dev e como backup.
  console.error(`[${ctx.scope ?? 'app'}]`, err, ctx.extra ?? '')

  const sentry = await loadSentry()
  if (!sentry) return

  sentry.withScope(scope => {
    if (ctx.scope)  scope.setTag('scope', ctx.scope)
    if (ctx.userId) scope.setUser({ id: ctx.userId })
    if (ctx.extra)  scope.setExtras(ctx.extra)
    sentry.captureException(err)
  })
}

export async function captureMessage(message: string, ctx: ErrorContext = {}) {
  console.warn(`[${ctx.scope ?? 'app'}]`, message, ctx.extra ?? '')

  const sentry = await loadSentry()
  if (!sentry) return

  sentry.withScope(scope => {
    if (ctx.scope)  scope.setTag('scope', ctx.scope)
    if (ctx.userId) scope.setUser({ id: ctx.userId })
    if (ctx.extra)  scope.setExtras(ctx.extra)
    sentry.captureMessage(message)
  })
}
