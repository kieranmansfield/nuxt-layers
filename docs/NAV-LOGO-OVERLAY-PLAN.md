# Plan: overlay fix, configurable MastNav, SiteLogo (target v6.4.0)

**Audience:** an AI coding agent (or developer) working in `kmcom-nuxt-layers`.
**Origin:** KMCOMv5 (`~/Developer/KMCOMv5/frontend`) overrides `app.vue`, `useMastNav`, `MastNav`
and `MastNavModal`, and hand-rolls its wordmark in three places. Each override exists because the
layer either has a bug or can't be styled per site. This plan fixes the bug and adds the seams, so
consumers keep their look through `app.config` and slots, not by forking components.

Work top to bottom. Tasks 1–2 are fixes, 3–6 are additive features. Ship as one minor release
unless task 3's compatibility question says otherwise.

---

## 1. Fix: duplicate overlay provider (bug, patch-level)

**Cause:** `layers/core/app/app.vue` renders `<UOverlayProvider />` inside `<UApp>`. `UApp` already
renders one. Two providers consume the same `useOverlay()` state, so every overlay created with
`useOverlay().create()` (including `useMastNav` via `createModal`) renders **twice**. KMCOMv5 saw
this as a doubled nav modal and layout shift, and worked around it by replacing `useMastNav`.

**Apply:**

```vue
<!-- layers/core/app/app.vue -->
<template>
  <UApp>
    <LoadingScreen />
    <NuxtLoadingIndicator />
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </UApp>
</template>
```

- Delete `<UOverlayProvider />`.
- Add `<LoadingScreen />` (see task 2).

**Verify:** in the playground, open any `createModal` modal: exactly one `[role="dialog"]` in the
DOM. Add a Nuxt test that mounts the app, calls `useMastNav().open()` and asserts one dialog.

