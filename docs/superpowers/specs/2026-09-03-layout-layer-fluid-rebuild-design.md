# Layout Layer — Fluid Rebuild Design Spec

Source: `LAYOUT-SYSTEM.md` (forensic reference for the `swiss-test/`
prototype — `src/layout.css`, vanilla Vite/TS, no framework), validated
against the working prototype at `/Users/kieranmansfield/Developer/layers/swiss-test`.
This document adapts that CSS-only derivation into a full rebuild of
`layers/structure/layout`, replacing its current breakpoint-based
6/12/18-column subgrid system.

## §0 Relationship to the Swiss Grid tier-2 spec

`docs/superpowers/specs/2026-08-31-swiss-grid-layer-design.md` proposes a
**separate sibling layer** (`layers/structure/swiss-grid`) that leaves
`layers/structure/layout` untouched. This spec is a **different track**: it
replaces `layout` itself, in place, rather than adding a new layer beside
it. The two specs are not both implementable as originally scoped — before
implementation starts on this one, reconcile with the user whether the
tier-2 sibling-layer spec is superseded, deferred, or still wanted
alongside this rebuild.

## §1 Governing idea

One root unit derives everything else. No breakpoints, no orientation
query, no hand-picked column counts.

```text
--fs (fluid font-size)
  → line-height (rounded to px)
    → --unit: 1rlh
      → --edge-min, --lpf, --measure-min
        → --lines, --fields, --type-b, --slack
          → padding-block, grid tracks, gap
```

Change `--fs`'s clamp and the whole grid — margins, field height, column
count threshold — rescales in step. The grid has no size values of its
own, only ratios against `--unit`. This is CSS-only: no JS computes grid
math at runtime.

## §2 Scope decisions (from brainstorming)

- **Clean break.** No `colStart`/`colSpan`/`rowStart`/`rowSpan` numbered
  placement API. Auto-fill's native column resolution
  (`floor((available + gutter) / (measure-min + gutter))`) is the only
  column-count mechanism — no mathematically-generated `--cols` ladder,
  since a `calc()`/`round()`-derived integer fed into `repeat()`'s
  track-count position is the exact failure mode Pitfall 1 (§7) already
  proved broken in this codebase.
