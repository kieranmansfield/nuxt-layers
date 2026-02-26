# Layout Layer

Swiss Grid System for Nuxt 4 applications. Provides a responsive 6/12/18-column CSS subgrid, page structure components, a mode system, and fluid layout utilities.

---

## Contents

- [How it works](#how-it-works)
- [Playground setup](#playground-setup)
- [Mode system](#mode-system)
- [Components](#components)
- [Composables](#composables)
- [CSS utilities](#css-utilities)
- [Z-index system](#z-index-system)
- [Config reference](#config-reference)
- [Known pitfalls](#known-pitfalls)

---

## How it works

The grid is a single CSS `display: grid` on `<main>` (the `.mastmain` class). Everything else — sections, items — participates via CSS `subgrid`, meaning they inherit the parent's column and row lines rather than defining their own. No JS is involved in the grid itself.

```
<main class="mastmain">          ← defines the grid (6/12/18 cols, row height)
  <section class="basesection">  ← subgrid: inherits cols + rows, spans 12 rows (= 100vh)
    <div style="grid-column: ..."> ← positioned within the subgrid
```

`LayoutMain` renders the `<main class="mastmain">`. `LayoutSection` renders `<section class="basesection">`. `LayoutGridItem` handles grid positioning via inline style or presets.

---

## Playground setup

The layout layer requires a dedicated Nuxt layout file and page-level layout declaration. Without these, content appears edge-to-edge and the grid CSS never applies.

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

> `LayoutPage` is a fragment component — it intentionally provides no wrapper element. The `mastmain` grid lives on `LayoutMain` in the layout file, not in `LayoutPage` itself. Do not add a second `LayoutMain` inside `LayoutPage`.

**Grid debug overlay** (`Cmd+G` to toggle) is rendered by `LayoutGridDebug` inside the layout file, not per-page.

---

## Mode system

The grid has three modes controlled via `app.config.ts`:

| Mode | Behaviour |
|---|---|
| `'swiss'` | Default. Full Swiss grid with `mastmain`/`basesection` CSS subgrid. |
| `'fluid'` | Container-query-based auto-fit grid. `basesection` still gets `container-type`. |
| `'disabled'` | `LayoutMain` renders a plain `<main>` without grid CSS. |

Set in your `app.config.ts`:

```ts
export default defineAppConfig({
  layoutLayer: {
    ui: {
      grid: {
        mode: 'swiss',  // 'swiss' | 'fluid' | 'disabled'
      },
    },
  },
})
```

The old `enabled: boolean` flag is still supported (mapped to `'disabled'` / `'swiss'`) but `mode` takes precedence.

Read in code:

```ts
const { mode, isEnabled } = useGridConfig()
// mode.value === 'swiss' | 'fluid' | 'disabled'
// isEnabled.value === mode !== 'disabled'
```

---

## Components

### `LayoutMain`

Renders `<main class="mastmain">`. When `mode === 'disabled'` it renders a plain `<main>` with no grid classes.

```vue
<LayoutMain>           <!-- default: <main> -->
<LayoutMain tag="div"> <!-- custom tag -->
```

**Props:**

| Prop | Type | Default |
|---|---|---|
| `tag` | `string` | `'main'` |

Place this in your layout file (`layouts/grid.vue`), not in individual pages.

---

### `LayoutContainer`

Constrains content width and centres it. Use inside sections or anywhere you need a contained block.

```vue
<LayoutContainer>                    <!-- default: wide (90rem) -->
<LayoutContainer size="content">     <!-- 65ch prose width -->
<LayoutContainer size="wide">        <!-- 90rem -->
<LayoutContainer size="fluid">       <!-- 100% of parent -->
<LayoutContainer size="full">        <!-- 100vw, escapes grid padding -->
```

**Props:**

| Prop | Type | Default |
|---|---|---|
| `size` | `'content' \| 'wide' \| 'fluid' \| 'full'` | `'wide'` |
| `tag` | `string` | `'div'` |

The `full` size uses negative `margin-inline` to escape the grid's `--grid-padding`, reaching the true viewport edge.

---

### `LayoutPage`

Fragment component (no wrapper element). Handles `useHead()` SEO and optionally renders a `LayoutPageHeader` section.

```vue
<template>
  <LayoutPage title="About" description="About us">
    <LayoutSection>
      <LayoutGridItem preset="centered">
        <!-- content -->
      </LayoutGridItem>
    </LayoutSection>
  </LayoutPage>
</template>
```

**Props:**

| Prop | Type | Default |
|---|---|---|
| `title` | `string` | — (required) |
| `description` | `string` | `''` |
| `showHeader` | `boolean` | `false` |

---

### `LayoutSection`

Full-viewport subgrid section. Spans 12 rows (= 100vh). Inherits the parent `.mastmain` grid columns via `subgrid`.

```vue
<LayoutSection>
<LayoutSection full-height>   <!-- always 100vh, even on mobile -->
<LayoutSection tag="article">
```

**Props:**

| Prop | Type | Default |
|---|---|---|
| `fullHeight` | `boolean` | `false` |
| `fullWidth` | `boolean` | `false` |
| `tag` | `string` | `'section'` |

---

### `LayoutGridItem`

Positioned child within a subgrid section. Use `preset` for common layouts or set column/row values directly.

```vue
<LayoutGridItem preset="centered" />
<LayoutGridItem col-start="3" col-span="12" row-start="2" row-span="8" />
<!-- Responsive values -->
<LayoutGridItem :col-span="{ default: 6, md: 10, lg: 12 }" />
```

**Props:**

| Prop | Type | Notes |
|---|---|---|
| `preset` | `string` | Named preset from config |
| `colStart` | `number \| ResponsiveValue` | Grid column start |
| `colSpan` | `number \| ResponsiveValue` | Column span |
| `rowStart` | `number \| ResponsiveValue` | Grid row start |
| `rowSpan` | `number \| ResponsiveValue` | Row span |
| `layer` | `keyof GridLayers` | Z-index layer: `back`, `mid`, `front`, `top` |
| `align` | `string` | `align-self` value |
| `justify` | `string` | `justify-self` value |
| `bleed` | `boolean` | Negative margin to reach viewport edge |
| `as` | `string` | Tag override |

**Built-in presets:**

| Preset | Columns | Rows |
|---|---|---|
| `hero` | full width | full height |
| `centered` | centre 10 cols | rows 2–10 |
| `fullWidth` | full width | auto |
| `sidebar` | cols 1–4 | full height |
| `content` | cols 5–14 | rows 2–10 |
| `splitLeft` | left half | full |
| `splitRight` | right half | full |
| `quarterLeft` | first quarter | full |
| `threeQuarterRight` | right 3/4 | full |
| `halfTop` | full width | top half |
| `halfBottom` | full width | bottom half |

---

### `LayoutSectionHero`

Section with `background`, `default`, and `footer` slot layers.

```vue
<LayoutSectionHero>
  <template #background><img ... /></template>
  <h1>Title</h1>
  <template #footer><p>Subtitle</p></template>
</LayoutSectionHero>
```

---

### `LayoutSectionSplit`

Two-column 50/50 layout.

```vue
<LayoutSectionSplit>
  <template #left>Left content</template>
  <template #right>Right content</template>
</LayoutSectionSplit>

<LayoutSectionSplit reverse /> <!-- right renders first visually -->
```

---

### `LayoutSectionGallery`

Auto-placing collection grid.

```vue
<LayoutSectionGallery :items="items" :columns="3" :item-row-span="4">
  <template #item="{ item, index }">
    <img :src="item.src" />
  </template>
</LayoutSectionGallery>
```

**Props:** `items` (required), `columns` (2/3/4/6, default 3), `itemRowSpan` (default 4)

---

### `LayoutGridDebug`

Column overlay toggled with `Cmd+G`. Place once in your grid layout file, not in pages.

---

## Composables

### `useGridConfig()`

```ts
const { config, getPreset, isEnabled, mode, layers, useZIndex } = useGridConfig()
```

| Return | Type | Description |
|---|---|---|
| `config` | `Ref<GridConfig>` | Raw config from `app.config` |
| `isEnabled` | `ComputedRef<boolean>` | `true` when `mode !== 'disabled'` |
| `mode` | `ComputedRef<GridMode>` | `'swiss' \| 'fluid' \| 'disabled'` |
| `layers` | `ComputedRef<GridLayers>` | All z-index values |
| `getPreset(name)` | `GridPresetsItem \| undefined` | Look up a preset by name |
| `useZIndex(layer)` | `number` | Get a z-index value by layer name |

**`useZIndex` example:**

```ts
const { useZIndex } = useGridConfig()
const zModal = useZIndex('modal')   // 400
const zHeader = useZIndex('header') // 100
```

---

## CSS utilities

All grid CSS is in `layers/layout/app/assets/css/layout/`.

> **Important:** All classes are plain CSS (not `@utility` directives). Do not convert them to `@utility` — they are loaded via Nuxt's `css: []` array which bypasses the Tailwind CSS 4 pipeline, so `@utility` would produce no output.

### `grids.css` — Core grid classes

**`.mastmain`** — Root grid container on `<main>`.

```css
/* Responsive column counts */
/* Mobile:  6 columns  (< 768px) */
/* Tablet:  12 columns (≥ 768px) */
/* Desktop: 18 columns (≥ 1280px) */
```

CSS custom properties exposed:

| Variable | Value | Purpose |
|---|---|---|
| `--grid-cols` | 6 / 12 / 18 | Active column count |
| `--grid-gap` | `clamp(0.75rem, 1.5vw, 1.5rem)` | Gap between columns and rows |
| `--grid-padding` | `clamp(1rem, 2.5vw, 2rem)` | Outer left/right gutters |
| `--section-height` | `100vh` | Height of one section |
| `--grid-row-height` | computed | Height of one grid row |

**`.basesection`** — Subgrid section (12 rows = 100vh).

**Vertical rhythm utilities** (`.leading-rhythm-*`, `.space-rhythm-*`, `.prose-rhythm`)

### `modes/fluid.css` — Fluid grid classes

Container-query-based auto-fit grids for components that should respond to their container width rather than the viewport.

```vue
<div class="fluid-grid">          <!-- auto-fit, min col 16rem -->
<div class="fluid-grid-2">        <!-- 2-column at container ≥ 30rem -->
<div class="fluid-grid-3">        <!-- 3-column at container ≥ 44rem -->
<div class="fluid-grid-4">        <!-- 4-column at container ≥ 52rem -->
```

Tune minimum column width per-instance:

```vue
<div class="fluid-grid" style="--fluid-col-min: 20rem">
```

**Container size classes** (used by `LayoutContainer`):

| Class | Effect |
|---|---|
| `.layout-container-content` | `max-width: 65ch`, centred |
| `.layout-container-wide` | `max-width: 90rem`, centred |
| `.layout-container-fluid` | `max-width: 100%` |
| `.layout-container-full` | `width: 100vw`, escapes grid padding |

---

## Z-index system

The grid manages z-index through named layers. Use `useZIndex()` or the `layer` prop on `LayoutGridItem` — never raw numbers.

| Layer | Value | Use |
|---|---|---|
| `back` | 0 | Background elements |
| `mid` | 10 | Content |
| `front` | 20 | Floating content |
| `top` | 30 | Pinned / sticky |
| `header` | 100 | Site header / nav |
| `dropdown` | 200 | Dropdown menus, popups |
| `overlay` | 300 | Drawers, sidebars |
| `modal` | 400 | Modal dialogs |
| `toast` | 500 | Toasts, notifications |

```ts
// In a component
const { useZIndex } = useGridConfig()
</script>
<template>
  <div :style="{ zIndex: useZIndex('modal') }">
```

```vue
<!-- On a grid item -->
<LayoutGridItem layer="front">
```

Override values in `app.config.ts`:

```ts
layoutLayer: {
  ui: {
    grid: {
      layers: {
        toast: 9999,  // override individual values
      },
    },
  },
},
```

---

## Config reference

Full type from `layers/layout/app/types/layouts.ts`:

```ts
interface GridConfig {
  mode?: 'swiss' | 'fluid' | 'disabled'
  /** @deprecated use mode: 'disabled' */
  enabled?: boolean
  layers?: Partial<GridLayers>
  presets?: Record<string, GridPresetsItem>
}

interface GridPresetsItem {
  colStart?: number | ResponsiveValue
  colSpan?: number | ResponsiveValue
  rowStart?: number | ResponsiveValue
  rowSpan?: number | ResponsiveValue
  container?: 'content' | 'wide' | 'fluid' | 'full'
  gap?: string
  density?: 'compact' | 'normal' | 'spacious'
}
```

App config namespace: `layoutLayer.ui.grid`.

**Custom preset example:**

```ts
export default defineAppConfig({
  layoutLayer: {
    ui: {
      grid: {
        presets: {
          spotlight: {
            colStart: 4,
            colSpan: 12,
            rowStart: 3,
            rowSpan: 6,
          },
        },
      },
    },
  },
})
```

---

## Known pitfalls

### `@utility` doesn't work in layer CSS files

`@utility` is a Tailwind CSS 4 directive that only works inside files processed by TW4's own pipeline (files containing `@import "tailwindcss"`). CSS loaded via Nuxt's `css: []` array bypasses this pipeline — `@utility` blocks are silently ignored and the class is never generated.

**Rule: always use plain CSS class selectors in layer CSS files.**

```css
/* Wrong — class will not exist in output */
@utility mastmain {
  display: grid;
}

/* Correct */
.mastmain {
  display: grid;
}
```

### `overflow-x: hidden` creates unintended scroll containers

The CSS overflow interaction rule: setting `overflow-x: hidden` on any element forces `overflow-y` from `visible` to `auto`, turning that element into a scroll container. When the element is `html` or `body`, `window.scrollY` stays 0 even when content overflows the viewport.

**Use `overflow-x: clip` instead.** `clip` cuts off overflow without creating a scroll container and is not subject to the forced `overflow-y` conversion. This is why `.mastmain`, `html`, and `body` all use `overflow-x: clip` in this layer.

```css
/* Wrong */
.mastmain { overflow-x: hidden; } /* becomes a scroll container */

/* Correct */
.mastmain { overflow-x: clip; }   /* clips without scroll container */
```

### Locomotive Scroll intercepts wheel events globally

Locomotive Scroll v5 (Lenis-based) with `smoothWheel: true` calls `preventDefault()` on every `wheel` event. If initialised globally in a Nuxt plugin, it intercepts scrolling on every page — even pages where the window has no scroll height, silently swallowing events.

**Scope Locomotive Scroll to the specific route** using `addRouteMiddleware`:

```ts
// plugins/locomotive-scroll.client.ts
addRouteMiddleware((to, from) => {
  if (to.path === '/the-route') nextTick(init)
  else if (from?.path === '/the-route') destroy()
})
```

### `LayoutPage` is a fragment — it provides no grid wrapper

`LayoutPage` renders no element of its own. The `mastmain` grid lives on `LayoutMain` inside a layout file. If you use `<LayoutPage>` on a page that uses the `default` layout (which doesn't include `LayoutMain`), the grid CSS never applies.

Always pair `LayoutPage` usage with `definePageMeta({ layout: 'grid' })` and ensure `layouts/grid.vue` exists with `<LayoutMain>`.
