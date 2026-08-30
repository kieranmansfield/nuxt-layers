# Layer Taxonomy Redesign — Part 1: Tier 0 (Foundation) & Tier 1 (Design System)

## Scope

This document covers the first two tiers of a full monorepo layer-taxonomy redesign that
reorganizes ~26 layers into 8 tiers ordered by build-workflow sequence (design system → structure
→ content → data → motion → render → delivery) instead of flat domain buckets. Tiers 2–7
(Structure, Content, Data, Motion, Render, Delivery) are audited in follow-on documents. This
document is complete and actionable for Tier 0 and Tier 1 on their own — it does not depend on
later tiers being finished, except where explicitly noted.

Full 8-tier map, for reference:

| Tier | Name | Layers |
|---|---|---|
| 0 | Foundation | `core` |
| 1 | Design System | `theming`, `typography`, `visual` (`ui` dissolved, see below) |
| 2 | Structure | `layout`, `navigation`, `routing` |
| 3 | Content | `content` |
| 4 | Data | `database`, `auth`, `metadata` (+ 4 provider sub-folders), `forms`, `mailer` |
| 5 | Motion | `scroll`, `animations`, `transitions` (absorbs `page-transitions`), `motion` |
| 6 | Render | `canvas`, `shader` |
| 7 | Delivery | `seo`, `scripts`, `feeds` |

`baseline` merges into `scripts` (Tier 7, Delivery) rather than `core` — corrected after full
audit: it's not just compiler config, it wraps a real third-party widget (`baseline-status` npm
package, web.dev's Baseline browser-support badge web component) via a `BaselineStatus.vue`
wrapper, a client plugin, and the `isCustomElement` allowlist. That's a third-party embed
integration, the same shape as `scripts`' existing analytics/GTM/embed facades — not a `core`
concern. `starter` relocates out of `layers/` into `apps/` (it's a demo app). Neither is a
standalone tier member. The per-tier sub-layer/toggle mechanism (extending the
`PLAYGROUND_LAYERS` pattern) referenced below is a separate, not-yet-designed piece of work —
tiers 0–1 do not depend on it existing yet.

## Nuxt 5 readiness (cross-cutting, applies to every tier)

Verified against the official upgrade guide (nuxt.com/docs/5.x/getting-started/upgrade):

- `app.config.ts` is **unaffected** in Nuxt 5 — confirmed, not carried forward as a risk.
  (Two blog posts disagreed on this; the official guide settles it. `app.config.ts` migration
  to `runtimeConfig` is explicitly **out of scope** for this redesign.)
- `future.compatibilityVersion: 5` — flip in `core`'s `nuxt.config.ts` now. Available since
  Nuxt 4.2, individually revertable, cheapest way to surface real breakage early.
- TypeScript `baseUrl` is removed in v5 — audit every layer's `tsconfig.json` for `baseUrl`
  reliance (not yet done).
- Vue Options API disabled by default in v5 — repo convention is already `<script setup>`
  everywhere (per root CLAUDE.md), expect zero findings, worth a confirming grep.
- Case-sensitive routing / normalized page names — relevant once the Content/Structure tiers
  are audited (page file naming), not Tier 0/1.
- `giget` becomes an optional peer dep for remote layers — not applicable, this repo has no
  remote `extends:`, all layers are local.

## Tier 0 — Foundation (`core`)

**Charter:** the safe, minimal way to load a site. Zero layer dependencies — every other layer
extends `core`, `core` extends nothing.

**Current real contents** (junk paths `.playground/.output`, `.fallow`, `.turbo` excluded):

- Device/capability detection: `useDevice`, `useBrowser`, `useNetworkInfo`, `useScreen`,
  `useRendering`, `useFeatures`, `usePWAInfo`, `useScrollGuard`, `feature-detection.client.ts`,
  `scroll-guard.client.ts`, `browserInfo.ts`, `featureClasses.ts`
- Error/404: `ErrorBoundary.vue`, `error.vue`, `error-handler.ts` plugin, `useErrorLog`,
  `[...slug].vue` catch-all
- Loading: `LoadingScreen.vue`, `useLoading`, `loading.client.ts`
- Design tokens (Phase 1–4 declarative layout work): `types/tokens.ts`, `types/responsive.ts`,
  `useLayoutAttrs.ts`, `assets/css/tokens/{breakpoints,container,spacing-fluid}.css` — correctly
  homed here per the earlier locked decision that shared tokens live in `core`
- Misc utils: `useCache`, `useEnv`, `helpers.ts`, `regex.ts`

Re-audited the device/capability-detection cluster individually — traced real consumers, not just
presence. Result: `useDevice`, `useBrowser`, `useNetworkInfo`, `useScreen` fit cleanly.
`useRendering`, `useFeatures`, `usePWAInfo`, `useScrollGuard` did not hold up — see decisions 5-8
below.

### Decisions

1. **`Container.vue` → `AppContainer.vue`.** Not a duplicate of `layout`'s containers (see Tier 2
   note below) — it's the shared width-constraint primitive both `layout` and `ui`/`layout`
   consumers build on. Renamed for clarity per direct request. `layout/Layout/Container.vue`
   (`LayoutContainer`, a documented back-compat shim that just re-renders `<Container>`) needs its
   internal reference updated to `<AppContainer>` alongside this rename.

