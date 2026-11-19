# Grid Layer Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a new `grid` layer (Tier 2 — Structure) providing font-size-derived vertical rhythm plus data-driven, arbitrary-width column composition (named presets and custom track arrays), with a dev-only visual builder for constructing custom compositions.

**Architecture:** Two independent, composable concerns. (1) Rhythm — CSS custom properties on `.grid-root`, derived unconditionally from `--fs`, reimplementing `LAYOUT-SYSTEM.md`'s derivation chain (steps 1–6 only; column derivation is replaced by (2)). (2) Column composition — a `TrackSegment[]` data shape, resolved from a named preset registry (`app.config.ts`) or passed inline, converted to a `grid-template-columns` string by a pure function. Named CSS grid lines are the primary addressing mechanism (they survive `subgrid` boundaries); numeric index/span is a fallback util only, no component ships for it in this phase.

**Tech Stack:** Nuxt 4 layer conventions (`app/` srcDir, `#layers/grid` alias), TypeScript, Vitest (`layers/**/*.test.ts` auto-discovered by root `vitest.config.mts`), Vue 3 `<script setup lang="ts">` for the playground builder page only (no components ship in the layer itself).

**Spec:** `docs/superpowers/specs/2026-09-04-grid-layer-design.md`

## Global Constraints

- New layer only — do not modify `layers/structure/layout/**` (its `LayoutMain`/`LayoutGridItem`/`Section`/`Hero`/`Split`/`Gallery`/`useGridConfig` are explicitly out of scope; reworking them to consume this layer is a future pass).
- Do not carry forward the `layout-fluid-rebuild` worktree's uncommitted `app.config.ts`/`types/layouts.ts` changes — this layer reimplements the rhythm math fresh, independent of that worktree.
- Rhythm CSS constraints (from `LAYOUT-SYSTEM.md`, carried forward unconditionally): every `clamp()` keeps a `rem`/`rlh` term (WCAG 1.4.4 zoom safety); `svh`/`svi` only, never `dvh`/`vw`/`vh`; `rlh` not `lh`; `container-type` never on `body`.
- No component ships in the `grid` layer itself in this phase — only CSS, a composable, and pure utils. The only Vue component is the playground's dev-only builder page.
- No Bento-grid preset, no row-track presets beyond the rhythm floor, no save-to-registry automation from the builder UI — all explicitly out of scope per spec.
- Package name: `kmcom-layer-grid`. Layer path: `layers/structure/grid`. Alias: `#layers/grid` (root), `#layers/grid/types` (types dir).
- Style: no semicolons, single quotes, ES5 trailing commas, max 100 char lines, `<script setup lang="ts">` block order script → template → style (per `.claude/rules/typescript.md` and `.claude/rules/vue-components.md`).

---

## File Structure

```
layers/structure/grid/
├── app/
│   ├── assets/css/
│   │   └── grid.css                    # Task 2 — rhythm custom properties, .grid-root
│   ├── composables/
│   │   └── useGridTracks.ts            # Task 3 — resolve() + toColumnsCss(), composable wrapper
│   ├── types/
│   │   └── tracks.ts                   # Task 1 — TrackSegment, TrackConfig, GridPreset
│   ├── utils/
│   │   ├── placement.ts                # Task 4 — placementFromLines, placementFromIndex
│   │   └── placement.test.ts           # Task 4
│   └── app.config.ts                   # Task 5 — gridLayer.presets registry (swiss, editorial)
├── nuxt.config.ts                      # Task 1 — $meta.name: 'grid', extends core, alias, css
├── package.json                        # Task 1 — kmcom-layer-grid
└── CLAUDE.md                           # Task 1 — layer reference doc

layers/structure/grid/app/composables/useGridTracks.test.ts  # Task 3

apps/playground/nuxt.config.ts          # Task 6 — MODIFY: register grid in layer resolver
apps/playground/app/pages/grid-builder.vue  # Task 7 — dev-only visual builder page
```

**Boundary rationale:** `types/tracks.ts` has zero runtime dependents outside this layer's own composable/utils, so it's the natural first task (nothing else compiles without it). `useGridTracks.ts` and `utils/placement.ts` are independent pure-function modules — neither imports the other — so they're separate tasks or could run in parallel. `app.config.ts` depends on `types/tracks.ts` (for `GridPreset`) but not on the composable, so it's its own task. The playground builder page is last because it's the only consumer that needs the full composable + utils surface working end to end.

---

### Task 1: Layer scaffold + track types

**Files:**

