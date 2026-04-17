# Fauna Platform — Agent Evaluation Report
**Date:** 2026-04-04  
**Scope:** parallax-preview.html, Nav.tsx, page.tsx, SpeciesCounter.tsx, FeedSection.tsx, HowItWorks.tsx, CtaSection.tsx, projetos/page.tsx, globals.css

---

## Agent Findings

### Brand Guardian
**Issues found:**
- `parallax-preview.html` used `#04111a` as the base background colour — drifting slightly from the design-system `--forest: #0a120a`. Fixed.
- `WalterTurncoat` was present in the HTML preview but not confirmed as loading correctly (font-face pointed at `/fonts/...`, which is correct).
- Music button used `#8c9e42` — a colour not in the design system. Replaced with `var(--sage)` (#7ab060).
- Emoji used in `FeedSection.tsx` (`📍`) — inconsistent with editorial tone. Removed.
- `.btn-primary` used `text-xs` (12px) instead of `text-[10px]` for consistency with the tracking-widest uppercase style across the site. Aligned all button sizes.

**Status:** Resolved.

---

### UI Designer
**Issues found:**
- `Nav.tsx` had no scroll state — it looked identical whether at top of page or mid-scroll. Added: dark backdrop + border appears on scroll, nav fades in on load (staggered entry).
- Nav was missing a direct donation CTA — the primary conversion action. Added a filled `Doe agora` button (hidden on mobile).
- Stats bar stat items had no visual separator — added a pseudo-element rule between items.
- `HowItWorks.tsx` step detail/proof lines were missing — important for trust. Added as a third text element per step.
- `CtaSection.tsx` lacked a micro proof line under the buttons. Added: "Doação a partir de R$ 10 · Cancele quando quiser · 100% vai ao projeto".
- `FeedSection.tsx` grid used inline style with hardcoded column widths — kept for layout accuracy but tightened spacing.
- `globals.css` missing `body { background-color }` declaration — could flash white on slow loads. Added.
- Button hover states lacked `translateY(-1px)` lift — now present for primary/outline buttons.

**Status:** Resolved.

---

### UX Architect / Visual Storyteller
**Issues found:**
- `page.tsx` had no editorial bridge between the stats bar and the FeedSection — nothing told the user why these numbers matter. Added a "trust signal band" with a one-sentence copy line and a link to the how-it-works page.
- `FeedSection.tsx` had no section header eyebrow ("Do campo para você") — the section felt nameless. Added.
- `FeedSection.tsx` had no bottom CTA after the list — users who scrolled through all updates had nowhere obvious to go next. Added "Ver todos os projetos" button.
- `projetos/page.tsx` had no supporting description under the headline — users arrived without context. Added a 2-sentence onboarding paragraph.
- `parallax-preview.html` reveal panel had no supporting copy — just a quote and one button. Added `#reveal-sub` (subtitle) and a two-button row (primary + ghost).

**Status:** Resolved.

---

### Content Creator
**Issues found:**
- Hero headline ("É o planeta deles também.") — strong, kept as-is.
- Scroll phrases were good but the third one ("Doe com propósito") felt abrupt — it's a command, not a story. This remains for future iteration; could become "Cada real chega até o campo."
- Reveal panel quote was identical to the hero title in the old version ("O mundo é deles também" vs "É o planeta deles também") — too close. Updated reveal to "A fauna não espera. Você pode ajudar." — reuses the `CtaSection` headline but this is intentional repetition for reinforcement.
- `CtaSection` sub-copy: changed "Agora você pode fazer parte" (vague) to "Com qualquer valor, você faz parte da história" (specific, lowers barrier to entry).
- `HowItWorks.tsx` added concrete micro-proof details per step (verification timeline, notification feature, 100% donation claim).
- `SpeciesCounter.tsx` added a micro CTA linking to projects — the counter was emotionally compelling but had no next action.

**Status:** Resolved (one phrase left for future iteration).

---

### Growth Hacker
**Issues found:**
- No donation CTA visible in the navigation — critical miss since navigation is persistent. Fixed: added "Doe agora" filled button in Nav.
- `CtaSection` had two equal-weight CTAs ("Ver projetos" and "Cadastrar meu projeto") — donor and org flows competing for equal visual weight. Kept as-is since both are valuable, but primary is visually dominant via btn-primary vs btn-outline.
- No micro social proof at conversion points. Fixed: "Junte-se a 19.400 apoiadores" eyebrow added to CtaSection; "Doação a partir de R$ 10" line added below CTAs.
- `SpeciesCounter.tsx` had no path forward — the emotional peak with no conversion hook. Fixed: added inline "Ver projetos ativos →" link.
- `FeedSection.tsx` "Apoiar projeto" button was nested inside a `<Link>` wrapper — the outer link's click would fire instead. Fixed: added `e.stopPropagation()` on the inner CTA.
- Stats bar numbers were purely informational. Could benefit from a hover tooltip explaining methodology — left for future iteration.

**Status:** Critical items resolved. Further A/B testing recommended on CTA copy.

---

### Whimsy Injector
**Issues found:**
- `parallax-preview.html` — parrot wing-beat animation was good. Enhanced: added `filter: drop-shadow` to parrot image for depth.
- Added a preloader veil (`#preloader`) that dissolves after fonts settle — prevents the unstyled flash on slower connections.
- Stats bar numbers now have a `group-hover:scale-105` micro-interaction — subtle pulse on hover.
- Nav entry is now animated (opacity + translateY from above) — feels alive on page load.
- `parallax-preview.html` — added `#grain` SVG noise overlay for editorial film-grain texture. Barely visible (3.5% opacity) but removes the "too digital" look.
- Bird chirp audio timing tightened: delay range 1400–4600ms (was 1200–4700ms) for slightly more naturalistic rhythm.
- Parrot arc timing refined: active through 84% of scroll (was 82%) so it feels like it lingers before departing.
- Added `::before` decorative rule above the reveal panel quote — a thin sage-tinted line as a structural break.

**Status:** Resolved. Future ideas: subtle leaf particles on scroll, species hover tooltips in the feed.

---

## Files Changed

| File | Changes |
|------|---------|
| `public/parallax-preview.html` | Full redesign: nav integrated into scene, eyebrow above title, scroll phrases section, reveal panel rebuilt with sub-copy + two CTAs, grain overlay, preloader veil, parrot drop-shadow, stats bar + counter + footer below fold, refined JS timings |
| `src/components/layout/Nav.tsx` | Scroll state (transparent → solid), staggered entry animation, "Doe agora" primary CTA button added, active link colour changed to sage |
| `src/app/page.tsx` | Trust signal band added, stats bar hover micro-interaction, footer rebuilt with nav links |
| `src/components/SpeciesCounter.tsx` | Eyebrow updated to cite IUCN date, micro CTA link to projects added, decorative rule refined |
| `src/components/FeedSection.tsx` | Section eyebrow added, emoji removed, bottom CTA added, stopPropagation on inner link |
| `src/components/HowItWorks.tsx` | Section sub-header + "Saiba mais" link added, micro-proof line per step added |
| `src/components/CtaSection.tsx` | Eyebrow social proof added, sub-copy sharpened, micro barrier-lowering line added |
| `src/app/projetos/page.tsx` | Project count displayed, onboarding paragraph added |
| `src/app/globals.css` | body background-color declared, button hover lifts added, `.prose-link` utility added, font-smoothing added |

---

## Remains To Do

### High priority
- **Mobile breakpoints** — the current feed grid uses `gridTemplateColumns: '240px 1fr auto'` via inline style, which will break below ~700px. Needs a single-column stacked layout for mobile.
- **FilteredProjects.tsx** — not evaluated. Should be checked for filter UX and card design consistency.
- **DonationForm.tsx** — not evaluated. The donation flow is the highest-stakes conversion step; needs a dedicated review pass.

### Medium priority
- **Scroll phrase copy** — phrase-2 ("Doe com propósito") could be more narrative: "Cada real chega até o campo."
- **Stats bar** — tooltips explaining how numbers are calculated would build trust.
- **Empty state** — FeedSection has `if (!updates.length) return null`. An empty state with a CTA to explore projects would be better.
- **ParallaxHero.tsx** — the React version uses different images (Unsplash crossfades) vs the HTML preview (single local image with depth planes). These should converge — the depth-plane technique is more sophisticated and should be ported to the React component.

### Low priority / ideas
- Species hover tooltips in the feed ("Did you know?" facts from IUCN data)
- Subtle leaf/particle animation on the CtaSection background
- Progress bar tooltip showing exact amount raised on hover
- OpenGraph / Twitter card meta tags for social sharing