- **Layout owns `--fs`/`line-height`.** Matches the repo's existing
  convention (CLAUDE.md's open item, option 1) — layout owns the one
  clamp that feeds the grid; typography layer owns everything else
  (font-family, weight scale, prose styles, headings outside grid cells).
- **Per-section row derivation, restored.** Not a flat, purely continuous
  page (see §4) — the field/line math runs per `LayoutSection`, not once
  globally per page.
- **CSS `@property` typing, not TS.** Every derived custom property gets a
  real `syntax` descriptor. No TypeScript interface for the JS→CSS var
  bridge (config tunables → `:style`) — out of scope.
- **Unrelated components untouched.** `HStack`/`VStack`/`ZStack`/`Spacer`,
  `LayoutPage`/`LayoutPageHeader`, the z-index layer system
  (`useZIndex`/`GridLayers`), and the `⌘G` debug overlay carry forward —
  rebuilt only where they touch grid mechanics.
- **No consumer migration in this task.** `layers/content`,
  `layers/structure/navigation`, and the playground/starter apps keep
  calling the old API until a separate pass updates them. This task's
  deliverable includes a migration guide document, not the migrations
  themselves.

## §3 Derivation, step by step

Ported from the validated prototype (`swiss-test/src/layout.css`):

1. **Type.** `--fs: clamp(1rem, 0.95rem + 0.25svi, 1.125rem)`, registered
   via `@property` as `<length>` so downstream `calc()` gets a resolved
   length, not an unresolved token stream. `line-height` is
   `round(nearest, fs * 1.5, 1px)` — rounded, not raw, so grid boundaries
   land on-pixel.
2. **Unit.** `--unit: 1rlh`. `rlh` not `lh`: `lh` resolves against the
   *current* element, so a heading with a different line-height would
   silently produce a different unit for anything nested in it. `rlh`
   always resolves against root.
3. **Minimums.**
   - `--measure-min: 22rem` — narrowest column, also the
     `repeat(auto-fill, minmax(...))` floor and the `@container cell`
     padding-step threshold.
   - `--edge-min: clamp(1unit, 8svi, 3unit)` — margin floor > 0, steep
     `svi` slope so it shrinks fast on narrow screens. Feeds `--avail-b`,
     so it also trims top/bottom slack, not just inline edges.
4. **Lines** (per-section, see §4). `--avail-b: 100svh - 2*edge-min`.
   `--lines: round(down, avail-b, unit) / unit` — the only way to get an
   integer line-count out of a length in CSS.
5. **Fields** (per-section). `--lpf` (lines-per-field) clamped 4–8, scaled
   by viewport height (`round(down, 100svh/unit/4.5, 1)`) so a fixed
   `lpf=8` can't strand up to 8 line-heights as dead padding on a short
   viewport. `--fields: max(1, round(down, (lines+1)/(lpf+1), 1))`.
6. **Margins** (per-section). Whatever's left over, split by the
   section's `align` prop (§4) — computed last because it can't be
   chosen, only what remains after the whole-line constraint.
   `--slack: 100svh - type-b`, clamped `max(0px, …)` on both sides so a
   short/landscape viewport degrades to scroll instead of negative
   padding.
7. **Columns.** `repeat(auto-fill, minmax(measure-min, 1fr))` on the root
   grid only. Native `auto-fill` computes column count from available
   space directly, without needing an integer derived via `calc()`.

## §4 Section model

The root (`LayoutMain`) is a continuous auto-fill grid — content not
wrapped in a `LayoutSection` flows and wraps normally, sized only by
`--measure-min`/`--unit`, no viewport-height chunking.

`LayoutSection` is an **opt-in full-width row**:

- `grid-column: 1 / -1`, `grid-template-columns: subgrid` — inherits
  however many explicit columns the root's `auto-fill` resolved. This is
  legal: subgrid adopts the parent's resolved explicit track count
  whatever it is; it only breaks when something tries to *address* a
  column by number, which nothing in this design does. A `.span-2` class
  inside a subgridded section asks for "2 of however many columns exist,"
  the same trick the prototype's own `.span-2` container-query gate uses
  (§6) — it works identically whether the parent's tracks came from a
  fixed count or from `auto-fill`.
- Block-size defaults to `100svh` (overridable via a `height` prop), and
  it runs its own §3 steps 4–6 scoped to itself — same global
  `--unit`/`--edge-min`/`--lpf` from `:root`, applied per-section instead
  of once per-page.
- `align` prop: `'split'` (the prototype's default 40/60 optical-center
  padding split) or `'center'` (`place-content: center` — true
  horizontal+vertical centering). Explicit choice, not a fight against
  `align-items: stretch` defaults — this directly addresses the prior
  centering pain: the old `LayoutSection`/`GridItem` combo had no
  first-class centering prop, so centering meant fighting
  `grid-auto-rows`'s fixed track height and the container's default
  stretch behavior.

## §5 Components

```text
layers/structure/layout/app/components/
├── HStack.vue / VStack.vue / ZStack.vue / Spacer.vue   # unchanged
└── Layout/
    ├── Main.vue           # rebuilt: root auto-fill grid, --fs/--unit owner
    ├── Section.vue        # rebuilt: opt-in full-width subgrid row, §4
    ├── Cell.vue            # new, replaces Grid/Item.vue
    ├── Hero.vue            # new, replaces the `hero` GridItem preset
    ├── Grid/Debug.vue     # rebuilt: visualizes --unit/field boundaries
    └── Page/
        ├── index.vue       # unchanged
        └── Header.vue      # unchanged
```

- **`LayoutMain`** — kept name (minimizes churn for whatever later
  migrates to it), rebuilt internals. Renders `<main>` as the root
  auto-fill grid. Registers `--fs`, binds config tunables to CSS custom
  properties via `:style`.
- **`LayoutSection`** — see §4.
- **`LayoutCell`** (replaces `LayoutGridItem`) — `variant: 'block' |
  'plate'` prop (border vs. filled, matching the prototype's `.block`/
  `.plate`), `span2` / `span2Rows` / `span3Rows` boolean/enum props. No
  `colStart`/`rowStart`/`preset`/`layer`/`bleed` — those go in the
  migration guide as removed, with the nearest equivalent noted.
- **`LayoutHero`** (replaces the `hero` `GridItem` preset) — standalone,
  full-viewport (`100svh`) flex-centered, deliberately outside the grid
  entirely (no `--fields`, no column derivation) — matches the
  prototype's `.hero`.
- **`LayoutGridDebug`** — same `⌘⇧G` shortcut, rewritten to overlay
  `--unit`/field boundaries (via `getComputedStyle`) instead of a fixed
  column count, since column count is now emergent.
- `Layout/Grid/Item.vue` and `Layout/Section/{Gallery,Hero,Split}.vue` —
  deleted; superseded by `Cell`/`Hero`/`Section`.

## §6 CSS `@property` registration

Every derived custom property gets a `syntax` descriptor, extending the
prototype's existing `--fs` registration:

| Property | `syntax` |
|---|---|
| `--fs` | `<length>` |
| `--unit` | `<length>` |
| `--edge-min` | `<length>` |
| `--measure-min` | `<length>` |
| `--lpf` | `<integer>` |
| `--lines` | `<integer>` |
| `--fields` | `<integer>` |
| `--avail-b`, `--type-b`, `--slack` | `<length>` |

Registration guards against Pitfall 1's failure mode (§7) as new CSS is
added later: an unregistered custom property built from `calc()`/
`round()` silently substitutes as a token stream instead of a resolved
value at points that require one, invalidating the whole declaration and
falling back to implicit auto-sized tracks — a squash bug that's invisible
to `pnpm build` and only catchable via real browser `getComputedStyle()`
inspection.

## §7 Pitfalls carried forward (verified in the prototype, must not regress)

1. **`repeat(var(--n), ...)` silently invalidates.** `repeat()`'s
   track-count argument requires a literal `<integer>` at computed-value
   time — an unregistered `calc()`/`round()`-derived custom property
   doesn't satisfy that. Fix: `repeat(auto-fill, minmax(<length>, 1fr))`,
   never a `var()`-derived count. This is *why* §2 rejects a mathematical
   `--cols` ladder for v1.
2. **Span utilities forcing malformed implicit tracks.** `span-2`
   unconditionally applying `grid-column: span 2` can force CSS Grid to
   fabricate a content-sized implicit column when only 1 explicit column
   resolved (narrow/medium viewport), squashing siblings. Fix:
   `grid-auto-columns: minmax(measure-min, 1fr)` (belt-and-braces) plus
   gating `.span-2` behind `@container viewport (min-width: 2 *
   measure-min + gutter)` so it only activates once 2 columns have
   genuinely resolved.
3. **Hand-synced container-query thresholds.** `@container` conditions
   can't reference custom properties — the `@container cell (max-width:
   22rem)` / `@container viewport (min-width: 46rem)` thresholds must be
   hand-kept in sync with `--measure-min`, commented at both ends.

## §8 Constraints to preserve

- Every fluid `clamp()` keeps a `rem` term — a pure `vw`/`cqi` middle term
  ignores browser zoom, fails WCAG 1.4.4.
- Never `line-height: normal` on `:root` — font-metric dependent, whole
  grid would reflow on webfont swap.
- `svh`/`svi`, never `dvh`/`vw`/`vh` — `dvh` recomputes on mobile URL-bar
  collapse, reflowing mid-scroll.
- `lh`/`rlh` don't resolve correctly in media queries (resolve against
  initial font there) — use `rem`, or a container query with `cqi`.
- `container-type` never on `body` (becomes the `position: fixed`
  containing block for descendants — an unrelated footgun).

## §9 Config

`app.config.ts`:

```ts
layoutLayer: {
  ui: {
    grid: {
      mode: 'fluid' | 'disabled'
      tunables: {
        measureMin: string           // e.g. '22rem'
        edgeMin: { min: string; max: string }   // clamp bounds
        lpf: { min: number; max: number }       // lines-per-field bounds
      }
      layers: GridLayers             // z-index system, unchanged
    }
  }
}
```

`useGridConfig()`:

```ts
const { config, mode, isEnabled, layers, useZIndex, cssVars } = useGridConfig()
```

- `getPreset` — removed (no addressable placement left to preset).
- `cssVars` — new: computed map of tunables → CSS custom property
  strings, consumed by `LayoutMain`/`LayoutSection`'s `:style` binding.
  This is the JS→CSS bridge; per §2, it carries no dedicated TS interface
  beyond the existing `GridConfig` type in `layouts.ts`.
- `mode`/`isEnabled`/`layers`/`useZIndex` — unchanged behavior.
  `'disabled'` mode renders a plain `<main>`, no grid CSS, same fallback
  as today.

## §10 Testing

- `gridPlacementStyle.ts`/`.test.ts` — deleted. Placement is static CSS
  classes now (`span2`, etc.); there's no positioning math left to unit
  test.
- New: a small test for `useGridConfig`'s `cssVars` mapping and
  `mode`/`isEnabled` resolution (mirrors the existing composable test
  shape).
- Manual verification: `getComputedStyle` sweep at 500 / 768 / 900 /
  1024 / 1440 / 1920px, checking `gridTemplateColumns`/`gridAutoRows`
  against expectation at each width, and that `.span-2`/`--fields`
  thresholds gate correctly — the same method that caught Pitfalls 1–2 in
  the prototype, since computed-value grid bugs are invisible to
  `pnpm build`'s pure syntax check.
- Playground: existing `apps/playground/app/pages/layout.vue` demo
  rebuilt against the new components — visual check of continuous grid,
  section centering (both `align` modes), hero, debug overlay.

## §11 Deliverables

1. Rebuilt `layers/structure/layout` per §5–§9.
2. `docs/LAYOUT.md` rewritten to describe the new system (supersedes the
   6/12/18 breakpoint documentation).
3. A migration guide document (old → new API mapping: removed props,
   nearest equivalents, config shape changes) for later use when
   `layers/content`, `layers/structure/navigation`, and the
   playground/starter apps are updated. Not implemented as part of this
   task.
4. §0's spec-conflict reconciliation resolved before implementation
   starts.

## §12 Not building

- No numbered column/row placement API (`colStart`, `rowStart`).
- No mathematically-generated `--cols` (§2, §7 pitfall 1).
- No consumer migration (content layer, navigation, playground/starter
  call sites) — guide only.
- No TypeScript interface for the CSS var bridge — `@property` is the
  only typing layer (§2, §6).
- No changes to `HStack`/`VStack`/`ZStack`/`Spacer`, `LayoutPage`/
  `LayoutPageHeader`, or the z-index layer system beyond what's needed to
  keep them working against the rebuilt `LayoutMain`.