- Create: `layers/structure/grid/nuxt.config.ts`
- Create: `layers/structure/grid/package.json`
- Create: `layers/structure/grid/CLAUDE.md`
- Create: `layers/structure/grid/app/types/tracks.ts`
- Test: `layers/structure/grid/app/types/tracks.test.ts`

**Interfaces:**

- Produces: `TrackSegment` (`{ size: number; lineStart?: string | string[]; lineEnd?: string | string[] }`), `TrackConfig` (`{ columns: TrackSegment[]; minTrackWidth?: string }`), `GridPreset` (`TrackConfig & { name: string }`) — all subsequent tasks import from `#layers/grid/types/tracks` (or relative `../types/tracks` within the layer).

- [ ] **Step 1: Create the layer directories**

Run: `mkdir -p layers/structure/grid/app/types layers/structure/grid/app/assets/css layers/structure/grid/app/composables layers/structure/grid/app/utils`

- [ ] **Step 2: Write `app/types/tracks.ts`**

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

- [ ] **Step 3: Write the failing test for the type shapes**

Types have no runtime behavior, so the test is a compile-time shape check: it fails if the file
doesn't exist yet, and catches accidental breaking changes to the shape later (e.g. renaming
`lineStart`).

```ts
// layers/structure/grid/app/types/tracks.test.ts
import { describe, expect, it } from 'vitest'

import type { GridPreset, TrackConfig, TrackSegment } from './tracks'

describe('track types', () => {
  it('accepts a minimal equal-width segment', () => {
    const segment: TrackSegment = { size: 1 }
    expect(segment.size).toBe(1)
  })

  it('accepts a segment with named lines', () => {
    const segment: TrackSegment = {
      size: 2,
      lineStart: 'feature-start',
      lineEnd: ['feature-end', 'aside-start'],
    }
    expect(segment.lineEnd).toEqual(['feature-end', 'aside-start'])
  })

  it('accepts a TrackConfig with optional minTrackWidth', () => {
    const config: TrackConfig = {
      columns: [{ size: 1 }, { size: 2 }],
      minTrackWidth: '20rem',
    }
    expect(config.columns).toHaveLength(2)
  })

  it('a GridPreset is a named TrackConfig', () => {
    const preset: GridPreset = { name: 'swiss', columns: [{ size: 1 }] }
    expect(preset.name).toBe('swiss')
  })
})
```

- [ ] **Step 4: Run test to verify it fails**

Run: `pnpm vitest run layers/structure/grid/app/types/tracks.test.ts`
Expected: FAIL — cannot find module `./tracks` (file doesn't exist yet until Step 2 lands; if
Step 2 already ran, run this before Step 2 instead, or trust the type-checker catches shape
regressions on the next `pnpm typecheck` run — either ordering is fine for a types-only file).

- [ ] **Step 5: Run test to verify it passes**

Run: `pnpm vitest run layers/structure/grid/app/types/tracks.test.ts`
Expected: PASS (4 tests)

- [ ] **Step 6: Write `nuxt.config.ts`**

```ts
// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  $meta: {
    name: 'grid',
  },

  extends: ['../../core'],

  alias: {
    '#layers/grid': import.meta.dirname,
    '#layers/grid/types': `${import.meta.dirname}/app/types`,
  },

  css: ['#layers/grid/app/assets/css/grid.css'],

  compatibilityDate: '2026-01-20',

  typescript: {
    typeCheck: false,
    strict: true,
  },
})
```

- [ ] **Step 7: Write `package.json`**

```json
{
  "name": "kmcom-layer-grid",
  "type": "module",
  "version": "0.0.1",
  "main": "./nuxt.config.ts",
  "scripts": {
    "typecheck": "vue-tsc --noEmit -p ../../../tsconfig.typecheck.json",
    "dev": "nuxi dev .playground",
    "dev:prepare": "nuxt prepare .playground",
    "build": "nuxt build .playground",
    "generate": "nuxt generate .playground",
    "preview": "nuxt preview .playground",
    "lint": "eslint ."
  }
}
```

- [ ] **Step 8: Write `CLAUDE.md`**

