# Vue Element System Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a polymorphic `Element` component to `layers/structure/layout` giving Vue templates a small, typed vocabulary (layout/grid/spacing/sizing/surface/interaction) instead of utility-class strings, reusing the layer's existing fluid-token and grid-placement engines.

**Architecture:** Six small composables, each resolving one property group to a `Partial<CSSProperties>`, merged inside `Element.vue`'s single computed `style`. Grid item-placement (`colStart`/`colSpan`/`rowStart`/`rowSpan`) delegates directly to the existing `buildGridPlacementStyle` from `gridPlacementStyle.ts` — no new placement math. Spacing (`p`/`px`/`py`/`gap`/`align`/`justify`) delegates to core's `useLayoutAttrs`, extended with `m`/`mx`/`my`. Surface/Sizing/Interaction are new, minimal, raw-CSS-passthrough composables.

**Tech Stack:** Vue 3 `<script setup>`, TypeScript, Vitest, Nuxt 4 layers (`#layers/*` aliases).

**Spec:** `docs/superpowers/specs/2026-09-03-vue-element-system-design.md`

## Global Constraints

- No changes to `LayoutGridItem`, `gridPlacementStyle.ts` placement logic, or any fluid-rebuild-spec territory — read-only reuse.
- No semantic colour/token system — `bg`/`color`/`border`/`radius`/`shadow` are raw CSS passthrough (`CSSProperties[...]` typed), not token enums.
- Grid item-placement prop names match `LayoutGridItem`'s existing vocabulary: `colStart`/`colSpan`/`rowStart`/`rowSpan` — not the source doc's `span`/`start`/`end`.
- No semicolons, single quotes, ES5 trailing commas, max 100 char lines (`.claude/rules/typescript.md`).
- `<script setup lang="ts">`, script → template → style block order (`.claude/rules/vue-components.md`).
- `Element` is root-level, unprefixed component name, matching `HStack`/`VStack`/`ZStack`/`Spacer`.

---

## File Structure

```
layers/core/app/composables/useLayoutAttrs.ts        (modify: add m/mx/my)
layers/core/app/composables/useLayoutAttrs.test.ts    (modify: add margin tests, only if file exists — else create)

layers/structure/layout/app/composables/
├── useElementLayout.ts        (new: display mode resolver)
├── useElementLayout.test.ts   (new)
├── useElementGrid.ts          (new: container-axis template + item-axis delegate)
├── useElementGrid.test.ts     (new)
├── useElementSizing.ts        (new: w/h/min/max/aspect passthrough)
├── useElementSizing.test.ts   (new)
├── useElementSurface.ts       (new: bg/color/border/radius/shadow passthrough)
├── useElementSurface.test.ts  (new)
├── useElementInteraction.ts   (new: cursor/select/pointer passthrough)
└── useElementInteraction.test.ts (new)

layers/structure/layout/app/types/element.ts          (new: ElementProps union)

layers/structure/layout/app/components/Element.vue     (new)

apps/playground/app/pages/element.vue                  (new: manual verification page)
```

Each composable owns exactly one property group, mirrors the existing `gridPlacementStyle.ts` / `useLayoutAttrs.ts` pattern (plain exported function, `Partial<CSSProperties>` return), and gets its own test file — matching the existing `gridPlacementStyle.test.ts` convention (`describe`/`it`, vitest, no mocking needed since these are pure functions).

---

### Task 1: Extend `useLayoutAttrs` with margin support

