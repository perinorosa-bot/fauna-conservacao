// Mapeia mensagens de erro do Supabase Auth (vêm em inglês) para uma
// chave de tradução do namespace `authErrors`. Cada formulário usa o
// resultado com seu próprio `t = useTranslations()`.
//
// Mensagens não mapeadas caem no `generic` para não vazar inglês cru
// na UI. O console.warn ajuda a flagar pra adicionar.

type ErrLike = { message?: string } | Error | null | undefined

export type TranslatedAuthError = {
  key: string
  values?: Record<string, string | number>
}

// Keys são relativas ao namespace `authErrors` — cada form usa
// `useTranslations('authErrors')` e chama `t(key, values)`.
const PATTERNS: Array<[RegExp, string]> = [
  [/email rate limit exceeded/i,                                   'rateLimit'],
  [/over (email|sms) send rate limit/i,                            'rateLimit'],
  [/email address.*is invalid|unable to validate email address|invalid format/i, 'invalidEmail'],
  [/user already registered|already registered|already exists/i,   'alreadyRegistered'],
  [/invalid login credentials/i,                                   'invalidCredentials'],
  [/email not confirmed/i,                                         'notConfirmed'],
  [/signups? not allowed/i,                                        'signupsDisabled'],
  [/network request failed|fetch failed/i,                         'networkFailed'],
  [/captcha/i,                                                     'captcha'],
]

export function translateAuthError(err: ErrLike): TranslatedAuthError {
  const raw = (err as any)?.message ?? ''
  if (!raw) return { key: 'generic' }

  const pwLen = raw.match(/password should be at least (\d+) characters?/i)
  if (pwLen) return { key: 'passwordTooShort', values: { min: Number(pwLen[1]) } }

  const wait = raw.match(/for security purposes, you can only request this after (\d+) seconds?/i)
  if (wait) return { key: 'waitSeconds', values: { seconds: Number(wait[1]) } }

  for (const [re, key] of PATTERNS) {
    if (re.test(raw)) return { key }
  }

  if (typeof console !== 'undefined') console.warn('[auth] untranslated error:', raw)
  return { key: 'generic' }
}

// Helper para os formulários: aplica o `t` do namespace authErrors ao
// resultado. Cada chamador faz `const tErr = useTranslations('authErrors')`
// e chama `applyAuthError(err, tErr)`.
export function applyAuthError(
  err: ErrLike,
  t: (key: any, values?: Record<string, any>) => string,
): string {
  const { key, values } = translateAuthError(err)
  return t(key, values)
}