```markdown
# Grid Layer

Font-size-derived vertical rhythm + data-driven column composition for Nuxt 4 applications.
Named presets (`swiss`, `editorial`) or custom `TrackSegment[]` arrays resolve to
`grid-template-columns` strings via `useGridTracks()`. See
`docs/superpowers/specs/2026-09-04-grid-layer-design.md` for the full design.

## Layer Structure

\`\`\`
layers/structure/grid/
├── app/
│ ├── assets/css/grid.css # .grid-root rhythm custom properties
│ ├── composables/useGridTracks.ts # resolve() + toColumnsCss()
│ ├── types/tracks.ts # TrackSegment, TrackConfig, GridPreset
│ ├── utils/placement.ts # placementFromLines, placementFromIndex
│ └── app.config.ts # gridLayer.presets registry
├── nuxt.config.ts
└── package.json
\`\`\`

## Quick Reference

\`\`\`ts
const { resolve, toColumnsCss } = useGridTracks()

const config = resolve('swiss') // named preset from app.config
const custom = resolve({ columns: [{ size: 1 }, { size: 2 }] }) // passthrough

const css = toColumnsCss(config)
// → 'minmax(var(--measure-min), 1fr) minmax(var(--measure-min), 1fr) ...'
\`\`\`

\`\`\`ts
import { placementFromIndex, placementFromLines } from '#layers/grid/app/utils/placement'

placementFromLines('feature-start', 'aside-end') // → 'feature-start / aside-end'
placementFromIndex(2, 3) // → '2 / span 3'
placementFromIndex(2, 'full') // → '2 / -1'
\`\`\`

## Out of scope (this layer, this phase)

- No `LayoutGridItem`-equivalent component — that's `layout`'s territory, deferred.
- No row-track presets beyond the rhythm-derived floor.
- No Bento-grid preset.
- `layers/structure/layout/**` is untouched — reworking it to consume this layer is a future pass.
```

- [ ] **Step 9: Commit**

```bash
git add layers/structure/grid/nuxt.config.ts layers/structure/grid/package.json \
  layers/structure/grid/CLAUDE.md layers/structure/grid/app/types/tracks.ts \
  layers/structure/grid/app/types/tracks.test.ts
git commit -m "feat(grid): scaffold new grid layer, add track types"
```

---

### Task 2: Rhythm CSS

**Files:**

- Create: `layers/structure/grid/app/assets/css/grid.css`

**Interfaces:**

- Consumes: nothing (pure CSS, no TS dependency).
- Produces: `.grid-root` class with `--unit`, `--measure-min`, `--edge-min`, `--lines`, `--lpf`,
  `--fields` custom properties, consumed visually by Task 7's builder page (no TS import — CSS
  classes are used by `class="grid-root"` in markup).

- [ ] **Step 1: Write `app/assets/css/grid.css`**

Reimplements `LAYOUT-SYSTEM.md`'s derivation chain, steps 1–6 (step 7, column derivation via
`auto-fill`, is intentionally NOT included — column composition comes from `toColumnsCss()`
instead, applied per-consumer via inline `style="grid-template-columns: ..."`).

```css
/* Grid layer rhythm — derives all vertical spacing from --fs. See
   docs/superpowers/specs/2026-09-04-grid-layer-design.md and root LAYOUT-SYSTEM.md
   for the full derivation rationale. Column composition is NOT here — it comes from
   useGridTracks().toColumnsCss(), applied inline per grid-root instance. */

@property --fs {
  syntax: '<length>';
  inherits: true;
  initial-value: 1rem;
}

:root {
  /* rem term keeps this WCAG 1.4.4 zoom-safe; svi never vw (viewport-bar-collapse safe) */
  --fs: clamp(1rem, 0.95rem + 0.25svi, 1.125rem);
  font-size: var(--fs);
  /* rounded, not raw, so grid boundaries land on-pixel */
  line-height: round(nearest, var(--fs) * 1.5, 1px);
}

