# Layout Layer Fluid Rebuild Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace `layers/structure/layout`'s breakpoint-based 6/12/18-column subgrid system with a CSS-only, `--fs`-derived fluid grid — no breakpoints, no numbered column placement, no JS grid math.

**Architecture:** One root custom property (`--fs`) drives everything via CSS `calc()`/`round()`: `--unit` → `--edge-min`/`--lpf`/`--measure-min` → per-section `--lines`/`--fields`/`--slack`. The root grid uses `repeat(auto-fill, minmax(--measure-min, 1fr))` for organic column count. `LayoutSection` opts a full-width row into `subgrid` (inheriting the root's resolved columns) and runs its own field-rhythm derivation. Every derived custom property is registered via `@property` so a future bad edit fails loud (invalid declaration → visible layout break) instead of silently squashing cells into slivers — the exact failure mode this design already hit once in the `swiss-test` prototype.

**Tech Stack:** Nuxt 4 layer (`layers/structure/layout`), Vue 3 `<script setup>`, plain CSS (`@property`, subgrid, container queries, `clamp()`/`round()`), Vitest + `@nuxt/test-utils` for the composable test.

**Spec:** `docs/superpowers/specs/2026-09-03-layout-layer-fluid-rebuild-design.md`

## Global Constraints

- No numbered `colStart`/`colSpan`/`rowStart`/`rowSpan` placement API anywhere in the new component surface (spec §2, §5).
- No mathematically-generated `--cols` — column count comes only from native `auto-fill` (spec §2, §7 Pitfall 1).
- Every derived custom property (`--fs`, `--unit`, `--edge-min`, `--measure-min`, `--lpf`, `--lines`, `--fields`, `--avail-b`, `--type-b`, `--slack`) is registered via `@property` with a real `syntax` (spec §6).
- Every fluid `clamp()` keeps a `rem` term; `svh`/`svi` never `dvh`/`vw`/`vh`; `container-type` never on `body`; `lh`/`rlh` never inside a media query condition (spec §8).
- No TypeScript interface for the config→CSS-var bridge — `@property` is the only typing layer (spec §2, §9).
- `HStack`/`VStack`/`ZStack`/`Spacer`, `LayoutPage`/`LayoutPageHeader`, and the z-index layer system (`useZIndex`, `GridLayers`) are untouched (spec §2).
- No edits to `layers/content`, `layers/structure/navigation`, or the `starter` app in this plan — those are migration-guide territory, not this task (spec §2, §11).

---

## File Structure

```text
layers/structure/layout/app/
├── assets/css/layout/grids.css        # REWRITE — fluid engine + @property + rhythm utils (unchanged)
├── types/layouts.ts                   # REWRITE — GridMode/GridTunables/GridConfig, drop presets
├── app.config.ts                      # REWRITE — layoutLayer.ui.grid tunables, fix ui.page slots
├── composables/useGridConfig.ts       # REWRITE — drop getPreset, add cssVars
├── components/Layout/
│   ├── Main.vue                       # REWRITE — binds cssVars, class layout-grid
│   ├── Section.vue                    # NEW — opt-in full-width subgrid row (replaces Section/index.vue)
│   ├── Cell.vue                       # NEW — replaces Grid/Item.vue
│   ├── Hero.vue                       # NEW — replaces the `hero` GridItem preset
│   └── Grid/Debug.vue                 # REWRITE — --unit band overlay, no JS column tracking
└── utils/gridPlacementStyle.ts        # DELETE (+ .test.ts)

layers/structure/layout/app/components/Layout/Section/  # DELETE whole dir (index.vue, Gallery.vue, Hero.vue, Split.vue)
layers/structure/layout/app/components/Layout/Grid/Item.vue  # DELETE

tests/nuxt/use-grid-config.test.ts     # REWRITE — mode/isEnabled/useZIndex/cssVars

apps/playground/app/pages/layout.vue   # REWRITE — demo against new components

docs/LAYOUT.md                          # REWRITE
layers/structure/layout/CLAUDE.md       # REWRITE
docs/LAYOUT-MIGRATION.md                # NEW — old→new API mapping for later consumer migration
```

---

### Task 1: Types and config

**Files:**
- Modify: `layers/structure/layout/app/types/layouts.ts`
- Modify: `layers/structure/layout/app/app.config.ts`

**Interfaces:**
- Produces: `GridMode = 'fluid' | 'disabled'`, `GridLayers` (unchanged shape), `GridTunables = { measureMin: string; edgeMin: { min: string; max: string }; lpf: { min: number; max: number } }`, `GridConfig = { mode?: GridMode; tunables: GridTunables; layers: GridLayers }` — every later task that imports from `layouts.ts` uses these exact names.

- [ ] **Step 1: Rewrite `layouts.ts`**

Replace the entire file with:

```ts
export type GridLayers = {
  /** Component/content at rest — z-index 0 */
  back: number
  /** Standard interactive content — z-index 10 */
  mid: number
  /** Elevated content, sticky elements — z-index 20 */
  front: number
  /** Page-level overlays — z-index 30 */
  top: number
  /** Site header / navigation bar — z-index 100 */
  header: number
  /** Dropdown menus, popovers — z-index 200 */
  dropdown: number
  /** Overlay backdrops — z-index 300 */
  overlay: number
  /** Modal dialogs — z-index 400 */
  modal: number
  /** Toast notifications — z-index 500 */
  toast: number
}

export type GridMode = 'fluid' | 'disabled'

export type GridTunables = {
  /** Narrowest column / repeat(auto-fill, minmax(...)) floor. CSS length, e.g. '22rem'. */
  measureMin: string
  /** clamp() bounds for the inline/block edge margin. CSS lengths. */
  edgeMin: { min: string; max: string }
  /** clamp() bounds for lines-per-field (vertical rhythm chunking). */
  lpf: { min: number; max: number }
}

export type GridConfig = {
  /**
   * Layout mode.
   * - `'fluid'`    — the --fs-derived fluid grid (default)
   * - `'disabled'` — falls back to a plain, ungridded `<main>`
   */
  mode?: GridMode
  tunables: GridTunables
  layers: GridLayers
}
```

- [ ] **Step 2: Rewrite `app.config.ts`**

Replace the `layoutLayer` block and the `ui.page` slots block. Keep `ui.header`, `ui.pageBody`, `ui.pageGrid`, `ui.pageColumns` unchanged — they only use `col-span-full`/`grid-cols-subgrid`, which stay meaningful with emergent columns. `ui.page`'s `left`/`center`/`right` split assumed a fixed 18-column grid (`col-start-5`, `col-start-15`) — that addressing is gone, so collapse all three slots to full width:

```ts
import type { GridConfig } from './types/layouts'

export default defineAppConfig({
  ui: {
    header: {
      slots: {
        container: 'max-w-full px-[clamp(1rem,2.5vw,2rem)]',
      },
    },

    // UPage: transparent subgrid participant. No addressable columns under
    // the fluid grid, so left/center/right all resolve to the same
    // full-width slot instead of a numbered sidebar split.
    page: {
      slots: {
        root: 'col-span-full grid grid-cols-subgrid',
        left: 'col-span-full',
        center: 'col-span-full',
        right: 'col-span-full',
      },
    },

    // UPageBody: no opinionated padding — the grid and sections own spacing
    pageBody: {
      base: '',
    },

    // UPageGrid: inherits subgrid column lines; gap matches --unit
    pageGrid: {
      base: 'col-span-full grid grid-cols-subgrid gap-[var(--unit)]',
    },

    // UPageColumns: inherits subgrid column lines
    pageColumns: {
      base: 'col-span-full grid grid-cols-subgrid',
    },
  },

  layoutLayer: {
    ui: {
      grid: {
        /**
         * Layout mode.
         * - 'fluid'    — the --fs-derived fluid grid (default)
         * - 'disabled' — falls back to a plain, ungridded <main>
         */
        mode: 'fluid',

        // Tunables feed CSS custom properties via useGridConfig().cssVars,
        // bound on LayoutMain. See docs/LAYOUT.md for what each one does.
        tunables: {
          measureMin: '22rem',
          edgeMin: { min: 'var(--unit)', max: 'calc(var(--unit) * 3)' },
          lpf: { min: 4, max: 8 },
        },

        // Z-index layers — unchanged from the old system
        layers: {
          back: 0,
          mid: 10,
          front: 20,
          top: 30,
          header: 100,
          dropdown: 200,
          overlay: 300,
          modal: 400,
          toast: 500,
        },
      },
    },
  },
})

declare module '@nuxt/schema' {
  interface AppConfigInput {
    layoutLayer?: {
      name?: string
      ui?: {
        grid?: GridConfig
      }
    }
  }
}
```

- [ ] **Step 3: Typecheck**

Run: `pnpm --filter kmcom-layer-layout typecheck`
Expected: no errors from `layouts.ts`/`app.config.ts` (downstream files that still import `GridPresetsItem`/`getPreset` will fail here — that's expected, fixed in later tasks of this same plan, not a regression to chase down yet).

- [ ] **Step 4: Commit**

```bash
git add layers/structure/layout/app/types/layouts.ts layers/structure/layout/app/app.config.ts
git commit -m "feat(layout): replace preset-based grid config with fluid tunables"
```

---

### Task 2: Fluid grid CSS engine

**Files:**
- Modify: `layers/structure/layout/app/assets/css/layout/grids.css`

**Interfaces:**
- Produces: CSS classes `.layout-grid`, `.layout-section`, `.layout-section[data-align='center']`, `.layout-section[data-align='split']`, `.layout-cell`, `.layout-cell--block`, `.layout-cell--plate`, `.layout-cell--span-2`, `.layout-cell--span-2-rows`, `.layout-cell--span-3-rows`, `.layout-hero`, and custom properties `--fs`/`--unit`/`--edge-min`/`--measure-min`/`--lpf` on `:root` — every component task below (3 onward) targets these exact class names.
- Consumes: nothing (this is the base layer).

- [ ] **Step 1: Replace the "Root grid" and "Section" sections of `grids.css`, keep the rhythm utilities**

The file currently has three sections: `.grid-root`, `.basesection`, and the rhythm utilities (`.leading-rhythm-*`, `.space-rhythm-*`, `.prose-rhythm`). Replace only the first two; the rhythm utilities are unrelated to grid mechanics and stay as-is. Full new file:

```css
/**
 * Fluid Grid System - CSS Utilities
 *
 * --fs-derived, breakpoint-free grid. One root unit (--unit, derived from
 * --fs) drives column floor, edge margins, and per-section vertical
 * rhythm. Column count comes from native `auto-fill` — never a
 * calc()/round()-derived integer fed into repeat() (see Pitfall 1 below).
 *
 * Full derivation and pitfalls:
 * docs/superpowers/specs/2026-09-03-layout-layer-fluid-rebuild-design.md
 *
 * Hierarchy:
 *   LayoutMain (.layout-grid)              ← auto-fill columns, --fs owner
 *   └── LayoutSection (.layout-section)    ← opt-in, subgrid, own field rhythm
 *       └── LayoutCell (.layout-cell)      ← block/plate variant, span-N utility
 *   LayoutHero (.layout-hero)              ← deliberately outside the grid
 */

/* Every derived custom property is registered so an invalid calc() chain
   fails loud (declaration invalidates, layout visibly breaks) instead of
   silently substituting as a token stream and squashing cells — the exact
   bug this design already hit once (Pitfall 1). */
@property --fs {
  syntax: '<length>';
  inherits: true;
  initial-value: 1rem;
}

@property --unit {
  syntax: '<length>';
  inherits: true;
  initial-value: 1rem;
}

@property --edge-min {
  syntax: '<length>';
  inherits: true;
  initial-value: 1rem;
}

@property --measure-min {
  syntax: '<length>';
  inherits: true;
  initial-value: 22rem;
}

@property --lpf {
  syntax: '<integer>';
  inherits: true;
  initial-value: 8;
}

:root {
  /* Every clamp() below keeps a rem term (WCAG 1.4.4 — pure vw/cqi ignores
     browser zoom) and uses svi/svh, never dvh/vw/vh (dvh recomputes on
     mobile URL-bar collapse, reflowing mid-scroll). */
  --fs: clamp(1rem, 0.95rem + 0.25svi, 1.125rem);
  font-size: var(--fs);
  /* round(), not raw multiplication, so grid boundaries land on-pixel. */
  line-height: round(nearest, calc(var(--fs) * 1.5), 1px);

  /* rlh, not lh — lh resolves against the *current* element, so a heading
     with a different line-height would silently produce a different unit
     for anything nested inside it. rlh always resolves against root. */
  --unit: 1rlh;
  --measure-min: 22rem;
  /* Margin floor > 0 (never flush edge), steep svi slope so it shrinks
     fast on narrow screens. Feeds --avail-b in .layout-section, so it also
     trims top/bottom slack, not just inline edges. */
  --edge-min: clamp(var(--unit), 8svi, calc(var(--unit) * 3));
  /* Lines-per-field, clamped 4-8, scaled by viewport height so a fixed
     lpf=8 can't strand up to 8 line-heights as dead padding on a short
     viewport. */
  --lpf: clamp(4, round(down, calc(100svh / var(--unit) / 4.5), 1), 8);
}

/**
 * .layout-grid - Root fluid grid
 *
 * Continuous auto-fill grid — content not wrapped in .layout-section flows
 * and wraps normally, sized only by --measure-min/--unit. No viewport-
 * height chunking here; that's opt-in via .layout-section.
 */
.layout-grid {
  display: grid;
  box-sizing: border-box;
  width: 100%;
  max-width: 100%;
  padding-inline: var(--edge-min);
  gap: var(--unit);
  /* Boundary for .layout-section's viewport-scoped span-2 gate below. */
  container-type: inline-size;
  container-name: layout-viewport;
  /* auto-fill computes column count natively (floor((avail+gutter) /
     (measure+gutter))) — no var()-derived integer needed. See Pitfall 1:
     repeat()'s track-count argument requires a literal <integer> at
     computed-value time; an unregistered calc()/round()-derived custom
     property there invalidates the whole declaration, falling back to
     implicit, content-sized auto-placement — cells silently squash to
     unreadable slivers. */
  grid-template-columns: repeat(auto-fill, minmax(var(--measure-min), 1fr));
  /* Belt-and-braces: if a span ever outruns the explicit tracks, the
     forced implicit column is sized the same way, not auto/content
     (Pitfall 2). */
  grid-auto-columns: minmax(var(--measure-min), 1fr);
  grid-auto-rows: minmax(calc(var(--lpf) * var(--unit)), max-content);
  /* clip without creating a scroll container (overflow-x:hidden would
     force overflow-y:auto) */
  overflow-x: clip;
}

/**
 * .layout-section - Opt-in full-width subgrid row
 *
 * Spans every column of the root's resolved auto-fill grid via subgrid —
 * legal because subgrid adopts however many explicit tracks the parent
 * resolved, whatever that count is; it only breaks when something tries
 * to *address* a column by number, which nothing here does. Runs its own
 * --lines/--fields/--slack derivation, scoped to itself, using the shared
 * global --unit/--edge-min/--lpf from :root.
 */
.layout-section {
  display: grid;
  box-sizing: border-box;
  grid-column: 1 / -1;
  grid-template-columns: subgrid;
  container-type: inline-size;
  container-name: layout-section;
}

.layout-section[data-align='center'] {
  place-content: center;
}

.layout-section[data-align='split'] {
  --avail-b: calc(100svh - 2 * var(--edge-min));
  --lines: calc(round(down, var(--avail-b), var(--unit)) / var(--unit));
  --fields: max(1, round(down, calc((var(--lines) + 1) / (var(--lpf) + 1)), 1));
  --type-b: calc((var(--fields) * (var(--lpf) + 1) - 1) * var(--unit));
  /* max(0px, ...) keeps padding from going negative when the block-axis
     field system can't fit (short landscape viewport) — the section just
     scrolls instead of forcing an impossible field count. */
  --slack: calc(100svh - var(--type-b));
  padding-block: max(0px, calc(var(--slack) * 0.4)) max(0px, calc(var(--slack) * 0.6));
}

/**
 * .layout-cell - Positioned/styled grid child
 *
 * variant is applied via a modifier class (--block / --plate), span via
 * boolean utility classes. No numbered colStart/rowStart placement.
 */
.layout-cell {
  container-type: inline-size;
  container-name: layout-cell;
}

.layout-cell--block {
  border: 1px solid currentColor;
  padding: calc(var(--unit) / 2);
}

.layout-cell--plate {
  background: var(--ui-bg-elevated, #16161a);
  color: var(--ui-text-highlighted, #fbfbf9);
  padding: calc(var(--unit) / 2);
}

/* Threshold mirrors --measure-min (22rem) — container query conditions
   can't reference custom properties, so keep this in sync by hand. */
@container layout-cell (max-width: 22rem) {
  .layout-cell--block {
    padding-inline: calc(var(--unit) / 4);
  }
}

.layout-cell--span-2-rows {
  grid-row: span 2;
}

.layout-cell--span-3-rows {
  grid-row: span 3;
}

/* .layout-cell--span-2 only claims a 2nd column once the viewport
   container has genuinely resolved 2 — below this it stays a normal 1x1
   cell instead of forcing CSS Grid to fabricate a content-sized implicit
   column (Pitfall 2's squash/overflow bug). Threshold is a deliberately
   conservative 2 * --measure-min + gutter; hand-kept in sync with
   --measure-min since container conditions can't read custom properties. */
@container layout-viewport (min-width: calc(2 * 22rem + 1rlh)) {
  .layout-cell--span-2 {
    grid-column: span 2;
  }
}

/**
 * .layout-hero - Deliberately outside the grid system
 *
 * No --fields, no column derivation — matches the doc's own .hero.
 */
.layout-hero {
  min-height: 100svh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--unit);
  padding-inline: var(--edge-min);
  text-align: center;
}

/**
 * Baseline Grid / Vertical Rhythm Utilities
 *
 * Maintains consistent vertical spacing based on a configurable baseline unit.
 * Default rhythm unit: 0.25rem (4px)
 */

/* Line height utilities */
.leading-rhythm-4 {
  --rhythm: 0.25rem;

  line-height: calc(var(--rhythm) * 4); /* 1rem */
}

.leading-rhythm-5 {
  --rhythm: 0.25rem;

  line-height: calc(var(--rhythm) * 5); /* 1.25rem */
}

.leading-rhythm-6 {
  --rhythm: 0.25rem;

  line-height: calc(var(--rhythm) * 6); /* 1.5rem */
}

.leading-rhythm-7 {
  --rhythm: 0.25rem;

  line-height: calc(var(--rhythm) * 7); /* 1.75rem */
}

.leading-rhythm-8 {
  --rhythm: 0.25rem;

  line-height: calc(var(--rhythm) * 8); /* 2rem */
}

/* Vertical spacing utilities */
.space-rhythm-1 {
  --rhythm: 0.25rem;

  margin-block: var(--rhythm); /* 0.25rem */
}

.space-rhythm-2 {
  --rhythm: 0.25rem;

  margin-block: calc(var(--rhythm) * 2); /* 0.5rem */
}

.space-rhythm-4 {
  --rhythm: 0.25rem;

  margin-block: calc(var(--rhythm) * 4); /* 1rem */
}

.space-rhythm-6 {
  --rhythm: 0.25rem;

  margin-block: calc(var(--rhythm) * 6); /* 1.5rem */
}

.space-rhythm-8 {
  --rhythm: 0.25rem;

  margin-block: calc(var(--rhythm) * 8); /* 2rem */
}

/* Prose container - auto-applies rhythm to children */
.prose-rhythm {
  --rhythm: 0.25rem;

  & > * + * {
    margin-block-start: calc(var(--rhythm) * 4); /* 1rem between elements */
  }

  & > h1,
  & > h2,
  & > h3,
  & > h4,
  & > h5,
  & > h6 {
    margin-block: calc(var(--rhythm) * 8) calc(var(--rhythm) * 4); /* 2rem before, 1rem after headings */
    line-height: calc(var(--rhythm) * 8);
  }

  & > p {
    line-height: calc(var(--rhythm) * 6); /* 1.5rem for paragraphs */
  }
}
```

- [ ] **Step 2: Lint the CSS**

Run: `pnpm --filter kmcom-layer-layout lint`
Expected: no stylelint errors. If `custom-property-pattern` flags `--_rs`-style leftovers from the old `.gi-placed` rules, those rules no longer exist in this file — ignore/fix only findings inside `grids.css`.

- [ ] **Step 3: Commit**

```bash
git add layers/structure/layout/app/assets/css/layout/grids.css
git commit -m "feat(layout): replace breakpoint grid CSS with --fs-derived fluid engine"
```

---

### Task 3: `useGridConfig` composable

**Files:**
- Modify: `layers/structure/layout/app/composables/useGridConfig.ts`
- Test: `tests/nuxt/use-grid-config.test.ts`

**Interfaces:**
- Consumes: `GridConfig`, `GridLayers`, `GridMode` from `layers/structure/layout/app/types/layouts.ts` (Task 1).
- Produces: `useGridConfig(): { config: ComputedRef<GridConfig | undefined>; mode: ComputedRef<GridMode>; isEnabled: ComputedRef<boolean>; layers: ComputedRef<GridLayers | undefined>; useZIndex: (layer: keyof GridLayers) => number; cssVars: ComputedRef<Record<string, string>> }` — `LayoutMain` (Task 4) binds `cssVars` via `:style` and reads `mode`.

- [ ] **Step 1: Rewrite the test file first**

Replace `tests/nuxt/use-grid-config.test.ts` entirely:

```ts
import { defineComponent } from 'vue'
import { mockNuxtImport, mountSuspended } from '@nuxt/test-utils/runtime'
import { describe, expect, it } from 'vitest'

import { useGridConfig } from '../../layers/structure/layout/app/composables/useGridConfig'
import type { GridConfig, GridLayers } from '../../layers/structure/layout/app/types/layouts'

type LayoutAppConfig = {
  layoutLayer?: {
    ui?: {
      grid?: GridConfig
    }
  }
}

const layers: GridLayers = {
  back: 0,
  mid: 10,
  front: 20,
  top: 30,
  header: 100,
  dropdown: 200,
  overlay: 300,
  modal: 400,
  toast: 500,
}

var appConfig: LayoutAppConfig = {
  layoutLayer: {
    ui: {
      grid: {
        mode: 'fluid',
        tunables: {
          measureMin: '22rem',
          edgeMin: { min: 'var(--unit)', max: 'calc(var(--unit) * 3)' },
          lpf: { min: 4, max: 8 },
        },
        layers,
      },
    },
  },
}

mockNuxtImport('useAppConfig', () => () => appConfig)

async function mountGridConfig() {
  let resolved: ReturnType<typeof useGridConfig> | undefined

  await mountSuspended(
    defineComponent({
      setup() {
        resolved = useGridConfig()
        return () => null
      },
    })
  )

  if (!resolved) {
    throw new Error('grid composable did not resolve')
  }

  return resolved
}

describe('useGridConfig', () => {
  it('defaults to fluid mode when mode is omitted', async () => {
    appConfig = {
      layoutLayer: {
        ui: {
          grid: {
            tunables: {
              measureMin: '22rem',
              edgeMin: { min: 'var(--unit)', max: 'calc(var(--unit) * 3)' },
              lpf: { min: 4, max: 8 },
            },
            layers,
          },
        },
      },
    }

    const resolved = await mountGridConfig()

    expect(resolved.mode.value).toBe('fluid')
    expect(resolved.isEnabled.value).toBe(true)
    expect(resolved.useZIndex('modal')).toBe(400)
    expect(resolved.layers.value).toEqual(layers)
  })

  it('respects an explicit disabled mode', async () => {
    appConfig = {
      layoutLayer: {
        ui: {
          grid: {
            mode: 'disabled',
            tunables: {
              measureMin: '24rem',
              edgeMin: { min: 'var(--unit)', max: 'calc(var(--unit) * 3)' },
              lpf: { min: 4, max: 8 },
            },
            layers,
          },
        },
      },
    }

    const resolved = await mountGridConfig()

    expect(resolved.mode.value).toBe('disabled')
    expect(resolved.isEnabled.value).toBe(false)
    expect(resolved.useZIndex('toast')).toBe(500)
  })

  it('maps tunables to CSS custom properties', async () => {
    appConfig = {
      layoutLayer: {
        ui: {
          grid: {
            mode: 'fluid',
            tunables: {
              measureMin: '24rem',
              edgeMin: { min: 'var(--unit)', max: 'calc(var(--unit) * 4)' },
              lpf: { min: 5, max: 9 },
            },
            layers,
          },
        },
      },
    }

    const resolved = await mountGridConfig()

    expect(resolved.cssVars.value['--measure-min']).toBe('24rem')
    expect(resolved.cssVars.value['--edge-min']).toBe(
      'clamp(var(--unit), 8svi, calc(var(--unit) * 4))'
    )
    expect(resolved.cssVars.value['--lpf']).toBe(
      'clamp(5, round(down, calc(100svh / var(--unit) / 4.5), 1), 9)'
    )
  })
})
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `pnpm vitest run tests/nuxt/use-grid-config.test.ts`
Expected: FAIL — `useGridConfig` still exports `getPreset`/references `enabled`/`presets`, `mode`/`cssVars` don't match yet.

- [ ] **Step 3: Rewrite `useGridConfig.ts`**

```ts
import type { GridConfig, GridLayers, GridMode } from '#layers/layout/app/types/layouts'

type LayoutLayerConfig = {
  layoutLayer?: {
    name?: string
    ui?: {
      grid?: GridConfig
    }
  }
}

export function useGridConfig() {
  const appConfig = useAppConfig() as LayoutLayerConfig
  const gridConfig = computed(() => appConfig.layoutLayer?.ui?.grid)

  /** Resolved layout mode. Defaults to 'fluid' when omitted. */
  const mode = computed<GridMode>(() => gridConfig.value?.mode ?? 'fluid')

  /** True when the fluid grid is active. */
  const isEnabled = computed(() => mode.value !== 'disabled')

  /**
   * Returns the z-index value for a named stacking layer.
   *
   * @example
   * const zModal = useZIndex('modal') // → 400
   */
  const useZIndex = (layer: keyof GridLayers): number => {
    return gridConfig.value?.layers?.[layer] ?? 0
  }

  /**
   * Config tunables mapped to the CSS custom properties LayoutMain binds
   * via :style. This is the JS→CSS bridge — see spec §9 for why it carries
   * no dedicated TS type beyond GridConfig itself.
   */
  const cssVars = computed(() => {
    const tunables = gridConfig.value?.tunables
    if (!tunables) return {}

    return {
      '--measure-min': tunables.measureMin,
      '--edge-min': `clamp(var(--unit), 8svi, ${tunables.edgeMin.max})`,
      '--lpf': `clamp(${tunables.lpf.min}, round(down, calc(100svh / var(--unit) / 4.5), 1), ${tunables.lpf.max})`,
    }
  })

  return {
    config: gridConfig,
    layers: computed(() => gridConfig.value?.layers),
    isEnabled,
    mode,
    useZIndex,
    cssVars,
  }
}
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `pnpm vitest run tests/nuxt/use-grid-config.test.ts`
Expected: PASS (3 tests)

- [ ] **Step 5: Commit**

```bash
git add layers/structure/layout/app/composables/useGridConfig.ts tests/nuxt/use-grid-config.test.ts
git commit -m "feat(layout): rebuild useGridConfig around fluid tunables and cssVars"
```

---

### Task 4: `LayoutMain` rebuild

**Files:**
- Modify: `layers/structure/layout/app/components/Layout/Main.vue`

**Interfaces:**
- Consumes: `useGridConfig()` → `{ mode, cssVars }` (Task 3).
- Produces: renders `.layout-grid` (Task 2's CSS) with `cssVars` bound as inline custom properties. `LayoutSection`/`LayoutCell` (Tasks 5-6) rely on being mounted inside this element for `--unit`/`--edge-min`/`--measure-min`/`--lpf` to resolve from the config-driven values rather than the `:root` defaults alone.

- [ ] **Step 1: Rewrite `Main.vue`**

```vue
<script setup lang="ts">
  /**
   * LayoutMain — root of the fluid grid.
   *
   * Renders `.layout-grid` and binds the config-driven tunables
   * (measureMin/edgeMin/lpf) as inline CSS custom properties, overriding
   * the :root defaults from grids.css for this subtree.
   *
   * When `mode` is `'disabled'`, falls back to a plain semantic `<main>`
   * so the page renders correctly without grid dependencies.
   *
   * @prop {string} tag — HTML element to render (default: 'main')
   *
   * @example
   * <LayoutMain>
   *   <LayoutSection>…</LayoutSection>
   * </LayoutMain>
   */

  interface Props {
    tag?: string
  }

  const { tag = 'main' } = defineProps<Props>()

  const { mode, cssVars } = useGridConfig()
</script>

<template>
  <component :is="tag" :class="mode !== 'disabled' ? 'layout-grid' : undefined" :style="mode !== 'disabled' ? cssVars : undefined">
    <slot />
  </component>
</template>
```

- [ ] **Step 2: Typecheck**

Run: `pnpm --filter kmcom-layer-layout typecheck`
Expected: no errors from `Main.vue`.

- [ ] **Step 3: Commit**

```bash
git add layers/structure/layout/app/components/Layout/Main.vue
git commit -m "feat(layout): rebuild LayoutMain around the fluid grid"
```

---

### Task 5: `LayoutSection` (new) and deletion of the old Section directory

**Files:**
- Create: `layers/structure/layout/app/components/Layout/Section.vue`
- Delete: `layers/structure/layout/app/components/Layout/Section/index.vue`
- Delete: `layers/structure/layout/app/components/Layout/Section/Gallery.vue`
- Delete: `layers/structure/layout/app/components/Layout/Section/Hero.vue`
- Delete: `layers/structure/layout/app/components/Layout/Section/Split.vue`

**Interfaces:**
- Produces: `LayoutSection` — props `{ height?: string; align?: 'split' | 'center' }`, renders `.layout-section` (Task 2's CSS) with `data-align` and `block-size` bound.

- [ ] **Step 1: Delete the old Section directory**

```bash
git rm -r layers/structure/layout/app/components/Layout/Section
```

- [ ] **Step 2: Create `Section.vue`**

```vue
<script setup lang="ts">
  /**
   * LayoutSection — opt-in full-width subgrid row.
   *
   * Spans every column of the parent LayoutMain's resolved auto-fill grid
   * via CSS subgrid, so content inside stays aligned to the same gutters
   * as everything else on the page. Defaults to a 100svh block, running
   * its own --lines/--fields/--slack derivation scoped to itself.
   *
   * `align="split"` (default) uses the doc's asymmetric 40/60 optical
   * padding split. `align="center"` uses `place-content: center` for true
   * horizontal+vertical centering — pick this when you want a centered
   * hero-like section without fighting align-items: stretch defaults.
   *
   * @prop {string} height — block-size (default: '100svh')
   * @prop {'split' | 'center'} align — vertical rhythm mode (default: 'split')
   *
   * @example
   * <LayoutSection align="center">
   *   <LayoutCell variant="plate">Centered content</LayoutCell>
   * </LayoutSection>
   */

  interface Props {
    height?: string
    align?: 'split' | 'center'
  }

  const { height = '100svh', align = 'split' } = defineProps<Props>()
</script>

<template>
  <section class="layout-section" :data-align="align" :style="{ blockSize: height }">
    <slot />
  </section>
</template>
```

- [ ] **Step 3: Typecheck**

Run: `pnpm --filter kmcom-layer-layout typecheck`
Expected: `Section.vue` itself introduces no errors. Remaining errors from files still importing the deleted `Section/index.vue` etc. are expected until Task 9 (playground) — do not fix them here.

- [ ] **Step 4: Commit**

```bash
git add layers/structure/layout/app/components/Layout/Section.vue
git commit -m "feat(layout): add LayoutSection, drop the old subgrid Section directory"
```

---

### Task 6: `LayoutCell` (replaces `LayoutGridItem`)

**Files:**
- Create: `layers/structure/layout/app/components/Layout/Cell.vue`
- Delete: `layers/structure/layout/app/components/Layout/Grid/Item.vue`
- Delete: `layers/structure/layout/app/utils/gridPlacementStyle.ts`
- Delete: `layers/structure/layout/app/utils/gridPlacementStyle.test.ts`

**Interfaces:**
- Produces: `LayoutCell` — props `{ as?: string; variant?: 'block' | 'plate'; span2?: boolean; span2Rows?: boolean; span3Rows?: boolean }`, renders the element with `layout-cell layout-cell--<variant>` plus the requested span modifier classes.

- [ ] **Step 1: Delete the old GridItem component and placement utility**

```bash
git rm layers/structure/layout/app/components/Layout/Grid/Item.vue
git rm layers/structure/layout/app/utils/gridPlacementStyle.ts
git rm layers/structure/layout/app/utils/gridPlacementStyle.test.ts
```

- [ ] **Step 2: Create `Cell.vue`**

```vue
<script setup lang="ts">
  /**
   * LayoutCell — a positioned/styled grid child.
   *
   * Replaces LayoutGridItem. No numbered colStart/rowStart placement —
   * emergent auto-fill columns have no addressable count to position
   * against. `variant` picks border-vs-filled styling; the span props are
   * boolean utility classes, not coordinates.
   *
   * @prop {string} as — HTML element to render (default: 'div')
   * @prop {'block' | 'plate'} variant — border vs. filled styling (default: 'block')
   * @prop {boolean} span2 — claim 2 columns once the viewport container has resolved 2 (see grids.css)
   * @prop {boolean} span2Rows — span 2 rows
   * @prop {boolean} span3Rows — span 3 rows
   *
   * @example
   * <LayoutCell variant="plate" span2>
   *   <h2>Featured</h2>
   * </LayoutCell>
   */

  interface Props {
    as?: string
    variant?: 'block' | 'plate'
    span2?: boolean
    span2Rows?: boolean
    span3Rows?: boolean
  }

  const {
    as = 'div',
    variant = 'block',
    span2 = false,
    span2Rows = false,
    span3Rows = false,
  } = defineProps<Props>()

  const classes = computed(() => [
    'layout-cell',
    `layout-cell--${variant}`,
    span2 && 'layout-cell--span-2',
    span2Rows && 'layout-cell--span-2-rows',
    span3Rows && 'layout-cell--span-3-rows',
  ])
</script>

<template>
  <component :is="as" :class="classes">
    <slot />
  </component>
</template>
```

- [ ] **Step 3: Typecheck**

Run: `pnpm --filter kmcom-layer-layout typecheck`
Expected: `Cell.vue` introduces no errors.

- [ ] **Step 4: Commit**

```bash
git add layers/structure/layout/app/components/Layout/Cell.vue
git commit -m "feat(layout): add LayoutCell, drop LayoutGridItem and gridPlacementStyle"
```

---

### Task 7: `LayoutHero` (new)

**Files:**
- Create: `layers/structure/layout/app/components/Layout/Hero.vue`

**Interfaces:**
- Produces: `LayoutHero` — prop `{ as?: string }`, renders `.layout-hero` (Task 2's CSS).

- [ ] **Step 1: Create `Hero.vue`**

```vue
<script setup lang="ts">
  /**
   * LayoutHero — full-viewport, flex-centered, deliberately outside the
   * grid entirely. No --fields, no column derivation — replaces the old
   * `hero` LayoutGridItem preset.
   *
   * @prop {string} as — HTML element to render (default: 'section')
   *
   * @example
   * <LayoutHero>
   *   <h1>Welcome</h1>
   * </LayoutHero>
   */

  interface Props {
    as?: string
  }

  const { as = 'section' } = defineProps<Props>()
</script>

<template>
  <component :is="as" class="layout-hero">
    <slot />
  </component>
</template>
```

- [ ] **Step 2: Typecheck**

Run: `pnpm --filter kmcom-layer-layout typecheck`
Expected: `Hero.vue` introduces no errors.

- [ ] **Step 3: Commit**

```bash
git add layers/structure/layout/app/components/Layout/Hero.vue
git commit -m "feat(layout): add LayoutHero"
```

---

### Task 8: `LayoutGridDebug` rebuild

**Files:**
- Modify: `layers/structure/layout/app/components/Layout/Grid/Debug.vue`

**Interfaces:**
- Produces: `LayoutGridDebug` — no props, `defineExpose({ toggle })`, same `⌘/Ctrl+G` shortcut as before.

- [ ] **Step 1: Rewrite `Debug.vue`**

Column count is now emergent (native `auto-fill`), so there's nothing left to track in JS — the old `cols`/`updateCols`/`BREAKPOINT_PX` machinery goes away entirely. The overlay instead visualizes `--unit` as horizontal bands, which is a pure CSS `repeating-linear-gradient` keyed to the same custom property the grid itself uses:

```vue
<script setup lang="ts">
  /**
   * LayoutGridDebug - Visual --unit overlay
   *
   * Displays a semi-transparent overlay showing horizontal bands at every
   * --unit (1rlh) — the same value the fluid grid derives its row floor
   * and field rhythm from. Toggle visibility with Ctrl+G (Windows/Linux)
   * or Cmd+G (Mac).
   *
   * @prop {string} color — band overlay color (default: rgba(255, 0, 0, 0.08))
   *
   * @example
   * <LayoutGridDebug color="rgba(0, 100, 255, 0.12)" />
   */

  interface Props {
    color?: string
  }

  const { color = 'rgba(255, 0, 0, 0.08)' } = defineProps<Props>()

  const visible = ref(false)

  const toggle = () => {
    visible.value = !visible.value
  }

  const handleKeydown = (event: KeyboardEvent) => {
    if ((event.ctrlKey || event.metaKey) && event.key === 'g') {
      event.preventDefault()
      toggle()
    }
  }

  onMounted(() => {
    window.addEventListener('keydown', handleKeydown)
  })

  onUnmounted(() => {
    window.removeEventListener('keydown', handleKeydown)
  })

  const style = computed(() => ({
    backgroundImage: `repeating-linear-gradient(to bottom, ${color} 0, ${color} 1px, transparent 1px, transparent var(--unit, 1rlh))`,
    pointerEvents: 'none' as const,
  }))

  defineExpose({ toggle })
</script>

<template>
  <Teleport to="body">
    <div v-if="visible" :style class="layout-grid-debug z-9999 fixed inset-0" aria-hidden="true" />
  </Teleport>
</template>
```

- [ ] **Step 2: Typecheck**

Run: `pnpm --filter kmcom-layer-layout typecheck`
Expected: no `BREAKPOINT_PX` import errors, no errors from `Debug.vue`.

- [ ] **Step 3: Commit**

```bash
git add layers/structure/layout/app/components/Layout/Grid/Debug.vue
git commit -m "feat(layout): rebuild LayoutGridDebug as a --unit band overlay"
```

---

### Task 9: Playground demo page rewrite

**Files:**
- Modify: `apps/playground/app/pages/layout.vue`

**Interfaces:**
- Consumes: `LayoutMain`, `LayoutSection`, `LayoutCell`, `LayoutHero`, `LayoutGridDebug`, `LayoutPage` (unchanged), `useGridConfig()` — all from Tasks 3-8.

- [ ] **Step 1: Rewrite `apps/playground/app/pages/layout.vue`**

The old page documented the 6/12/18 preset system in detail; that entire API is gone. Replace it with a page that demonstrates the fluid grid live — this is the manual verification surface for Task 12, not just documentation:

```vue
<script setup lang="ts">
  definePageMeta({
    layout: false,
  })

  const { setPageAccent } = useAccentColor()
  setPageAccent('amber')
  onUnmounted(() => setPageAccent(null))

  const cells = Array.from({ length: 8 }, (_, i) => ({
    id: i + 1,
    variant: i % 3 === 0 ? ('plate' as const) : ('block' as const),
    span2: i === 0,
  }))
</script>

<template>
  <LayoutPage
    title="Layout Layer"
    description="Demonstrating the fluid, --fs-derived layout grid"
  >
    <div class="bg-default min-h-screen">
      <LayoutGridDebug />
      <DemoPageHero
        name="LAYOUT"
        description="Fluid grid — one root unit derives column floor, edge margins, and per-section field rhythm. No breakpoints, no numbered placement."
      />
      <UContainer class="space-y-12 py-8">
        <div class="flex items-center gap-4">
          <UButton to="/" variant="ghost" icon="i-lucide-arrow-left" />
          <div>
            <h1 class="text-3xl font-bold text-highlighted">Layout Layer</h1>
            <p class="text-muted">Fluid grid, sections, and page components</p>
          </div>
          <div class="ml-auto">
            <UBadge color="primary" variant="soft">Cmd+G to toggle the --unit overlay</UBadge>
          </div>
        </div>

        <LayoutMain tag="div">
          <!-- Continuous auto-fill grid — no LayoutSection wrapper needed -->
          <section class="space-y-4">
            <h2 class="text-2xl font-bold">Continuous grid (LayoutCell)</h2>
            <p class="text-muted">
              Auto-fill columns floor at --measure-min (22rem). Resize the window and watch the
              column count change continuously — no breakpoint jump.
            </p>
            <div class="grid grid-cols-[repeat(auto-fill,minmax(22rem,1fr))] gap-[var(--unit)]">
              <LayoutCell
                v-for="cell in cells"
                :key="cell.id"
                :variant="cell.variant"
                :span2="cell.span2"
              >
                <h3 class="font-mono text-sm">Cell {{ cell.id }}</h3>
                <p class="text-sm text-muted">variant: {{ cell.variant }}</p>
              </LayoutCell>
            </div>
          </section>

          <LayoutSection align="split" class="mt-12">
            <div class="flex items-center justify-center">
              <div class="text-center space-y-2">
                <h2 class="text-2xl font-bold">LayoutSection align="split"</h2>
                <p class="text-muted">
                  100svh block, optical 40/60 padding split derived from --lines/--fields.
                </p>
              </div>
            </div>
          </LayoutSection>

          <LayoutSection align="center">
            <div class="text-center space-y-2">
              <h2 class="text-2xl font-bold">LayoutSection align="center"</h2>
              <p class="text-muted">
                place-content: center — true horizontal+vertical centering, no fighting
                align-items: stretch.
              </p>
            </div>
          </LayoutSection>
        </LayoutMain>

        <LayoutHero>
          <h2 class="text-3xl font-bold">LayoutHero</h2>
          <p class="text-muted max-w-lg">
            Deliberately outside the grid — no --fields, no column derivation.
          </p>
        </LayoutHero>

        <section class="space-y-8">
          <div>
            <h2 class="text-2xl font-bold mb-2">Z-Index System</h2>
            <p class="text-muted">
              Unchanged from the old system — read via
              <code class="font-mono text-sm">useGridConfig().useZIndex(layer)</code>
            </p>
          </div>
          <UCard>
            <pre
              class="bg-muted text-highlighted p-4 rounded-lg text-sm overflow-x-auto"
            ><code>const { useZIndex } = useGridConfig()
const zModal = useZIndex('modal') // → 400</code></pre>
          </UCard>
        </section>

        <div class="flex gap-4 justify-center pt-4">
          <UButton to="/ui" variant="outline" icon="i-lucide-arrow-left">UI Layer Demo</UButton>
          <UButton to="/" icon="i-lucide-home">Back to Home</UButton>
          <UButton to="/core" variant="outline" trailing-icon="i-lucide-arrow-right">
            Core Layer Demo
          </UButton>
        </div>
      </UContainer>
      <DemoPageFooter
        name="Layout Layer"
        description="Fluid, --fs-derived layout grid"
        :links="[
          { label: 'Core', to: '/core', icon: 'i-lucide-box' },
          { label: 'UI Layer', to: '/ui', icon: 'i-lucide-palette' },
        ]"
      />
    </div>
  </LayoutPage>
</template>
```

- [ ] **Step 2: Typecheck the playground app**

Run: `pnpm --filter playground typecheck`
Expected: no errors referencing `LayoutGridItem`, `LayoutSectionHero`, `LayoutSectionSplit`, `LayoutSectionGallery`, or the old preset props — this file was the only playground consumer of the deleted API.

- [ ] **Step 3: Commit**

```bash
git add apps/playground/app/pages/layout.vue
git commit -m "feat(layout): rebuild the playground layout demo against the fluid grid"
```

---

### Task 10: Documentation rewrite

**Files:**
- Modify: `docs/LAYOUT.md`
- Modify: `layers/structure/layout/CLAUDE.md`

**Interfaces:**
- Consumes: nothing new — documents Tasks 1-9's final API surface.

- [ ] **Step 1: Rewrite `docs/LAYOUT.md`**

```markdown
# Layout Layer

A fluid, `--fs`-derived grid for Nuxt 4 applications. One root unit derives column floor, edge margins, and per-section vertical rhythm — no breakpoints, no numbered column placement.

---

## Contents

- [How it works](#how-it-works)
- [Playground setup](#playground-setup)
- [Mode system](#mode-system)
- [Components](#components)
- [Composable](#composable)
- [CSS custom properties](#css-custom-properties)
- [Z-index system](#z-index-system)
- [Config reference](#config-reference)
- [Known pitfalls](#known-pitfalls)

---

## How it works

One root custom property, `--fs`, drives everything else via CSS `calc()`/`round()`:

```text
--fs (fluid font-size)
  → line-height (rounded to px)
    → --unit: 1rlh
      → --edge-min, --lpf, --measure-min
        → --lines, --fields, --slack (per LayoutSection)
          → padding-block, grid tracks, gap
```

The root grid (`LayoutMain`, class `.layout-grid`) is a continuous `repeat(auto-fill, minmax(--measure-min, 1fr))` grid — column count is native and emergent, not a config value. `LayoutSection` is an opt-in full-width row that adopts the root's resolved columns via CSS `subgrid` and runs its own vertical-rhythm derivation, scoped to itself. `LayoutCell` is a positioned/styled grid child — variant (`block`/`plate`) plus span utility classes, no numbered `colStart`/`rowStart`. `LayoutHero` sits deliberately outside the grid.

```text
LayoutMain (.layout-grid)              ← auto-fill columns, --fs owner
  LayoutSection (.layout-section)      ← opt-in, subgrid, own field rhythm
    LayoutCell (.layout-cell)          ← variant + span-N utility classes
  LayoutHero (.layout-hero)            ← deliberately outside the grid
```

---

## Playground setup

Same as before — the layout layer needs a dedicated Nuxt layout file and page-level layout declaration.

**1. Create `layouts/grid.vue`** in your app:

```vue
<template>
  <LayoutMain>
    <slot />
    <LayoutGridDebug />
  </LayoutMain>
</template>
```

**2. Declare the layout in each page that uses the grid:**

```vue
<script setup lang="ts">
  definePageMeta({ layout: 'grid' })
</script>
```

> `LayoutPage` is a fragment component — it provides no wrapper element. The grid lives on `LayoutMain` in the layout file. Do not add a second `LayoutMain` inside `LayoutPage`.

---

## Mode system

```ts
// app.config.ts
layoutLayer.ui.grid.mode: 'fluid' | 'disabled'
```

- `'fluid'` — default, the full `--fs`-derived grid
- `'disabled'` — plain `<main>`, no grid CSS

---

## Components

### `LayoutMain` — `<main class="layout-grid">`

- **Props:** `tag` (default `'main'`)
- Binds the config-driven tunables (`--measure-min`/`--edge-min`/`--lpf`) as inline CSS custom properties
- Renders a plain element (no class/style) when `mode === 'disabled'`

### `LayoutSection` — opt-in full-width subgrid row

- **Props:** `height` (default `'100svh'`), `align: 'split' | 'center'` (default `'split'`)
- `align="split"` — the doc's asymmetric 40/60 optical padding split
- `align="center"` — `place-content: center`, true horizontal+vertical centering

### `LayoutCell` — positioned/styled grid child

- **Props:** `as` (default `'div'`), `variant: 'block' | 'plate'` (default `'block'`), `span2`, `span2Rows`, `span3Rows` (all boolean, default `false`)
- No `colStart`/`colSpan`/`rowStart`/`rowSpan` — see [Known pitfalls](#known-pitfalls) for why

### `LayoutHero` — full-viewport, outside the grid

- **Props:** `as` (default `'section'`)
- No `--fields`, no column derivation

### `LayoutGridDebug` — `⌘/Ctrl+G` overlay

- **Props:** `color` (default `'rgba(255, 0, 0, 0.08)'`)
- Visualizes `--unit` as horizontal bands — no JS column tracking (column count is native `auto-fill`, nothing to track)

### `AppContainer` (from `layers/core`) — width constraint

- **Props:** `size` (`'content' | 'wide' | 'fluid' | 'full'`, default `'wide'`), `tag`
- Unchanged

---

## Composable

```ts
const { config, mode, isEnabled, layers, useZIndex, cssVars } = useGridConfig()
```

| Return             | Description                                          |
| ------------------ | ----------------------------------------------------- |
| `config`           | Raw `GridConfig` from app.config                      |
| `mode`             | `'fluid' \| 'disabled'`                                |
| `isEnabled`        | `true` when `mode !== 'disabled'`                      |
| `layers`           | All z-index values                                     |
| `useZIndex(layer)` | Get z-index value: `useZIndex('modal')` → `400`        |
| `cssVars`          | Tunables mapped to CSS custom properties — bound by `LayoutMain`'s `:style` |

---

## CSS custom properties

Every derived property is registered via `@property` (browser-enforced typing — see [Known pitfalls](#known-pitfalls)):

| Property | `syntax` | Meaning |
| --- | --- | --- |
| `--fs` | `<length>` | Root fluid font-size clamp |
| `--unit` | `<length>` | `1rlh` — the one unit everything else derives from |
| `--edge-min` | `<length>` | Inline/block edge margin floor |
| `--measure-min` | `<length>` | Narrowest column / `auto-fill` floor |
| `--lpf` | `<integer>` | Lines-per-field (vertical rhythm chunk size) |
| `--avail-b`, `--type-b`, `--slack` | `<length>` | Per-`LayoutSection` derivation intermediates (only present with `align="split"`) |
| `--lines`, `--fields` | `<integer>` | Per-`LayoutSection` derivation intermediates (only present with `align="split"`) |

---

## Z-index system

Unchanged from the old system — `layers` in config, `useZIndex(layer)` in code:

```ts
const { useZIndex } = useGridConfig()
const zModal = useZIndex('modal') // → 400
```

---

## Config reference

```ts
// app.config.ts
layoutLayer: {
  ui: {
    grid: {
      mode: 'fluid' | 'disabled',
      tunables: {
        measureMin: string           // e.g. '22rem'
        edgeMin: { min: string; max: string }
        lpf: { min: number; max: number }
      },
      layers: {
        back: number, mid: number, front: number, top: number,
        header: number, dropdown: number, overlay: number, modal: number, toast: number,
      },
    },
  },
}
```

---

## Known pitfalls

### 1. `repeat(var(--n), ...)` silently invalidates

`repeat()`'s track-count argument requires a literal `<integer>` at computed-value time. An unregistered custom property built from `calc()`/`round()` doesn't satisfy that — it substitutes as a token stream, not a resolved integer, invalidating the whole declaration. The grid falls back to implicit, content-sized tracks — cells silently squash to unreadable slivers. This is why column count comes only from native `repeat(auto-fill, minmax(...))`, never a computed integer.

### 2. Span utilities forcing malformed implicit tracks

`.layout-cell--span-2` unconditionally applying `grid-column: span 2` can force CSS Grid to fabricate a content-sized implicit column when only 1 explicit column has resolved (narrow/medium viewport). Fixed two ways: `grid-auto-columns` matches the explicit track sizing (belt-and-braces), and `.layout-cell--span-2` is gated behind a `@container layout-viewport (min-width: ...)` query so it only activates once 2 columns have genuinely resolved.

### 3. Hand-synced container-query thresholds

`@container` conditions can't reference custom properties. The `22rem` in `@container layout-cell (max-width: 22rem)` and the `2 * 22rem + 1rlh` in the span-2 gate both mirror `--measure-min`'s default — if you change `tunables.measureMin` in `app.config.ts`, these thresholds in `grids.css` need updating by hand.
```

- [ ] **Step 2: Rewrite `layers/structure/layout/CLAUDE.md`**

```markdown
# Layout Layer

Fluid, `--fs`-derived grid for Nuxt 4 applications. No breakpoints, no numbered column placement — one root unit derives column floor, edge margins, and per-section vertical rhythm.

Full documentation: `docs/LAYOUT.md` in the monorepo root.

---

## Layer Structure

```
layers/layout/
├── app/
│   ├── assets/css/
│   │   └── layout/
│   │       └── grids.css              # fluid grid engine + @property + rhythm utilities
│   ├── components/
│   │   ├── HStack.vue                 # HStack — flexbox row (unchanged)
│   │   ├── VStack.vue                 # VStack — flexbox column (unchanged)
│   │   ├── ZStack.vue                 # ZStack — single-area grid, layered children (unchanged)
│   │   └── Spacer.vue                 # Spacer — flexible remaining space (unchanged)
│   ├── components/Layout/
│   │   ├── Main.vue                   # LayoutMain — <main class="layout-grid"> wrapper, binds cssVars
│   │   ├── Section.vue                # LayoutSection — opt-in full-width subgrid row
│   │   ├── Cell.vue                   # LayoutCell — variant + span-N utility classes
│   │   ├── Hero.vue                   # LayoutHero — deliberately outside the grid
│   │   ├── Grid/
│   │   │   └── Debug.vue              # LayoutGridDebug — Cmd+G --unit band overlay
│   │   └── Page/
│   │       ├── index.vue              # LayoutPage — fragment: SEO + optional header (unchanged)
│   │       └── Header.vue             # LayoutPageHeader — title + description block (unchanged)
│   ├── composables/
│   │   └── useGridConfig.ts           # config, isEnabled, mode, layers, useZIndex, cssVars
│   └── types/
│       └── layouts.ts                 # GridConfig, GridMode, GridLayers, GridTunables
│   └── app.config.ts                  # Config defaults + Nuxt UI component theming
├── nuxt.config.ts                     # Layer meta, alias (#layers/layout), CSS import
└── CLAUDE.md                          # This file
```

---

## Core Concept

The grid is a single `display: grid` on `<main>` (`.layout-grid`), sized only by `--measure-min`/`--unit` — no breakpoints. `LayoutSection` opts a full-width row into `subgrid`, inheriting the root's resolved `auto-fill` columns. No JS is involved in the grid mechanics themselves.

```
LayoutMain (<main class="layout-grid">)         ← continuous auto-fill grid
  LayoutSection (<section class="layout-section">)  ← opt-in, subgrid, own field rhythm
    LayoutCell                                       ← variant + span classes
  LayoutHero                                          ← deliberately outside the grid
```

---

## Playground Setup

`layout` ships its own `default.vue` (`<LayoutMain><slot /></LayoutMain>`) — any consumer using the default layout gets the real grid root instead of a bare passthrough. For a page that also wants header/nav/footer chrome or the debug overlay, build a richer named layout, e.g.:

`LayoutPage` is a fragment component — it provides no grid wrapper. You need:

**`layouts/grid.vue`:**

```vue
<template>
  <LayoutMain>
    <slot />
    <LayoutGridDebug />
  </LayoutMain>
</template>
```

**In each page using the grid:**

```vue
<script setup lang="ts">
  definePageMeta({ layout: 'grid' })
</script>
```

---

## Mode System

```ts
// app.config.ts
layoutLayer.ui.grid.mode: 'fluid' | 'disabled'
```

- `'fluid'` — default, full `--fs`-derived grid
- `'disabled'` — plain `<main>`, no grid CSS

---

## Component Quick Reference

### `LayoutMain` — `<main class="layout-grid">`

- **Props:** `tag` (default `'main'`)
- Binds config-driven tunables as inline CSS custom properties
- Renders plain element when `mode === 'disabled'`

### `AppContainer` (from `layers/core`) — width constraint

- **Props:** `size` (`'content' | 'wide' | 'fluid' | 'full'`, default `'wide'`), `tag`
- Unchanged

### `LayoutPage` — fragment: SEO + optional header

- **Props:** `title` (req), `description`, `showHeader`
- Fragment component — no wrapper element. Unchanged.

### `LayoutSection` — opt-in full-width subgrid row

- **Props:** `height` (default `'100svh'`), `align: 'split' | 'center'` (default `'split'`)

### `LayoutCell` — positioned/styled grid child

- **Props:** `as`, `variant: 'block' | 'plate'`, `span2`, `span2Rows`, `span3Rows`
- No numbered placement — see `docs/LAYOUT.md`'s "Known pitfalls" for why

### `LayoutHero` — full-viewport, outside the grid

- **Props:** `as` (default `'section'`)

---

## useGridConfig()

```ts
const { config, isEnabled, mode, layers, useZIndex, cssVars } = useGridConfig()
```

| Return             | Description                                    |
| ------------------ | ----------------------------------------------- |
| `config`           | Raw `GridConfig` from app.config                |
| `isEnabled`        | `true` when `mode !== 'disabled'`               |
| `mode`             | `'fluid' \| 'disabled'`                          |
| `layers`           | All z-index values                              |
| `useZIndex(layer)` | Get z-index value: `useZIndex('modal')` → 400   |
| `cssVars`          | Tunables mapped to CSS custom properties         |

---

## CSS Critical Notes

1. **Never use `@utility` in CSS files loaded via Nuxt `css: []`** — it bypasses the TW4 pipeline and the class never exists. Use plain `.class-name {}` selectors only.

2. **Use `overflow-x: clip`, never `overflow-x: hidden`** — `hidden` forces `overflow-y: auto` on the same element, creating an unintended scroll container and making `window.scrollY` always 0.

3. **Every derived custom property is registered via `@property`.** Adding a new one? Register it too — an unregistered `calc()`/`round()`-derived property silently invalidates whatever CSS it feeds (see `docs/LAYOUT.md`'s "Known pitfalls").

---

## Key Files

| Task                     | File                                           |
| ------------------------ | ----------------------------------------------- |
| Grid CSS                 | `app/assets/css/layout/grids.css`              |
| Config + Nuxt UI theming | `app/app.config.ts`                            |
| TypeScript types         | `app/types/layouts.ts`                         |
| Config composable        | `app/composables/useGridConfig.ts`             |
| Grid wrapper component   | `app/components/Layout/Main.vue`               |
| Container component      | `layers/core/app/components/AppContainer.vue`  |
| Full reference docs      | `../../docs/LAYOUT.md`                         |
```

- [ ] **Step 3: Commit**

```bash
git add docs/LAYOUT.md layers/structure/layout/CLAUDE.md
git commit -m "docs(layout): rewrite LAYOUT.md and layer CLAUDE.md for the fluid grid"
```

---

### Task 11: Migration guide

**Files:**
- Create: `docs/LAYOUT-MIGRATION.md`

**Interfaces:**
- Consumes: nothing — reference document only, for the later (out-of-scope) pass that updates `layers/content`, `layers/structure/navigation`, and `apps/starter`.

- [ ] **Step 1: Create `docs/LAYOUT-MIGRATION.md`**

```markdown
# Layout Layer Migration Guide — Breakpoint Grid → Fluid Grid

For the later pass that updates `layers/content`, `layers/structure/navigation`, and `apps/starter` to the fluid grid rebuilt in `docs/superpowers/specs/2026-09-03-layout-layer-fluid-rebuild-design.md`. Not applied by that rebuild itself — those consumers still call the old API until this migration happens.

## Removed components

| Old | New | Notes |
| --- | --- | --- |
| `LayoutGridItem` | `LayoutCell` | No numbered placement. `preset` prop removed entirely. |
| `LayoutSection` (12-row, subgrid, no align control) | `LayoutSection` (same name, new props) | `fullHeight`/`fullWidth` props removed; use `height`/`align` instead. |
| `LayoutSectionHero` | `LayoutHero` | Slot-based (`#background`/`#default`/`#footer`) API dropped — `LayoutHero` is a single default slot. Rebuild background/footer composition with plain markup inside the slot, or a `HStack`/`VStack` from this same layer. |
| `LayoutSectionSplit` | *(no direct replacement)* | Was a 9+9 two-column layout keyed to the 18-col grid. Rebuild with `HStack` (`layers/structure/layout`) or a plain CSS grid — there's no addressable "half the columns" concept left. |
| `LayoutSectionGallery` | *(no direct replacement)* | Was an auto-placing grid with a `columns` prop. The fluid grid's own `auto-fill` already does this — drop the wrapper, use `LayoutCell` children directly inside a `LayoutMain` or a plain `<div class="layout-grid">`-styled container. |

## Removed props

`LayoutGridItem`/`LayoutCell`:

| Removed prop | Replacement |
| --- | --- |
| `preset` | None — presets removed from config. Compose spans directly. |
| `colStart`, `colSpan`, `rowStart` | None — no addressable columns. If you need "half width," reconsider the layout as `LayoutCell span2` (claims 2 of however many columns resolved) or a plain flex/grid composition outside the fluid grid. |
| `rowSpan` | `span2Rows` / `span3Rows` boolean props (only 2/3-row spans are supported; add more span classes to `grids.css` if a wider range is needed). |
| `container` | Use `AppContainer` (from `layers/core`) directly inside the cell instead of a `container` prop on the cell itself. |
| `gap` | Not carried over — override `--unit` locally via inline style if a specific cell needs a different internal gap. |
| `density` | Not carried over — use the rhythm utility classes (`.leading-rhythm-*`, `.space-rhythm-*`, `.prose-rhythm`) directly, unchanged from before. |
| `layer` | Still supported conceptually via `useGridConfig().useZIndex(layer)` — apply the z-index via `:style="{ zIndex: useZIndex('front') }"` instead of a `layer` prop. |
| `bleed` | Not carried over — edge-to-edge bleed needs a manual `margin-inline: calc(-1 * var(--edge-min))` on the cell, mirroring the old `resolveBleedStyles` logic if needed. |

`LayoutSection`:

| Removed prop | Replacement |
| --- | --- |
| `fullHeight` | `height` prop (default already `'100svh'` — pass a different value like `'auto'` for content-driven height). |
| `fullWidth` | No direct replacement — the old edge-to-edge "bleed" behavior needs manual `margin-inline: calc(-1 * var(--edge-min))`, same as `LayoutCell`'s removed `bleed` prop. |

## Config changes

`app.config.ts`'s `layoutLayer.ui.grid`:

| Old key | New key | Notes |
| --- | --- | --- |
| `mode: 'swiss'` | `mode: 'fluid'` | Rename only — same semantics (the enabled default). |
| `enabled: boolean` | *(removed)* | Was a deprecated alias for `mode: 'disabled'`. Use `mode` directly. |
| `columns: ResponsiveValue<number>` | *(removed)* | No configurable column count — `tunables.measureMin` controls the `auto-fill` floor instead. |
| `rowsPerSection: number` | *(removed)* | No fixed row count per section — `tunables.lpf` (lines-per-field) plus the section's own derivation replace it. |
| `rhythm: string` | *(removed)* | Was the base unit for the `.leading-rhythm-*`/`.space-rhythm-*` utilities, which are unchanged and still hardcode `0.25rem` in `grids.css` directly — not currently configurable. |
| `presets: GridPresets` | *(removed)* | No preset system. Compose `LayoutCell`/`LayoutSection` props directly. |
| *(new)* | `tunables: GridTunables` | `{ measureMin, edgeMin: {min,max}, lpf: {min,max} }` — see `docs/LAYOUT.md`'s config reference. |
| `layers: GridLayers` | `layers: GridLayers` | Unchanged. |

`ui.page` slots (Nuxt UI theming, same file): `left`/`center`/`right` used to map to a numbered 18-column sidebar split (`col-start-5`, `col-start-15`). That addressing doesn't exist anymore — all three slots are now `col-span-full`. Any app relying on the sidebar split visually will need a different approach (e.g. `HStack` composing `UPageAside` + body directly, outside `UPage`'s slot system).

## Composable changes

`useGridConfig()`:

| Old | New |
| --- | --- |
| `getPreset(name)` | Removed — nothing to look up. |
| `mode.value === 'swiss'` | `mode.value === 'fluid'` |
| *(new)* | `cssVars` — the tunables mapped to CSS custom properties, for anyone building a custom grid-root wrapper instead of using `LayoutMain`. |

`useZIndex`, `layers`, `isEnabled`, `config` are unchanged.
```

- [ ] **Step 2: Commit**

```bash
git add docs/LAYOUT-MIGRATION.md
git commit -m "docs(layout): add migration guide for the fluid grid rebuild"
```

---

### Task 12: Full verification pass

**Files:** none (verification only)

**Interfaces:** none

- [ ] **Step 1: Full layer typecheck**

Run: `pnpm --filter kmcom-layer-layout typecheck`
Expected: PASS, zero errors.

- [ ] **Step 2: Full layer lint**

Run: `pnpm --filter kmcom-layer-layout lint`
Expected: PASS, zero errors (stylelint on `grids.css`, eslint on the `.vue`/`.ts` files).

- [ ] **Step 3: Playground typecheck and build**

Run: `pnpm --filter playground typecheck && pnpm --filter playground build`
Expected: PASS. This is the only app in the monorepo whose pages consumed the deleted `LayoutGridItem`/`LayoutSectionHero`/`LayoutSectionSplit`/`LayoutSectionGallery` API (Task 9 already fixed its one usage) — a build failure here means something else in the playground still references the old API and needs fixing before this task is done.

- [ ] **Step 4: Full test suite**

Run: `pnpm vitest run tests/nuxt/use-grid-config.test.ts`
Expected: PASS (Task 3's 3 tests).

- [ ] **Step 5: Manual browser verification**

Start the playground dev server scoped to just this layer: `PLAYGROUND_LAYERS=core,layout pnpm dev`, open `/layout`, and check via real `getComputedStyle()` inspection (not just visual) at 500 / 768 / 900 / 1024 / 1440 / 1920px:

- `.layout-grid`'s `gridTemplateColumns` resolves to explicit tracks (not `none` — a `none` value means Pitfall 1 regressed).
- Column count grows continuously with width, no jump at a fixed breakpoint.
- `LayoutCell`'s `span2` cell only spans 2 columns once the viewport container has resolved ≥2 columns (Pitfall 2's gate) — check it stays 1×1 below that width, with no visible squash or horizontal scroll on any sibling cell.
- `LayoutSection align="split"` sections are exactly `100svh` tall with visible asymmetric top/bottom padding (top thinner than bottom).
- `LayoutSection align="center"` content is visually centered both axes.
- `⌘/Ctrl+G` toggles the `--unit` band overlay on/off.
- No horizontal scrollbar at any tested width.

- [ ] **Step 6: Commit (only if any fixes were needed in Step 1-4)**

If Steps 1-4 required fixes, commit them now with a message describing what broke and why. If everything passed clean, there's nothing to commit for this task — the plan is complete.
