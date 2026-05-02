# i18n migration plan — custom LanguageContext → next-intl

Closes #9. Plan completo con investigación + fases + riesgos.

## 1. Resumen ejecutivo

Hoy Fauna tiene un `LanguageContext` client-only (cookie `fauna-lang`) + un `translations.ts` de **929 líneas** que cubre **16 namespaces** (nav, hero, feed, stats, trust, species, footer, howItWorks, cta, projetos, filters, entrar, comoFunciona, donorProfile, orgDash, apoie). Solo **19 archivos** usan `useLanguage()`; el resto — incluidos el admin dashboard completo, `/faq`, `/privacidade`, `/cookies`, `/contato`, `/entrar`, `/organizacoes/cadastro`, `/doacao/sucesso`, `/loja/*`, `/academy/*`, `OrgRegisterForm`, `DonationForm`, `CookieBanner`, gran parte del `Nav` y todo el `Footer` — tiene strings hardcoded en pt-BR. Además, los archivos "i18n-enabled" como `/org/painel` mezclan keys traducidas con banners de Stripe en pt-BR. Por eso #9 dice "las páginas no se traducen correctamente": el sistema está traduciendo una fracción chica y el usuario ve mezcla.

La propuesta: migrar a **next-intl 4.9.0** (ya instalado) con **routing por prefijo de locale** (`/en`, `/es` y `pt` como default sin prefijo), server-first, reemplazando el `LanguageContext`. Estimado total: **28-38 horas** de trabajo, dividido en 6 fases. La mayor parte del tiempo (fases 3-5) es refactor mecánico y completar strings faltantes, no arquitectura.

## 2. Investigación — hallazgos concretos

### 2.1 Inventario de archivos que usan `useLanguage()` (19 archivos)

| Archivo | Namespaces consumidos |
|---|---|
| `src/components/layout/Nav.tsx` | `nav` (solo `projects`, `donate`) |
| `src/components/ParallaxHero.tsx` | `hero` |
| `src/components/FeedSection.tsx` | `feed` |
| `src/components/StatsBar.tsx` | `stats`, `trust` |
| `src/components/SpeciesCounter.tsx` | `species` |
| `src/components/HowItWorks.tsx` | `howItWorks` |
| `src/components/CtaSection.tsx` | `cta` |
| `src/components/ProjectsPageHeader.tsx` | `projetos` |
| `src/components/FilteredProjects.tsx` | `filters`, `projetos` (parcial) |
| `src/app/como-funciona/page.tsx` | `comoFunciona` |
| `src/app/sobre/page.tsx` | `comoFunciona` |
| `src/app/apoie/page.tsx` | `apoie` |
| `src/app/perfil/page.tsx` | `donorProfile` |
| `src/app/org/(dashboard)/layout.tsx` | `orgDash` |
| `src/app/org/(dashboard)/painel/page.tsx` | `orgDash` (parcial — banners Stripe en pt hardcoded) |
| `src/app/org/(dashboard)/perfil/page.tsx` | `orgDash` |
| `src/app/org/(dashboard)/projetos/novo/page.tsx` | `orgDash` |
| `src/app/org/(dashboard)/atualizacoes/nova/page.tsx` | `orgDash` |
| `src/lib/i18n/LanguageContext.tsx` | (infra, se elimina) |

Consumo típico: el namespace se toma en una variable de una letra (`o = t.orgDash`, `d = t.donorProfile`, `c = t.cta`). Refactor mecánico trivial.

### 2.2 Estructura sugerida de `messages/`

**Un archivo por locale con namespaces planos**: `messages/{pt,en,es}.json`. Razones: los 929 líneas se vuelven ~700-800 JSON por idioma, manejable; mejor tipado con `IntlMessages` inferred; splittear después no rompe nada.

Mantener los 16 namespaces actuales + agregar los nuevos: `authForms`, `adminDash`, `faq`, `legal`, `contato`, `orgRegister`, `donationForm`, `cookies`, `academy`, `loja`, `common`.

### 2.3 Strings hardcoded en pt-BR — auditoría por prioridad

