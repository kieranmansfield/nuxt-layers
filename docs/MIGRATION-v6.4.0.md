# Migration Guide — v6.3.x → v6.4.0

**Audience:** an AI coding agent (or developer) updating a downstream Nuxt app that consumes these
layers.
**What changed:** the duplicate overlay provider is gone, the nav is plain shared state with a
configurable trigger and modal, a new `SiteLogo` wordmark, and a per-element display type range.
Background: [`NAV-LOGO-OVERLAY-PLAN.md`](../NAV-LOGO-OVERLAY-PLAN.md).

Work top to bottom. Each change has a **Detect** step and an **Apply** step; skip anything Detect
doesn't find. An app component with the same name as a layer component overrides it, so a change
to a layer component you've overridden doesn't reach you until you delete the override.

## 0. Preconditions

- Update the package to `^6.4.0`, reinstall, run `npx nuxt prepare`.

---

## Required changes

### 1. Remove your own `<UOverlayProvider />`

`UApp` already renders one. A second one made every `useOverlay()`/`createModal` overlay render
twice (doubled modals, layout shift). `core`'s `app.vue` no longer adds one.

**Detect:** grep your `app.vue` and layouts for `<UOverlayProvider`.

**Apply:** delete it. Keep `<UApp>`.

### 2. Render `<MastNavModal />` once in your layout

`<MastNav>` is only a trigger now. The modal is rendered once by the layout, and every trigger on
the page opens that one modal.

**Detect:** a layout or page renders `<MastNav` but not `<MastNavModal`.

**Apply:**

```vue
<!-- app/layouts/default.vue -->
<template>
  <MastNav class="fixed top-0 right-0 z-(--z-header)" />
  <MastNavModal />
  <slot />
</template>
```

### 3. `useMastNav()` returns shared state

| Before (v6.3)                     | After (v6.4)                                        |
| --------------------------------- | --------------------------------------------------- |
| `{ open(props?), close, patch }`  | `{ isOpen, open, close, toggle }`                   |
| An overlay created per app        | `useState('mast-nav:open')`; `isOpen` is read-only  |
| `open()` called `lockScrolling()` | UModal locks body scroll; `open()` only stops Lenis |

**Detect:** grep for `useMastNav().patch`, `patch(` on the nav, or `open({` with props.

**Apply:** drop the props (the modal reads `mastNav` config and its own props instead), and read
`isOpen` where you used to track open state yourself.

### 4. `MastNav` is a `UButton`

The trigger was a bare `<button>` with a hamburger icon, an `#icon` slot and an inline
`z-index` (dropdown layer). It's now a `UButton` whose props come from `mastNav.trigger`, and
attrs on the component win.

**Detect:** `<MastNav>` with an `#icon` slot, or a fixed trigger that relied on the old inline
z-index.

**Apply:**

```ts
// app/app.config.ts
mastNav: {
  trigger: { label: 'Menu', icon: undefined, variant: 'ghost', size: 'xl' },
}
```

- Replace `#icon` with `trigger.icon` (or `icon="…"` on the component). The default slot now fills
  the button label.
- Add `z-(--z-header)` (or your own) to a fixed trigger that has to sit over page content.
- The default look moved from `p-4` + 28px icon to `UButton` neutral/ghost/xl. Restate `class` if
  you need the old size.

### 5. Loading screen is opt-in, and `core` renders it

`core`'s `app.vue` now renders `<LoadingScreen />`, so you can delete an `app.vue` that existed only
to add it. So that every other app doesn't suddenly get a loading screen,
`coreLayer.loading.enabled` now defaults to **`false`**.

**Detect:** your app shows the loading screen (it renders `<LoadingScreen />` or relied on the
default being on).

**Apply:**

```ts
// app/app.config.ts
coreLayer: { loading: { enabled: true } },
```

Then delete your `app.vue` if `<LoadingScreen />` was its only difference from `core`'s.

### 6. `mastNav.links` is typed as `MastNavLink[]`

Route `params`/`query` values are `string | number` (the app.config type used to allow
`unknown`).

**Detect:** typecheck errors in `app.config.ts` under `mastNav.links`.

