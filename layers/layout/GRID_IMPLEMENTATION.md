# Swiss Grid — Implementation Guide

Step-by-step guide to implementing the Swiss Grid system in a new or existing Nuxt project.

---

## 1. Setup

### Install / extend the layer

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  extends: ['../layers/layout'],  // or npm package path
})
```

The layer auto-imports its CSS, components, and composables. No additional setup required.

---

## 2. Structure every page with `<LayoutPage>`

`LayoutPage` is a **fragment component** (no wrapper element) that sits inside the default layout's `MastMain`. It handles:
- SEO (`useHead`) with title + OG tags
- Provides the page title to children via `provide`
- Optional visible page header block

```vue
<!-- pages/about.vue -->
<template>
  <LayoutPage title="About" description="Learn about us">
    <!-- sections go here -->
  </LayoutPage>
</template>
```

> **Architecture note:** The `mastmain` grid root is on `MastMain` in the default layout, not on `LayoutPage`. `LayoutPage` must not add its own `mastmain` wrapper — nesting two `mastmain` elements breaks subgrid alignment. `LayoutGridDebug` is also owned by the default layout.

---

## 3. Divide pages into sections with `<LayoutSection>`

Each `LayoutSection` spans the full 18 columns and 12 rows (one viewport height). It uses CSS subgrid to inherit the parent grid lines from `mastmain`.

```vue
<LayoutPage title="Home">
  <LayoutSection>           <!-- first viewport: hero -->
    <!-- ... -->
  </LayoutSection>

  <LayoutSection>           <!-- second viewport: content -->
    <!-- ... -->
  </LayoutSection>
</LayoutPage>
```

**Props:**
- `full-height` — forces `min-height: 100svh` (useful for short content sections)
- `full-width` — breaks out of the grid gutters for edge-to-edge content

---

## 4. Position content with `<LayoutGridItem>`

Inside a `LayoutSection`, use `LayoutGridItem` to place content on specific columns and rows.

### Using a preset (recommended)

```vue
<LayoutSection>
  <LayoutGridItem preset="centered">
    <h1>Centered content</h1>
    <p>Spans columns 5–14 on desktop</p>
  </LayoutGridItem>
</LayoutSection>
```

**Available presets:**

| Preset | Mobile | Tablet | Desktop | Use for |
|---|---|---|---|---|
| `hero` | cols 1–6 | cols 2–11 | cols 4–15 | Hero headlines |
| `centered` | cols 1–6 | cols 2–11 | cols 5–14 | Article content |
| `fullWidth` | cols 1–6 | cols 1–12 | cols 1–18 | Full-bleed elements |
| `sidebar` | cols 1–6 | cols 1–4 | cols 1–4 | Navigation sidebars |
| `content` | cols 1–6 | cols 5–12 | cols 5–18 | Main content next to sidebar |
| `splitLeft` | cols 1–6 | cols 1–6 | cols 1–9 | Left of 50/50 split |
| `splitRight` | cols 1–6 | cols 7–12 | cols 10–18 | Right of 50/50 split |
| `quarterLeft` | cols 1–6 | cols 1–3 | cols 1–5 | 25% left panel |
| `threeQuarterRight` | cols 1–6 | cols 4–12 | cols 6–18 | 75% right content |

### Custom responsive positioning

When presets don't match your needs:

```vue
<LayoutGridItem
  :col-start="{ default: 1, md: 3, lg: 5 }"
  :col-span="{ default: 6, md: 8, lg: 10 }"
  :row-start="2"
  :row-span="8"
  align="center"
>
  <p>Custom positioning</p>
