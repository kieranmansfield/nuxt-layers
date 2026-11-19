# Migration Guide — v6.2.x → v6.3.0

**Audience:** an AI coding agent (or developer) updating a downstream Nuxt app that consumes these
layers.
**What changed:** the 2026-10 atomic design audit — components moved to the right level, tokens
moved into `core`, motion respects reduced motion, modals use `UModal`, and organisms no longer set
page meta.

Work top to bottom. Each change has a **Detect** step (how to tell whether it applies) and an
**Apply** step. Skip anything Detect doesn't find. Run the **Verify** checklist before declaring
done. An app component with the same name as a layer component overrides it, so a change to a layer
component you've already overridden doesn't apply to you.

## 0. Preconditions

- Update the package to `^6.3.0` and reinstall.
- Run `npx nuxt prepare` so the new auto-imports are typed.

---

## Required changes

### 1. `MastNav` no longer positions itself

The hamburger button dropped `fixed top-0 right-0`. Where it sits is now the parent's decision.

**Detect:** the app renders `<MastNav` and has no `app/components/Mast/Nav.vue` of its own.

**Apply:** put the old positioning back where you render it, or position it differently:

```vue
<!-- BEFORE -->
<MastNav />

<!-- AFTER -->
<MastNav class="fixed top-0 right-0" />
```

### 2. Detail organisms no longer set page meta

`NuxtContentDetail` and `GalleryImageDetail` used to call `useSeoMeta`. That moved up into the page
components (`BlogItemPage`, `PortfolioItemPage`, `GallerySlugPage`, `GalleryImagePage`), so an
organism never decides page meta.

**Detect:** grep your own pages for `<NuxtContentDetail` or `<GalleryImageDetail`. If you only use
the layer's `*Page` components, nothing changes for you.

**Apply:** set the meta in your page. For a content item, `useContentItemSeo` does what the
organism used to do:

```vue
<script setup lang="ts">
  const slug = useRoute().params.slug as string
  // Registers title/description/og:image, then fetches. Call it before any other await.
  await useContentItemSeo('blog', slug)
</script>

<template>
  <NuxtContentDetail collection="blog" :slug />
</template>
```

For a gallery image, `galleryImageMeta(item, index)` (auto-imported util) returns the
`{ title, description, ogImage }` the organism used to set. Pass it to `useSeoMeta` with getters,
as `GalleryImagePage` does.

### 3. `BaseModal` and `MastNavModal` are built on `UModal`

Same props, emits and slots (`open`, `title`, `description`, `size`, `update:open`, `close`,
`#header`, default, `#footer="{ dismiss }"`). `UModal` now handles the dialog role, focus trap,
Escape key and teleport. What can break:

| Before                                                              | After                                                                       |
| ------------------------------------------------------------------- | --------------------------------------------------------------------------- |
| Rendered in place                                                   | Teleported to `<body>`: scoped or parent-selector CSS no longer reaches it  |
| `#header` replaced only the title block, so the close button stayed | `#header` replaces the whole header, close button included, so add your own |
| `.base-modal-*` / `.nav-modal-*` transition classes                 | Gone: `UModal` runs its own transitions                                     |
| `z-50` (`BaseModal`), `useZIndex('modal')` (`MastNavModal`)         | `z-(--z-modal)` = 400                                                       |
| `size="full"` = `max-w-full`                                        | `size="full"` = `UModal` `fullscreen`                                       |

**Detect:** grep for `<BaseModal` with a `#header` slot, CSS that targets `base-modal-` or
`nav-modal-`, and styles that reach into the modal from a parent. If you ship your own
`app/components/Mast/NavModal.vue`, your override still runs and its `nav-modal` CSS still applies.

**Apply:** put a close button inside a custom `#header`. Move modal styling to the `ui`/`class`
props or global CSS. Delete dead transition CSS.

### 4. Cursor and grid-debug overlays left `z-9999`

`MotionCursor` now uses `z-(--z-cursor)` = 600, and `LayoutGridDebug` uses `z-(--z-debug)` = 700.
Both still sit above the layout scale (header 100 … toast 500).

**Detect:** the app has its own elements above `z-index: 600` that should stay _under_ the custom
cursor, or it relied on the cursor beating something at `z-9999`.

**Apply:** move those elements onto the scale (`z-(--z-modal)`, `z-(--z-toast)`, …), or raise
`--z-cursor` in your own `:root`.

### 5. `NuxtContentList` `status` is a typed union

`status` changed from `string` to `'idle' | 'pending' | 'success' | 'error'`, and `'error'` now
renders an error alert instead of the empty message.

**Detect:** typecheck errors on `<NuxtContentList :status=…>`.

**Apply:** pass the `status` from `useAsyncData`/`useFetch` (already that union). To change the error
UI, use the new `error-message` prop or the `#error` slot.

---

## Recommended — deprecated components

Each one still works in v6.3 and prints a dev-only console warning. They'll be removed in the next
major.

### 6. `LinksGroup` → `HoverDimGroup`

Renamed and moved to `visual`: it dims any children, not just links. The `tag` prop is unchanged.

**Detect:** grep for `<LinksGroup`.

**Apply:** rename the tag.

