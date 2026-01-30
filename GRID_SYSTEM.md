# Swiss Grid System - Layout Layer Documentation

## Table of Contents

1. [Overview](#overview)
2. [Philosophy & Design Principles](#philosophy--design-principles)
3. [Architecture](#architecture)
4. [Core Concepts](#core-concepts)
5. [Components Reference](#components-reference)
6. [Configuration & Customization](#configuration--customization)
7. [Using with Nuxt Layers](#using-with-nuxt-layers)
8. [Examples](#examples)
9. [Best Practices](#best-practices)

---

## Overview

The **ui-layout-layer** implements a Swiss Grid System inspired by Josef Müller-Brockmann's typographic grid systems. It uses modern CSS Grid with **subgrid** to create a precise, responsive, and mathematically consistent layout system for Nuxt applications.

### Key Features

- **Responsive Grid Density**: 6 columns (mobile) → 12 columns (tablet) → 18 columns (desktop)
- **Vertical Rhythm**: 12-row sections spanning 100vh with consistent baseline grid
- **CSS Subgrid**: Precise alignment across component hierarchy
- **Layered Z-Index System**: Semantic layering (back, mid, front, top)
- **Configurable Presets**: Pre-built responsive layouts for common patterns
- **Container Queries**: @container support for component-level responsiveness
- **Debug Mode**: Visual grid overlay (Cmd/Ctrl+G)

---

## Philosophy & Design Principles

### Swiss Design Roots

The grid system follows Swiss/International Typographic Style principles:

1. **Mathematical Precision**: Grid-based layouts with exact column/row placement
2. **Hierarchy through Scale**: Z-index layering and responsive density changes
3. **Rhythm & Harmony**: Baseline grid (0.25rem units) maintains vertical rhythm
4. **Functional Clarity**: Components are named for their purpose, not appearance
5. **Modular Composition**: Small, reusable components compose into complex layouts

### Why CSS Subgrid?

Traditional grid systems require duplicating grid definitions at every level. **Subgrid** allows child grids to inherit parent grid lines, ensuring:

- Pixel-perfect alignment across nesting levels
- Single source of truth for grid configuration
- No "grid within grid" positioning calculations
- Simplified component APIs

---

## Architecture

### Component Hierarchy

```
MastMain (root grid container)
  └── LayoutSection (subgrid, 12 rows)
       └── LayoutGridItem (positioned on inherited grid lines)
            └── Your Content
```

### CSS Utilities

The system provides three core CSS utilities (defined in `app/assets/css/layout/grids.css`):

1. **`mastmain`** - Root grid container
2. **`basesection`** - Full-viewport section using subgrid
3. **`prose-rhythm`** - Typography vertical rhythm utilities

---

## Core Concepts

### 1. Responsive Grid Density

The grid adapts its column count based on viewport width:

| Breakpoint | Width | Columns | CSS Variable |
|------------|-------|---------|--------------|
| Mobile     | < 768px | 6 | `--grid-cols: 6` |
| Tablet     | ≥ 768px | 12 | `--grid-cols: 12` |
| Desktop    | ≥ 1280px | 18 | `--grid-cols: 18` |

**Breakpoints** are defined in `grids.css`:
- Tablet: `48rem` (768px)
- Desktop: `80rem` (1280px)

### 2. Vertical Grid (12 Rows)

Each section spans **12 rows** that together fill **100vh**:

```css
--grid-rows-per-section: 12;
--section-height: 100vh;
--grid-row-height: calc(
  (var(--section-height) - (var(--grid-rows-per-section) - 1) * var(--grid-gap)) /
    var(--grid-rows-per-section)
);
```

On mobile (`width < 48rem`), sections grow beyond 12 rows if content requires it.

### 3. Gap & Padding

- **Gap between columns/rows**: `clamp(0.75rem, 1.5vw, 1.5rem)` (12px → 24px)
- **Outer padding (gutters)**: `clamp(1rem, 2.5vw, 2rem)` (16px → 32px)

These are responsive and scale smoothly with viewport size.

### 4. Baseline Rhythm

Typography and spacing snap to a **0.25rem (4px)** baseline grid:

```css
--rhythm: 0.25rem;
```

Utilities:
- `leading-rhythm-4` through `leading-rhythm-8` (line-height)
- `space-rhythm-1` through `space-rhythm-8` (margin-block)
- `prose-rhythm` (auto-apply rhythm to prose content)

### 5. Layering System

Four semantic z-index layers defined in `app.config.ts`:

```ts
layers: {
  back: 0,     // Background images, decorative elements
  mid: 10,     // Default content layer
  front: 20,   // Overlays, modals
  top: 30,     // Tooltips, dropdowns
}
```

Use via `layer` prop on `<LayoutGridItem>`.

---

## Components Reference

### `<LayoutSection>`

**File**: `app/components/Layout/Section/index.vue`

Full-viewport section using CSS subgrid. Inherits parent grid lines.

**Props**:
- `fullHeight?: boolean` - Force `min-h-svh` (default: `false`)
- `fullWidth?: boolean` - Break outside grid gutters for edge-to-edge content (default: `false`)

**CSS Utility**: `basesection`

**Usage**:
```vue
<LayoutSection full-height>
  <LayoutGridItem>Content</LayoutGridItem>
</LayoutSection>

<!-- Full-bleed section (breaks outside grid padding) -->
<LayoutSection full-width>
  <div class="bg-black text-white p-8">
    Edge-to-edge content with no gutters
  </div>
</LayoutSection>
```

---

### `<LayoutGridItem>`

**File**: `app/components/Layout/Grid/Item.vue`

Positions content on the parent section's grid using `grid-column` and `grid-row`.

**Props**:

| Prop | Type | Description |
|------|------|-------------|
| `as` | `string` | HTML element (default: `'div'`) |
| `preset` | `string` | Named preset: `'hero'`, `'centered'`, `'fullWidth'`, `'sidebar'`, `'content'` |
| `colStart` | `number \| ResponsiveValue<number>` | Starting column (1-18) |
| `colSpan` | `number \| ResponsiveValue<number>` | Columns to span (default: 1) |
| `rowStart` | `number \| ResponsiveValue<number>` | Starting row (1-12) |
| `rowSpan` | `number \| ResponsiveValue<number>` | Rows to span (default: 1) |
| `align` | `'start' \| 'center' \| 'end' \| 'stretch'` | Vertical alignment |
| `justify` | `'start' \| 'center' \| 'end' \| 'stretch'` | Horizontal alignment |
| `z` | `number` | Explicit z-index |
| `layer` | `'back' \| 'mid' \| 'front' \| 'top'` | Semantic layer |
| `bleed` | `'left' \| 'right' \| 'both'` | Edge bleed (ignores padding) |
| `aspect` | `'1/1' \| '4/3' \| '16/9'` etc. | Aspect ratio |

**ResponsiveValue Type**:
```ts
interface ResponsiveValue<T> {
  default: T
  md?: T
  lg?: T
}
```

**Examples**:
```vue
<!-- Using preset -->
<LayoutGridItem preset="hero">
  <h1>Hero Content</h1>
</LayoutGridItem>

<!-- Responsive positioning -->
<LayoutGridItem
  :col-start="{ default: 1, md: 2, lg: 4 }"
  :col-span="{ default: 6, md: 10, lg: 12 }"
  align="center"
  layer="front"
>
  Content
</LayoutGridItem>

<!-- Full-bleed background -->
<LayoutGridItem bleed="both" layer="back">
  <NuxtImg src="/bg.jpg" class="size-full object-cover" />
</LayoutGridItem>
```

---

### `<LayoutGridDebug>`

**File**: `app/components/Layout/Grid/Debug.vue`

Visual grid overlay for development. Toggle with **Cmd+G** (Mac) or **Ctrl+G** (Windows/Linux).

**Props**:
- `gap?: string` - Gap between columns (default: `clamp(0.75rem, 1.5vw, 1.5rem)`)
- `color?: string` - Overlay color (default: `rgba(255, 0, 0, 0.1)`)

**Usage**:
```vue
<LayoutGridDebug />
```

Automatically adapts to responsive grid density (6/12/18 columns).

---

### `<LayoutSectionHero>`

**File**: `app/components/Layout/Section/Hero.vue`

Pre-configured hero section with slots for background, main content, and footer.

**Props**:
- `fullHeight?: boolean` - Force `100svh` (default: `true`)

**Slots**:
- `background` - Full-bleed background layer (z: 0)
- `default` - Centered content (z: 10)
- `footer` - Bottom-aligned content (z: 10)

**Example**:
```vue
<LayoutSectionHero>
  <template #background>
    <NuxtImg src="/hero.jpg" class="size-full object-cover" />
  </template>

  <h1>Welcome</h1>
  <p>Subtitle text</p>

  <template #footer>
    <UButton to="/get-started">Get Started</UButton>
  </template>
</LayoutSectionHero>
```

---

### `<PageContainer>`

**File**: `app/components/Layout/Page/Container.vue`

Unified page wrapper integrating Swiss Grid or Nuxt UI's `<UPage>` layout.

**Props**:
- `title: string` - Page title (required, sets `<title>` and header)
- `description?: string` - Meta description for SEO
- `showHeader?: boolean` - Show visible page header (default: `true`)
- `headerPreset?: string` - Grid preset for header (default: `'centered'`)
- `layout?: 'grid' | 'upage'` - Layout mode (default: `'grid'`)

**Example**:
```vue
<PageContainer
  title="About Us"
  description="Learn about our company"
  header-preset="hero"
>
  <LayoutSection>
    <LayoutGridItem preset="centered">
      <p>Page content</p>
    </LayoutGridItem>
  </LayoutSection>
</PageContainer>
```

---

## Configuration & Customization

### App Config (`app.config.ts`)

The grid system is fully configurable via `app.config.ts`:

```ts
export default defineAppConfig({
  layoutLayer: {
    ui: {
      grid: {
        // Core settings
        columns: { default: 6, md: 12, lg: 18 },
        rowsPerSection: 12,
        rhythm: '0.25rem',

        // Z-index layers
        layers: {
          back: 0,
          mid: 10,
          front: 20,
          top: 30,
        },

        // Preset layouts
        presets: {
          hero: {
            colStart: { default: 1, md: 2, lg: 4 },
            colSpan: { default: 6, md: 10, lg: 12 },
            rowSpan: 12,
          },
          centered: {
            colStart: { default: 1, md: 2, lg: 5 },
            colSpan: { default: 6, md: 10, lg: 10 },
            rowSpan: 12,
          },
          fullWidth: {
            colStart: 1,
            colSpan: { default: 6, md: 12, lg: 18 },
          },
          sidebar: {
            colStart: { default: 1, md: 1, lg: 1 },
            colSpan: { default: 6, md: 4, lg: 4 },
          },
          content: {
            colStart: { default: 1, md: 5, lg: 5 },
            colSpan: { default: 6, md: 8, lg: 14 },
          },
        },
      },
    },
  },
})
```

### Type Definitions (`app/types/layouts.ts`)

```ts
export interface ResponsiveValue<T> {
  default: T
  sm?: T
  md?: T
  lg?: T
  xl?: T
}

export interface GridLayers {
  back: number
  mid: number
  front: number
  top: number
}

export interface GridPresetsItem {
  colStart: number | ResponsiveValue<number>
  colSpan: number | ResponsiveValue<number>
  rowStart?: number | ResponsiveValue<number>
  rowSpan?: number
}

export interface GridConfig {
  columns: ResponsiveValue<number>
  rowsPerSection: number
  rhythm: string
  layers: GridLayers
  presets: GridPresets
}
```

---

## Using with Nuxt Layers

### Extending the Layer

In your consuming Nuxt project:

**1. Install the layer:**
```bash
npm install @your-org/ui-layout-layer
```

**2. Extend in `nuxt.config.ts`:**
```ts
export default defineNuxtConfig({
  extends: ['@your-org/ui-layout-layer'],
})
```

**3. (Optional) Override grid configuration:**

Create your own `app.config.ts`:

```ts
export default defineAppConfig({
  layoutLayer: {
    ui: {
      grid: {
        // Override columns
        columns: { default: 4, md: 8, lg: 12 },

        // Add custom presets
        presets: {
          ...useAppConfig().layoutLayer?.ui?.grid?.presets,
          myCustomPreset: {
            colStart: { default: 1, md: 3, lg: 5 },
            colSpan: { default: 4, md: 6, lg: 8 },
          },
        },
      },
    },
  },
})
```

### Using Components in Your Project

Components are auto-imported via Nuxt's component discovery:

```vue
<template>
  <LayoutSection>
    <LayoutGridItem preset="hero">
      <h1>My Page</h1>
    </LayoutGridItem>
  </LayoutSection>
</template>
```

### Creating Custom Layout Components

Extend the base components in your project:

```vue
<!-- ~/components/MyCustomSection.vue -->
<template>
  <LayoutSection full-height>
    <LayoutGridItem bleed="both" layer="back">
      <div class="gradient-background" />
    </LayoutGridItem>

    <LayoutGridItem preset="centered">
      <slot />
    </LayoutGridItem>
  </LayoutSection>
</template>
```

### Root Layout Setup

In your project's `app.vue` or layout file, ensure the root grid is initialized:

```vue
<template>
  <div class="mastmain">
    <NuxtPage />
  </div>
</template>

<style>
/* Import layer CSS */
@import '@your-org/ui-layout-layer/app/assets/css/main.css';
</style>
```

Or use auto-import via `nuxt.config.ts`:

```ts
export default defineNuxtConfig({
  css: ['@your-org/ui-layout-layer/app/assets/css/main.css'],
})
```

---

## Examples

### Example 1: Simple Centered Page

```vue
<template>
  <PageContainer title="About" description="About our company">
    <LayoutSection>
      <LayoutGridItem preset="centered">
        <h1>About Us</h1>
        <p>We build great products.</p>
      </LayoutGridItem>
    </LayoutSection>
  </PageContainer>
</template>
```

---

### Example 2: Hero Section with Background

```vue
<template>
  <LayoutSectionHero>
    <template #background>
      <NuxtImg
        src="/hero-bg.jpg"
        class="size-full object-cover"
        alt=""
      />
    </template>

    <div class="text-center">
      <h1 class="text-5xl font-bold">Welcome to Our Site</h1>
      <p class="text-xl mt-4">Building the future, one line at a time</p>
    </div>

    <template #footer>
      <UButton size="xl" to="/signup">Get Started</UButton>
    </template>
  </LayoutSectionHero>
</template>
```

---

### Example 3: Two-Column Layout

```vue
<template>
  <LayoutSection>
    <!-- Sidebar -->
    <LayoutGridItem
      :col-start="{ default: 1, md: 1, lg: 1 }"
      :col-span="{ default: 6, md: 4, lg: 5 }"
      :row-span="12"
    >
      <aside>
        <nav>Navigation items</nav>
      </aside>
    </LayoutGridItem>

    <!-- Main content -->
    <LayoutGridItem
      :col-start="{ default: 1, md: 5, lg: 6 }"
      :col-span="{ default: 6, md: 8, lg: 13 }"
      :row-span="12"
    >
      <main>
        <h1>Main Content</h1>
        <p>Article text...</p>
      </main>
    </LayoutGridItem>
  </LayoutSection>
</template>
```

---

### Example 4: Gallery with Overlapping Items

```vue
<template>
  <LayoutSection>
    <!-- Background image -->
    <LayoutGridItem
      :col-start="1"
      :col-span="{ default: 6, md: 8, lg: 10 }"
      :row-start="2"
      :row-span="6"
      layer="back"
    >
      <NuxtImg src="/image1.jpg" class="size-full object-cover" />
    </LayoutGridItem>

    <!-- Overlapping foreground image -->
    <LayoutGridItem
      :col-start="{ default: 3, md: 7, lg: 9 }"
      :col-span="{ default: 4, md: 6, lg: 8 }"
      :row-start="5"
      :row-span="6"
      layer="front"
    >
      <NuxtImg src="/image2.jpg" class="size-full object-cover shadow-xl" />
    </LayoutGridItem>

    <!-- Text overlay -->
    <LayoutGridItem
      :col-start="{ default: 2, md: 3, lg: 4 }"
      :col-span="{ default: 4, md: 5, lg: 6 }"
      :row-start="8"
      :row-span="3"
      layer="top"
      align="center"
    >
      <div class="bg-white p-6">
        <h2>Featured Work</h2>
      </div>
    </LayoutGridItem>
  </LayoutSection>
</template>
```

---

### Example 5: Using Presets with Overrides

```vue
<template>
  <LayoutSection>
    <!-- Use preset but override row position -->
    <LayoutGridItem
      preset="hero"
      :row-start="3"
      :row-span="8"
    >
      <h1>Custom positioned hero content</h1>
    </LayoutGridItem>
  </LayoutSection>
</template>
```

---

## Best Practices

### 1. Always Use ResponsiveValue for Positioning

Instead of hardcoding values, use responsive objects:

```vue
<!-- ❌ Don't -->
<LayoutGridItem :col-start="2" :col-span="10">

<!-- ✅ Do -->
<LayoutGridItem
  :col-start="{ default: 1, md: 2, lg: 4 }"
  :col-span="{ default: 6, md: 10, lg: 12 }"
>
```

### 2. Leverage Presets for Consistency

Define common layouts as presets in `app.config.ts`:

```ts
presets: {
  articleHeader: {
    colStart: { default: 1, md: 3, lg: 5 },
    colSpan: { default: 6, md: 8, lg: 10 },
    rowStart: 2,
    rowSpan: 3,
  },
}
```

Then use:
```vue
<LayoutGridItem preset="articleHeader">
```

### 3. Use Semantic Layer Names

Instead of manual z-index values:

```vue
<!-- ❌ Don't -->
<LayoutGridItem :z="5">

<!-- ✅ Do -->
<LayoutGridItem layer="back">
```

### 4. Bleed Only When Necessary

Full-bleed is great for backgrounds but should be used sparingly for content:

```vue
<!-- Background image: full bleed -->
<LayoutGridItem bleed="both" layer="back">
  <img src="/bg.jpg" />
</LayoutGridItem>

<!-- Content: respect grid gutters -->
<LayoutGridItem preset="centered">
  <p>Readable content</p>
</LayoutGridItem>
```

### 5. Enable Grid Debug During Development

Add to your layout:

```vue
<template>
  <div class="mastmain">
    <NuxtPage />
    <LayoutGridDebug v-if="isDev" />
  </div>
</template>

<script setup>
const isDev = process.dev
</script>
```

Or use Cmd/Ctrl+G to toggle dynamically.

### 6. Maintain Vertical Rhythm in Typography

Use rhythm utilities for consistent spacing:

```vue
<div class="prose-rhythm">
  <h1>Heading</h1>
  <p>Paragraph with automatic rhythm spacing.</p>
  <p>Another paragraph.</p>
</div>
```

### 7. Container Queries for Component-Level Responsiveness

`LayoutGridItem` includes `@container` support:

```vue
<LayoutGridItem preset="sidebar">
  <div class="@container/item">
    <p class="text-sm @lg:text-base">Responsive to grid item width</p>
  </div>
</LayoutGridItem>
```

### 8. Mobile-First Responsive Values

Always provide `default` (mobile) values first:

```ts
// ✅ Mobile-first
colStart: { default: 1, md: 3, lg: 5 }

// ❌ Missing default
colStart: { md: 3, lg: 5 } // Will error
```

### 9. Avoid Deep Nesting

The grid is flat by design. Avoid nesting `<LayoutSection>` inside `<LayoutGridItem>`:

```vue
<!-- ❌ Don't nest sections -->
<LayoutSection>
  <LayoutGridItem>
    <LayoutSection>...</LayoutSection>
  </LayoutGridItem>
</LayoutSection>

<!-- ✅ Use sibling sections -->
<LayoutSection>...</LayoutSection>
<LayoutSection>...</LayoutSection>
```

### 10. Test Across Breakpoints

Always test your layouts at:
- Mobile: < 768px (6 columns)
- Tablet: 768px - 1279px (12 columns)
- Desktop: ≥ 1280px (18 columns)

Use responsive design mode in browser DevTools or the grid debug overlay.

---

## Composables

### `useGridConfig()`

**File**: `app/composables/useGridConfig.ts`

Access grid configuration from `app.config.ts`:

```ts
const { config, getPreset, layers } = useGridConfig()

const heroPreset = getPreset('hero')
// { colStart: { default: 1, md: 2, lg: 4 }, ... }

const allLayers = layers.value
// { back: 0, mid: 10, front: 20, top: 30 }
```

**Returns**:
- `config` - Computed full grid config
- `getPreset(name: string)` - Get preset by name
- `layers` - Computed z-index layer values

---

## Tailwind Configuration

The layer includes a `tailwind.config.js` with safelist patterns for dynamic grid classes:

```js
safelist: [
  {
    pattern: /^(md|lg):(col|row)-(start|span)-[0-9]+$/,
  },
],
```

This ensures responsive grid utility classes are always generated, even when used with dynamic values.

---

## Browser Support

- **CSS Grid**: All modern browsers
- **CSS Subgrid**: Chrome 117+, Safari 16+, Firefox 71+
- **Container Queries**: Chrome 105+, Safari 16+, Firefox 110+

For older browsers, consider:
- Progressive enhancement (grid gracefully degrades)
- Polyfills (e.g., `css-grid-polyfill` for IE11)
- Feature detection (`@supports (grid-template-columns: subgrid)`)

---

## Troubleshooting

### Grid Items Not Aligning

**Problem**: Items don't align to grid lines.

**Solution**: Ensure parent has `mastmain` or `basesection` utility class:
```vue
<div class="mastmain">
  <LayoutSection>...</LayoutSection>
</div>
```

### Responsive Values Not Working

**Problem**: `md:` or `lg:` classes not applying.

**Solution**: Check Tailwind safelist includes grid patterns (see `tailwind.config.js`).

### Section Not Full Height

**Problem**: Section doesn't fill viewport.

**Solution**: Use `full-height` prop:
```vue
<LayoutSection full-height>
```

### Grid Overflow on Mobile

**Problem**: Content overflows horizontally on mobile.

**Solution**: Ensure all `<LayoutGridItem>` have mobile-friendly `colSpan`:
```vue
<LayoutGridItem :col-span="{ default: 6, md: 10, lg: 12 }">
```

### Preset Not Found

**Problem**: `getPreset('myPreset')` returns `undefined`.

**Solution**: Verify preset exists in `app.config.ts`:
```ts
presets: {
  myPreset: { ... }
}
```

---

## Advanced Customization

### Custom Breakpoints

Override breakpoints by extending the CSS:

```css
/* Your project's CSS */
@import '@your-org/ui-layout-layer/app/assets/css/main.css';

@utility mastmain {
  /* Override tablet breakpoint to 64rem (1024px) */
  @media (width >= 64rem) {
    :root {
      --grid-cols: 12;
    }
  }
}
```

### Dynamic Grid Configuration

Use runtime config to dynamically adjust grid:

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  runtimeConfig: {
    public: {
      gridColumns: {
        default: 6,
        md: 12,
        lg: 18,
      },
    },
  },
})
```

Access in component:
```ts
const config = useRuntimeConfig()
const columns = config.public.gridColumns
```

### Adding New Presets Programmatically

```ts
// composables/useCustomPresets.ts
export function useCustomPresets() {
  const { config } = useGridConfig()

  const addPreset = (name: string, preset: GridPresetsItem) => {
    if (config.value) {
      config.value.presets[name] = preset
    }
  }

  return { addPreset }
}
```

---

## Resources

- [CSS Subgrid on MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_grid_layout/Subgrid)
- [Container Queries Guide](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_containment/Container_queries)
- [Josef Müller-Brockmann Grid Systems](https://www.amazon.com/Grid-Systems-Graphic-Design-Communication/dp/3721201450)
- [Nuxt Layers Documentation](https://nuxt.com/docs/getting-started/layers)
- [Tailwind CSS Grid Documentation](https://tailwindcss.com/docs/grid-template-columns)

---

## Contributing

When contributing to the grid system:

1. Maintain backwards compatibility
2. Document all new presets in `app.config.ts`
3. Update types in `app/types/layouts.ts`
4. Add examples to this documentation
5. Test across all breakpoints (6/12/18 columns)
6. Ensure mobile-first responsive design

---

## License

This layer is part of the Nuxt UI ecosystem. Refer to the project's LICENSE file for details.
