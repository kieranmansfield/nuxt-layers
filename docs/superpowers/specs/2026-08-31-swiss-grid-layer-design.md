# Swiss Grid Layer — Design Spec

Source: "Swiss Grid Spatial System for Web Interfaces" artifact (functional
spec, rev. 2026-08-31), condensed from design discussion. This document
translates that spec into a concrete new layer for this monorepo.

## §0 Scope and relationship to `layers/structure/layout`

New layer: `layers/structure/swiss-grid` — tier 2, sibling to `layout`.
Depends only on `core`.

`layers/structure/layout` (Swiss Grid *subgrid* system: `LayoutMain` /
`LayoutSection` / `LayoutGridItem`, hero/centered presets, `HStack` /
`VStack` / `ZStack` / `Spacer`, `useGridConfig()`) is **untouched** by this
work. It stays the system in use by `layers/content` (Gallery/Blog/Portfolio
Page + Item/Slug/Image variants) and `layers/structure/navigation`
(`Nav`/`NavModal`, which call `useGridConfig()` directly). Migrating those
consumers to the new layer is explicitly a later, separate pass — not part
of this spec.

The two layers may run in the same app simultaneously. They do not share
components, CSS custom properties, or config namespaces (`layoutLayer.*` vs
a new `swissGridLayer.*` app.config key), so there is no collision risk.

## §1 Primitives

Two components, matching the artifact's §3 API surface exactly:

```ts
// SwissGrid — grid root
interface SwissGridProps {
  columns?: ResponsiveValue<number>   // default: xs:4 sm:4 md:8 lg:12 xl:12
  gap?: ResponsiveValue<Spacing>      // Spacing token from core, e.g. 'md'
  tag?: string                        // default: 'div'
}

// SwissGridItem — positioned child
type SpanAlias = 'full' | 'half' | 'third' | 'quarter'
interface SwissGridItemProps {
  start?: number
  span?: number | SpanAlias           // default: 'full'
  order?: number
  tag?: string                        // default: 'div'
}
```

