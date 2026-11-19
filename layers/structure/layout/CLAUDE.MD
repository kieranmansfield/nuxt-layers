# Layout Layer

Swiss Grid System for Nuxt 4 applications. Responsive 6/12/18-column CSS subgrid with page structure components and mode switching.

Full documentation: `docs/LAYOUT.md` in the monorepo root.

---

## Layer Structure

```
layers/layout/
├── app/
│   ├── assets/css/
│   │   ├── layout/
│   │   │   └── grids.css              # .grid-root, .basesection, prose-rhythm utilities
│   │   └── main.css                   # entry point (imports grids.css)
│   ├── components/
│   │   ├── HStack.vue                 # HStack — flexbox row (moved from the dissolved `ui` layer)
│   │   ├── VStack.vue                 # VStack — flexbox column
│   │   ├── ZStack.vue                 # ZStack — single-area grid, layered children
│   │   └── Spacer.vue                 # Spacer — flexible remaining space
│   ├── components/Layout/
│   │   ├── Main.vue                   # LayoutMain — <main class="grid-root"> wrapper
│   │   ├── Grid/
│   │   │   ├── Item.vue               # LayoutGridItem — positioned grid child
│   │   │   └── Debug.vue              # LayoutGridDebug — Cmd+G column overlay
│   │   ├── Page/
│   │   │   ├── index.vue              # LayoutPage — fragment: SEO + optional header
│   │   │   └── Header.vue             # LayoutPageHeader — title + description block
│   │   └── Section/
│   │       ├── index.vue              # LayoutSection — full-viewport subgrid section
│   │       ├── Hero.vue               # LayoutSectionHero — background/content/footer slots
│   │       ├── Gallery.vue            # LayoutSectionGallery — auto-placing grid
│   │       └── Split.vue              # LayoutSectionSplit — 50/50 two-column layout
│   ├── composables/
│   │   └── useGridConfig.ts           # config, isEnabled, mode, layers, getPreset, useZIndex
│   └── types/
│       └── layouts.ts                 # GridConfig, GridMode, GridLayers, GridPresetsItem, etc.
│   └── app.config.ts                  # Config defaults + Nuxt UI component theming
├── nuxt.config.ts                     # Layer meta, alias (#layers/layout), CSS import
└── CLAUDE.md                          # This file
```

---

## Core Concept

The grid is a single `display: grid` on `<main>` (`.grid-root`). Sections and items participate via CSS `subgrid` — they inherit the parent's column and row lines. No JS is involved in the grid itself.

```
LayoutMain (<main class="grid-root">)        ← defines the grid
  LayoutSection (<section class="basesection">)  ← subgrid, 12 rows = 100vh
    LayoutGridItem                               ← positioned via inline style
```

---

## Playground Setup

`layout` now ships its own `default.vue` (`<LayoutMain><slot /></LayoutMain>`) — any consumer
using the default layout gets the real grid root instead of a bare passthrough. For a page that
also wants header/nav/footer chrome or the debug overlay, build a richer named layout, e.g.:

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
layoutLayer.ui.grid.mode: 'swiss' | 'disabled'
```

- `'swiss'` — default, full subgrid
- `'disabled'` — plain `<main>`, no grid CSS

---

## Component Quick Reference

### `LayoutMain` — `<main class="grid-root">`

- **Props:** `tag` (default `'main'`)
- Renders plain `<main>` when `mode === 'disabled'`

### `AppContainer` (from `layers/core`) — width constraint

- **Props:** `size` (`'content' | 'wide' | 'fluid' | 'full'`, default `'wide'`), `tag`
- Maps to `.container-*` CSS classes (`layers/core/app/assets/css/tokens/container.css`)

### `LayoutPage` — fragment: SEO + optional header

- **Props:** `title` (req), `description`, `showHeader`
- Fragment component — no wrapper element

### `LayoutSection` — subgrid section (12 rows = 100vh)

- **Props:** `fullHeight`, `fullWidth`, `tag`

### `LayoutGridItem` — positioned grid child

- **Props:** `preset`, `colStart`, `colSpan`, `rowStart`, `rowSpan`, `layer`, `align`, `justify`, `bleed`, `as`
- **Presets:** hero, centered
- **Layers (z-index):** `back`(0) `mid`(10) `front`(20) `top`(30) `header`(100) `dropdown`(200) `overlay`(300) `modal`(400) `toast`(500)

---

## useGridConfig()

```ts
const { config, getPreset, isEnabled, mode, layers, useZIndex } = useGridConfig()
```

| Return             | Description                                   |
| ------------------ | --------------------------------------------- |
| `config`           | Raw `GridConfig` from app.config              |
| `isEnabled`        | `true` when `mode !== 'disabled'`             |
| `mode`             | `'swiss' \| 'disabled'`                       |
| `layers`           | All z-index values                            |
| `getPreset(name)`  | Look up preset by name                        |
| `useZIndex(layer)` | Get z-index value: `useZIndex('modal')` → 400 |

---

## CSS Critical Notes

1. **Never use `@utility` in CSS files loaded via Nuxt `css: []`** — it bypasses the TW4 pipeline and the class never exists. Use plain `.class-name {}` selectors only.

2. **Use `overflow-x: clip`, never `overflow-x: hidden`** — `hidden` forces `overflow-y: auto` on the same element, creating an unintended scroll container and making `window.scrollY` always 0.

---

## Key Files

| Task                     | File                                          |
| ------------------------ | --------------------------------------------- |
| Grid CSS                 | `app/assets/css/layout/grids.css`             |
| Config + Nuxt UI theming | `app/app.config.ts`                           |
| TypeScript types         | `app/types/layouts.ts`                        |
| Config composable        | `app/composables/useGridConfig.ts`            |
| Grid wrapper component   | `app/components/Layout/Main.vue`              |
| Container component      | `layers/core/app/components/AppContainer.vue` |
| Full reference docs      | `../../docs/LAYOUT.md`                        |