2. **`core.css`'s hard import of `typography.css` stays — do not remove.** This looked like a
   layer-independence violation (`core` reaching into `typography`) but is the deliberate,
   documented fix for a real production bug (see
   `kmcom-nuxt-layers-typography-css-bug.md` at repo root): Tailwind v4 is CSS-first and only
   tolerates **one** `@import 'tailwindcss/...'` build root per app. `typography.css` used to open
   its own build root and silently broke `@nuxt/ui`'s `UNavigationMenu` padding in production
   (nav stuck at 36px instead of 64px, no error, confirmed via isolation A/B test). The current
   fix — `typography.css` has no Tailwind import of its own, `core.css` pulls its contents in via
   relative path so everything rides `core`'s single build root — is correct and must be
   preserved.

   **New rule to codify** (candidate location: `.claude/rules/nuxt-layers.md`): any layer adding
   Tailwind-consuming CSS (custom properties, `@utility` blocks) must fold into `core.css`'s
   import chain via relative path and must never open its own `@import 'tailwindcss/...'` root.
   This is a permanent, documented exception to "core has zero layer deps" — true for JS/TS,
   not true for CSS build-root ownership.

3. **Delete `assets/css-backup.zip`.** 3.9KB, zero references anywhere in the codebase, dead
   leftover.

4. **`assets/css/base.css` and `assets/css/layout.css` contents not yet audited.** Both are
   loaded unconditionally by `core.css`. `core`'s `layout.css` shares a filename with
   `layers/layout/app/assets/css/layout.css` (a different file, both real) — confusing at minimum.
   Open item: read both files' actual contents and decide keep-in-core / move-to-`layout`-tier /
   delete per content, before this tier is considered fully closed.

11. **Types — mostly fine, one still-open.**
    - `types/tokens.ts` (`Spacing`, `ContainerSize`, `BREAKPOINT_PX`, `Breakpoint`) — correctly
      homed, deliberately cross-consumed by `layout`/`visual` via the `#layers/core/types` alias.
      No action.
    - `types/responsive.ts` (canonical `ResponsiveValue<T>`) — deliberately kept separate from
      `layout`'s own `ResponsiveValue` per an explicit code comment. Same item as the "3 duplicate
      `ResponsiveValue` types" flagged in the original pre-redesign audit — still open: permanent
      split or future merge target, not decided.

12. **`init.ts` — delete entirely.** 190 lines that call nearly every composable in `core`
    (`useDevice`, `useBrowser`, `useScreen`, `useNetworkInfo`, `useFeatures`, `useCache`,
    `useRendering`, `useEnv`) purely to `console.log` their output in dev mode. Zero production
    behavior. Its one artifact — `provide: { $coreLayer: {...} } ` — is never read anywhere in the
    repo. Duplicates `DiagnosticsPage.vue`. Confirmed leftover scaffolding from when the layer was
    being built, not load-bearing.

13. **Misc utils — three of four dead or near-dead, one folded into the PWA decision.**
    - `useCache` — PWA-only (hardcoded `'workbox-precache-v2'`), only caller was `init.ts`. Folds
      into decision 8 (PWA disabled, not deleted) rather than standing alone.
    - `useEnv` — delete. 4-line pass-through of `useRuntimeConfig()`, adds nothing despite its doc
      comment's claims. Only caller was `init.ts`. Consumers use `useRuntimeConfig()` directly.
    - `helpers.ts` — delete. ~20-function grab-bag (`debounce`, `throttle`, `sleep`, `retry`,
      `clamp`, `deepClone`, `pick`, `omit`, `groupBy`, etc). Confirmed zero real usage anywhere in
      the repo outside its own test file and `useScrollGuard`'s `debounce` import (already being
      deleted per decision 7) — checked specifically against the loading cluster too, no imports
      there. Recoverable from git history if a real need appears later.
    - `regex.ts` — delete. Dead duplicate: `navigation` has its own separate `regex.ts` with the
      same `splitSpaces` job, actually consumed by `navigation/app/utils/site.ts`. `core`'s copy
      has zero consumers.

