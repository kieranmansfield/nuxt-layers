# Vue Element System — Design Spec

Source: `Vue Element System.md` (repo root) + working prototype at
`/Users/kieranmansfield/Developer/element-test`. This spec adapts both into
`layers/structure/layout`, on top of the declarative layout system already
shipped this session (`nuxt-declarative-layout-system-spec.md`).

## §0 Relationship to prior work

`nuxt-declarative-layout-system-spec.md` shipped `useLayoutAttrs` (core),
`HStack`/`VStack`/`ZStack`/`Spacer`/`AppContainer`, and explicitly **parked**
two things: a new Grid primitive (§20: "no new Grid primitive... untouched
this pass") and a semantic colour/surface system (§4.3, §21: Phase 2, gated
on Nuxt UI Unstyled work). This spec reopens both, scoped narrowly to
`Element` only — it does not touch `LayoutGridItem`'s placement logic, and it
does not introduce semantic colour tokens (bg/color stay raw CSS passthrough,
same as the prototype).

`2026-09-03-layout-layer-fluid-rebuild-design.md` (same day, separate
worktree) proposes removing `colStart`/`colSpan`/`rowStart`/`rowSpan`
entirely. Confirmed with the user as **shelved, not proceeding** — safe to
build Element's Grid group on the current engine.

## §1 Purpose

`Element` is a polymorphic primitive that gives Vue templates a small,
typed, composable vocabulary for layout/grid/spacing/sizing/surface/
interaction — replacing large utility-class strings with attributes that
read as a description of the composition. Not a Tailwind clone, not a
universal `Box` with every CSS property exposed, not a semantic colour
system.

```vue
<Element as="section" grid :cols="12" gap="lg" p="lg" bg="var(--ui-bg-elevated)">
  <Element :colSpan="8">Main</Element>
  <Element :colSpan="4">Sidebar</Element>
</Element>
```

Typography is explicitly out of scope (per source doc) — no `text`/`font`
props.

## §2 Layer placement

`layers/structure/layout` — same tier as `HStack`/`VStack`/`ZStack`/
`Spacer`. No new layer: the repo already dissolved a dedicated `ui` layer
specifically to avoid a second primitives home (CLAUDE.md). `Element`
becomes that layer's polymorphic sibling, reusing its existing grid engine
directly rather than duplicating it in `core` (which has zero layer deps by
convention).

## §3 Property groups

Six groups, each an internal composable in
`layers/structure/layout/app/composables/`. Markup stays flat — groups are
an architectural seam, not a markup namespace.

### 3.1 Layout — `useElementLayout.ts` (new)

```ts
interface ElementLayoutProps {
  block?: boolean
  flex?: boolean
  grid?: boolean
  hidden?: boolean
}
```
Resolves to `display`. Exactly one of the four booleans wins (first match:
hidden > grid > flex > block), matching the prototype's `displayFor` map.

### 3.2 Spacing — reuse `useLayoutAttrs` (core), extended

`useLayoutAttrs` (`layers/core/app/composables/useLayoutAttrs.ts`) already
resolves `gap`/`align`/`justify`/`p`/`px`/`py` off the fluid `Spacing`
token scale. Add `m`/`mx`/`my` (margin) — additive, optional fields, backward
compatible with `HStack`/`VStack`'s existing calls (they don't pass margin,
nothing changes for them). Element's Spacing group is this composable, not
a new one.

```ts
// added to LayoutAttrsInput
m?: ResponsiveValue<Spacing> | Spacing | undefined
mx?: ResponsiveValue<Spacing> | Spacing | undefined
my?: ResponsiveValue<Spacing> | Spacing | undefined
```

### 3.3 Grid — `useElementGrid.ts` (new), wraps existing engine

Two axes:

- **Container axis** (`grid` bool set): `cols`/`rows`/`gap` → `gridTemplateColumns`/`Rows`. `gap` already covered by 3.2. `cols`/`rows` accept a number (→ `repeat(n, 1fr)`) or a raw CSS track string, matching the prototype's `track()` helper. This axis has no existing engine to reuse — `LayoutGridItem` is item-only — so it's new, small code.
- **Item axis** (placement within a parent grid): `colStart`/`colSpan`/`rowStart`/`rowSpan`, delegated directly to `buildGridPlacementStyle` (`layers/structure/layout/app/utils/gridPlacementStyle.ts`) — same names, same responsive/bleed/align/layer support `LayoutGridItem` already has. **Decision:** these names, not the source doc's `span`/`start`/`end` — one grid vocabulary in this layer, not two competing spellings for the same concept.

```ts
interface ElementGridProps {
  grid?: boolean
  cols?: number | string
  rows?: number | string
  colStart?: number | ResponsiveValue<number>
  colSpan?: number | 'full' | ResponsiveValue<number>
  rowStart?: number | ResponsiveValue<number>
  rowSpan?: number | ResponsiveValue<number>
}
```

`align`/`justify`/`bleed`/`density`/`layer` from `buildGridPlacementStyle`
are **not** exposed on `Element` in this pass — `LayoutGridItem` remains the
component for those; Element's item-axis support covers the common
span/start case only. Escape hatch: use `LayoutGridItem` directly, or
`:style` on `Element`, for the rest.

