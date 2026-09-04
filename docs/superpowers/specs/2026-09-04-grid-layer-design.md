# Grid layer — design

## Context

`layout` (Tier 2 — Structure) has carried a fixed 6/12/18-column "Swiss Grid
System" since its dissolution of the old `ui` layer. A forensic spec,
`LAYOUT-SYSTEM.md` (repo root), documents a different, single-mode fluid grid
derived entirely from `--fs` (font-size) — no fixed column count, columns
resolve via `repeat(auto-fill, minmax(...))`, and vertical rhythm derives from
`--unit: 1rlh`. A worktree, `layout-fluid-rebuild`, was mid-migration from the
Swiss system to that fluid system: it had already stripped `columns`,
`rowsPerSection`, and `presets` out of `layout`'s `app.config.ts`/
`types/layouts.ts` in favor of `tunables` (`measureMin`, `edgeMin`, `lpf`), but
had not yet touched the components that still assume 18 numbered columns
(`Section/Hero.vue`, `Section/Split.vue`, `Section/Gallery.vue`,
`Grid/Item.vue`).

Mid-migration, direction changed: a single imposed grid (whether Swiss or
fluid) is too rigid. The system should support **multiple layout patterns**
plus a way to build **arbitrary, unequal-width column compositions** (e.g. 8
equal columns + 1 double + 1 triple), plus an interactive tool for
constructing those compositions at dev time.

This spec covers a **new layer**, not changes to `layout`. `layout`'s
existing grid components (`LayoutMain`, `LayoutGridItem`, `LayoutSection`,
`Hero`, `Split`, `Gallery`, `useGridConfig`) are explicitly **out of scope**
and stay as they are — reworking them to consume this new layer is deferred
to a future pass. The `layout-fluid-rebuild` worktree's uncommitted
`app.config.ts`/`types/layouts.ts` changes are superseded by this spec and
should not be carried forward as-is; its rhythm math is the basis for what
this layer reimplements fresh.

## Governing idea

Two independent concerns, both configurable, neither hardcoded:

1. **Vertical rhythm** — derived from `--fs`, unconditional, the same for
   every layout pattern (per `LAYOUT-SYSTEM.md`'s derivation chain).
2. **Column composition** — a named preset (`swiss`, `editorial`) or a
   custom array of track segments, each optionally carrying CSS named grid
   lines. This is the "grid builder" surface.

A layout pattern is data: an array of track segments. A preset is just a
named, pre-built instance of that same data shape. The interactive builder
produces that same shape. One representation, three ways to get one.

## New layer: `grid`

Tier 2 — Structure, sibling to `layout`/`navigation`/`routing`. Depends only
on `core`, same as `layout`.

```
layers/structure/grid/
├── app/
│   ├── assets/css/
│   │   └── grid.css              # rhythm custom properties, .grid-root class
│   ├── composables/
│   │   └── useGridTracks.ts      # preset lookup + custom-track → CSS string
│   ├── types/
│   │   └── tracks.ts             # TrackSegment, TrackConfig, GridPreset types
│   └── app.config.ts             # gridLayer.presets registry (swiss, editorial)
├── nuxt.config.ts                # $meta.name: 'grid', extends core, alias #layers/grid
├── package.json                  # kmcom-layer-grid
└── CLAUDE.md
```

### Rhythm (`app/assets/css/grid.css`)

Reimplements `LAYOUT-SYSTEM.md`'s derivation as custom properties on
`.grid-root`:

```
--fs → line-height (rounded) → --unit: 1rlh
  → --edge-min, --measure-min
    → --lines, --lpf, --fields
      → padding-block, row height (--unit * --lpf floor)
```

Same constraints as the source doc, carried forward unconditionally:

- Every `clamp()` keeps a `rem` term (WCAG 1.4.4 zoom safety).
- `svh`/`svi`, never `dvh`/`vw`/`vh`.
- `rlh` not `lh`, so nested elements with different line-heights don't skew
  the unit.
- `container-type` never on `body`.

This part is **not preset-dependent** — `swiss`, `editorial`, and any custom
track config all sit on the same rhythm.

### Track config shape (`app/types/tracks.ts`)

```ts
export type TrackSegment = {
  /** Relative size, same unit as CSS `fr`. 1 = one equal column. */
  size: number
  /** Optional named line(s) at the start of this segment, e.g. 'feature-start'. */
  lineStart?: string | string[]
  /** Optional named line(s) at the end of this segment. */
  lineEnd?: string | string[]
}

export type TrackConfig = {
  columns: TrackSegment[]
  /** Track floor — reuses --measure-min unless overridden. */
  minTrackWidth?: string
}

export type GridPreset = TrackConfig & {
  name: string
}
```

`8 equal + double + triple` is:

```ts
columns: [
  { size: 1 },
  { size: 1 },
  { size: 1 },
  { size: 1 },
  { size: 1 },
  { size: 1 },
  { size: 1 },
  { size: 2 },
  { size: 3 },
]
```

An editorial preset with named lines:

```ts
columns: [
  { size: 2, lineStart: 'feature-start', lineEnd: 'feature-end' },
  { size: 1, lineStart: 'aside-start', lineEnd: 'aside-end' },
]
```

### Presets (`app/app.config.ts`)

```ts
gridLayer: {
  presets: {
    swiss: { columns: [ /* 18 equal segments */ ] },
    editorial: { columns: [ /* feature/aside as above */ ] },
  }
}
```

Registry is data in `app.config.ts` (consuming apps can override/extend, same
pattern `layout` already uses for its own config), not hardcoded in the
composable.

### `useGridTracks()` composable

```ts
const { toColumnsCss, resolve } = useGridTracks()

resolve('swiss') // → GridPreset from app.config
resolve(customTrackConfig) // → passes a TrackConfig straight through

toColumnsCss(trackConfig)
// → 'minmax(min-content, [feature-start] 2fr [feature-end aside-start] 1fr [aside-end])'
```

`toColumnsCss` builds the `grid-template-columns` string: each segment's
`lineStart`/`lineEnd` become bracketed line names positioned around its `fr`
value, per standard named-grid-line syntax. Track width floor uses
`minTrackWidth` (defaults to `var(--measure-min)` from the rhythm CSS) via
`minmax()`, so narrow viewports still degrade to fewer effective columns —
same floor behavior as today's `auto-fill` approach, just applied per-segment
rather than to one repeated track.

### Placement — named lines primary, numeric fallback

No `LayoutGridItem`-equivalent component ships in this layer (that's
`layout`'s territory, deferred). What ships is the addressing convention and
a pure util others can build on:

```ts
export function placementFromLines(startLine: string, endLine: string): string
// → 'feature-start / aside-start'

export function placementFromIndex(colStart: number, colSpan: number | 'full'): string
// → numeric fallback for auto-flowing content (e.g. a future Gallery) that
//   has no named slot to target
```

Named lines are primary because they propagate through CSS `subgrid`
correctly — `grid-template-areas` do not survive a subgrid boundary the same
way, and this codebase's existing grid components lean heavily on subgrid
for Section → Item inheritance. Numeric index/span stays available as a
fallback, unchanged in shape from what `layout`'s current `GridItem` already
exposes, so a future migration of those components is additive rather than a
rewrite of every prop.

### Visual builder (`apps/playground`)

A dev-only page, e.g. `/grid-builder`, in `apps/playground` (not shipped as
part of the `grid` layer itself — playground is a demo app that loads
layers, this doesn't need to be loadable by consuming apps):

- Form/drag UI to add, resize, and reorder `TrackSegment`s (count, relative
  size, optional line names).
- Live preview: renders a `.grid-root` with the resulting
  `grid-template-columns`, filled with placeholder cells so proportions are
  visible immediately.
- Output panel: the resulting `TrackConfig` as copyable TS, so the result can
  be pasted into `app.config.ts` as a new named preset or used inline.
- No persistence, no save-to-registry automation — copy/paste is the
  hand-off, matching the "dev-time tool in playground, emits config" scope
  agreed earlier.

## Testing

- `useGridTracks.test.ts` — `toColumnsCss` produces correct line-name
  bracket placement for: equal segments, mixed sizes, segments with only
  `lineStart`, segments with both. `resolve()` returns registry presets and
  passes through custom configs unchanged.
- `placement.test.ts` — `placementFromLines`/`placementFromIndex` produce
  the expected `grid-column` value strings, including the `'full'` numeric
  case.
- No component tests — no Vue component ships in this phase besides the
  playground builder page, which is verified visually (render the three
  known shapes — swiss, editorial, one ad hoc custom config from the builder
  itself — and confirm proportions match what was configured).

## Out of scope

- Reworking `layout`'s `LayoutMain`/`LayoutGridItem`/`Section`/`Hero`/
  `Split`/`Gallery` to consume this layer's tracks/rhythm. Noted as a known
  follow-up; not part of this spec or its implementation plan.
- Row-track presets beyond the rhythm-derived floor (`--unit * --lpf`) —
  only column composition is preset/builder-driven in this phase.
- Saving builder output directly into the preset registry from the UI.
- A Bento-grid preset (mixed row+column spans) — deferred; only `swiss` and
  `editorial` ship initially, matching the two selected patterns.