9. **Loading cluster — mostly fine, one real gap, minor cruft.**
   - `LoadingScreen`/`useLoading`/`loading.client.ts` = app-level, one-time boot splash (runs
     once via `app:mounted`). Confirmed intentional design, kept as-is. Progress is simulated
     (random 3-8% increments every 150ms to 90%, not tied to real asset/network state) — expected
     behavior for this kind of splash, not a bug, just worth knowing it's cosmetic.
   - Remove dead commented-out `console.log` debug lines (3 spots across `LoadingScreen.vue` and
     `loading.client.ts`).
   - **Gap**: Nuxt's native `<NuxtLoadingIndicator>`/`useLoadingIndicator()` (page-level,
     per-navigation progress bar, real state, zero config, ships free) is not used anywhere in the
     repo — `core/app.vue` doesn't include it. Confirmed split: `LoadingScreen` = app-level boot
     splash, `NuxtLoadingIndicator` = page-level per-navigation bar. Add
     `<NuxtLoadingIndicator />` to `core/app.vue` alongside `<NuxtLayout>`/`<NuxtPage>`.

10. **Error/404 cluster — one real production bug.**
    - `[...slug].vue` (catch-all 404 route) is solid: config-driven, `setResponseStatus(404)`,
      matches unmatched routes correctly.
    - `error-handler.ts` (global Vue/Nuxt error hooks → `useErrorLog`) and `useErrorLog` itself
      (console + optional external-service logging, app.config-driven) are both correctly wired
      and fine.
    - **`error.vue` — Nuxt's actual global error page, shown for any *thrown* error (500s,
      `createError()`, unhandled exceptions) — is a bare stub in production**: `<div><p>error</p>
      </div>`, no message, no status code, no way back. Its full real implementation (same
      UEmpty/actions/stack-trace pattern as the working 404 page) exists but is entirely commented
      out. Confirmed: this was always meant as a fallback and the real version was never finished
      — not a regression, an unfinished build. Ships broken today regardless. Open item: finish
      it (the commented code is already written, needs uncommenting + wiring against the same
      pattern `[...slug].vue` already proves out) — not yet scheduled, logged here so it isn't
      lost.

5. **`useRendering` — keep as-is.** Zero current consumers, but cheap: computed refs only, no
   side effects, no auto-run plugin. Real use case documented (gate interactivity until
   `isHydrated`, e.g. `:disabled="!isHydrated"`) even though nothing uses it yet. Not worth
   cutting something inert on the chance it's needed.

