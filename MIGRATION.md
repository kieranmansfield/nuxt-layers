# Migration Guide: v1.5.x → v1.6.0

v1.6.0 restructures the layout and content systems. The main theme is **opt-in chrome** — header, footer, and nav are no longer always-on, full-bleed pages now use `layout: false`, and the global Locomotive Scroll wrapper is gone.

---

## Breaking Changes

### 1. `grid.vue` layout now requires explicit props for header/footer

Header and footer are no longer rendered by default. Pages that relied on `layout: 'grid'` to get them must now pass props.

**Before (v1.5.x):**
```ts
definePageMeta({ layout: 'grid' })
// header + footer always rendered
```

**After (v1.6.0):**
```ts
// Opt-in to header and footer:
definePageMeta({
  layout: { name: 'grid', props: { showHeader: true, showFooter: true } },
})

// No chrome needed (content-only page):
definePageMeta({ layout: 'grid' })

// Full-bleed pages (no mastmain grid at all):
definePageMeta({ layout: false })
```

Available props on `grid.vue` (all `boolean`, default `false`):

| Prop | Description |
|---|---|
| `showHeader` | Renders `<MastHeader>` |
| `showNav` | Renders `<MastNav>` |
| `showFooter` | Renders `<MastFooter>` |
| `showGridDebug` | Renders `<LayoutGridDebug>` overlay |

---

### 2. `MastScroller` removed

The global Locomotive Scroll wrapper in `default.vue` has been removed. Smooth scroll is now per-page via the `useSmoothScroll()` composable.

**Before (v1.5.x):**
```vue
<!-- default.vue automatically wrapped everything in MastScroller -->
<!-- No per-page setup required -->
```

**After (v1.6.0):**
```ts
// In any page that needs smooth scroll:
const { scrollTo, scrollToTop, velocity, progress } = useSmoothScroll()
```

Pages that don't call `useSmoothScroll()` will use native browser scroll — no behaviour change for those pages.

---

### 3. `LayoutPageContainer` deprecated → use `LayoutPage`

`LayoutPageContainer` has been superseded by `LayoutPage`. The legacy component still exists for backwards compatibility but is no longer maintained.

**Before (v1.5.x):**
```vue
<LayoutPageContainer title="My Page" :show-header="false">
  <LayoutSection>...</LayoutSection>
</LayoutPageContainer>
```

**After (v1.6.0):**
```vue
<LayoutPage title="My Page">
  <LayoutSection>...</LayoutSection>
</LayoutPage>
```

**Key difference:** `LayoutPage` defaults `showHeader` to `false`. If you need the page header block, pass it explicitly:

```vue
<LayoutPage title="My Page" :show-header="true">
  ...
</LayoutPage>
```

---

### 4. Full-bleed / animation pages must use `layout: false`

Pages with custom full-screen sections (WebGL canvases, GSAP hero animations, horizontal scroll tracks) must opt out of `LayoutMain` entirely. Using `layout: 'grid'` constrains them to a single `1fr` column which breaks full-width layouts.

```ts
// Full-bleed or animation-heavy page:
definePageMeta({ layout: false })

// With SSR disabled (e.g. WebGL):
definePageMeta({ ssr: false, layout: false })
```

**Rule of thumb:**

- Page uses `LayoutSection` + `LayoutGridItem`? → `layout: 'grid'` (with props as needed)
- Page uses custom full-width `<div>`/`<section>` elements? → `layout: false`

---

### 5. Content composables: `useContentData` replaces bare `useAsyncData`

All built-in content composables now use `useContentData` — a `createUseAsyncData` wrapper with `dedupe: 'cancel'` — instead of calling `useAsyncData` directly. If you've extended or wrapped any content composables, update the inner call:

**Before (v1.5.x):**
```ts
return useAsyncData('my-key', () => queryCollection('blog').all())
```

**After (v1.6.0):**
```ts
return useContentData('my-key', () => queryCollection('blog').all())
```

`useContentData` is exported from the content layer and available as a Nuxt auto-import. The API is identical to `useAsyncData`.

---

### 6. `payloadExtraction: 'client'` (nuxt.config.ts)

Add this experimental flag to your app's `nuxt.config.ts` if you use content collections or data-heavy pages. It moves payload extraction to the client, reducing SSR bundle size for content-driven routes.

```ts
export default defineNuxtConfig({
  experimental: {
    payloadExtraction: 'client',
  },
})
```

---

## Non-Breaking Additions

- **`MastNav` component** — renders `<nav><slot /></nav>`. Enable via `showNav: true` on the `grid.vue` layout.
- **`showGridDebug` prop** — `LayoutGridDebug` is now controlled by the `showGridDebug` prop on `grid.vue` instead of always rendering.

---

## Quick Reference

| Pattern | v1.5.x | v1.6.0 |
|---|---|---|
| Grid page with header + footer | `layout: 'grid'` | `layout: { name: 'grid', props: { showHeader: true, showFooter: true } }` |
| Grid page, no chrome | `layout: 'grid'` | `layout: 'grid'` |
| Full-bleed / animation page | `layout: 'grid'` (broken) | `layout: false` |
| Page wrapper component | `<LayoutPageContainer>` | `<LayoutPage>` |
| Global smooth scroll | `MastScroller` in layout (auto) | `useSmoothScroll()` per-page |
| Content async data | `useAsyncData(...)` | `useContentData(...)` |