### 3.4 Sizing — `useElementSizing.ts` (new)

```ts
interface ElementSizingProps {
  w?: CSSProperties['width']
  h?: CSSProperties['height']
  minW?: CSSProperties['minWidth']
  maxW?: CSSProperties['maxWidth']
  minH?: CSSProperties['minHeight']
  maxH?: CSSProperties['maxHeight']
  aspect?: CSSProperties['aspectRatio']
}
```
Raw CSS passthrough, same shape as the prototype. No token constraint — sizing is inherently arbitrary (pixel dimensions, percentages).

### 3.5 Surface — `useElementSurface.ts` (new)

```ts
interface ElementSurfaceProps {
  bg?: CSSProperties['background']
  color?: CSSProperties['color']
  border?: CSSProperties['border']
  radius?: CSSProperties['borderRadius']
  shadow?: CSSProperties['boxShadow']
}
```
Raw CSS passthrough (per user decision) — `bg="var(--ui-color-primary-500)"`, not `bg="primary"`. No semantic colour resolution; that stays Phase 2 territory, untouched. No new `radius`/`shadow` token files exist in `core` yet — not created here.

### 3.6 Interaction — `useElementInteraction.ts` (new)

```ts
interface ElementInteractionProps {
  cursor?: CSSProperties['cursor']
  select?: CSSProperties['userSelect']
  pointer?: CSSProperties['pointerEvents']
}
```
Direct port of the prototype's composable — already minimal and correct.

## §4 `Element.vue`

```vue
<script setup lang="ts">
import type { Component, CSSProperties } from 'vue'
import type { ElementGridProps } from '#layers/layout/app/composables/useElementGrid'
import type { ElementInteractionProps } from '#layers/layout/app/composables/useElementInteraction'
import type { ElementLayoutProps } from '#layers/layout/app/composables/useElementLayout'
import type { ElementSizingProps } from '#layers/layout/app/composables/useElementSizing'
import type { ElementSurfaceProps } from '#layers/layout/app/composables/useElementSurface'
import type { LayoutAttrsInput } from '#layers/core/app/composables/useLayoutAttrs'

const props = withDefaults(defineProps<
  ElementLayoutProps & ElementGridProps & LayoutAttrsInput & ElementSizingProps &
  ElementSurfaceProps & ElementInteractionProps & { as?: string | Component }
>(), { as: 'div' })

const style = computed<CSSProperties>(() => ({
  ...useElementLayout(props).value,
  ...useLayoutAttrs(() => props).style.value,
  ...useElementGrid(props).value,
  ...useElementSizing(props).value,
  ...useElementSurface(props).value,
  ...useElementInteraction(props).value,
}))
</script>

<template>
  <component :is="as" :style>
    <slot />
  </component>
</template>
```

Root-level, unprefixed component name (`<Element>`), matching `HStack`/
`VStack`'s convention.

## §5 Types file

`layers/structure/layout/app/types/element.ts` re-exports the union:

```ts
export type ElementProps =
  & ElementLayoutProps & ElementGridProps & LayoutAttrsInput &
    ElementSizingProps & ElementSurfaceProps & ElementInteractionProps
  & { as?: string | Component }
```
Consumed by future semantic components (`Card`, `Section` variants) that
want a documented subset — per source doc's "Component Capabilities"
section. No such consumer is built in this pass; the type just exists for
one to compose against later.

## §6 What's explicitly out of scope this pass

- Typography vocabulary (source doc defers it too).
- Semantic colour/surface tokens (`bg="surface"`) — Phase 2, per the
  declarative-layout spec's §21, untouched.
- `align`/`justify`/`bleed`/`density`/`layer` on Element's Grid group — use
  `LayoutGridItem` directly for those.
- Any change to `LayoutGridItem`, `gridPlacementStyle.ts` placement logic,
  or the fluid-rebuild spec's territory — read-only reuse, zero edits.
- A new `Grid`/`Section` container component — `Element grid` covers the
  "I am a grid" case inline; the source doc's own example doesn't need a
  separate named component for it.

## §7 File layout

```
layers/structure/layout/app/
├── components/
│   └── Element.vue                    (new)
├── composables/
│   ├── useElementLayout.ts            (new)
│   ├── useElementGrid.ts              (new)
│   ├── useElementSizing.ts            (new)
│   ├── useElementSurface.ts           (new)
│   └── useElementInteraction.ts       (new)
└── types/
    └── element.ts                     (new)

layers/core/app/composables/
└── useLayoutAttrs.ts                  (edit: add m/mx/my)
```

## §8 Testing

- Vitest unit tests per composable: static value, boolean layout-mode
  precedence, grid container-axis (`cols`/`rows` number vs. string),
  grid item-axis delegates correctly to `buildGridPlacementStyle`.
- `Element.vue` mount test: renders as native tag, renders as a passed
  component (`:as="SomeComponent"`), style merge order (later group wins
  on key collision — none expected, groups write disjoint CSS properties).