**Files:**
- Modify: `layers/core/app/composables/useLayoutAttrs.ts`
- Test: `layers/core/app/composables/useLayoutAttrs.test.ts` (create if it doesn't exist)

**Interfaces:**
- Consumes: nothing new — extends existing `LayoutAttrsInput`, `Spacing` type from `../types/tokens`, `ResponsiveValue` from `../types/responsive`.
- Produces: `LayoutAttrsInput` gains `m?`, `mx?`, `my?` fields (same shape as existing `p`/`px`/`py`). `useLayoutAttrs()`'s returned `style` now also sets `margin`/`marginInline`/`marginBlock` when those props are passed.

- [ ] **Step 1: Check for an existing test file**

Run: `ls layers/core/app/composables/useLayoutAttrs.test.ts 2>/dev/null && echo EXISTS || echo MISSING`

If `EXISTS`, read the file first and add new `describe` blocks to it in Step 2 rather than replacing it. If `MISSING`, Step 2 creates the whole file.

- [ ] **Step 2: Write the failing tests**

Create/extend `layers/core/app/composables/useLayoutAttrs.test.ts`:

```ts
import { describe, expect, it } from 'vitest'

import { useLayoutAttrs } from './useLayoutAttrs'

describe('useLayoutAttrs margin support', () => {
  it('sets margin from a static token', () => {
    const { style } = useLayoutAttrs(() => ({ m: 'md' }))
    expect(style.value.margin).toBe('var(--fluid-space-md)')
  })

  it('sets marginInline from px-equivalent mx', () => {
    const { style } = useLayoutAttrs(() => ({ mx: 'lg' }))
    expect(style.value.marginInline).toBe('var(--fluid-space-lg)')
  })

  it('sets marginBlock from my', () => {
    const { style } = useLayoutAttrs(() => ({ my: 'sm' }))
    expect(style.value.marginBlock).toBe('var(--fluid-space-sm)')
  })

  it('resolves none to 0px for margin', () => {
    const { style } = useLayoutAttrs(() => ({ m: 'none' }))
    expect(style.value.margin).toBe('0px')
  })

  it('omits margin keys entirely when not passed', () => {
    const { style } = useLayoutAttrs(() => ({ gap: 'md' }))
    expect(style.value.margin).toBeUndefined()
    expect(style.value.marginInline).toBeUndefined()
    expect(style.value.marginBlock).toBeUndefined()
  })

  it('does not regress existing gap/align/justify/padding behavior', () => {
    const { style } = useLayoutAttrs(() => ({
      gap: 'md',
      align: 'center',
      justify: 'between',
      p: 'lg',
    }))
    expect(style.value).toEqual({
      gap: 'var(--fluid-space-md)',
      padding: 'var(--fluid-space-lg)',
      alignItems: 'center',
      justifyContent: 'space-between',
    })
  })
})
```

- [ ] **Step 3: Run tests to verify they fail**

Run: `cd layers/core && npx vitest run app/composables/useLayoutAttrs.test.ts`
Expected: FAIL — `style.value.margin` is `undefined` for the `m: 'md'` case (property not implemented yet).

- [ ] **Step 4: Implement margin support**

Edit `layers/core/app/composables/useLayoutAttrs.ts`:

```ts
export type LayoutAttrsInput = {
  gap?: ResponsiveValue<Spacing> | Spacing | undefined
  align?: ResponsiveValue<Align> | Align | undefined
  justify?: ResponsiveValue<Justify> | Justify | undefined
  p?: ResponsiveValue<Spacing> | Spacing | undefined
  px?: ResponsiveValue<Spacing> | Spacing | undefined
  py?: ResponsiveValue<Spacing> | Spacing | undefined
  m?: ResponsiveValue<Spacing> | Spacing | undefined
  mx?: ResponsiveValue<Spacing> | Spacing | undefined
  my?: ResponsiveValue<Spacing> | Spacing | undefined
}
```

Update the `applySpacing` call signature to accept the margin CSS props, then extend `useLayoutAttrs`'s `computed`:

```ts
function applySpacing(
  result: CSSProperties,
  cssProp: 'gap' | 'padding' | 'paddingInline' | 'paddingBlock' | 'margin' | 'marginInline' | 'marginBlock',
  value: ResponsiveValue<Spacing> | Spacing | undefined
): void {
  const resolved = resolveDefault(value)
  if (resolved) result[cssProp] = spacingVar(resolved)
}

export function useLayoutAttrs(input: MaybeRefOrGetter<LayoutAttrsInput>): {
  style: ComputedRef<CSSProperties>
} {
  const style = computed((): CSSProperties => {
    const { gap, align, justify, p, px, py, m, mx, my } = toValue(input)
    const result: CSSProperties = {}

    applySpacing(result, 'gap', gap)
    applySpacing(result, 'padding', p)
    applySpacing(result, 'paddingInline', px)
    applySpacing(result, 'paddingBlock', py)
    applySpacing(result, 'margin', m)
    applySpacing(result, 'marginInline', mx)
    applySpacing(result, 'marginBlock', my)

    const resolvedAlign = resolveDefault(align)
    if (resolvedAlign) result.alignItems = ALIGN_MAP[resolvedAlign]

    const resolvedJustify = resolveDefault(justify)
    if (resolvedJustify) result.justifyContent = JUSTIFY_MAP[resolvedJustify]

    return result
  })

  return { style }
}
```

- [ ] **Step 5: Run tests to verify they pass**

Run: `cd layers/core && npx vitest run app/composables/useLayoutAttrs.test.ts`
Expected: PASS, all 6 new tests green.

- [ ] **Step 6: Run the full core test suite to check for regressions**

Run: `cd layers/core && npx vitest run`
Expected: PASS — no existing test touching `useLayoutAttrs` breaks.

- [ ] **Step 7: Commit**

```bash
git add layers/core/app/composables/useLayoutAttrs.ts layers/core/app/composables/useLayoutAttrs.test.ts
git commit -m "feat(core): add margin support to useLayoutAttrs

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_017vMSCbNb6g9hyb9sBUsAQN"
```

---

### Task 2: `useElementLayout` — display mode composable

**Files:**
- Create: `layers/structure/layout/app/composables/useElementLayout.ts`
- Test: `layers/structure/layout/app/composables/useElementLayout.test.ts`

**Interfaces:**
- Consumes: nothing (pure function, no imports beyond Vue's `CSSProperties` type).
- Produces: `ElementLayoutProps` type (`{ block?: boolean; flex?: boolean; grid?: boolean; hidden?: boolean }`) and `useElementLayout(props: ElementLayoutProps): Partial<CSSProperties>`. Both are imported by Task 6 (`Element.vue`).

- [ ] **Step 1: Write the failing tests**

Create `layers/structure/layout/app/composables/useElementLayout.test.ts`:

```ts
import { describe, expect, it } from 'vitest'

import { useElementLayout } from './useElementLayout'

describe('useElementLayout', () => {
  it('returns no display when no mode prop is set', () => {
    expect(useElementLayout({})).toEqual({ display: undefined })
  })

  it('resolves block to display: block', () => {
    expect(useElementLayout({ block: true })).toEqual({ display: 'block' })
  })

  it('resolves flex to display: flex', () => {
    expect(useElementLayout({ flex: true })).toEqual({ display: 'flex' })
  })

  it('resolves grid to display: grid', () => {
    expect(useElementLayout({ grid: true })).toEqual({ display: 'grid' })
  })

  it('resolves hidden to display: none', () => {
    expect(useElementLayout({ hidden: true })).toEqual({ display: 'none' })
  })

  it('prioritizes hidden over grid, flex, and block when multiple are set', () => {
    expect(useElementLayout({ hidden: true, grid: true, flex: true, block: true })).toEqual({
      display: 'none',
    })
  })

  it('prioritizes grid over flex and block', () => {
    expect(useElementLayout({ grid: true, flex: true, block: true })).toEqual({
      display: 'grid',
    })
  })

  it('prioritizes flex over block', () => {
    expect(useElementLayout({ flex: true, block: true })).toEqual({ display: 'flex' })
  })
})
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `cd layers/structure/layout && npx vitest run app/composables/useElementLayout.test.ts`
Expected: FAIL — module `./useElementLayout` not found.

- [ ] **Step 3: Write the implementation**

Create `layers/structure/layout/app/composables/useElementLayout.ts`:

```ts
import type { CSSProperties } from 'vue'

export interface ElementLayoutProps {
  block?: boolean
  flex?: boolean
  grid?: boolean
  hidden?: boolean
}

type Mode = 'hidden' | 'grid' | 'flex' | 'block'

const DISPLAY_FOR: Record<Mode, CSSProperties['display']> = {
  hidden: 'none',
  grid: 'grid',
  flex: 'flex',
  block: 'block',
}

export function useElementLayout(props: ElementLayoutProps): Partial<CSSProperties> {
  const mode = (['hidden', 'grid', 'flex', 'block'] as const).find((m) => props[m])
  return {
    display: mode && DISPLAY_FOR[mode],
  }
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `cd layers/structure/layout && npx vitest run app/composables/useElementLayout.test.ts`
Expected: PASS, all 8 tests green.

- [ ] **Step 5: Commit**

```bash
git add layers/structure/layout/app/composables/useElementLayout.ts layers/structure/layout/app/composables/useElementLayout.test.ts
git commit -m "feat(layout): add useElementLayout display-mode composable

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_017vMSCbNb6g9hyb9sBUsAQN"
```

---

### Task 3: `useElementSizing` — dimension composable

**Files:**
- Create: `layers/structure/layout/app/composables/useElementSizing.ts`
- Test: `layers/structure/layout/app/composables/useElementSizing.test.ts`

**Interfaces:**
- Consumes: nothing.
- Produces: `ElementSizingProps` type and `useElementSizing(props: ElementSizingProps): Partial<CSSProperties>`, imported by Task 6.

- [ ] **Step 1: Write the failing tests**

Create `layers/structure/layout/app/composables/useElementSizing.test.ts`:

```ts
import { describe, expect, it } from 'vitest'

import { useElementSizing } from './useElementSizing'

describe('useElementSizing', () => {
  it('returns all-undefined style when no props are set', () => {
    expect(useElementSizing({})).toEqual({
      width: undefined,
      height: undefined,
      minWidth: undefined,
      maxWidth: undefined,
      minHeight: undefined,
      maxHeight: undefined,
      aspectRatio: undefined,
    })
  })

  it('maps every prop to its CSS property 1:1', () => {
    expect(
      useElementSizing({
        w: '80px',
        h: '40px',
        minW: '10rem',
        maxW: '20rem',
        minH: '5rem',
        maxH: '15rem',
        aspect: '16 / 9',
      })
    ).toEqual({
      width: '80px',
      height: '40px',
      minWidth: '10rem',
      maxWidth: '20rem',
      minHeight: '5rem',
      maxHeight: '15rem',
      aspectRatio: '16 / 9',
    })
  })
})
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `cd layers/structure/layout && npx vitest run app/composables/useElementSizing.test.ts`
Expected: FAIL — module not found.

- [ ] **Step 3: Write the implementation**

Create `layers/structure/layout/app/composables/useElementSizing.ts`:

```ts
import type { CSSProperties } from 'vue'

export interface ElementSizingProps {
  w?: CSSProperties['width']
  h?: CSSProperties['height']
  minW?: CSSProperties['minWidth']
  maxW?: CSSProperties['maxWidth']
  minH?: CSSProperties['minHeight']
  maxH?: CSSProperties['maxHeight']
  aspect?: CSSProperties['aspectRatio']
}

export function useElementSizing(props: ElementSizingProps): Partial<CSSProperties> {
  return {
    width: props.w,
    height: props.h,
    minWidth: props.minW,
    maxWidth: props.maxW,
    minHeight: props.minH,
    maxHeight: props.maxH,
    aspectRatio: props.aspect,
  }
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `cd layers/structure/layout && npx vitest run app/composables/useElementSizing.test.ts`
Expected: PASS, both tests green.

- [ ] **Step 5: Commit**

```bash
git add layers/structure/layout/app/composables/useElementSizing.ts layers/structure/layout/app/composables/useElementSizing.test.ts
git commit -m "feat(layout): add useElementSizing composable

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_017vMSCbNb6g9hyb9sBUsAQN"
```

---

### Task 4: `useElementSurface` and `useElementInteraction` — surface & interaction composables

**Files:**
- Create: `layers/structure/layout/app/composables/useElementSurface.ts`
- Create: `layers/structure/layout/app/composables/useElementInteraction.ts`
- Test: `layers/structure/layout/app/composables/useElementSurface.test.ts`
- Test: `layers/structure/layout/app/composables/useElementInteraction.test.ts`

**Interfaces:**
- Consumes: nothing.
- Produces: `ElementSurfaceProps`/`useElementSurface()` and `ElementInteractionProps`/`useElementInteraction()`, both imported by Task 6.

- [ ] **Step 1: Write the failing surface test**

Create `layers/structure/layout/app/composables/useElementSurface.test.ts`:

```ts
import { describe, expect, it } from 'vitest'

import { useElementSurface } from './useElementSurface'

describe('useElementSurface', () => {
  it('returns all-undefined style when no props are set', () => {
    expect(useElementSurface({})).toEqual({
      background: undefined,
      color: undefined,
      border: undefined,
      borderRadius: undefined,
      boxShadow: undefined,
    })
  })

  it('maps every prop to its CSS property 1:1', () => {
    expect(
      useElementSurface({
        bg: 'var(--ui-bg-elevated)',
        color: 'var(--ui-text)',
        border: '1px solid var(--ui-border)',
        radius: '0.5rem',
        shadow: '0 4px 12px rgb(0 0 0 / 0.15)',
      })
    ).toEqual({
      background: 'var(--ui-bg-elevated)',
      color: 'var(--ui-text)',
      border: '1px solid var(--ui-border)',
      borderRadius: '0.5rem',
      boxShadow: '0 4px 12px rgb(0 0 0 / 0.15)',
    })
  })
})
```

- [ ] **Step 2: Write the failing interaction test**

Create `layers/structure/layout/app/composables/useElementInteraction.test.ts`:

```ts
import { describe, expect, it } from 'vitest'

import { useElementInteraction } from './useElementInteraction'

describe('useElementInteraction', () => {
  it('returns all-undefined style when no props are set', () => {
    expect(useElementInteraction({})).toEqual({
      cursor: undefined,
      userSelect: undefined,
      pointerEvents: undefined,
    })
  })

  it('maps every prop to its CSS property 1:1', () => {
    expect(
      useElementInteraction({
        cursor: 'pointer',
        select: 'none',
        pointer: 'none',
      })
    ).toEqual({
      cursor: 'pointer',
      userSelect: 'none',
      pointerEvents: 'none',
    })
  })
})
```

- [ ] **Step 3: Run both tests to verify they fail**

Run: `cd layers/structure/layout && npx vitest run app/composables/useElementSurface.test.ts app/composables/useElementInteraction.test.ts`
Expected: FAIL — modules not found.

- [ ] **Step 4: Write the surface implementation**

Create `layers/structure/layout/app/composables/useElementSurface.ts`:

```ts
import type { CSSProperties } from 'vue'

export interface ElementSurfaceProps {
  bg?: CSSProperties['background']
  color?: CSSProperties['color']
  border?: CSSProperties['border']
  radius?: CSSProperties['borderRadius']
  shadow?: CSSProperties['boxShadow']
}

export function useElementSurface(props: ElementSurfaceProps): Partial<CSSProperties> {
  return {
    background: props.bg,
    color: props.color,
    border: props.border,
    borderRadius: props.radius,
    boxShadow: props.shadow,
  }
}
```

- [ ] **Step 5: Write the interaction implementation**

Create `layers/structure/layout/app/composables/useElementInteraction.ts`:

```ts
import type { CSSProperties } from 'vue'

export interface ElementInteractionProps {
  cursor?: CSSProperties['cursor']
  select?: CSSProperties['userSelect']
  pointer?: CSSProperties['pointerEvents']
}

export function useElementInteraction(props: ElementInteractionProps): Partial<CSSProperties> {
  return {
    cursor: props.cursor,
    userSelect: props.select,
    pointerEvents: props.pointer,
  }
}
```

- [ ] **Step 6: Run both tests to verify they pass**

Run: `cd layers/structure/layout && npx vitest run app/composables/useElementSurface.test.ts app/composables/useElementInteraction.test.ts`
Expected: PASS, all 4 tests green.

- [ ] **Step 7: Commit**

```bash
git add layers/structure/layout/app/composables/useElementSurface.ts layers/structure/layout/app/composables/useElementSurface.test.ts layers/structure/layout/app/composables/useElementInteraction.ts layers/structure/layout/app/composables/useElementInteraction.test.ts
git commit -m "feat(layout): add useElementSurface and useElementInteraction composables

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_017vMSCbNb6g9hyb9sBUsAQN"
```

---

### Task 5: `useElementGrid` — container-axis template + item-axis delegate

**Files:**
- Create: `layers/structure/layout/app/composables/useElementGrid.ts`
- Test: `layers/structure/layout/app/composables/useElementGrid.test.ts`

**Interfaces:**
- Consumes: `buildGridPlacementStyle`, `GridPlacementInput` from `../utils/gridPlacementStyle` (existing, unmodified — see `layers/structure/layout/app/utils/gridPlacementStyle.ts:132`).
- Produces: `ElementGridProps` type and `useElementGrid(props: ElementGridProps): Partial<CSSProperties>`, imported by Task 6. `ElementGridProps` shape: `{ grid?: boolean; cols?: number | string; rows?: number | string; colStart?: number | ResponsiveValue<number>; colSpan?: number | 'full' | ResponsiveValue<number>; rowStart?: number | ResponsiveValue<number>; rowSpan?: number | ResponsiveValue<number> }`.

- [ ] **Step 1: Write the failing tests**

Create `layers/structure/layout/app/composables/useElementGrid.test.ts`:

```ts
import { describe, expect, it } from 'vitest'

import { useElementGrid } from './useElementGrid'

describe('useElementGrid container axis', () => {
  it('returns no grid-template properties when grid is not set', () => {
    const result = useElementGrid({ cols: 12 })
    expect(result.gridTemplateColumns).toBeUndefined()
    expect(result.gridTemplateRows).toBeUndefined()
  })

  it('converts a numeric cols to a repeat() track when grid is set', () => {
    const result = useElementGrid({ grid: true, cols: 12 })
    expect(result.gridTemplateColumns).toBe('repeat(12, 1fr)')
  })

  it('converts a numeric rows to a repeat() track when grid is set', () => {
    const result = useElementGrid({ grid: true, rows: 4 })
    expect(result.gridTemplateRows).toBe('repeat(4, 1fr)')
  })

  it('passes a string cols track through unchanged', () => {
    const result = useElementGrid({ grid: true, cols: '1fr 2fr 1fr' })
    expect(result.gridTemplateColumns).toBe('1fr 2fr 1fr')
  })

  it('sets display: grid when grid is true', () => {
    const result = useElementGrid({ grid: true, cols: 12 })
    expect(result.display).toBe('grid')
  })
})

describe('useElementGrid item axis (delegates to buildGridPlacementStyle)', () => {
  it('sets gridColumn span from colSpan alone', () => {
    const result = useElementGrid({ colSpan: 8 })
    expect(result.gridColumn).toBe('1 / -1')
  })

  it('sets --_ce custom property when colSpan is not full', () => {
    const result = useElementGrid({ colStart: 3, colSpan: 6 })
    expect(result['--_cs']).toBe('3')
    expect(result['--_ce']).toBe('6')
  })

  it('produces identical output to buildGridPlacementStyle for the same input', async () => {
    const { buildGridPlacementStyle } = await import('../utils/gridPlacementStyle')
    const direct = buildGridPlacementStyle({ colStart: 2, colSpan: 4, rowSpan: 2 })
    const viaElement = useElementGrid({ colStart: 2, colSpan: 4, rowSpan: 2 })
    expect(viaElement).toMatchObject(direct)
  })
})
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `cd layers/structure/layout && npx vitest run app/composables/useElementGrid.test.ts`
Expected: FAIL — module not found.

- [ ] **Step 3: Write the implementation**

Create `layers/structure/layout/app/composables/useElementGrid.ts`:

```ts
import type { CSSProperties } from 'vue'

import type { ResponsiveValue } from '../types/layouts'
import { buildGridPlacementStyle } from '../utils/gridPlacementStyle'

export interface ElementGridProps {
  grid?: boolean
  cols?: number | string
  rows?: number | string
  colStart?: number | ResponsiveValue<number>
  colSpan?: number | 'full' | ResponsiveValue<number>
  rowStart?: number | ResponsiveValue<number>
  rowSpan?: number | ResponsiveValue<number>
}

function track(value: number | string | undefined): string | undefined {
  return typeof value === 'number' ? `repeat(${value}, 1fr)` : value
}

export function useElementGrid(props: ElementGridProps): Partial<CSSProperties> {
  const placement = buildGridPlacementStyle({
    colStart: props.colStart,
    colSpan: props.colSpan,
    rowStart: props.rowStart,
    rowSpan: props.rowSpan,
  })

  return {
    ...placement,
    ...(props.grid && {
      display: 'grid',
      gridTemplateColumns: track(props.cols),
      gridTemplateRows: track(props.rows),
    }),
  }
}
```

- [ ] **Step 4: Confirm the `ResponsiveValue` import path**

Run: `grep -n "export type ResponsiveValue" layers/structure/layout/app/types/layouts.ts`
Expected: one match — confirms `../types/layouts` is the correct import path for the layer's own `ResponsiveValue` (distinct from `core`'s — see spec §13). If the grep finds no match, locate the actual export and adjust the import in Step 3 before proceeding.

- [ ] **Step 5: Run tests to verify they pass**

Run: `cd layers/structure/layout && npx vitest run app/composables/useElementGrid.test.ts`
Expected: PASS, all 8 tests green.

- [ ] **Step 6: Run the full layout test suite to check for regressions**

Run: `cd layers/structure/layout && npx vitest run`
Expected: PASS — `gridPlacementStyle.test.ts` and all others still green; confirms `buildGridPlacementStyle` itself was not touched.

- [ ] **Step 7: Commit**

```bash
git add layers/structure/layout/app/composables/useElementGrid.ts layers/structure/layout/app/composables/useElementGrid.test.ts
git commit -m "feat(layout): add useElementGrid composable, reusing buildGridPlacementStyle

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_017vMSCbNb6g9hyb9sBUsAQN"
```

---

### Task 6: `Element.vue` + `ElementProps` type + playground verification page

**Files:**
- Create: `layers/structure/layout/app/types/element.ts`
- Create: `layers/structure/layout/app/components/Element.vue`
- Test: `layers/structure/layout/app/components/Element.test.ts`
- Create: `apps/playground/app/pages/element.vue`

**Interfaces:**
- Consumes: `ElementLayoutProps`/`useElementLayout` (Task 2), `ElementGridProps`/`useElementGrid` (Task 5), `ElementSizingProps`/`useElementSizing` (Task 3), `ElementSurfaceProps`/`useElementSurface` (Task 4), `ElementInteractionProps`/`useElementInteraction` (Task 4), `LayoutAttrsInput`/`useLayoutAttrs` (core, Task 1).
- Produces: `ElementProps` type (exported union) and the `<Element>` component itself — the final deliverable, consumed by application pages.

- [ ] **Step 1: Write the failing component test**

Create `layers/structure/layout/app/components/Element.test.ts`:

```ts
import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

import Element from './Element.vue'

describe('Element', () => {
  it('renders as a div by default', () => {
    const wrapper = mount(Element)
    expect(wrapper.element.tagName).toBe('DIV')
  })

  it('renders as the tag passed via the as prop', () => {
    const wrapper = mount(Element, { props: { as: 'section' } })
    expect(wrapper.element.tagName).toBe('SECTION')
  })

  it('renders slot content', () => {
    const wrapper = mount(Element, { slots: { default: 'hello' } })
    expect(wrapper.text()).toBe('hello')
  })

  it('merges layout, sizing, and surface styles into one style attribute', () => {
    const wrapper = mount(Element, {
      props: {
        flex: true,
        w: '80px',
        bg: 'var(--ui-bg-elevated)',
      },
    })
    const style = wrapper.attributes('style') ?? ''
    expect(style).toContain('display: flex')
    expect(style).toContain('width: 80px')
    expect(style).toContain('background: var(--ui-bg-elevated)')
  })

  it('merges spacing (via useLayoutAttrs) and grid item-placement styles together', () => {
    const wrapper = mount(Element, {
      props: {
        p: 'md',
        colSpan: 6,
      },
    })
    const style = wrapper.attributes('style') ?? ''
    expect(style).toContain('padding: var(--fluid-space-md)')
    expect(style).toContain('--_ce: 6')
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `cd layers/structure/layout && npx vitest run app/components/Element.test.ts`
Expected: FAIL — `Element.vue` not found.

- [ ] **Step 3: Write the ElementProps type**

Create `layers/structure/layout/app/types/element.ts`:

```ts
import type { Component } from 'vue'

import type { LayoutAttrsInput } from '#layers/core/app/composables/useLayoutAttrs'

import type { ElementGridProps } from '../composables/useElementGrid'
import type { ElementInteractionProps } from '../composables/useElementInteraction'
import type { ElementLayoutProps } from '../composables/useElementLayout'
import type { ElementSizingProps } from '../composables/useElementSizing'
import type { ElementSurfaceProps } from '../composables/useElementSurface'

export type ElementProps = ElementLayoutProps &
  ElementGridProps &
  LayoutAttrsInput &
  ElementSizingProps &
  ElementSurfaceProps &
  ElementInteractionProps & {
    as?: string | Component
  }
```

- [ ] **Step 4: Write Element.vue**

Create `layers/structure/layout/app/components/Element.vue`:

```vue
<script setup lang="ts">
  import type { CSSProperties } from 'vue'

  import type { ElementProps } from '../types/element'

  const props = withDefaults(defineProps<ElementProps>(), {
    as: 'div',
  })

  const style = computed<CSSProperties>(() => ({
    ...useElementLayout(props),
    ...useLayoutAttrs(() => props).style.value,
    ...useElementGrid(props),
    ...useElementSizing(props),
    ...useElementSurface(props),
    ...useElementInteraction(props),
  }))
</script>

<template>
  <component :is="as" :style>
    <slot />
  </component>
</template>
```

`useElementLayout`, `useLayoutAttrs`, `useElementGrid`, `useElementSizing`, `useElementSurface`, `useElementInteraction` are all Nuxt auto-imports (composables in `app/composables/` are auto-imported within the layer, and `useLayoutAttrs` is auto-imported from `core` since `layout` extends `core` — see `layers/structure/layout/nuxt.config.ts:7`). No explicit imports needed in the `<script setup>` block for them.

- [ ] **Step 5: Run test to verify it passes**

Run: `cd layers/structure/layout && npx vitest run app/components/Element.test.ts`
Expected: PASS, all 5 tests green.

If auto-imports aren't resolved in the Vitest environment (composables not globally available outside a running Nuxt instance), explicitly import them at the top of `Element.vue`'s `<script setup>` instead:

```ts
import { useLayoutAttrs } from '#layers/core/app/composables/useLayoutAttrs'
import { useElementGrid } from '../composables/useElementGrid'
import { useElementInteraction } from '../composables/useElementInteraction'
import { useElementLayout } from '../composables/useElementLayout'
import { useElementSizing } from '../composables/useElementSizing'
import { useElementSurface } from '../composables/useElementSurface'
```

Re-run the test after adding imports if the auto-import approach fails.

- [ ] **Step 6: Create the playground verification page**

Create `apps/playground/app/pages/element.vue`:

```vue
<template>
  <Element block p="xl">
    <h2>Grid container + item placement</h2>
    <Element grid :cols="12" gap="lg" p="lg" bg="var(--ui-bg-elevated)" radius="0.5rem">
      <Element :col-span="12" bg="var(--color-green-400)" color="white" p="md" radius="0.25rem">
        colSpan 12
      </Element>
      <Element :col-span="8" bg="var(--color-green-500)" color="white" p="md" radius="0.25rem">
        colSpan 8
      </Element>
      <Element :col-span="4" bg="var(--color-green-600)" color="white" p="md" radius="0.25rem">
        colSpan 4
      </Element>
      <Element :col-start="3" :col-span="6" bg="var(--color-green-700)" color="white" p="md" radius="0.25rem">
        colStart 3 / colSpan 6
      </Element>
    </Element>
  </Element>

  <Element block p="xl">
    <h2>Flex + sizing + interaction</h2>
    <Element flex gap="md" p="lg" bg="var(--ui-bg-elevated)" radius="0.5rem">
      <Element w="80px" h="80px" bg="var(--color-green-400)" radius="9999px" cursor="pointer" select="none" />
      <Element
        w="160px"
        h="80px"
        bg="var(--color-green-500)"
        color="white"
        p="sm"
        radius="0.5rem"
        shadow="0 4px 12px rgb(0 0 0 / 0.15)"
      >
        card
      </Element>
      <Element min-w="120px" max-w="240px" h="80px" bg="var(--color-green-600)" color="white" p="sm" radius="0.5rem">
        min/max width
      </Element>
    </Element>
  </Element>

  <Element block p="xl">
    <h2>Layout modes</h2>
    <Element flex gap="sm">
      <Element block bg="var(--color-green-400)" p="sm" radius="0.25rem" color="white">block</Element>
      <Element flex bg="var(--color-green-500)" p="sm" radius="0.25rem" color="white">flex</Element>
      <Element hidden bg="var(--color-green-600)" p="sm" radius="0.25rem" color="white">
        hidden (not rendered visibly)
      </Element>
    </Element>
  </Element>

  <Element block p="xl">
    <h2>Margin (Task 1 verification)</h2>
    <Element bg="var(--ui-bg-elevated)" p="md">
      <Element bg="var(--color-green-500)" color="white" p="sm" m="lg" radius="0.25rem">
        m="lg" pushes this box away from its siblings
      </Element>
    </Element>
  </Element>
</template>
```

- [ ] **Step 7: Manually verify in the browser**

Run: `PLAYGROUND_LAYERS=core,layout pnpm dev` from the repo root, then navigate to `/element`.

Verify: the 12-column grid row renders with correctly spanned/positioned green blocks, the flex row shows a circle/card/min-max box, the layout-modes row hides the third box, and the margin box visibly indents from its container. Confirm no console errors.

- [ ] **Step 8: Run full test suite one more time**

Run: `pnpm --filter layers/core --filter layers/structure/layout test` (or `cd` into each and run `npx vitest run` if the filter form doesn't match this repo's script names — check `package.json`'s `scripts.test` first with `cat layers/core/package.json layers/structure/layout/package.json | grep -A2 '"scripts"'`)
Expected: PASS across both layers, zero regressions.

- [ ] **Step 9: Run typecheck**

Run: `pnpm typecheck`
Expected: PASS — no new type errors from `ElementProps`, `Element.vue`, or the modified `LayoutAttrsInput`.

- [ ] **Step 10: Commit**

```bash
git add layers/structure/layout/app/types/element.ts layers/structure/layout/app/components/Element.vue layers/structure/layout/app/components/Element.test.ts apps/playground/app/pages/element.vue
git commit -m "feat(layout): add Element polymorphic primitive

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_017vMSCbNb6g9hyb9sBUsAQN"
```

---

## Self-Review

**Spec coverage:**
- §3.1 Layout group → Task 2. §3.2 Spacing (incl. margin) → Task 1. §3.3 Grid (both axes) → Task 5. §3.4 Sizing → Task 3. §3.5 Surface → Task 4. §3.6 Interaction → Task 4. §4 `Element.vue` → Task 6. §5 `ElementProps` type → Task 6. §6 out-of-scope items — no task touches them (confirmed: no typography props, no semantic colour, no align/justify/bleed/density/layer exposed on Element, no LayoutGridItem/gridPlacementStyle edits, no new Grid/Section container component). §7 file layout → matches the File Structure section above exactly, plus a playground page for manual verification not explicitly required by the spec but implied by its own worked examples (§4, §5). §8 testing → per-composable unit tests (Task 1–5) plus an `Element.vue` mount test (Task 6) covering `as` passthrough, slot rendering, and style merge order, matching the spec's stated testing requirements. §9 success criteria — criterion 3 ("zero changes to LayoutGridItem/gridPlacementStyle.ts") is enforced by Task 5 Step 6 (full layout suite re-run) and the Global Constraints section; criterion 4 (HStack/VStack unaffected) is enforced by Task 1 Step 6.

**Placeholder scan:** No TBD/TODO/"add appropriate handling" patterns present. Every step has literal code or an exact command.

**Type consistency:** `ElementGridProps`, `ElementSizingProps`, `ElementSurfaceProps`, `ElementInteractionProps`, `ElementLayoutProps`, `LayoutAttrsInput` are named identically everywhere they're referenced across Tasks 2–6. `useElementGrid`/`useElementSizing`/`useElementSurface`/`useElementInteraction`/`useElementLayout` function names match between their defining task and their `Element.vue` usage (Task 6). `ElementProps`'s field list in Task 6 Step 3 is the exact union of every composable's Props type defined in Tasks 1–5, nothing added or missing.