6. **`useFeatures` — keep the composable, delete the auto-run plugin.** Traced actual consumers:
   zero outside the diagnostics demo page, despite the plugin (`feature-detection.client.ts`)
   running CSS/JS-API/image-format detection, `sessionStorage` writes, and `<html>` classList
   mutation on every single page load for every `core` consumer. Delete
   `plugins/feature-detection.client.ts`. Composable itself stays, callable on-demand by whichever
   future consumer actually needs it (candidate: `layout`'s subgrid fallback).

7. **`useScrollGuard` — delete entirely** (composable, `plugins/scroll-guard.client.ts`,
   `types/scroll-guard.ts`). Traced: auto-enabled on every page load, zero code anywhere calls its
   exposed runtime controls (`enable`/`disable`/`toggle`), yet it walks the full DOM on load and
   runs a `MutationObserver` on the entire `<body>` subtree indefinitely — real always-on perf
   cost for a problem never confirmed to exist in practice. The clamping behavior it implements is
   preserved as a vitest characterization test instead of shipped runtime code, so the logic isn't
   lost, just no longer running live.

8. **PWA — disabled, not deleted**, pending a separate decision on Nuxt's PWA direction. Comment
   out (don't remove) `@vite-pwa/nuxt` from `core`'s conditional prod `modules` array and the
   `pwa: { workbox: {...} }` config block in `core/nuxt.config.ts`. `usePWAInfo` composable stays
   in place, dormant, same status as `useRendering` — unused but harmless.

## Tier 1 — Design System (`theming`, `typography`, `visual`)

**Charter:** typed design primitives — typography, color, gradients/tints/accents, theming —
consumed by everything above it in the tier order.

### `ui` is dissolved as a physical layer

Audited full contents of `ui`: `HStack.vue`, `VStack.vue`, `ZStack.vue`, `Spacer.vue`, one CSS
file, and `app/layouts/default.vue`. Everything `ui/CLAUDE.md` documents (Typography/, Links/,
Media/, Mast/, Site/, `breakpoints.ts`) has already migrated to `typography`, `navigation`, and
`visual` — confirmed those files live there now, `ui/CLAUDE.md` is stale and describes a
structure that no longer exists in this layer.

`ui`'s only two remaining jobs: (1) `extends: ['typography', 'navigation', 'visual']` as a
convenience bundle, and (2) own 4 unrelated stack/spacing primitives. Job 1 duplicates what the
Tier 1 sub-layer/toggle manifest (separate future work) will do natively. Job 2 doesn't belong in
a design-system layer — `HStack`/`VStack`/`ZStack`/`Spacer` are flexbox/positioning layout
primitives.

**Decision:** delete `ui` as a layer. Move `HStack.vue`, `VStack.vue`, `ZStack.vue`, `Spacer.vue`
into `layout` (Tier 2), next to `Container.vue`. Consumers that previously did
`extends: ['ui']` now either extend `['typography', 'navigation', 'visual']` directly, or use the
Tier 1 manifest once it exists.

### `MastMain` / grid-root duplication (found while tracing `ui`'s dissolved `default.vue`)

Two competing implementations of the same grid-root DOM contract existed:

- `navigation/Mast/Main.vue` (`MastMain`) — naive stub: `<div class="mastmain"><slot/></div>`,
  dead `<!-- <UMain> -->` comments, wrong element (`<div>` not `<main>`, loses the page's `<main>`
  landmark — an accessibility regression), no grid-mode awareness, no disabled-mode fallback.
- `layout/Layout/Main.vue` (`LayoutMain`) — the real one: semantic `<main>` (configurable tag),
  reads `useGridConfig()`, applies grid padding, has a `disabled`-mode escape hatch. This is what
  `layout`'s own CLAUDE.md documents as canonical.

`ui`'s (now-dissolved) `default.vue` used the weak `navigation` stub, not the real `layout`
component. Not currently biting anyone — every current playground page sets `layout: false` or
points at its own `layouts/grid.vue` — but a silent trap for any future consumer using an
unmodified default layout.

**Decisions:**
- Delete `navigation/Mast/Main.vue` outright — not salvageable, the real implementation already
  exists in `layout`.
- Grid-root ownership moves fully to `layout` (Tier 2, Structure) — it was never a Design System
  concern. `layout` gets its own real default layout using `LayoutMain`; no design-system-tier
  layer should ship a page-shell default layout again.
- Rename the `.mastmain` CSS class itself (not just the component) — the class string is threaded
  through `grids.css`, `useGridConfig`, and `layout`'s CLAUDE.md, and a component-only rename
  would leave the exact naming confusion that caused this bug. Component name `LayoutMain` stays
  as-is (already consistent with `LayoutContainer`, `LayoutSection`, `LayoutGridItem` — not the
  outdated part). Target CSS class name not yet chosen (candidate: `.grid-root`).

### `theme` → `theming`

Confirmed rename. Functional scope (static tokens only vs. real multi-theme runtime switching) is
**not yet re-confirmed** — flagged early in the discussion, implicitly superseded by the rename
decision but never explicitly re-settled. Open item.

### Other Tier 1 content, audited, no action needed yet

- `typography`: `Typography/*` components (`CodeBlock`, `Headline`, `HeadlineScreen`,
  `QuoteBlock`, `RepeatText`, `TextStroke`, base `index.vue`), `useTypography`, `useColor`,
  `repeatFill` composable, `colors.ts`/`typography.ts` types. Fits charter.
- `visual`: `Accent/{Blob,Scene}`, `Base/Modal`, `Gradient/{Background,Text}`, `Media/Picture`,
  `Progress/{Bar,Circular}`, `Tint/Overlay`, matching composables, `colorTokens`/`gradientStyle`/
  `responsiveSizes` utils (all with tests). Fits charter.

### `typography` component audit + prop standardization

Traced real consumers per component (playground's `typography.vue`/`ui.vue` demo pages +
`starter`'s design-system showcase count as legitimate usage for a component-library monorepo,
unlike `core`'s debug-only diagnostics page).

- **`HeadlineScreen.vue` — delete.** Zero usages anywhere, including demos. Strictly a worse
  subset of `Headline.vue`: `Headline` already supports everything `HeadlineScreen` does
  (`fluidSize`) plus a fixed `size` option, with fluid defaults that scale per heading level
  (`h1`→`6xl` … `h6`→`lg`) where `HeadlineScreen` flat-defaults every level to `2xl`. `Headline`
  also renders through the shared `<Typography>` base; `HeadlineScreen` bypasses it, breaking
  the delegation pattern every sibling follows.
- **`RepeatText`** — still in active development per direct confirmation, not audited this pass.

**Prop inconsistency found across the remaining semantic text components** (`TextStroke`
excluded — different domain, an SVG stroke-effect component with no typography props, not an
inconsistency to fix):

| Component | Props declared |
|---|---|
| `Typography` (base) | `tag, weight, width, slant, leading, tracking, align, transform, color, size, fluidSize` |
| `Headline` | same 11, via `level` instead of `tag`, + `class` |
| `CodeBlock` | only `language, color, size, class` |
| `QuoteBlock` | only `color, size` |

`CodeBlock`/`QuoteBlock` already render through `<Typography>` under the hood and forward
`$attrs` to it — so the other 9 axes technically work if passed, they're just untyped and
invisible to autocomplete on those two components. Confirmed: the delegation architecture the
user asked for already exists (`Typography/index.vue` is the one generic base component every
wrapper renders through); the actual fix is closing the gap between what already delegates at
runtime and what's typed, not building new architecture.

**Decisions:**

1. Every wrapper component (`Headline`, `CodeBlock`, `QuoteBlock`) explicitly declares the full
   canonical prop set in its own `defineProps` and calls `useTypography()`/`useColor()` directly
   — see decision 4 (architecture refactor) below for why this is composable calls, not
   `<Typography>` component wrapping.
2. Drop the manual `class: classProp` destructure-and-remerge pattern (present in `Headline` and
   `CodeBlock`, absent from `Typography` and `QuoteBlock`) — Vue's automatic `$attrs` class
   merging already does this without the extra code. Standardize on the implicit pattern
   everywhere.
3. **New `font` prop**, replacing hardcoded utility classes like `CodeBlock`'s current
   `class="font-mono"`. Requires new token infrastructure — none exists yet (confirmed: no
   `@theme { --font-* }` block anywhere in `core`/`typography`/`visual`; `--font-mono` is
   referenced defensively in `feeds`/`shader` CSS but the variable itself is never defined,
   silently falling through to its fallback value).
   - Define `--font-sans`, `--font-mono`, `--font-display` (or whatever set is chosen) in a
     `@theme` block in `typography.css` — matches the existing pattern where every other
     typography-axis type (`FontWeight`, `FontLeading`, `FontTracking`) already lives in the
     `typography` layer, not `core`. Tailwind v4 auto-generates the `font-sans`/`font-mono`/
     `font-display` utility classes from these.
   - Add a `FontFamily` type to `typography/app/types/typography.ts`, typed directly off the
     chosen token names so the prop and the CSS can't drift apart.
   - Add `font` to the canonical prop set on `Typography/index.vue`, wired through
     `useTypography` to emit `font-${font}`.
   - Sensible per-component defaults: `Typography`/`Headline`/`QuoteBlock` default `font: 'sans'`;
     `CodeBlock` defaults `font: 'mono'` (directly replacing its current hardcoded class).
   - **Open item, not yet decided**: actual font families to use. No real webfont loading exists
     in this design-system layer today (confirmed: no `@nuxt/fonts`/Google Fonts module in
     `core`/`typography`; only the unrelated `visual-identity` app has one). Options: system-font
     stacks for `sans`/`mono`/`display` now with real webfont loading as separate later work, or
     specific fonts chosen now. Not resolved this pass.
4. **Architecture refactor: stop wrapping the `<Typography>` component, call the composables
   directly.** `useTypography()`/`useColor()` (`layers/typography/app/composables/typography.ts`,
   `color.ts`) are already pure, headless, no-DOM functions — props in, class string out. That's
   already the abstraction layer being asked for; it's just not used as the primary interface.
   Right now `Headline`/`CodeBlock`/`QuoteBlock` reach it indirectly by wrapping the
   `<Typography>` *component*, adding an extra nested-component hop in the render tree
   (`<Headline>` → `<Typography>` → actual DOM tag) to reach logic that already sits one level
   lower as a plain function.

   Refactor: `Headline`/`CodeBlock`/`QuoteBlock` call `useTypography()`/`useColor()` directly and
   render their own root element with the computed classes — the same pattern
   `Typography/index.vue` itself already uses internally. `Typography/index.vue` becomes just one
   more consumer of the composables (the generic "any tag, any axis" primitive for ad-hoc use),
   not a mandatory pass-through for every other typography component. Side benefit: unlocks
   components outside the typical semantic set — e.g. `TextStroke`, which currently has no
   typography classes at all — to opt into consistent typography styling later without needing to
   nest inside `<Typography>`.

### `visual/app/types/breakpoints.ts` — resolved

Traced real consumers per vocabulary: every export except `ResponsiveBreakpoint`/
`BREAKPOINT_VALUES` (the Tailwind-matching one) has **zero** external references anywhere in the
repo — `DeviceBreakpoint`, `PhoneBreakpoint`, `TabletBreakpoint`, `DeviceOrientation`,
`ORIENTATION_BREAKPOINTS`, `AllBreakpoints` are only referenced inside their own file. Confirms
the original audit's ~15%-used figure precisely.

Also found: this design system currently runs **two half-overlapping breakpoint scales**.
`BREAKPOINT_VALUES` mirrors Tailwind's generic defaults (640/768/1024/1280/1536px), while
`layout`'s own Swiss Grid density breakpoints are `48rem`/`80rem` (per its CLAUDE.md) — those
only coincidentally match 2 of Tailwind's 4 values (`48rem`=768px=`md`, `80rem`=1280px=`xl`;
`sm`/`lg`/`2xl` correspond to nothing grid-related).

Separately, "container breakpoints" turned out to name two different things: `core`'s
`container.css` is max-width sizing classes (`.container-content/wide/fluid/full`), unrelated to
breakpoints. The actual container-*query* breakpoints (`@container (width >= 30rem/44rem/52rem)`)
live hardcoded, ad-hoc, directly in `layout/fluid.css` — no shared token/type backs them.

**Decisions:**

1. Delete `DeviceBreakpoint`, `PhoneBreakpoint`, `TabletBreakpoint`, `DeviceOrientation`,
   `ORIENTATION_BREAKPOINTS`, `AllBreakpoints`, and their value objects — zero consumers, cut
   outright, not rebuilt.
2. Replace `BREAKPOINT_VALUES`'s Tailwind-derived sm/md/lg/xl/2xl with breakpoints derived from
   `layout`'s actual grid thresholds (`48rem`/`80rem` plus whatever else the grid needs) — one
   real scale instead of two overlapping ones.
3. Formalize the 3 ad-hoc `layout/fluid.css` container-query values (`30rem`/`44rem`/`52rem`)
   into named tokens.

### Container responsiveness strategy — breakpoints + container queries combined

`AppContainer`'s CSS already sets `container-type: inline-size` on all four size variants
(`container.css`) — meaning every descendant already has a live container-query context, the same
mechanism `layout/fluid.css`'s `@container` breakpoints and `typography.css`'s `-cq` fluid text
variants already use. That half already ships, just not used as a deliberate strategy.
`AppContainer`'s own sizing (`content`=65ch, `wide`=90rem, `fluid`=100%, `full`=100vw), by
contrast, is one static value per variant — it doesn't itself respond to viewport width.

**Decision:** combine both deliberately, split by scope —
- **Viewport breakpoints** (the new custom scale from decision 2 above) decide macro/page-level
  layout: which container size variant is active, grid-mode switches, nav collapse points,
  structural decisions that need to know about the whole page/device.
- **Container queries** decide everything rendered inside `AppContainer` — since
  `container-type: inline-size` is already there, any nested component responds to the
  container's real width rather than the viewport's, which matters once a component can render
  inside a sidebar, a modal, or a narrower section.
- `AppContainer`'s own max-width values become responsive across the new breakpoint tokens
  (rather than one fixed value per size), while everything nested inside it uses `@container`
  against `AppContainer`'s own box. Standard "outer responds to viewport, inner responds to its
  own box" pattern, made deliberate instead of accidental.

**Third technique, combined with the two above**: fluid (`clamp()`) sizing for the size variants
themselves, extending the same pattern `typography.css`'s fluid type scale already proves out
(clamp scale + `-cq` container-relative variant + breakpoint-derived endpoints). Each technique
answers a different question:
- **Breakpoints** decide *which mode* — which named size variant is active, when macro/structural
  switches happen — and set the `clamp()` bounds themselves (the min/max endpoints).
- **`clamp()`** decides *how it moves within that mode* — continuous scaling instead of an abrupt
  jump at a hard breakpoint. E.g. `wide` becomes `clamp(65rem, 85vw, 90rem)` instead of a flat
  `90rem`.
- **Container queries** decide how *descendants* respond to `AppContainer`'s real rendered width,
  independent of both of the above.

`AppContainer`'s size variants (`content`/`wide`/`fluid`/`full`) move from single fixed values to
`clamp()` expressions bounded by the new breakpoint tokens.

### `theme`/`visual` app.config + theming scope — resolved

No actual conflict between the two config surfaces — each has its own separate, real defect
instead.

- **`visual`'s `app.config.ts` uses the `uiLayer` namespace** — leftover from before this
  gradient/accent-scene config was split out of the (now-dissolved) `ui` layer. Now orphaned:
  config that lives in `visual` is namespaced under a layer name that no longer exists.
- **`theme`'s `app.config.ts` is a broken stub**: `{ themeLayer: {} }`, not even using
  `defineAppConfig()`. Real consumers exist and expect it populated —
  `useAccentColor.ts` reads `themeLayer.defaultAccent` (falls back to a hardcoded `'blue'` since
  config provides nothing), `ThemePicker/Colors.vue` reads `themeLayer.accents` (falls back to
  `[]`, picker renders empty by default). The type augmentation also lives in a separate file
  (`types/app-config.d.ts`) instead of inside `app.config.ts` itself, violating the repo's own
  documented rule that both must live together.
- This also resolves **`theming`'s functional scope**, decisively: `useTheme()` composes
  `useAccentColor` + `useThemeContrast` + `useThemeMotion` + `useThemeTransparency`, backed by a
  `theme-fouc.ts` server plugin for flash-prevention and a real `ThemePicker` UI. Already a
  genuine runtime accessibility-preference system (accent color, contrast, motion, transparency —
  each with `system`/`on`/`off` override), confirmed via code — not tokens-only, no scope
  decision needed, just the rename.

**Decisions:**
1. Rename `visual`'s `uiLayer` config namespace → `visualLayer`.
2. Fix `theme`'s `app.config.ts`: real defaults for `accents`/`defaultAccent`, use
   `defineAppConfig()`, move the type augmentation into the same file per the repo's own rule.
3. `theming` rename proceeds as previously confirmed — functional scope already correct as-is.

### `LayoutContainer` shim — delete

This redesign is already a breaking pass everywhere else (renaming `Container`→`AppContainer`,
deleting `ui` as a layer, deleting `HeadlineScreen`) — keeping one back-compat shim is
inconsistent. Delete `layout/Layout/Container.vue`; migrate its one real usage (playground demo)
directly to `<AppContainer>`.

### Font families for the `font` prop — resolved

No real webfont loading exists anywhere in the design system today. Default to system-font
stacks for `sans`/`mono`/`display` now — matches what `core/base.css` already does
(`font-family: system-ui, sans-serif`) — and defer real custom webfont choice to later,
non-blocking.

**Tier 0 and Tier 1 are both fully closed** — every open item above is resolved.

## Consolidated action list (Tier 0 + Tier 1)

- [x] `core`: flip `future.compatibilityVersion: 5`
- [x] `core`: audit `tsconfig.json` files repo-wide for `baseUrl` reliance
- [x] `core`: grep repo-wide for Options API stragglers (expect zero)
- [x] `core`: rename `Container.vue` → `AppContainer.vue` (all consumers migrated, shims deleted)
- [x] `core`: delete `assets/css-backup.zip`
- [x] `core`: read `base.css` + `layout.css` contents — both clean resets, correctly homed, no
      action needed (see Tier 2 doc)
- [x] `core`: keep `useRendering` as-is (no action, decision recorded for traceability)
- [x] `core`: delete `plugins/feature-detection.client.ts`; `useFeatures` composable kept on-demand
- [x] `core`: delete `useScrollGuard` composable, `plugins/scroll-guard.client.ts`,
      `types/scroll-guard.ts`; clamping decision logic ported to
      `utils/scrollGuardClamp.ts` + `.test.ts`
- [x] `core`: `@vite-pwa/nuxt` module entry + `pwa: { workbox: {...} }` config block commented out;
      `usePWAInfo`/`useCache` left in place, dormant
- [x] `baseline`: merge into `scripts` (not `core`) — see scope note at top of document
- [x] `core`: delete `plugins/init.ts` (dev-only console-log scaffolding, zero production value)
- [x] `core`: delete `composables/useEnv.ts` (no-op pass-through, consumers use
      `useRuntimeConfig()` directly)
- [x] `core`: delete `utils/helpers.ts` (zero real usage repo-wide once `useScrollGuard` is gone)
- [x] `core`: delete `utils/regex.ts` (dead duplicate of `navigation/app/utils/regex.ts`)
- [x] `core`: remove dead commented-out `console.log` debug lines from `LoadingScreen.vue` and
      `plugins/loading.client.ts`
- [x] `core`: add `<NuxtLoadingIndicator />` to `app.vue` (page-level nav progress; `LoadingScreen`
      stays as the separate app-level boot splash)
- [x] `core`: finish `error.vue`'s real implementation (currently commented out, bare stub ships
      in production) — uncomment and wire against the same UEmpty/actions pattern `[...slug].vue`
      already proves out
- [x] `.claude/rules/nuxt-layers.md`: add the CSS single-build-root rule
- [x] Delete `ui` as a layer
- [x] Move `HStack.vue`, `VStack.vue`, `ZStack.vue`, `Spacer.vue` from `ui` → `layout`
- [x] Update `LayoutContainer` shim's internal `<Container>` reference → `<AppContainer>`
- [x] Delete `navigation/Mast/Main.vue`
- [x] Give `layout` its own real default layout using `LayoutMain`
- [x] Rename `.mastmain` CSS class repo-wide (candidate: `.grid-root`)
- [x] Rename `theme` layer → `theming`
- [x] Delete `layout/Layout/Page/Container.vue` — playground demo card for it removed (nothing
      migrated onto `LayoutPage`; the card was pure documentation text, not a live usage)
- [x] `typography`: delete `HeadlineScreen.vue`
- [x] `typography`: add `font` prop infrastructure — `@theme` font tokens in `typography.css`,
      `FontFamily` type, wire into `Typography/index.vue` + `useTypography`
- [x] `typography`: refactor `Headline`/`CodeBlock`/`QuoteBlock` to call `useTypography()`/
      `useColor()` directly (own root element) instead of wrapping the `<Typography>` component;
      give each the full canonical prop set in the process
- [x] `typography`: drop the manual `class: classProp` destructure pattern from `Headline` and
      `CodeBlock`; rely on implicit `$attrs` class merging everywhere
- [x] `CodeBlock`: replace hardcoded `class="font-mono"` with `font="mono"` prop
- [x] `visual`: **finding corrected, not blindly executed** — `DeviceBreakpoint`/`PhoneBreakpoint`/
      `TabletBreakpoint`/`DeviceOrientation` and their `*_VALUES` consts are NOT dead: real
      consumers exist (`responsiveSizes.ts`'s `buildResponsiveSizesQueries()`, tested, wired into
      `usePicture`/`Picture.vue`). Kept those. Deleted only the genuinely zero-consumer parts:
      `BreakpointValues`/`BreakpointKey`/`BreakpointValue`, `DeviceBreakpointValues`/`Key`/`Value`,
      `PhoneBreakpointValues`/`Key`/`Value`, `TabletBreakpointValues`/`Key`/`Value`,
      `ORIENTATION_BREAKPOINTS`, `OrientationBreakpoints`, `AllBreakpoints` — derived helper
      types/consts nobody imported.
- [x] `visual`/`core`: `BREAKPOINT_VALUES` already resolved — `sm`/`md`/`lg`/`xl` repoint at core's
      `BREAKPOINT_PX` (768/1280 = 48rem/80rem, exactly `layout`'s grid thresholds) from the earlier
      Phase 3 breakpoint migration. Only `2xl` (1536, no grid equivalent) stays hand-written. No
      further change needed.
- [x] `layout`: formalize the 3 ad-hoc `fluid.css` container-query values (`30rem`/`44rem`/`52rem`)
      into named tokens
- [x] `core`: convert `AppContainer`'s size variants (`content`/`wide`/`fluid`/`full`) from fixed
      max-width values to `clamp()` expressions bounded by the new breakpoint tokens
- [x] `visual`: rename `app.config.ts`'s `uiLayer` namespace → `visualLayer`
- [x] `theme`/`theming`: fix `app.config.ts` — real `accents`/`defaultAccent` defaults, use
      `defineAppConfig()`, move the `types/app-config.d.ts` augmentation into the same file
- [x] Delete `layout/Layout/Container.vue` (`LayoutContainer` back-compat shim); playground's
      back-compat comparison card removed, live `<Container>` usage migrated to `<AppContainer>`
- [x] `typography`: default `font` prop's `sans`/`mono`/`display` tokens to system-font stacks
      (real webfont choice deferred, non-blocking)

## Not yet covered

Tiers 2 (Structure), 3 (Content), 4 (Data), 5 (Motion), 6 (Render), 7 (Delivery), and the Tier
sub-layer/toggle mechanism design are separate passes, to be written up as follow-on sections or
documents.