.grid-root {
  /* rlh not lh: always resolves against root, unaffected by a nested element's own
     line-height */
  --unit: 1rlh;
  --measure-min: 22rem;
  /* margin floor > 0, steep svi slope so it shrinks fast on narrow screens */
  --edge-min: clamp(1rlh, 8svi, 3rlh);
  --avail-b: calc(100svh - 2 * var(--edge-min));
  --lines: calc(round(down, var(--avail-b), var(--unit)) / var(--unit));
  --lpf: clamp(4, round(down, calc(100svh / var(--unit) / 4.5), 1), 8);
  --fields: max(1, round(down, calc((var(--lines) + 1) / (var(--lpf) + 1)), 1));

  display: grid;
  grid-auto-rows: minmax(calc(var(--lpf) * var(--unit)), max-content);
  gap: var(--unit);
  container-name: grid-root;
  container-type: inline-size;
  padding-inline: var(--edge-min);
  padding-block: var(--edge-min);
}
```

- [ ] **Step 2: Verify it's wired into the layer's `nuxt.config.ts`**

Task 1 Step 6 already added `css: ['#layers/grid/app/assets/css/grid.css']` — confirm the path
matches this file's actual location:

Run: `grep -n "grid.css" layers/structure/grid/nuxt.config.ts`
Expected: `css: ['#layers/grid/app/assets/css/grid.css'],`

- [ ] **Step 3: Commit**

```bash
git add layers/structure/grid/app/assets/css/grid.css
git commit -m "feat(grid): add rhythm CSS derived from --fs"
```

(Manual/visual verification of this CSS happens in Task 7, once a page actually renders
`.grid-root` — CSS custom-property derivation chains can't be meaningfully unit-tested in
Vitest, and a computed-style assertion would need a real browser per `LAYOUT-SYSTEM.md`
Pitfall 1's own lesson: `pnpm build`/static checks don't catch computed-value failures.)

---

### Task 3: `useGridTracks()` — track resolution and CSS generation

**Files:**

- Create: `layers/structure/grid/app/composables/useGridTracks.ts`
- Test: `layers/structure/grid/app/composables/useGridTracks.test.ts`

**Interfaces:**

- Consumes: `TrackSegment`, `TrackConfig`, `GridPreset` from `../types/tracks` (Task 1).
- Produces: `resolve(input: string | TrackConfig, presets?: Record<string, GridPreset>): TrackConfig`
  and `toColumnsCss(config: TrackConfig): string` — both exported as standalone pure functions
  (unit-testable without Nuxt context) — plus the `useGridTracks()` composable that wraps them
  against `useAppConfig().gridLayer.presets`. Task 5 (`app.config.ts`) and Task 7 (builder page)
  both call `useGridTracks()`; Task 6 does not.

- [ ] **Step 1: Write the failing tests**

```ts
// layers/structure/grid/app/composables/useGridTracks.test.ts
import { describe, expect, it } from 'vitest'

import type { GridPreset, TrackConfig } from '../types/tracks'
import { resolve, toColumnsCss } from './useGridTracks'

describe('toColumnsCss', () => {
  it('renders equal segments with no line names', () => {
    const config: TrackConfig = { columns: [{ size: 1 }, { size: 1 }, { size: 1 }] }
    expect(toColumnsCss(config)).toBe(
      'minmax(var(--measure-min), 1fr) minmax(var(--measure-min), 1fr) ' +
        'minmax(var(--measure-min), 1fr)'
    )
  })

  it('renders mixed sizes (8 equal + double + triple)', () => {
    const config: TrackConfig = {
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
      ],
    }
    const css = toColumnsCss(config)
    expect(css.split(' ').filter((s) => s.startsWith('minmax'))).toHaveLength(9)
    expect(css).toContain('minmax(var(--measure-min), 2fr)')
    expect(css).toContain('minmax(var(--measure-min), 3fr)')
  })

  it('brackets a leading lineStart and trailing lineEnd', () => {
    const config: TrackConfig = {
      columns: [{ size: 1, lineStart: 'a-start', lineEnd: 'a-end' }],
    }
    expect(toColumnsCss(config)).toBe('[a-start] minmax(var(--measure-min), 1fr) [a-end]')
  })

  it('merges an adjacent lineEnd and lineStart into one bracket', () => {
    const config: TrackConfig = {
      columns: [
        { size: 2, lineStart: 'feature-start', lineEnd: 'feature-end' },
        { size: 1, lineStart: 'aside-start', lineEnd: 'aside-end' },
      ],
    }
    expect(toColumnsCss(config)).toBe(
      '[feature-start] minmax(var(--measure-min), 2fr) ' +
        '[feature-end aside-start] minmax(var(--measure-min), 1fr) [aside-end]'
    )
  })

  it('supports a segment with only lineStart set', () => {
    const config: TrackConfig = {
      columns: [{ size: 1, lineStart: 'only-start' }, { size: 1 }],
    }
    expect(toColumnsCss(config)).toBe(
      '[only-start] minmax(var(--measure-min), 1fr) minmax(var(--measure-min), 1fr)'
    )
  })

  it('accepts an array of line names', () => {
    const config: TrackConfig = {
      columns: [{ size: 1, lineStart: ['a', 'b'] }],
    }
    expect(toColumnsCss(config)).toBe('[a b] minmax(var(--measure-min), 1fr)')
  })

  it('uses minTrackWidth override instead of the --measure-min default', () => {
    const config: TrackConfig = { columns: [{ size: 1 }], minTrackWidth: '20rem' }
    expect(toColumnsCss(config)).toBe('minmax(20rem, 1fr)')
  })
})