**Apply:** stringify the offending values.

---

## Behaviour changes — check, usually no code

### 7. The current page's link is active

A link used to be active only when `useState('activeSection')` matched its `id`. It's now also
active when its `to` resolves to the current route, except on the smooth-scroll index, where every
link points at `index`. Active links get `aria-current="page"` plus `mastNav.ui.linkActive`. The
default weight (light → normal) keys off `aria-current`.

### 8. No more scrollbar jump when the nav opens

With classic (non-overlay) scrollbars the page used to widen by the scrollbar on open, because the
nav hid `html` overflow before the dialog measured the scrollbar. UModal now owns the lock and pads
`body`, and Lenis stops after it. `useSmoothScroll().lockScrolling()` is unchanged for other
callers.

### 9. `HoverDimGroup` renders nested fragments

Children inside `<template v-for>` around a `<slot>` (fragments two deep) used to be dropped
silently. They render and dim now. Check any `HoverDimGroup` that rendered fewer children than
you passed.

---

## New — optional

### `MastNavModal` styling and slots

The layer keeps the behaviour (dialog, focus trap, Escape, scroll lock, smooth-scroll vs router,
active link). The look comes from config and slots:

```ts
// app/app.config.ts: each key you set replaces that default string (no class merging)
mastNav: {
  ui: {
    content: 'bg-default text-default',
    close: 'absolute right-[5vw] top-[3vh]',
    nav: 'flex w-full flex-col items-start gap-2 px-12',
    link: 'cursor-pointer py-3 text-step-4 tracking-wider transition-all',
    linkActive: 'underline',
  },
}
```

| API                                  | Purpose                                                         |
| ------------------------------------ | --------------------------------------------------------------- |
| `ui` prop                            | Per-instance override, merged per key over `mastNav.ui`         |
| `links` prop                         | Replace `mastNav.links`, e.g. filtered by your page flags       |
| `open` prop / `update:open`          | Manual control; omit to follow `useMastNav().isOpen`            |
| `#link="{ link, active, navigate }"` | Replace a link's markup; `navigate()` scrolls/routes and closes |
| `#close="{ close }"`                 | Replace the close button                                        |
| `#header`, `#footer`                 | Content above/below the links                                   |
| `hidden: true` on a link             | Skip it without a custom `links` prop                           |

### `SiteLogo`

`site.title` as a wordmark on the step scale. Replaces the deprecated `SiteTitle`.

```vue
<SiteLogo />
<!-- stacked, text-step-1 -->
<SiteLogo size="display" :stacked="false" />
<!-- one line -->
<SiteLogo v-slot="{ words }">…</SiteLogo>
<!-- your own markup -->
```

```ts
// app/app.config.ts: sizes merge per key
siteLogo: {
  stacked: true,
  ui: { root: 'font-display leading-none tracking-tight', word: '' },
  sizes: { display: 'text-step-display [--display-from:4] [--display-to:9]' },
}
```

### Per-element display range

`text-step-display` and plain `h1` now read `--display-from` (step at ≤360px, default 5) and
`--display-to` (step at ≥1280px, default 7) on the element itself:

```html
<span class="text-step-display [--display-from:4] [--display-to:9]">…</span>
<!-- ≈42px at 390px, 154px at 1280px -->
```

Defaults are unchanged in Chromium, Firefox and WebKit. If you override `--step-display` on an
element with your own unlayered CSS, that still works; the two numbers are the simpler way.

## Deprecated

`SiteTitle` → `<SiteLogo :stacked="false">`. Removal in the next major, alongside `SiteSubtitle`,
`LinksNamed` and `LinksGroup`.

## Verify

- [ ] `npx nuxt prepare && npx nuxi typecheck` is clean.
- [ ] Opening any modal puts exactly one `[role="dialog"]` in the DOM (§1).
- [ ] The nav trigger opens one modal. Escape and the close button close it, focus returns to the
      trigger, and the page stays where it was (§2–4, §8).
- [ ] The current page's link is highlighted (§7).
- [ ] The loading screen shows only where you enabled it (§5).