```vue
<!-- BEFORE -->
<LinksGroup tag="nav">…</LinksGroup>
<!-- AFTER -->
<HoverDimGroup tag="nav">…</HoverDimGroup>
```

### 7. `LinksNamed` → `ULink`

**Detect:** grep for `<LinksNamed`.

**Apply:**

```vue
<!-- BEFORE -->
<LinksNamed name="blog-slug" :params="{ slug }" color="primary">Read</LinksNamed>
<!-- AFTER -->
<ULink :to="{ name: 'blog-slug', params: { slug } }" class="text-primary">Read</ULink>
```

### 8. `SiteTitle` / `SiteSubtitle` → `useSite()`

**Detect:** grep for `<SiteTitle` or `<SiteSubtitle`.

**Apply:**

```vue
<script setup lang="ts">
  const site = useSite()
</script>

<template>
  <span v-for="(word, i) in site.titleWords" :key="i" class="site-word">{{ word }}</span>
</template>
```

---

## Behaviour changes — check, usually no code

### 9. Motion respects reduced motion

When the OS asks for reduced motion, or the ThemePicker motion setting is `on`, these now render
static or paused: `MotionStaggered`, `MotionTextReveal`, `MotionCountUp` (jumps to the end value),
`MotionMarquee`, `MotionMarqueeText`, `MotionVelocityEffect`, `MotionParallax`,
`MotionPinnedSection` (items shown, no pin), `MotionHorizontalScroll` (native horizontal scroll),
the pointer-follow effects (`MotionTilt`, `MotionMagnetic`) and the cursor follower.

**Check:** e2e tests that emulate `prefers-reduced-motion: reduce` and still expect motion.

### 10. `MotionStaggered` now actually reveals its children

Before, `ref`/`class` on the `<slot>` never reached the DOM, so items stayed at `opacity: 0` for
good. It now staggers its rendered **element** children (text nodes aren't animated) and adds the
`transitions` layer's `animate-<animation>` class.

**Check:** remove any workaround CSS that forced `.motion-staggered > *` visible.

### 11. `LayoutPage` sets meta with `useSeoMeta`

It used `useHead`. Now `og:title` is always set, and a page's own `useSeoMeta` overrides
`LayoutPage`'s values instead of adding duplicate tags.

**Check:** nothing to do, unless you relied on the duplicate tags.

### 12. Wider `extends`

`content` now extends `layout` and `visual`, and `scroll` and `navigation` now extend `visual`. An
app that loads `content` or `navigation` therefore also gets the `layout`/`visual` components and
composables auto-imported. App components with the same name still win.

**Check:** after `nuxt prepare`, look for auto-import name clashes. The likeliest new one is
`useReducedMotion` (scroll layer), which `motion-v` also exports.

### 13. Colour and markup tweaks

- `Feeds` (index page) and `FeedsRouteCard` use semantic colours (`bg-elevated`, `text-muted`,
  `border-default`). Only the RSS/Atom/JSON format hues stay fixed.
- `MastFooter` copyright: `text-neutral-300` → `text-muted`.
- `BlogPage`, `GalleryPage` and `PortfolioPage` render through the new `NuxtContentIndexTemplate`
  (`UPageHeader` + `UPageBody` inside `LayoutSection` > `LayoutGridItem`).

**Check:** visual regression on the feeds page, the footer and the content index pages, in light and
dark mode.

---

## New — optional

| Addition                              | Where                                      | Use                                                       |
| ------------------------------------- | ------------------------------------------ | --------------------------------------------------------- |
| `title`, `description` props          | `BlogPage`, `GalleryPage`, `PortfolioPage` | Override the index heading and meta (defaults unchanged)  |
| `items` prop                          | `BlogList`, `GalleryGrid`, `PortfolioList` | Pass data in. The component only fetches when it's absent |
| `error-message` prop, `#error` slot   | `NuxtContentList`                          | Custom error state                                        |
| `NuxtContentIndexTemplate`            | content                                    | Heading + body skeleton for your own index pages          |
| `useContentSection(section)`          | content                                    | 404 when `contentLayer.sections.<section>` is `false`     |
| `useContentItemSeo(collection, slug)` | content                                    | Fetch an item and set its page meta                       |
| `useReducedMotion()`                  | scroll                                     | `ComputedRef<boolean>`: OS setting + ThemePicker override |
| `--z-header` … `--z-debug`            | core CSS                                   | Stacking scale: `z-(--z-modal)`                           |
| Shadow / duration tokens              | core CSS                                   | Moved from `theming`, so they work without it             |
| `docs/component-levels.md`            | repo                                       | Atomic level of every component                           |

## Verify

- [ ] `npx nuxt prepare && npx nuxi typecheck` is clean.
- [ ] Nav button is where it was (§1).
- [ ] Each content item page has the right `<title>` and `og:image` (§2).
- [ ] Modals open, close on Escape and backdrop, and custom headers have a close button (§3).
- [ ] The cursor sits above modals and toasts (§4).
- [ ] No `[navigation] … is deprecated` warnings in the dev console (§6–8).
- [ ] With reduced motion on, nothing moves and all content is visible (§9–10).