describe('resolve', () => {
  const presets: Record<string, GridPreset> = {
    swiss: { name: 'swiss', columns: [{ size: 1 }] },
  }

  it('looks up a named preset from the registry', () => {
    expect(resolve('swiss', presets)).toBe(presets.swiss)
  })

  it('throws for an unknown preset name', () => {
    expect(() => resolve('nope', presets)).toThrow('Unknown grid preset: "nope"')
  })

  it('passes a TrackConfig object through unchanged', () => {
    const custom: TrackConfig = { columns: [{ size: 1 }, { size: 2 }] }
    expect(resolve(custom, presets)).toBe(custom)
  })
})
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `pnpm vitest run layers/structure/grid/app/composables/useGridTracks.test.ts`
Expected: FAIL — cannot find module `./useGridTracks`

- [ ] **Step 3: Write `app/composables/useGridTracks.ts`**

```ts
import type { GridPreset, TrackConfig } from '../types/tracks'

type GridLayerAppConfig = {
  gridLayer?: {
    presets?: Record<string, GridPreset>
  }
}

function normalizeNames(names: string | string[] | undefined): string[] {
  if (!names) return []
  return Array.isArray(names) ? names : [names]
}

function toBracket(names: string[]): string {
  return names.length > 0 ? `[${names.join(' ')}]` : ''
}

/**
 * Builds a `grid-template-columns` value from a TrackConfig. Each segment becomes a
 * `minmax(floor, Nfr)` track; adjacent lineEnd/lineStart names merge into one bracket,
 * per standard named-grid-line syntax.
 */
export function toColumnsCss(config: TrackConfig): string {
  const minWidth = config.minTrackWidth ?? 'var(--measure-min)'
  const segments = config.columns

  const parts: string[] = []

  segments.forEach((segment, index) => {
    const previous = index > 0 ? segments[index - 1] : undefined
    const leadNames = [...normalizeNames(previous?.lineEnd), ...normalizeNames(segment.lineStart)]
    const leadBracket = toBracket(leadNames)
    if (leadBracket) parts.push(leadBracket)
    parts.push(`minmax(${minWidth}, ${segment.size}fr)`)
  })

  const lastSegment = segments[segments.length - 1]
  const trailBracket = toBracket(normalizeNames(lastSegment?.lineEnd))
  if (trailBracket) parts.push(trailBracket)

  return parts.join(' ')
}

/**
 * Resolves a preset name against a registry, or passes a TrackConfig object through
 * unchanged. Exported standalone so it's testable without Nuxt's useAppConfig context.
 */
export function resolve(
  input: string | TrackConfig,
  presets?: Record<string, GridPreset>
): TrackConfig {
  if (typeof input === 'string') {
    const found = presets?.[input]
    if (!found) {
      throw new Error(`Unknown grid preset: "${input}"`)
    }
    return found
  }
  return input
}

export function useGridTracks() {
  const appConfig = useAppConfig() as GridLayerAppConfig
  const presets = computed(() => appConfig.gridLayer?.presets)

  return {
    resolve: (input: string | TrackConfig) => resolve(input, presets.value),
    toColumnsCss,
  }
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `pnpm vitest run layers/structure/grid/app/composables/useGridTracks.test.ts`
Expected: PASS (10 tests)

- [ ] **Step 5: Commit**

```bash
git add layers/structure/grid/app/composables/useGridTracks.ts \
  layers/structure/grid/app/composables/useGridTracks.test.ts
git commit -m "feat(grid): add useGridTracks composable (resolve, toColumnsCss)"
```

---

### Task 4: Placement utils

**Files:**

- Create: `layers/structure/grid/app/utils/placement.ts`
- Test: `layers/structure/grid/app/utils/placement.test.ts`

**Interfaces:**

- Consumes: nothing (pure string functions, no type imports needed).
- Produces: `placementFromLines(startLine: string, endLine: string): string`,
  `placementFromIndex(colStart: number, colSpan: number | 'full'): string` — used by Task 7's
  builder page preview cells (named-line path) and available as the numeric fallback for future
  `layout` migration (not consumed anywhere else in this plan).

- [ ] **Step 1: Write the failing tests**

```ts
// layers/structure/grid/app/utils/placement.test.ts
import { describe, expect, it } from 'vitest'

import { placementFromIndex, placementFromLines } from './placement'

describe('placementFromLines', () => {
  it('joins two named lines with a slash', () => {
    expect(placementFromLines('feature-start', 'aside-end')).toBe('feature-start / aside-end')
  })
})

