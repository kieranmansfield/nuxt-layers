# UPage + Swiss Grid Integration

## The Problem

`<LayoutMain>` renders `<main class="mastmain">` which sets:

```css
.mastmain {
  grid-auto-rows: calc((100vh - 11 * gap) / 12); /* ≈ 8.5vh per row */
}
```

Every direct child that doesn't explicitly span rows becomes ~8.5vh tall. `<UPage>` and Nuxt UI's page components (`UPageSection`, `UPageHero`, etc.) don't span rows — so they collapse.

`.basesection` fixes this for `<LayoutSection>` by spanning 12 rows:

```css
.basesection {
  grid-row: span 12; /* 12 × 8.5vh ≈ 100vh */
}
```

`<UPage>` has no equivalent. It's designed for document flow, not a fixed-row grid.

---

## Approaches

### Option A — `minmax` on `grid-auto-rows` (Recommended)

**Change in `grids.css`:**

```css
.mastmain {
  /* Before */
  grid-auto-rows: var(--grid-row-height);

  /* After — allow rows to grow beyond their minimum */
  grid-auto-rows: minmax(var(--grid-row-height), auto);
}
```

The mobile breakpoint already uses this. Apply it at all breakpoints.

**What changes:**
- `<LayoutSection>` spanning 12 rows = at least `12 × 8.5vh ≈ 100vh` (min preserved)
- `<UPage>` in a single row = auto-sized to its content height
- Column alignment is fully preserved

**Trade-off:** `rowStart` placement in `<LayoutGridItem>` becomes less predictable when rows above it grow beyond their minimum. `rowSpan` presets are unaffected.

**Implementation:** One-line CSS change in the layout layer source.

---

### Option B — `display: contents` on UPage

Configure `<UPage>` to be transparent to the grid so its children participate directly:

```ts
// In frontend app.config.ts, override the layout layer's UPage config:
ui: {
  page: {
    root: 'col-span-full [display:contents]',
  },
}
```

With `display: contents`, `<UPage>` generates no box — its children (`UPageHero`, `UPageSection`, etc.) become direct grid items in `mastmain`.

**What changes:**
- `<UPage>` styling is effectively gone (use with care)
- Each child component becomes a grid item and needs its own column/row spanning
- Requires configuring `UPageSection`, `UPageHero`, etc. similarly

**Trade-off:** You lose `<UPage>`'s layout structure. Works best when you're using it purely as a semantic grouping with no visual styling.

---

### Option C — `<LayoutPage>` component (Hybrid mode)

A new component that gives pages an explicit choice between Swiss Grid and normal document flow:

```vue
<!-- layers/layout/app/components/Layout/Page/index.vue -->
<script setup lang="ts">
interface Props {
  mode?: 'swiss' | 'flow'
}
const { mode = 'swiss' } = defineProps<Props>()
</script>

<template>
  <!-- Swiss: children participate directly in mastmain grid (use LayoutSection) -->
  <template v-if="mode === 'swiss'">
    <slot />
  </template>

  <!-- Flow: UPage mode — auto-height row that fills content -->
  <div
    v-else
    class="col-span-full"
    style="grid-row: auto / span 999; height: max-content; min-height: 0"
  >
    <UPage>
      <slot />
    </UPage>
  </div>
</template>
```

Usage:

```vue
<!-- Swiss Grid page -->
<template>
  <LayoutPage>
    <LayoutSection full-height>
      <LayoutGridItem preset="centered">
        <h1>Title</h1>
      </LayoutGridItem>
    </LayoutSection>
  </LayoutPage>
</template>

<!-- UPage page inside LayoutMain -->
<template>
  <LayoutPage mode="flow">
    <UPageHero title="About" />
    <UPageSection>...</UPageSection>
  </LayoutPage>
</template>
```

**Trade-off:** `span 999` is an escape hatch — it works because CSS Grid clamps spans to the available track count. It's pragmatic but not semantically clean. Requires the component to live in the layout layer source.

---

### Option D — Per-page `<LayoutMain tag="div">` opt-in

Don't apply `<LayoutMain>` in the layouts at all. Let pages that want the Swiss Grid add it themselves inside their template:

```vue
<!-- A Swiss Grid page — no UPage -->
<template>
  <LayoutMain tag="div">
    <LayoutSection full-height>
      <LayoutGridItem preset="hero">
        <h1>Home</h1>
      </LayoutGridItem>
    </LayoutSection>
  </LayoutMain>
</template>

<!-- A normal page — uses UMain from the layout, no grid involvement -->
<template>
  <UPage>
    <UPageHero title="About" />
  </UPage>
</template>
```

**This is the current approach after the revert.** The layout layer is available everywhere but not globally applied. The `mastmain` CSS class exists — any element can opt in via `class="mastmain"` or `<LayoutMain tag="div">`.

**Trade-off:** No automatic column alignment across pages. Pages must explicitly adopt the grid.

---

## Recommendation

**Short-term (no code changes required):** Option D — current approach. Build new sections using `<LayoutSection>` / `<LayoutGridItem>` inside pages that want the Swiss Grid. Existing `<UPage>` pages are untouched.

**Medium-term (one CSS change):** Option A — change `grid-auto-rows` to `minmax(var(--grid-row-height), auto)` in `grids.css`. This makes `<LayoutMain>` compatible with both Swiss Grid sections and UPage content at the same time, unlocking global application in the layouts with zero page changes.

**Long-term:** Migrate pages to the Swiss Grid pattern (no `<UPage>`) to take full advantage of precise row placement and the full 18-column subgrid system.

---

## CSS Grid Behaviour Reference

| Scenario | `grid-auto-rows: 8.5vh` | `grid-auto-rows: minmax(8.5vh, auto)` |
|---|---|---|
| `<LayoutSection>` (spans 12 rows) | ✅ Exactly 100vh | ✅ At least 100vh, grows with content |
| `<UPage>` (1 auto row) | ❌ Collapsed to 8.5vh | ✅ Grows to content height |
| `<LayoutGridItem rowStart="3">` | ✅ Predictable position | ⚠️ Position shifts if rows above grew |
| `<LayoutGridItem rowSpan="6">` | ✅ 6 × 8.5vh = 51vh | ✅ At least 6 × 8.5vh |
