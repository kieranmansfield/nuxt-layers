# Layout Layer

Swiss Grid System for Nuxt 4 applications. Provides a 6/12/18-column responsive grid using CSS subgrid, along with page, section, and grid item components.

---

## Layer Structure

```
layers/layout/
├── app/
│   ├── assets/css/
│   │   ├── layout/grids.css     # mastmain, basesection, prose-rhythm utilities
│   │   └── main.css             # entry point
│   ├── components/Layout/
│   │   ├── Grid/
│   │   │   ├── Item.vue         # LayoutGridItem — positioned grid child
│   │   │   └── Debug.vue        # LayoutGridDebug — Cmd+G column overlay
│   │   ├── Page/
│   │   │   ├── index.vue        # LayoutPage — canonical page wrapper (NEW)
│   │   │   ├── Container.vue    # LayoutPageContainer — legacy, kept for compat
│   │   │   └── Header.vue       # LayoutPageHeader — title + description block
│   │   └── Section/
│   │       ├── index.vue        # LayoutSection — full-viewport subgrid section
│   │       ├── Hero.vue         # LayoutSectionHero — background/content/footer slots
│   │       ├── Gallery.vue      # LayoutSectionGallery — auto-placing collection grid
│   │       └── Split.vue        # LayoutSectionSplit — 50/50 two-column layout
│   ├── composables/
│   │   └── useGridConfig.ts     # Access grid config + isEnabled + getPreset()
│   └── types/
│       └── layouts.ts           # GridConfig, GridPresetsItem, ResponsiveValue, etc.
├── app.config.ts                # Grid config + Nuxt UI component theming
├── nuxt.config.ts               # Layer meta, alias, CSS import
├── GRID_SYSTEM.md               # Full reference documentation
└── GRID_IMPLEMENTATION.md       # Step-by-step implementation guide
```

---

## Core Concepts

### CSS Utilities (grids.css)

| Utility | Applied to | Purpose |
|---|---|---|
| `mastmain` | Page root (`<main>`) | Defines 6/12/18 column grid with clamp gaps |
| `basesection` | `LayoutSection` | Subgrid section, inherits parent column lines, 12 rows = 100vh |
| `prose-rhythm` | Text containers | 0.25rem baseline grid for typography |

### Responsive breakpoints

| Viewport | Width | Columns |
|---|---|---|
| Mobile | < 768px | 6 |
| Tablet | ≥ 768px | 12 |
| Desktop | ≥ 1280px | 18 |

---

## Canonical Page API

Always use `<LayoutPage>` for new pages:

```vue
<template>
  <LayoutPage title="Page Title" description="SEO description">
    <LayoutSection>
      <LayoutGridItem preset="centered">
        <!-- content -->
      </LayoutGridItem>
    </LayoutSection>
  </LayoutPage>
</template>
```

`LayoutPage` wraps content in `<main class="mastmain">`, handles `useHead()`, and renders `LayoutGridDebug` automatically.

---

## Feature Flag

The Swiss Grid can be disabled via `app.config.ts`:

```ts
export default defineAppConfig({
  layoutLayer: {
    ui: {
      grid: {
        enabled: false,  // LayoutPage falls back to UMain > UPage > UPageBody
      },
    },
  },
})
```

Read in components via `useGridConfig().isEnabled`.

---

## Nuxt UI Integration (app.config.ts)

The layer configures Nuxt UI components to align with the grid:

- **`ui.header.container`** — removes max-width, uses clamp-based gutters matching the grid
- **`ui.page`** — `root` is a subgrid participant; `left`/`center`/`right` slots map to cols 1–4, 5–14, 15–18
- **`ui.pageBody`** — strips opinionated padding
- **`ui.pageGrid`** / **`ui.pageColumns`** — inherit subgrid column lines

---

## Component Quick Reference

### LayoutPage (index.vue)
- **Props:** `title` (req), `description`, `showHeader` (default: false)
- **Fragment component** — no wrapper element. `mastmain` lives on `MastMain` in the default layout; do NOT add a second one here
- **Handles:** `useHead()` SEO, `provide('pageTitle', title)`, optional `LayoutPageHeader` section
- **Do NOT add `LayoutGridDebug`** — the default layout already owns that

### LayoutSection
- **Props:** `fullHeight`, `fullWidth`, `tag`
- **CSS:** `basesection` (subgrid, 12 rows)

### LayoutGridItem
- **Props:** `preset`, `colStart`, `colSpan`, `rowStart`, `rowSpan`, `align`, `justify`, `layer`, `bleed`, `aspect`, `as`
- **Responsive values:** `{ default: 6, md: 10, lg: 12 }`
- **Layers:** `back`(0) `mid`(10) `front`(20) `top`(30)
- **Presets:** hero, centered, fullWidth, sidebar, content, splitLeft, splitRight, quarterLeft, threeQuarterRight, halfTop, halfBottom

### LayoutSectionHero
- **Slots:** `#background` (layer back), default (layer mid), `#footer` (layer mid)

### LayoutSectionSplit
- **Props:** `fullHeight`, `reverse`
- **Slots:** `#left`, `#right`

### LayoutSectionGallery
- **Props:** `items` (req), `columns` (2/3/4/6, default 3), `itemRowSpan` (default 4)
- **Slot:** `#item="{ item, index }"`

### useGridConfig()
```ts
const { config, getPreset, isEnabled, layers } = useGridConfig()
```

---

## Development Guidelines

- Use `LayoutPage` as the root of every page — not raw divs or `PageContainer`
- Never duplicate grid column/gap definitions — `mastmain` is the single source of truth; sections inherit via subgrid
- Use `layer` prop instead of raw z-index numbers
- Prefer presets over custom `colStart`/`colSpan` for common layouts
- The `enabled` flag controls `LayoutPage` only — `LayoutSection` / `LayoutGridItem` are always available
- Consuming apps can override any `ui.*` config in their own `app.config.ts`
- `PageContainer.vue` is kept for backwards compatibility; do not remove it

---

## Key Files

| Task | File |
|---|---|
| Canonical page wrapper | `app/components/Layout/Page/index.vue` |
| Grid CSS utilities | `app/assets/css/layout/grids.css` |
| Grid config + Nuxt UI theming | `app.config.ts` |
| TypeScript types | `app/types/layouts.ts` |
| Config composable | `app/composables/useGridConfig.ts` |
| Step-by-step guide | `GRID_IMPLEMENTATION.md` |
| Full reference | `GRID_SYSTEM.md` |