describe('placementFromIndex', () => {
  it('builds a numeric span from colStart and colSpan', () => {
    expect(placementFromIndex(2, 3)).toBe('2 / span 3')
  })

  it('spans to the last line when colSpan is "full"', () => {
    expect(placementFromIndex(4, 'full')).toBe('4 / -1')
  })
})
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `pnpm vitest run layers/structure/grid/app/utils/placement.test.ts`
Expected: FAIL — cannot find module `./placement`

- [ ] **Step 3: Write `app/utils/placement.ts`**

```ts
/** Grid-column value addressing a named-line range. Primary placement method — named
 * lines survive CSS subgrid boundaries, unlike grid-template-areas. */
export function placementFromLines(startLine: string, endLine: string): string {
  return `${startLine} / ${endLine}`
}

/** Numeric fallback for auto-flowing content with no named slot to target. `'full'`
 * spans to the grid's last line (-1), matching the shape of layout's current
 * GridItem colSpan prop for an additive future migration. */
export function placementFromIndex(colStart: number, colSpan: number | 'full'): string {
  if (colSpan === 'full') {
    return `${colStart} / -1`
  }
  return `${colStart} / span ${colSpan}`
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `pnpm vitest run layers/structure/grid/app/utils/placement.test.ts`
Expected: PASS (3 tests)

- [ ] **Step 5: Commit**

```bash
git add layers/structure/grid/app/utils/placement.ts \
  layers/structure/grid/app/utils/placement.test.ts
git commit -m "feat(grid): add placement utils (named-line and numeric fallback)"
```

---

### Task 5: Preset registry (`app.config.ts`)

**Files:**

- Create: `layers/structure/grid/app/app.config.ts`

**Interfaces:**

- Consumes: `GridPreset` from `./types/tracks` (Task 1).
- Produces: `gridLayer.presets.swiss` and `gridLayer.presets.editorial`, read by
  `useGridTracks()` (Task 3) via `useAppConfig()`. Task 7's builder page uses `resolve('swiss')`
  and `resolve('editorial')` to render the two known-shape previews mentioned in the spec's
  testing section.

- [ ] **Step 1: Write `app/app.config.ts`**

No unit test for this file — it's static data plus a type augmentation, and its correctness is
exercised end to end by Task 7 (visually rendering both presets) per the spec's own testing
plan, which explicitly scopes preset verification to that visual check rather than a unit test.

```ts
import type { GridPreset } from './types/tracks'

const SWISS_COLUMNS = Array.from({ length: 18 }, () => ({ size: 1 }))

export default defineAppConfig({
  gridLayer: {
    presets: {
      swiss: {
        name: 'swiss',
        columns: SWISS_COLUMNS,
      },
      editorial: {
        name: 'editorial',
        columns: [
          { size: 2, lineStart: 'feature-start', lineEnd: 'feature-end' },
          { size: 1, lineStart: 'aside-start', lineEnd: 'aside-end' },
        ],
      },
    },
  },
})