**P0 — dashboards (menciona #9 explícitamente):**
- `src/components/admin/AdminSidebar.tsx` — 6 labels menú, "Ver site", "Sair" (líneas 9-14, 64, 70)
- `src/app/admin/(dashboard)/page.tsx` — titular, subtitular, 4 stats, alert pendentes, "Doações recentes", "Organizações recentes", "Nenhuma ... ainda", "Verificada/Pendente", "Ver todas" (líneas 27-32, 37-39, 57-63, 73-74, 85, 93-94, 104, 108)
- `src/app/admin/(dashboard)/organizations/page.tsx` — h1, subtitulo, column headers, "Verificada/Pendente", "Nenhuma organização cadastrada" (líneas 15-16, 23-28, 48, 62)
- `src/app/admin/(dashboard)/donations/page.tsx` — h1, "registradas", "Total arrecadado", 6 column headers, "Anônimo", "Nenhuma doação registrada" (líneas 18-19, 22, 33-38, 46, 68)
- `src/app/admin/(dashboard)/projects/page.tsx` — h1, "cadastrados", 7 headers, `statusLabel` map (Ativo/Pausado/Concluído), "Nenhum projeto cadastrado" (líneas 17-19, 24-25, 32-38, 80)
- `src/app/admin/(dashboard)/updates/page.tsx` — h1, "publicadas", "por {autor}", "Nenhuma atualização publicada" (líneas 16-17, 40, 54)
- `src/app/admin/(dashboard)/users/page.tsx` — h1, "cadastrados", `roleLabel` (Admin/Organização/Doador), 4 headers, "Nenhum usuário cadastrado" (líneas 17-19, 24-25, 32-35, 59)
- `src/app/admin/login/page.tsx` — "Painel administrativo", labels form, "E-mail ou senha incorretos", "Entrar/Entrando", "Somente administradores têm acesso" (líneas 23, 39, 45, 60, 81, 85)
- `src/components/admin/{OrgActions,ProjectActions,UpdateActions,UserActions}.tsx` — acciones tipo "Verificar", "Suspender", "Eliminar"
- `src/app/org/(dashboard)/painel/page.tsx` — banners Stripe Connect (líneas 115, 121, 127, 133, 141, 150-151, 158-161, 167, 176-178, 185) y `"+ Update"` (244). Mezcla en un archivo que ya usa `t.orgDash` — peor de los mundos.

**P1 — páginas públicas sin i18n (alta visibilidad):**
- `src/components/layout/Nav.tsx` — "Sobre", "Academy", "Nossa loja", "Nos apoie", "Tem um projeto?", "Meu perfil"/"Entrar", tooltips audio, flags (líneas 140, 152, 157, 171, 197, 208, 255)
- `src/components/layout/Footer.tsx` — toda la estructura (Plataforma/Conta/Ajuda + entries + "Taxa zero sobre doações") hardcoded; `t.footer.rights` solo cubre copyright (líneas 21-46)
- `src/app/entrar/page.tsx` — 3 estados (selector donor/org, form donor, form org), ~40 strings (líneas 67-220)
- `src/app/org/login/page.tsx` — ~15 strings
- `src/app/organizacoes/cadastro/page.tsx` — pitch lateral + form, 4 bullets, títulos
- `src/components/OrgRegisterForm.tsx` — form completo (3 steps), ~30 strings (líneas 53, 98, 127-128, 135, 145-167, 180-256)
- `src/components/DonationForm.tsx` — form 4-steps, ~25 strings (líneas 43, 48-49, 136, 146-150, 169, 179, 188-190, 202-204, 240-265, 274, 275, 302, 308-310, 314)
- `src/app/doacao/sucesso/page.tsx` — "Obrigado pela sua doação", "Ver projeto", "Explorar outros projetos" (líneas 24-46)
- `src/components/CookieBanner.tsx` — mensaje, "Saiba mais", "Recusar", "Aceitar" (líneas 37, 44-50, 60, 67)

**P2 — prosa larga (legal, FAQ, contato, sobre, loja, academy):**
- `src/app/faq/page.tsx` — 29 preguntas × 3 idiomas = 87 entradas + 3 secciones + hero + CTA (líneas 10-169)
- `src/app/privacidade/page.tsx` — 10 secciones LGPD (líneas 19-65)
- `src/app/cookies/page.tsx` — 6 secciones + tabla (líneas 19-74)
- `src/app/contato/page.tsx` — hero, 3 emails, 4 form labels, selector Assunto (5 opciones), feedback
- `src/app/loja/*.tsx` — 671 líneas alto volumen
- `src/app/academy/*.tsx` — 7 archivos, ~1100 líneas totales

**P3 — fuera de scope:**
- `MOCK_PROJECTS` en `src/app/projetos/page.tsx` y `/projetos/[slug]/page.tsx` — dejarlos hardcoded pt (fixtures de demo)
- Error messages backend Supabase — issue #14 separado

### 2.4 Estado de cobertura actual en en/es

- **Estructural:** los 16 namespaces tienen las 3 variantes pt/en/es completas — no hay keys vacías.
- **Calidad:** traducciones existentes bien hechas, no son Google Translate obvio.
- **Problema real:** cobertura ~**15-20%** del total de strings. Los 929 renglones cubren 19 archivos. Admin, FAQ, legal, login, cadastro org, donation form, cookie banner, nav completo, footer completo — ~80% sin traducir.
- **Pattern flojo:** `pt.apoie.tiers` usa BRL ("R$ 25/mês") mientras `en/es.apoie.tiers` usa USD ("$5/month") — **conversión de moneda mezclada con traducción**. Decidir en fase 5.

### 2.5 Config actual vs requerida

**Actual:** `next-intl@4.9.0` instalado pero 0 imports. Sin plugin en `next.config.js`. Middleware solo hace auth-guard (`/admin/*`, `/org/*`). App Router sin `[locale]`. `<html lang="pt-BR">` estático en `src/app/layout.tsx:40`. Solo 6 `export const metadata`.

**Requerido:**
1. `next.config.js` envuelto con `createNextIntlPlugin('./src/i18n/request.ts')`
2. `src/i18n/routing.ts` — `locales: ['pt','en','es']`, `defaultLocale: 'pt'`, `localePrefix: 'as-needed'`
3. `src/i18n/request.ts` — `getRequestConfig` cargando `messages/${locale}.json`
4. `src/i18n/navigation.ts` — `createNavigation(routing)` exportando wrappers localizados
5. Mover `src/app/*` bajo `src/app/[locale]/*` (excepto `app/api/*` y `app/auth/callback/route.ts`)
6. Layout raíz en `src/app/[locale]/layout.tsx` con `<html lang>` dinámico + `<NextIntlClientProvider>`
7. `middleware.ts` combinado: i18n primero, auth después

### 2.6 Breaking changes

- **URLs:** con `localePrefix: 'as-needed'`, pt queda en `/` → no rompe links existentes. Solo `/en/*` y `/es/*` son nuevas.
- `LanguageContext` desaparece. 19 archivos → `useTranslations(ns)` (client) o `getTranslations(ns)` (server). Dropdown locale hace `router.replace(pathname, { locale })` de `@/i18n/navigation`.
- Cookie `fauna-lang` → `NEXT_LOCALE`. Migración one-shot en middleware.
- Middleware matcher cambia a `['/((?!api|_next|_vercel|.*\\..*).*)']`.
- Metadata estática → `generateMetadata({ params: { locale } })` con `getTranslations`.
- `<html lang>` dinámico en layout `[locale]`.
- API routes y `/auth/callback` no se tocan.
- `usePathname` devuelve con prefijo — archivos que hacen `path.startsWith('/projetos')` usan el `usePathname` de `@/i18n/navigation` que devuelve sin prefijo. Afectados: `Nav.tsx:139,144,175`, `Footer.tsx:10`, `AdminSidebar.tsx:38`, `org/layout.tsx:65`.
- `date-fns` locale dinámico: hoy `projetos/[slug]/page.tsx` usa `ptBR` hardcoded. Mapear `pt→ptBR, en→enUS, es→es` o migrar a `useFormatter().relativeTime(...)`.

## 3. Fases

### FASE 1 — Setup next-intl (≈4-5h)

**Objetivo:** app levanta con next-intl habilitado, middleware combinado funcionando, `/`, `/en`, `/es` ruteun.

**Crear:**
- `src/i18n/routing.ts`, `src/i18n/navigation.ts`, `src/i18n/request.ts`
- `messages/pt.json`, `messages/en.json`, `messages/es.json` (inicialmente derivados en fase 2)

**Modificar:**
- `next.config.js` — envolver con `createNextIntlPlugin`
- `src/middleware.ts` — combinar i18n primero, auth después. Matcher nuevo. Redirects preservando locale.
- `src/app/layout.tsx` → mover a `src/app/[locale]/layout.tsx`. `generateStaticParams`. `<html lang={locale}>`. `<NextIntlClientProvider>`.
- **MOVER** toda `src/app/*` (excepto `api/*` y `auth/*`) bajo `src/app/[locale]/*`.

**Done:** `npm run dev` OK. `/` home en pt. `/en/projetos`, `/es/projetos` ruteun. Auth-guard funciona. Dropdown locale aún no funciona (fase 3).

### FASE 2 — Migración `translations.ts` → `messages/*.json` (≈1-2h)

Script one-shot en Node:
```ts
import { translations } from '../src/lib/i18n/translations'
import fs from 'fs'
(['pt','en','es'] as const).forEach(l => {
  fs.writeFileSync(`messages/${l}.json`, JSON.stringify(translations[l], null, 2))
})
```
Correr con `npx tsx scripts/export-translations.ts`. ICU: el string `'Verifique {email} e clique...'` ya es ICU-compatible.

**Type-safety:** crear `src/types/messages.d.ts`:
```ts
type Messages = typeof import('../../messages/pt.json')
declare global { interface IntlMessages extends Messages {} }
```

### FASE 3 — Refactor mecánico 19 archivos (≈6-8h)

Patrón:
```diff
- import { useLanguage } from '@/lib/i18n/LanguageContext'
+ import { useTranslations } from 'next-intl'
- const { t } = useLanguage()
- const o = t.orgDash
+ const o = useTranslations('orgDash')
- <h1>{o.overview}</h1>
+ <h1>{o('overview')}</h1>
```

Para arrays/objects complejos (ej. `apoie.tiers`, `howItWorks.steps`): usar `t.raw('tiers')` que devuelve el valor JSON tal cual.

**Nav dropdown:** `setLocale` → `router.replace(pathname, { locale: code })` con hooks de `@/i18n/navigation`.

**Eliminar:** `src/lib/i18n/LanguageContext.tsx`, `src/lib/i18n/translations.ts`.

**Done:** `grep -r "useLanguage\|LanguageContext" src/` = 0 matches. `tsc --noEmit` OK.

### FASE 4 — Auditoría hardcoded + extracción (≈10-14h)

**4a. Dashboards (P0, ≈4h)** — nuevo namespace `adminDash` con subnamespaces `sidebar, home, orgs, projects, donations, updates, users, login, actions`. Extender `orgDash` con banners Stripe: `stripeConnected, stripeVerifying, stripeNeedsOnboarding, stripeReady, stripeError, stripeRefresh, stripeSuccessToast, stripeConnectCta, stripeContinueCta, addUpdateShortcut`.

**4b. Public layout + forms (P1, ≈4h)** — nuevos namespaces: `common` (botones reutilizables Voltar/Cancelar/Salvar/loading), `navExtra`, `footerExtra`, `authForms`, `orgRegister`, `donationForm`, `donationSuccess`, `cookieBanner`.

**4c. Prosa larga (P2, ≈4-6h)** — namespaces: `faq`, `legal.privacy`, `legal.cookies`, `contato`, `loja`, `academy`. **Decisión:** prosa legal traducir literalmente, abrir issue separado para revisión jurídica (LGPD → GDPR/CCPA). FAQ con 87 entradas: traducción automática + revisión.

**Done:** `grep -rE "\\b(você|confirme|obrigad|cadastr|criar|enviar|sair|entrar|voltar|salvar|excluir)\\b" src/ --include='*.tsx'` = 0 matches en JSX.

### FASE 5 — Llenado huecos + QA calidad (≈3-4h)

1. **Monedas en `apoie.tiers`:** decidir mantener hardcoded por locale o parametrizar con helper.
2. **`date-fns` locale dinámico:** helper que mapea `locale → {ptBR, enUS, es}` o migrar a `useFormatter().relativeTime`.
3. **`toLocaleDateString('pt-BR')` hardcoded** (~15 instancias) → `useFormatter()` de next-intl.
4. Revisión spot-check 20% de keys nuevas en en/es.
5. **Cookie migration:** middleware lee `fauna-lang` una vez y convierte a `NEXT_LOCALE`.
6. **`<html lang>` completo:** mapear `pt→pt-BR, en→en-US, es→es-ES` para screen readers.

### FASE 6 — Testing + rollout + SEO (≈4-5h)

**Smoke tests manuales:**
- [ ] `/`, `/en`, `/es` home OK
- [ ] Dropdown cambia URL preservando path
- [ ] `/en/projetos/{slug}` — detalle OK
- [ ] Flows auth completos en es/en
- [ ] `/en/admin`, `/es/org/painel` OK
- [ ] `/en/faq` buscar + filtrar
- [ ] Donation flow desde `/es/projetos/{slug}`
- [ ] Cookie banner idioma correcto
- [ ] `/organizacoes/cadastro` en 3 idiomas

**SEO:**
- `<html lang>` correcto
- `alternates.languages` (hreflang) en `generateMetadata`
- Convertir 4-5 `export const metadata` estáticos a `generateMetadata` con `getTranslations('meta')`

**Middleware edge-cases:**
- `/` (sin locale) → pt
- `/en/entrar` logged-in → `/en/perfil` (no `/perfil`)
- `/admin` sin auth → `/admin/login`
- Preservar locale en todos los redirects de auth

**Rollout:** PR `feat(i18n): migrate to next-intl routing with pt/en/es support` + closes #9. Plan rollback: `git revert` + rama legacy por 48h.

## 4. Riesgos y trade-offs

1. **URLs cambian parcialmente.** `as-needed` minimiza (pt queda en `/`). `/en/*` y `/es/*` son nuevas.
2. **Middleware conflict.** Orden: i18n primero → auth después. Invertir rompe redirects sin preservar locale.
3. **Server vs client components.** `useTranslations` (client) vs `getTranslations` (server). Hoy 19 archivos son client — directo. Admin dashboards de fase 4 son server.
4. **Costo FAQ.** 87 entradas prosa larga. Traducción automática + revisión 1h.
5. **Prosa legal.** Traducciones literales de LGPD pueden dar problemas regulatorios. **Disclaimer "needs legal review" + follow-up issue.**
6. **`statusLabel` / `roleLabel` maps** en admin — extraer a helper `useStatusLabel(status)` usando `useTranslations('adminDash.statusLabels')`.
7. **Supabase auth errors** — decidir mapear códigos conocidos (en follow-up #14).
8. **Performance middleware.** Matcher crece — early-return para paths públicos antes de `getUser()`.
9. **Analytics externos** leyendo `fauna-lang` — grep confirma que nadie la usa afuera.
10. **UX dropdown locale.** Antes cambiaba estado, ahora cambia URL. Mejor (back-button funciona).

## 5. Archivos críticos (orden de lectura)

- `src/lib/i18n/translations.ts` — fuente 929 líneas
- `src/lib/i18n/LanguageContext.tsx` — a eliminar, 40 líneas
- `src/middleware.ts` — pieza central, combinar
- `src/app/layout.tsx` — pasa a `[locale]`
- `src/components/layout/Nav.tsx` — primer archivo del refactor + strings hardcoded
- `src/app/org/(dashboard)/painel/page.tsx` — peor caso (mezcla)
- `src/app/admin/(dashboard)/page.tsx` — 100% pt hardcoded
- `src/components/OrgRegisterForm.tsx` — form complejo
- `next.config.js` — plugin

## 6. Checklist "hacerlo bien y extensible"

- [ ] **TypedMessages** global en `src/types/messages.d.ts`
- [ ] **Namespacing por feature**, no por página
- [ ] **`common` namespace** para botones reutilizables
- [ ] **`useFormatter()`** para fechas/números (no `toLocaleDateString('pt-BR')`)
- [ ] **Navegación via `@/i18n/navigation`** — nunca `next/link` directo
- [ ] **`generateMetadata`** con locale + `alternates.languages` (hreflang)
- [ ] **Cookie migration** `fauna-lang` → `NEXT_LOCALE`
- [ ] **Test middleware** (redirects auth + locale)
- [ ] **Docs en CLAUDE.md:** agregar sección i18n (cómo agregar key, cómo agregar locale, convención namespaces)
- [ ] **Follow-up issues:** #14 (errores backend), revisión legal privacidade/cookies, estrategia de moneda por locale

## Follow-ups (fuera de scope de esta migración)

- #14 — mapear errores Supabase a pt/en/es
- Revisión legal `privacidade` + `cookies` por jurisdicción
- Estrategia moneda multi-locale en `apoie.tiers` y `DonationForm`