`SwissGrid` sets `display: grid`, a responsive `grid-template-columns:
repeat(N, minmax(0, 1fr))` (N from `columns`, resolved per breakpoint via
`core`'s `ResponsiveValue<T>` — 5 tiers: `default/sm/md/lg/xl`, media
queries built from `core`'s existing `--breakpoint-sm/md/lg/xl` tokens), a
responsive `gap` from `core`'s `Spacing` scale, and `container-type:
inline-size` (§7 — makes it a container-query boundary by default; every
`SwissGrid` is a potential nesting point, not just the page root).

`SwissGridItem` sets `grid-column: <start> / span <n>` (or `span <n>` alone
when `start` is omitted) and `order` via an inline style object, built by a
pure function — same shape as the old layer's `gridPlacementStyle.ts`, but a
new implementation in this layer, not shared code. Old and new stay
decoupled so `layout`'s cleanup/behavior can't leak into this layer or vice
versa.

## §2 Span aliases — resolving the artifact's open item

The artifact leaves the exact alias set open (§13). Resolved here:

- Aliases are expressed in a fixed **12-unit vocabulary**: `full=12,
  half=6, third=4, quarter=3` — independent of the grid's live column
  count, the same mental model as Bootstrap-style 12-col systems.
- Because `columns` can be less than 12 at smaller breakpoints (4 at `xs`,
  8 at `sm`/`md` per §1's default), an alias's rendered span is `min(alias
  value, current column count)` — computed in the component, not CSS
  `calc()` (integer `grid-column: span N` can't come from a fractional
  division). This keeps `half` always rendering as "half of whatever this
  breakpoint's grid actually has," clamped so it never overflows a
  narrower grid.
- The 12-unit table lives in `app.config.ts` under `swissGridLayer.ui.spanAliases`,
  editable like the old layer's presets, not hardcoded in the component.

## §3 Composition tier — Cluster and Flow

New components, this layer, alongside `SwissGrid`/`SwissGridItem`:

- **`Cluster`** — horizontal grouping: `display: flex; flex-wrap: wrap`,
  `gap` from `core`'s `Spacing` scale, optional `align`/`justify` props.
  For groups of items that wrap as a unit (tag lists, button rows,
  metadata chips) — distinct from `SwissGrid`, which is column-track-based.
- **`Flow`** — vertical stack with automatic rhythm: renders `> * + *
  { margin-block-start: var(--fluid-space-<size>) }` scoped via a CSS
  class, `size` prop selecting the `core` fluid-space token. For prose-like
  vertical sequences where every child needs the same gap, without each
  child managing its own margin.

`HStack`/`VStack`/`Split` (old layer) are not duplicated here — `Cluster`
and `Flow` cover shapes those don't (wrap-as-a-unit and auto-rhythm
respectively), not full stack semantics.

## §4 Vertical rhythm and fluid tokens — reusing `core`

`core` already ships `layers/core/app/assets/css/tokens/spacing-fluid.css`:
`--fluid-space-xs` through `--fluid-space-3xl`, `clamp()`-based, **plus**
`-cq` container-relative variants (`--fluid-space-md-cq`, etc.) already
built on `cqi` units. This is exactly what the artifact's §5 (baseline
scale) and §6 (fluid `clamp()` tokens) ask for.

**Decision: swiss-grid does not define its own spacing scale.** `gap` on
`SwissGrid`, `Cluster`, and `Flow` all take `core`'s `Spacing` token type
and resolve to `core`'s existing `--fluid-space-*` custom properties (the
`-cq` variant when the component sits inside a `container-type` ancestor,
plain variant otherwise). No new token set, no duplication, no future
convergence work needed — building a parallel scale here would be
first-rung ladder work nobody asked for.

## §5 Container queries (§7)

`container-type: inline-size` ships on `SwissGrid` by default (not opt-in)
— every grid is nestable. Column-count and gap responsiveness *can* be
expressed via `@container` queries scoped to a `SwissGrid`'s own inline
size (for a grid inside a sidebar vs. full page) as well as via the
viewport-keyed `ResponsiveValue` breakpoints in §1 — both are supported,
picked per-usage by which query type the CSS in question actually needs.

## §6 Dev overlay (§10)

`SwissGridDebug` component, same `⌘⇧G` shortcut and visual language as the
old layer's `LayoutGridDebug`, reimplemented against the new grid's column
custom properties. Toggles a column-boundary overlay for whichever
`SwissGrid` instances are on screen.

## §7 CSS conventions

All new CSS in this layer uses **logical properties**: `inline-size` /
`block-size` over `width`/`height`, `margin-inline`/`padding-block` over
directional variants, etc. This is a deliberate departure from some
existing CSS in the repo (which uses physical properties) — noted as a
forward-looking convention for this layer only; not a retrofit of `layout`
or other layers.

## §8 Not building

- **No "Section" concept.** The artifact never mentions viewport-height
  sections — that's `layout`-specific (12-row/100vh `LayoutSection`). Out
  of scope.
- **No migration of `content`/`navigation` consumers.** Explicitly deferred
  to a later pass per user decision.
- **No shared code with `layout`'s `gridPlacementStyle.ts`.** Pattern
  reused, implementation is new and independent.

## §9 File layout

```
layers/structure/swiss-grid/
├── app/
│   ├── assets/css/
│   │   └── swiss-grid.css          # entry point, imports below
│   ├── components/
│   │   ├── SwissGrid.vue
│   │   ├── SwissGridItem.vue
│   │   ├── SwissGridDebug.vue
│   │   ├── Cluster.vue
│   │   └── Flow.vue
│   ├── composables/
│   │   └── useSwissGrid.ts         # config resolution, span-alias lookup
│   ├── utils/
│   │   └── gridItemStyle.ts        # pure style-building fns (start/span/order)
│   ├── types/
│   │   └── swissGrid.ts            # SwissGridProps, SwissGridItemProps, SpanAlias
│   └── app.config.ts               # swissGridLayer.ui.{columns,spanAliases}
├── nuxt.config.ts                  # extends: ['../../core'], alias #layers/swiss-grid
└── CLAUDE.md
```

## §10 Testing

- `gridItemStyle.test.ts` — unit tests for the start/span/order → inline
  style function, and the alias→span clamped-lookup function (mirrors old
  layer's `gridPlacementStyle.test.ts` shape).
- `tests/nuxt/use-swiss-grid.test.ts` — composable resolution test (config
  defaults, override via app.config), same pattern as
  `use-grid-config.test.ts`.
- Component mount tests for `SwissGrid`/`SwissGridItem` (renders expected
  `grid-template-columns`/`grid-column` given props).
- New playground demo page (not `layout.vue` — a separate page, e.g.
  `apps/playground/app/pages/swiss-grid.vue`) to visually verify: column
  grid at each breakpoint, span aliases, `Cluster`/`Flow`, container-query
  nesting, dev overlay.

## §11 Open items carried forward

None from the artifact remain open — §2 above resolves the span-alias set,
§6 resolves the dev-overlay mechanism (reuse of the old layer's shortcut).