declare module '@nuxt/schema' {
  interface AppConfigInput {
    gridLayer?: {
      presets?: Record<string, GridPreset>
    }
  }
}
```

- [ ] **Step 2: Verify the shape matches the tested `toColumnsCss` behavior**

Run: `pnpm vitest run layers/structure/grid/app/composables/useGridTracks.test.ts`
Expected: PASS (still 10 tests — this step is a regression check, not new coverage; the
"mixed sizes" and "merges an adjacent lineEnd and lineStart" test cases in Task 3 already cover
the exact shapes used here for `swiss` and `editorial`)

- [ ] **Step 3: Commit**

```bash
git add layers/structure/grid/app/app.config.ts
git commit -m "feat(grid): add swiss and editorial preset registry"
```

---

### Task 6: Register `grid` in the playground layer resolver

**Files:**

- Modify: `apps/playground/nuxt.config.ts:2-95`

**Interfaces:**

- Consumes: nothing new — this task only wires the layer path into the existing
  `AVAILABLE_LAYERS`/`LAYER_PATHS`/`LAYER_DEPENDENCIES` resolver so
  `PLAYGROUND_LAYERS=core,grid pnpm dev` (Task 7's manual verification) can load it.
- Produces: nothing new for later tasks to consume — this is pure registration.

- [ ] **Step 1: Add `'grid'` to `AVAILABLE_LAYERS`**

In `apps/playground/nuxt.config.ts`, add `'grid'` to the `AVAILABLE_LAYERS` array (alongside
`'layout'`, since it's the same tier):

```ts
const AVAILABLE_LAYERS = [
  'core',
  'seo',
  'scripts',
  'element',
  'typography',
  'navigation',
  'visual',
  'layout',
  'grid',
  'scroll',
  // ...unchanged rest
] as const
```

- [ ] **Step 2: Add the path to `LAYER_PATHS`**

```ts
const LAYER_PATHS: Record<LayerName, string> = {
  // ...unchanged entries
  layout: '../../layers/structure/layout',
  grid: '../../layers/structure/grid',
  // ...unchanged rest
}
```

- [ ] **Step 3: Add the dependency entry to `LAYER_DEPENDENCIES`**

`grid` depends only on `core`, same as `layout`:

```ts
const LAYER_DEPENDENCIES: Record<LayerName, LayerName[]> = {
  // ...unchanged entries
  layout: ['core'],
  grid: ['core'],
  // ...unchanged rest
}
```

- [ ] **Step 4: Verify the registration typechecks**

Run: `pnpm --filter kmcom-playground typecheck`
Expected: no new errors (the `LayerName` union, `Record` types, and `resolveExtendedLayers()`
all derive from `AVAILABLE_LAYERS`, so a missing `LAYER_PATHS`/`LAYER_DEPENDENCIES` entry for
`'grid'` would be a TS error here — this is the automated check standing in for a runtime test,
since layer registration has no unit-testable behavior of its own)

- [ ] **Step 5: Verify the layer loads at dev time**

Run: `PLAYGROUND_LAYERS=core,grid pnpm dev` (from `apps/playground/`), then stop it once the
dev server prints its ready message with no errors — full page verification happens in Task 7
once there's a page to load.
Expected: dev server starts cleanly, no "layer not found" or CSS resolution errors in the
console.

- [ ] **Step 6: Commit**

```bash
git add apps/playground/nuxt.config.ts
git commit -m "feat(grid): register grid layer in playground resolver"
```

---

### Task 7: Playground visual builder (`/grid-builder`)

**Files:**

- Create: `apps/playground/app/pages/grid-builder.vue`

**Interfaces:**

- Consumes: `useGridTracks()` (Task 3, `resolve`/`toColumnsCss`), `TrackSegment`/`TrackConfig`
  types (Task 1), `.grid-root` CSS class (Task 2), `gridLayer.presets` (Task 5), the `grid`
  layer registration (Task 6).
- Produces: nothing further downstream — this is the terminal consumer and the spec's
  manual/visual verification point.

- [ ] **Step 1: Write `apps/playground/app/pages/grid-builder.vue`**

Dev-only page: add/remove/resize `TrackSegment`s (no drag library — up/down reorder buttons,
per YAGNI, since drag-and-drop is a UX nicety the spec doesn't require), a live `.grid-root`
preview with placeholder cells, and a copyable TS output panel. No persistence, no
save-to-registry — copy/paste is the hand-off, matching the spec's scope.

```vue
<script setup lang="ts">
  import type { TrackConfig, TrackSegment } from '#layers/grid/types/tracks'

  definePageMeta({ layout: false })

  const { resolve, toColumnsCss } = useGridTracks()

  const activePresetName = ref<'swiss' | 'editorial' | 'custom'>('custom')
  const customSegments = ref<TrackSegment[]>([{ size: 1 }, { size: 1 }, { size: 2 }])

  const activeConfig = computed<TrackConfig>(() => {
    if (activePresetName.value === 'custom') {
      return { columns: customSegments.value }
    }
    return resolve(activePresetName.value)
  })

  const columnsCss = computed(() => toColumnsCss(activeConfig.value))

  const isCustom = computed(() => activePresetName.value === 'custom')

  function addSegment() {
    customSegments.value.push({ size: 1 })
  }

  function removeSegment(index: number) {
    customSegments.value.splice(index, 1)
  }

  function moveSegment(index: number, direction: -1 | 1) {
    const target = index + direction
    if (target < 0 || target >= customSegments.value.length) return
    const segments = customSegments.value
    ;[segments[index], segments[target]] = [segments[target], segments[index]]
  }

  function updateSize(index: number, value: number) {
    customSegments.value[index].size = Math.max(1, value)
  }

  function updateLineStart(index: number, value: string) {
    customSegments.value[index].lineStart = value || undefined
  }

  function updateLineEnd(index: number, value: string) {
    customSegments.value[index].lineEnd = value || undefined
  }

  const outputCode = computed(() => {
    const lines = customSegments.value.map((segment) => {
      const parts = [`size: ${segment.size}`]
      if (segment.lineStart) parts.push(`lineStart: '${segment.lineStart}'`)
      if (segment.lineEnd) parts.push(`lineEnd: '${segment.lineEnd}'`)
      return `    { ${parts.join(', ')} },`
    })
    return `{\n  columns: [\n${lines.join('\n')}\n  ],\n}`
  })
