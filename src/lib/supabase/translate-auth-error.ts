// Mapeia mensagens de erro do Supabase Auth (vêm em inglês) para
// português pt-BR. Usado em todos os formulários de login/signup.
//
// Mensagens não mapeadas caem no fallback genérico para não vazar
// inglês cru na UI. Se aparecer um erro frequente que não está aqui,
// adicionar à MAP — o console.warn ajuda a flagar.

type ErrLike = { message?: string } | Error | null | undefined

const MAP: Array<[RegExp, string]> = [
  [/email rate limit exceeded/i,
    'Limite de envios de e-mail atingido. Tente novamente em uma hora.'],
  [/over (email|sms) send rate limit/i,
    'Limite de envios atingido. Tente novamente em uma hora.'],
  [/email address.*is invalid|unable to validate email address|invalid format/i,
    'E-mail inválido. Use um endereço de e-mail válido.'],
  [/user already registered|already registered|already exists/i,
    'Esta conta já existe. Faça login em vez de criar uma nova.'],
  [/invalid login credentials/i,
    'E-mail ou senha incorretos.'],
  [/email not confirmed/i,
    'Confirme seu e-mail antes de entrar. Verifique sua caixa de entrada.'],
  [/signups? not allowed/i,
    'Cadastros desabilitados no momento.'],
  [/network request failed|fetch failed/i,
    'Falha de conexão. Verifique sua internet e tente novamente.'],
  [/captcha/i,
    'Falha na verificação de segurança. Recarregue a página e tente novamente.'],
]

export function translateAuthError(err: ErrLike): string {
  const raw = (err as any)?.message ?? ''
  if (!raw) return 'Erro desconhecido. Tente novamente.'

  // Casos com captura de número (interpoladas).
  const pwLen = raw.match(/password should be at least (\d+) characters?/i)
  if (pwLen) return `A senha deve ter pelo menos ${pwLen[1]} caracteres.`

  const wait = raw.match(/for security purposes, you can only request this after (\d+) seconds?/i)
  if (wait) return `Aguarde ${wait[1]} segundos antes de tentar novamente.`

  for (const [re, msg] of MAP) {
    if (re.test(raw)) return msg
  }

  // Não mapeado — loga para podermos adicionar depois, mas devolve fallback amigável.
  if (typeof console !== 'undefined') console.warn('[auth] untranslated error:', raw)
  return 'Não foi possível concluir a operação. Tente novamente em alguns instantes.'
}