- Regression: `useLayoutAttrs`'s existing `HStack`/`VStack` consumers
  unaffected by the `m`/`mx`/`my` addition (existing tests still pass).
- Manual: playground page exercising the source doc's grid/flex/sizing
  examples, ported from the prototype's `pages/index.vue`.

## §9 Success criteria

1. `<Element as="section" grid :cols="12" gap="lg">` renders identically
   in spirit to the prototype, but spacing/gap comes from the fluid token
   scale, not raw CSS strings.
2. Item placement (`colSpan`/`colStart`) on `Element` produces the same
   CSS as the equivalent `LayoutGridItem` usage — one engine, two entry
   points.
3. Zero changes to `LayoutGridItem`, `gridPlacementStyle.ts`, or any file
   the fluid-rebuild spec's territory covers.
4. `HStack`/`VStack` unaffected by the `useLayoutAttrs` margin addition.
5. No new semantic colour/token system introduced.

## §10 Amendment (2026-09-03, post-ship): relocated to `core`, item placement dropped

Shipped as designed above, in `layers/structure/layout`, then relocated the
same day. The stated intent was for `Element` to be usable across
essentially every layer to replace class-attribute soup generally — not a
layout-tier-only primitive. That breaks criterion 2 above: `layout` is a
tier-2 layer, and forcing every other layer (typography, visual, data,
motion, render, delivery — everything) to `extends: ['../layout']` just to
use `Element` is a far heavier dependency footprint than a shared-vocabulary
component should ask for.

**Resolution:** moved `Element` and its five composables
(`useElementLayout`/`useElementGrid`/`useElementSizing`/`useElementSurface`/
`useElementInteraction`) into `layers/core` (zero layer deps, already
extended by everything). This forced dropping `useElementGrid`'s item-axis
(`colStart`/`colSpan`/`rowStart`/`rowSpan`) support outright — that axis
delegated to `buildGridPlacementStyle`, which lives in `layout` and can't be
imported from `core` without inverting the dependency graph. `useElementGrid`
is now container-axis only (`grid`/`cols`/`rows` → `display: grid` +
`gridTemplateColumns`/`gridTemplateRows`). Item placement inside an
`Element`-built grid still works — just via `LayoutGridItem` directly, in
the `layout` layer, unchanged.

Superseded from §9: criterion 2 (item placement, no longer part of
`Element`) and criterion 3's `LayoutGridItem`/`gridPlacementStyle.ts`
clause (moot — `Element` no longer imports either). Criteria 1, 4, 5 still
hold. `Element.vue`'s duplicated `.gi-placed` CSS block (added during the
final-review fix wave, §8's ledger) was removed along with the item axis —
no longer needed.

File moves (git history preserved via `git mv`):
- `layers/structure/layout/app/components/Element.vue` → `layers/core/app/components/Element.vue`
- `layers/structure/layout/app/composables/useElement*.ts(.test.ts)` → `layers/core/app/composables/`
- `layers/structure/layout/app/types/element.ts` → `layers/core/app/types/element.ts`
- `@vue/test-utils` devDependency moved from `layout`'s `package.json` to `core`'s.
- The `#layers/core` vitest alias added for the old cross-layer import was removed (dead — `Element`'s imports are relative now that it lives in `core`).

## §11 Second amendment (2026-09-03, same day): moved again, to its own layer

Reconsidered §10's placement almost immediately: putting `Element` inside
`core` means core stops being pure foundation and starts carrying an
opinionated design-vocabulary component. The user's framing — `Element`
"provides containment," a distinct concern from core's browser/device/PWA
utilities — matches the tier taxonomy better than folding it into `core`.

**Resolution:** new layer, `layers/design-system/element/`, alongside
`theming`/`typography`/`visual` (same tier, same shape: one dependency,
`core`). This is *not* a reversion to §7's original mistake (`layout`,
tier 2) — `element` depends only on `core`, so it costs every consuming
layer/app exactly one `extends` entry, same as `typography` or `visual`
already do. §10's core objection (§7's placement inverting the tier-2
`layout` → tier-0 `core` boundary if item-placement stayed) is unaffected —
`useElementGrid` is still container-axis only; nothing about this second
move reopens the dropped item-placement question.

Mechanically: `Element.vue`'s `useLayoutAttrs` import goes back to the
`#layers/core/...` alias (cross-layer again), and `types/element.ts`'s
`LayoutAttrsInput` import goes back to the four-level relative path (same
SFC-macro-can't-see-aliases reason as §7). The `#layers/core` vitest alias
removed in §10 is restored. New layer scaffolding: `nuxt.config.ts`
(`extends: ['../../core']`, matching `typography`'s exact shape),
`package.json` (`kmcom-layer-element`, `@vue/test-utils` devDependency
moved here from `core`). Registered in
`apps/playground/nuxt.config.ts`'s `AVAILABLE_LAYERS`/`LAYER_PATHS`/
`LAYER_DEPENDENCIES` (depends on `core` only, same as `typography`/`visual`).
`CLAUDE.md` and `.claude/rules/nuxt-layers.md` updated to list the new
layer and its `element → core` dependency-graph line.