</script>

<template>
  <div style="padding: 2rem; display: grid; gap: 2rem">
    <h1>Grid builder</h1>

    <div style="display: flex; gap: 0.5rem">
      <button type="button" @click="activePresetName = 'swiss'">Swiss (18 equal)</button>
      <button type="button" @click="activePresetName = 'editorial'">Editorial</button>
      <button type="button" @click="activePresetName = 'custom'">Custom</button>
    </div>

    <section v-if="isCustom" style="display: grid; gap: 0.5rem">
      <div
        v-for="(segment, index) in customSegments"
        :key="index"
        style="display: flex; gap: 0.5rem; align-items: center"
      >
        <span>#{{ index + 1 }}</span>
        <label>
          size
          <input
            type="number"
            min="1"
            :value="segment.size"
            @input="updateSize(index, Number(($event.target as HTMLInputElement).value))"
          />
        </label>
        <label>
          lineStart
          <input
            type="text"
            :value="segment.lineStart ?? ''"
            @input="updateLineStart(index, ($event.target as HTMLInputElement).value)"
          />
        </label>
        <label>
          lineEnd
          <input
            type="text"
            :value="segment.lineEnd ?? ''"
            @input="updateLineEnd(index, ($event.target as HTMLInputElement).value)"
          />
        </label>
        <button type="button" @click="moveSegment(index, -1)">↑</button>
        <button type="button" @click="moveSegment(index, 1)">↓</button>
        <button type="button" @click="removeSegment(index)">Remove</button>
      </div>
      <button type="button" @click="addSegment">Add segment</button>
    </section>

    <section>
      <h2>Preview</h2>
      <div class="grid-root" :style="{ gridTemplateColumns: columnsCss }">
        <div
          v-for="(segment, index) in activeConfig.columns"
          :key="index"
          style="border: 1px solid currentColor; padding: 0.5rem; text-align: center"
        >
          {{ segment.size }}fr
        </div>
      </div>
    </section>

    <section v-if="isCustom">
      <h2>Output — paste into app.config.ts as a new preset</h2>
      <pre><code>{{ outputCode }}</code></pre>
    </section>
  </div>
</template>
```

- [ ] **Step 2: Run typecheck**

Run: `pnpm --filter kmcom-playground typecheck`
Expected: no errors

- [ ] **Step 3: Manual visual verification — the three known shapes from the spec's testing plan**

Run: `PLAYGROUND_LAYERS=core,grid pnpm dev` (from `apps/playground/`), open
`http://localhost:3000/grid-builder`.

Expected, checked by eye:

1. Click "Swiss (18 equal)" — 18 equal-width preview cells render, all the same width.
2. Click "Editorial" — 2 preview cells render, the first roughly twice the width of the second.
3. Click "Custom", adjust segment sizes/add a segment (e.g. the 8-equal + double + triple shape
   from the spec) — proportions in the preview visibly match the configured sizes, and the
   output panel shows valid-looking TS matching the current segments.

- [ ] **Step 4: Commit**

```bash
git add apps/playground/app/pages/grid-builder.vue
git commit -m "feat(grid): add playground visual grid builder"
```

---

## Plan Self-Review Notes

- **Spec coverage:** rhythm CSS (Task 2), track types (Task 1), presets registry (Task 5),
  `useGridTracks()`/`resolve`/`toColumnsCss` (Task 3), placement utils (Task 4), visual builder
  (Task 7) — all spec sections have a task. Out-of-scope items (layout rework, row presets,
  save-to-registry, Bento preset) are called out in Global Constraints and not implemented.
- **`toColumnsCss` example correction:** the spec's inline example string
  (`'minmax(min-content, [feature-start] 2fr [feature-end aside-start] 1fr [aside-end])'`) is
  not valid `grid-template-columns` syntax (a single `minmax()` can't wrap multiple tracks).
  This plan implements the spec's own prose description instead — "each segment's
  lineStart/lineEnd become bracketed line names positioned around its fr value, per standard
  named-grid-line syntax" — which Task 3's tests encode as one `minmax(floor, Nfr)` per segment
  with brackets between them. Flagged here rather than silently deviating.
- **Type consistency:** `TrackSegment`/`TrackConfig`/`GridPreset` (Task 1) are used identically
  in Task 3's function signatures, Task 5's `app.config.ts`, and Task 7's builder page — no
  renames across tasks.