Add an entry to `docs/layout-shift-causes.md` (#8: duplicate `UOverlayProvider`).

## 2. `app.vue` renders `LoadingScreen` so consumers can drop their own

KMCOMv5's `app/app.vue` differs from the layer's only by rendering `<LoadingScreen />`.
`LoadingScreen` already gates itself on `coreLayer.loading.enabled`, so the layer can render it
unconditionally.

**Behaviour change to flag in the changelog:** `coreLayer.loading.enabled` defaults to `true`, so
every consumer that doesn't override `app.vue` starts showing the loading screen. Either flip the
default to `false` (consumers opt in) or call it out as a breaking-ish change. **Recommended: flip
the default to `false`**, then KMCOMv5 sets `coreLayer.loading.enabled: true` in its `app.config`.

Keep `<NuxtLoadingIndicator />` (route-change progress bar). It's separate from the first-load
screen.

## 3. `useMastNav`: plain shared state, no overlay

Even with task 1 fixed, `createModal` is the wrong fit for the nav: the nav needs a readable
`isOpen` (layouts and the trigger react to it), and closing must also resync smooth scroll.

**Apply** (`layers/structure/navigation/app/composables/mastNav.ts`):

```ts
import { readonly } from 'vue'

export function useMastNav() {
  const isOpen = useState('mast-nav:open', () => false)

  function open() {
    try {
      useSmoothScroll().lockScrolling()
    } catch {}
    isOpen.value = true
  }

  function close() {
    isOpen.value = false
    try {
      const { unlockScrolling, locomotiveScroll } = useSmoothScroll()
      unlockScrolling()
      // Locomotive/Lenis measure the page while it's locked; resize after unlock so they resync
      if (import.meta.client) {
        locomotiveScroll.value?.lenisInstance?.resize()
        requestAnimationFrame(() => locomotiveScroll.value?.resize())
      }
    } catch {}
  }

  const toggle = () => (isOpen.value ? close() : open())

  return { isOpen: readonly(isOpen), open, close, toggle }
}
```

- `MastNavModal` binds to it directly: `:open="isOpen"`, `@update:open="(v) => !v && close()"`.
  Its `open` prop / `update:open` emit can stay for manual control but are no longer required.
- The modal is rendered **once, by the layout** (`<MastNavModal />`), not by the trigger. Two
  triggers on a page (header + floating) must not mean two modals.
- Keep `createModal` and `BaseModal` for other modals; they work once task 1 lands.

**Compatibility:** the old return shape was `{ open(props?), close, patch }`. `patch` and
`open(props)` go away. Grep showed no consumers outside the playground (`apps/playground/app/pages/nav.vue`,
update it). If any other site uses them, keep `open(props?)` accepting and ignoring props for one
minor with a dev warning.

**Check:** `UModal` (Reka) also locks body scroll. With Lenis/Locomotive active, confirm the two
locks don't fight (no scrollbar-width jump on open, page position restored on close). If they do,
pass `:modal="false"` and keep only the smooth-scroll lock, or vice versa. Document which.

## 4. `MastNav` (trigger): configurable button

Today: a bare `<button>` with a hamburger icon. KMCOMv5 wants a ghost `UButton` reading "Menu".

**Apply:** render `UButton`, props from config, overridable by attrs:

```vue
<script setup lang="ts">
  defineOptions({ inheritAttrs: false })
  const { open } = useMastNav()
  const trigger = useAppConfig().mastNav?.trigger ?? {}
</script>

<template>
  <UButton aria-label="Open navigation menu" v-bind="{ ...trigger, ...$attrs }" @click="open">
    <slot />
  </UButton>
</template>
```

Layer default in `navigation/app/app.config.ts`:

```ts
mastNav: {
  trigger: { icon: 'lucide:menu', color: 'neutral', variant: 'ghost', size: 'xl' },
}
```

Positioning stays the parent's call (v6.3 §1). Drop the inline `useZIndex('dropdown')` style unless
the playground shows it's needed; a header already sits on `--z-header`.

## 5. `MastNavModal`: behaviour in the layer, look per site

The layer owns behaviour; the site owns appearance.

**Layer owns:** `UModal` (dialog role, focus trap, Escape, teleport), scroll lock (via
`useMastNav`), smooth-scroll vs `navigateTo` (`mastNav.scrollBehaviour`), active-link detection,
link filtering.

**Site owns, via `app.config` + slots:**

```ts
// navigation/app/app.config.ts: layer defaults (current look)
mastNav: {
  links: [],
  scrollBehaviour: 'router',
  trigger: { /* task 4 */ },
  ui: {
    content: 'bg-default text-default',
    close: 'absolute top-4 right-4',
    nav: 'flex flex-col items-center gap-2',
    link: 'cursor-pointer border-0 bg-transparent px-4 py-3 text-3xl tracking-widest uppercase transition-all font-light',
    linkActive: 'font-normal',
  },
}
```

Component API:

| API                                      | Purpose                                                                                    |
| ---------------------------------------- | ------------------------------------------------------------------------------------------ |
| `ui` prop (`Partial<typeof mastNav.ui>`) | Per-instance override, merged over `app.config` (prop wins per key; strings replace)       |
| `links` prop                             | Override `mastNav.links`, e.g. filtered by the site's own page flags                       |
| `#link="{ link, active, navigate }"`     | Replace one link's markup entirely; `navigate()` runs the scroll/route logic and dismisses |
| `#close="{ close }"`                     | Replace the close button                                                                   |
| `#header`, `#footer`                     | Content above/below the link list (socials, theme picker)                                  |
| Link field `hidden?: boolean`            | Skip a link without a custom `links` prop                                                  |

**Active link (smarter than today):** `active = activeSection === link.id || route matches
link.to` (resolve with `useRouter().resolve(link.to)` and compare `name` / `path`). Today only
`activeSection` counts, so the nav never highlights the current page outside smooth-scroll mode.

Keep `HoverDimGroup` around the links (its `tag` comes from `ui`-independent markup: `nav`).

Merge rule for `ui`: plain object spread per key, strings replace, no `tailwind-merge`. A site that
changes `link` restates the whole class string. Document this; it keeps the API predictable.

**Tailwind scanning:** layer defaults live in `node_modules`. Confirm `core.css`'s `@source` globs
cover `navigation/app/app.config.ts` so the default classes are generated. Site classes in the
site's own `app.config.ts` are scanned automatically.

## 6. `SiteLogo`: one wordmark, sized on the step scale

Replaces the deprecated `SiteTitle` / `SiteSubtitle` (remove those in the next major as planned).
Lives in `navigation` next to `useSite`.

```vue
<!-- layers/structure/navigation/app/components/Site/Logo.vue -->
<script setup lang="ts">
  type Size = 'sm' | 'md' | 'lg' | 'display'

  const {
    as = 'span',
    size = 'sm',
    stacked,
    ui,
  } = defineProps<{
    as?: string
    size?: Size
    stacked?: boolean
    ui?: { root?: string; word?: string }
  }>()

  const config = useAppConfig().siteLogo
  const site = useSite()
  const isStacked = computed(() => stacked ?? config.stacked)
</script>

<template>
  <component :is="as" :class="[ui?.root ?? config.ui.root, config.sizes[size]]">
    <slot :words="site.titleWords" :title="site.title">
      <span
        v-for="(word, i) in site.titleWords"
        :key="i"
        :class="[isStacked && 'block', ui?.word ?? config.ui.word]"
        >{{ word }}{{ !isStacked && i < site.titleWords.length - 1 ? ' ' : '' }}</span
      >
    </slot>
  </component>
</template>
```

Layer defaults:

```ts
siteLogo: {
  stacked: true,
  ui: { root: 'font-display leading-none tracking-tight', word: '' },
  sizes: {
    sm: 'text-step-1',
    md: 'text-step-4',
    lg: 'text-step-6',
    display: 'text-step-display',
  },
}
```

Type it in the navigation layer's `AppConfigInput` augmentation. `sizes` merges per key (defu), so
a site can retune one size without restating the others.

Ships with task 7, which lets `display` take a per-site fluid range.

## 7. Typography: per-element display range

`--step-display` is computed once at `:root` (5 → 7 across 360 → 1280px). Like `--space-*`, it's
substituted there, so overriding it on a subtree does nothing useful unless the override restates
the whole expression (KMCOMv5 currently does exactly that for its hero). Move the expression into
the places that use it, driven by two plain numbers:

```css
:root {
  --display-from: 5; /* step at ≤360px */
  --display-to: 7; /* step at ≥1280px */
}

/* In @utility text-step-display and the h1 base rule, replacing var(--step-display): */
--step: tan(
  atan2(
    clamp(
      var(--display-from) * 1rem,
      var(--display-from) * 1rem + (var(--display-to) - var(--display-from)) * (100vw - 360px) *
        tan(atan2(1rem, 16px)) / 57.5,
      var(--display-to) * 1rem
    ),
    1rem
  )
);
```

- `57.5 = 920 / 16`: the 360 → 1280px span. At the defaults this reduces to today's
  `clamp(5rem, 4.2176rem + 3.4784vw·k, 7rem)`, so nothing changes visually. Check that with the
  existing computed-size table (ADR 0003) before and after.
- Keep `--step-display` as an alias for one minor if anything external reads it (grep first).
- Now any element can retune: `[--display-from:4] [--display-to:9]`. KMCOMv5's hero logo uses
  exactly that (154px at 1280px, ≈42px at 390px).
- Same accessibility rules as ADR 0003: the exponent must stay independent of root font size
  (that's the `tan(atan2(1rem, 16px))` factor), and the rem term in the clamp stays.
- Verify in Chrome, Safari and Firefox (`calc()` multiplying `var()` numbers by lengths inside
  `clamp()` inside `atan2()`). If an engine misbehaves, stop and report; don't work around it
  silently.
- Update ADR 0003 (or add 0004) and the typography `CLAUDE.md`.

---

## Verify (whole release)

- [ ] `pnpm typecheck && pnpm lint && pnpm test && pnpm build` green.
- [ ] Playground: one dialog per `createModal` open (task 1).
- [ ] Nav: Escape, backdrop and close button all close it; focus returns to the trigger; page
      scroll position restored; no scrollbar jump on open (task 3).
- [ ] Current route's link shows `linkActive` with `scrollBehaviour: 'router'` (task 5).
- [ ] `#link` slot replaces markup and `navigate()` still dismisses + navigates (task 5).
- [ ] `SiteLogo` sizes match the step table; `stacked: false` renders one line with spaces
      (task 6).
- [ ] `text-step-display` / `h1` computed sizes unchanged at defaults; `[--display-from:4]
    [--display-to:9]` gives ≈42px at 390px and 154px at 1280px (task 7).
- [ ] Docs: `MIGRATION-v6.4.0.md` covering the `useMastNav` shape change, the loading-screen
      default, `SiteLogo`, `--display-from/to`.

---

## KMCOMv5 follow-up (after release)

Once v6.4.0 is published, the site drops its overrides:

| Delete                             | Replace with                                                               |
| ---------------------------------- | -------------------------------------------------------------------------- |
| `app/app.vue`                      | layer `app.vue` + `coreLayer.loading.enabled: true` (if the default flips) |
| `app.vue` (repo root)              | nothing: dead file, outside Nuxt 4's `app/` srcDir. Can go today           |
| `app/composables/mastNav.ts`       | layer `useMastNav` (task 3)                                                |
| `app/components/Mast/Nav.vue`      | `mastNav.trigger` in `app.config` (below)                                  |
| `app/components/Mast/NavModal.vue` | `mastNav.ui` in `app.config` + `:links` filtered by `appConfig.pages`      |
| `app/components/Site/Logo.vue`     | layer `SiteLogo` + `siteLogo` in `app.config` (below)                      |

```ts
// KMCOMv5 app/app.config.ts
mastNav: {
  trigger: {
    label: 'Menu',
    icon: undefined,
    variant: 'ghost',
    size: 'xl',
    class: 'uppercase text-step-sm text-neutral-50',
  },
  ui: {
    content: 'bg-default text-default',
    close: 'absolute right-[5vw] top-[3vh]',
    nav: 'flex w-full flex-col items-start gap-2 px-12',
    link: 'cursor-pointer border-0 bg-transparent py-3 font-display-light text-step-3 md:text-step-4 tracking-wider transition-all',
    linkActive: '',
  },
},
siteLogo: {
  ui: { root: 'font-display-reg leading-none tracking-tight' },
  sizes: { display: 'text-step-display [--display-from:4] [--display-to:9]' },
},
```

Layouts keep rendering `<MastNavModal :links="visibleLinks" />` once, where `visibleLinks` filters
`mastNav.links` by `appConfig.pages`. Check the nav, header, footer and hero against the current
site in light and dark mode.