</LayoutGridItem>
```

`ResponsiveValue<T>` accepts `{ default, md, lg }` — matching the grid's breakpoints (mobile < 768px, tablet ≥ 768px, desktop ≥ 1280px).

---

## 5. Layering content (z-index)

Use the `layer` prop instead of raw z-index numbers:

```vue
<LayoutSection>
  <!-- Background: renders behind everything -->
  <LayoutGridItem preset="fullWidth" layer="back">
    <NuxtImg src="/bg.jpg" class="size-full object-cover" />
  </LayoutGridItem>

  <!-- Content: default mid-layer -->
  <LayoutGridItem preset="centered" layer="mid">
    <h1>Readable over the background</h1>
  </LayoutGridItem>

  <!-- Overlay badge: renders on top -->
  <LayoutGridItem
    :col-start="{ default: 5, lg: 14 }"
    :col-span="{ default: 2, lg: 3 }"
    :row-start="1"
    :row-span="2"
    layer="front"
  >
    <span class="badge">New</span>
  </LayoutGridItem>
</LayoutSection>
```

| Layer | z-index | Use for |
|---|---|---|
| `back` | 0 | Background images, decorative shapes |
| `mid` | 10 | Default text and content (default) |
| `front` | 20 | Overlapping cards, callouts |
| `top` | 30 | Tooltips, dropdowns, notifications |

---

## 6. Pre-built section layouts

For common patterns, use the pre-configured section components instead of building from scratch.

### Hero section

```vue
<LayoutSectionHero>
  <template #background>
    <NuxtImg src="/hero.jpg" class="size-full object-cover" />
  </template>

  <h1 class="text-6xl font-bold">Page Headline</h1>
  <p class="text-xl mt-4">Supporting copy goes here</p>

  <template #footer>
    <div class="flex gap-4">
      <UButton size="xl" to="/start">Get Started</UButton>
      <UButton size="xl" variant="ghost">Learn More</UButton>
    </div>
  </template>
</LayoutSectionHero>
```

### 50/50 split

```vue
<LayoutSectionSplit>
  <template #left>
    <NuxtImg src="/product.jpg" class="size-full object-cover" />
  </template>
  <template #right>
    <div class="p-12">
      <h2>Product Name</h2>
      <p>Description text</p>
    </div>
  </template>
</LayoutSectionSplit>
```

Add `:reverse="true"` to swap the stacking order on mobile.

### Gallery / collection grid

```vue
<LayoutSectionGallery :items="projects" :columns="3">
  <template #item="{ item }">
    <NuxtLink :to="`/projects/${item.slug}`" class="block size-full">
      <NuxtImg :src="item.image" class="size-full object-cover" />
    </NuxtLink>
  </template>
</LayoutSectionGallery>
```

---

## 7. Full page example

```vue
<!-- pages/index.vue -->
<template>
  <LayoutPage title="Home" description="Welcome to our site">
    <!-- Section 1: Hero -->
    <LayoutSectionHero>
      <template #background>
        <NuxtImg src="/hero-bg.jpg" class="size-full object-cover" />
        <div class="absolute inset-0 bg-black/40" />
      </template>

      <div class="text-center text-white">
        <h1 class="text-6xl font-bold mb-4">Hello World</h1>
        <p class="text-2xl opacity-80">Build something great</p>
      </div>

      <template #footer>
        <UButton size="xl" to="/about" color="white">Learn More</UButton>
      </template>
    </LayoutSectionHero>

    <!-- Section 2: Intro text -->
    <LayoutSection full-height>
      <LayoutGridItem preset="centered" align="center">
        <div class="prose-rhythm">
          <h2>Our Story</h2>
          <p>We've been building for years...</p>
        </div>
      </LayoutGridItem>
    </LayoutSection>

    <!-- Section 3: Feature split -->
    <LayoutSectionSplit>
      <template #left>
        <NuxtImg src="/feature.jpg" class="size-full object-cover" />
      </template>
      <template #right>
        <div class="flex items-center justify-center size-full p-12">
          <div>
            <h2 class="text-4xl font-bold mb-4">Key Feature</h2>
            <p>Explanation of the feature...</p>
            <UButton class="mt-6" to="/features">See More</UButton>
          </div>
        </div>
      </template>
    </LayoutSectionSplit>

    <!-- Section 4: Work grid -->
    <LayoutSection>
      <LayoutGridItem preset="fullWidth">
        <LayoutSectionGallery :items="work" :columns="3">
          <template #item="{ item }">
            <div :class="item.color" class="size-full" />
          </template>
        </LayoutSectionGallery>
      </LayoutGridItem>
    </LayoutSection>
  </LayoutPage>
