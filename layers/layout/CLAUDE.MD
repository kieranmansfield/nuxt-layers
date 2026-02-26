# Layout Layer

Swiss Grid System for Nuxt 4 applications. Responsive 6/12/18-column CSS subgrid with page structure components, mode switching, and fluid layout utilities.

Full documentation: `docs/LAYOUT.md` in the monorepo root.

---

## Layer Structure

```
layers/layout/
├── app/
│   ├── assets/css/
│   │   ├── layout/
│   │   │   ├── grids.css              # .mastmain, .basesection, prose-rhythm utilities
│   │   │   └── modes/
│   │   │       └── fluid.css          # .fluid-grid, .layout-container-* utilities
│   │   └── main.css                   # entry point (imports grids.css + fluid.css)
│   ├── components/Layout/
│   │   ├── Main.vue                   # LayoutMain — <main class="mastmain"> wrapper
│   │   ├── Container.vue              # LayoutContainer — content/wide/fluid/full sizing
│   │   ├── Grid/
│   │   │   ├── Item.vue               # LayoutGridItem — positioned grid child
│   │   │   └── Debug.vue              # LayoutGridDebug — Cmd+G column overlay
│   │   ├── Page/
│   │   │   ├── index.vue              # LayoutPage — fragment: SEO + optional header
│   │   │   ├── Container.vue          # LayoutPageContainer — legacy, kept for compat
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
├── app.config.ts                      # Config defaults + Nuxt UI component theming
├── nuxt.config.ts                     # Layer meta, alias (#layers/layout), CSS import
└── CLAUDE.md                          # This file
```

---

## Core Concept

The grid is a single `display: grid` on `<main>` (`.mastmain`). Sections and items participate via CSS `subgrid` — they inherit the parent's column and row lines. No JS is involved in the grid itself.

```
LayoutMain (<main class="mastmain">)        ← defines the grid
  LayoutSection (<section class="basesection">)  ← subgrid, 12 rows = 100vh
    LayoutGridItem                               ← positioned via inline style
```

---

## Playground Setup

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
layoutLayer.ui.grid.mode: 'swiss' | 'fluid' | 'disabled'
```

- `'swiss'` — default, full subgrid
- `'fluid'` — container-query auto-fit grid
- `'disabled'` — plain `<main>`, no grid CSS

---

## Component Quick Reference

### `LayoutMain` — `<main class="mastmain">`
- **Props:** `tag` (default `'main'`)
- Renders plain `<main>` when `mode === 'disabled'`

### `LayoutContainer` — width constraint
- **Props:** `size` (`'content' | 'wide' | 'fluid' | 'full'`, default `'wide'`), `tag`
- Maps to `.layout-container-*` CSS classes

### `LayoutPage` — fragment: SEO + optional header
- **Props:** `title` (req), `description`, `showHeader`
- Fragment component — no wrapper element

### `LayoutSection` — subgrid section (12 rows = 100vh)
- **Props:** `fullHeight`, `fullWidth`, `tag`

### `LayoutGridItem` — positioned grid child
- **Props:** `preset`, `colStart`, `colSpan`, `rowStart`, `rowSpan`, `layer`, `align`, `justify`, `bleed`, `as`
- **Presets:** hero, centered, fullWidth, sidebar, content, splitLeft, splitRight, quarterLeft, threeQuarterRight, halfTop, halfBottom
- **Layers (z-index):** `back`(0) `mid`(10) `front`(20) `top`(30) `header`(100) `dropdown`(200) `overlay`(300) `modal`(400) `toast`(500)

---

## useGridConfig()

```ts
const { config, getPreset, isEnabled, mode, layers, useZIndex } = useGridConfig()
```

| Return | Description |
|---|---|
| `config` | Raw `GridConfig` from app.config |
| `isEnabled` | `true` when `mode !== 'disabled'` |
| `mode` | `'swiss' \| 'fluid' \| 'disabled'` |
| `layers` | All z-index values |
| `getPreset(name)` | Look up preset by name |
| `useZIndex(layer)` | Get z-index value: `useZIndex('modal')` → 400 |

---

## CSS Critical Notes

1. **Never use `@utility` in CSS files loaded via Nuxt `css: []`** — it bypasses the TW4 pipeline and the class never exists. Use plain `.class-name {}` selectors only.

2. **Use `overflow-x: clip`, never `overflow-x: hidden`** — `hidden` forces `overflow-y: auto` on the same element, creating an unintended scroll container and making `window.scrollY` always 0.

---

## Key Files

| Task | File |
|---|---|
| Grid CSS | `app/assets/css/layout/grids.css` |
| Fluid / container CSS | `app/assets/css/layout/modes/fluid.css` |
| Config + Nuxt UI theming | `app.config.ts` |
| TypeScript types | `app/types/layouts.ts` |
| Config composable | `app/composables/useGridConfig.ts` |
| Grid wrapper component | `app/components/Layout/Main.vue` |
| Container component | `app/components/Layout/Container.vue` |
| Full reference docs | `../../docs/LAYOUT.md` |