</template>
```

---

## 8. Using `UPage` components inside the grid

The layout layer configures Nuxt UI's `UPage` to participate as a subgrid member. Use it when you want the Nuxt UI sidebar/content layout to align with the 18-column grid.

```vue
<LayoutPage title="Documentation">
  <LayoutSection>
    <!-- UPage slots map to grid columns: left=1–4, center=5–14, right=15–18 -->
    <UPage>
      <template #left>
        <UPageAside>
          <nav>
            <!-- sidebar navigation -->
          </nav>
        </UPageAside>
      </template>

      <UPageBody>
        <ContentRenderer :value="page" />
      </UPageBody>

      <template #right>
        <UContentToc :links="page.body.toc.links" />
      </template>
    </UPage>
  </LayoutSection>
</LayoutPage>
```

---

## 9. Adding a visible page header

Pass `:show-header="true"` to `LayoutPage` to render an automatic title + description block using the `centered` preset:

```vue
<LayoutPage
  title="About Us"
  description="Learn about our team and mission"
  :show-header="true"
>
  <LayoutSection>
    <LayoutGridItem preset="centered">
      <p>Content below the auto-generated header</p>
    </LayoutGridItem>
  </LayoutSection>
</LayoutPage>
```

---

## 10. Disabling the grid (feature flag)

Set `layoutLayer.ui.grid.enabled = false` in your `app.config.ts` to opt out of the Swiss Grid. `LayoutPage` falls back to a standard `UMain > UPage > UPageBody` structure.

```ts
// app.config.ts
export default defineAppConfig({
  layoutLayer: {
    ui: {
      grid: {
        enabled: false,
      },
    },
  },
})
```

When disabled, `LayoutSection` / `LayoutGridItem` can still be used independently — the feature flag only controls what `LayoutPage` renders as its outer wrapper.

---

## 11. Customising the grid

Override any config value in your `app.config.ts`. The layer's defaults are deep-merged, so you only need to specify the values you want to change.

### Change column density

```ts
export default defineAppConfig({
  layoutLayer: {
    ui: {
      grid: {
        columns: { default: 4, md: 8, lg: 12 },  // 12-column instead of 18
      },
    },
  },
})
```

### Add a custom preset

```ts
export default defineAppConfig({
  layoutLayer: {
    ui: {
      grid: {
        presets: {
          // Existing presets are merged, not replaced
          editorial: {
            colStart: { default: 1, md: 3, lg: 4 },
            colSpan: { default: 6, md: 8, lg: 9 },
          },
          wideContent: {
            colStart: { default: 1, md: 2, lg: 3 },
            colSpan: { default: 6, md: 10, lg: 14 },
          },
        },
      },
    },
  },
})
```

### Access config in a component

```ts
const { config, getPreset, isEnabled } = useGridConfig()

// Get a preset by name
const heroLayout = getPreset('hero')

// Check if grid is enabled
if (isEnabled.value) {
  // swiss grid is active
}
```

---

## 12. Debug tools

`LayoutGridDebug` is included in `LayoutPage` automatically. It renders a visual overlay of all columns.

**Keyboard shortcut:** `Cmd+G` (macOS) or `Ctrl+G` (Windows/Linux)

To use it standalone (outside of `LayoutPage`):

```vue
<LayoutGridDebug
  color="rgba(0, 100, 255, 0.1)"
  gap="clamp(0.75rem, 1.5vw, 1.5rem)"
/>
```

---

## Quick reference

```
LayoutPage              — root page wrapper (SEO + grid root + debug)
  └─ LayoutSection      — full-viewport section (subgrid, 12 rows)
       └─ LayoutGridItem — positioned content (cols + rows + layer)

LayoutSectionHero       — pre-built hero (background / content / footer slots)
LayoutSectionSplit      — pre-built 50/50 split (#left + #right slots)
LayoutSectionGallery    — pre-built auto-placing collection grid

useGridConfig()         — access grid config + isEnabled + getPreset()
```
