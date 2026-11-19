# Dynamic `theme-color` layer for Nuxt

A small Nuxt layer that keeps the `theme-color` meta tag in sync with the page background (Nuxt 4, Nuxt UI v4, Tailwind v4). Based on the approach in the 2021 Safari 15 theme-color article.

## How it works

- Two `theme-color` meta tags, one per `prefers-color-scheme`, always with the same value. Safari treats a tag without `media` as light-only, so this keeps control in our hands.
- `useHead` with a getter makes the tags reactive, so there is no manual `querySelectorAll`.
- The colour is read from a CSS variable (`--ui-bg` by default), because the variable changes instantly, whereas a computed `background-color` can be mid-transition.
- Values are normalised to `rgb()` through a 1px canvas, because Tailwind v4 colours are often `oklch()`, which Safari may not accept here.
- A shared override lets any component (nav overlay, loading screen) temporarily set the colour.

## Layer structure

```
layers/theme-color/
├── nuxt.config.ts
└── app/
    └── composables/
        ├── useThemeColor.ts
        ├── useThemeColorOverride.ts
        └── useBgThemeColor.ts
```

## Files

### `layers/theme-color/nuxt.config.ts`

```ts
export default defineNuxtConfig({})
```

### `app/composables/useThemeColor.ts`

```ts
export function useThemeColor(color: MaybeRefOrGetter<string>) {
  const value = () => toValue(color)

  useHead({
    meta: [
      {
        key: 'theme-color-light',
        name: 'theme-color',
        content: value,
        media: '(prefers-color-scheme: light)',
      },
      {
        key: 'theme-color-dark',
        name: 'theme-color',
        content: value,
        media: '(prefers-color-scheme: dark)',
      },
    ],
  })
}
```

### `app/composables/useThemeColorOverride.ts`

```ts
export const useThemeColorOverride = () =>
  useState<string | null>('theme-color-override', () => null)
```

### `app/composables/useBgThemeColor.ts`

```ts
function toRgb(cssColor: string): string {
  const ctx = document.createElement('canvas').getContext('2d', { willReadFrequently: true })!
  ctx.fillStyle = '#fff'
  ctx.fillStyle = cssColor
  ctx.fillRect(0, 0, 1, 1)
  const [r, g, b] = ctx.getImageData(0, 0, 1, 1).data
  return `rgb(${r}, ${g}, ${b})`
}

export function useBgThemeColor(options: { cssVar?: string; fallback?: string } = {}) {
  const { cssVar = '--ui-bg', fallback = '#ffffff' } = options

  const color = useState('theme-color', () => fallback)
  const override = useThemeColorOverride()

  const sync = () => {
    const raw = getComputedStyle(document.documentElement).getPropertyValue(cssVar).trim()
    if (raw) color.value = toRgb(raw)
  }

  onMounted(() => {
    sync()

    // Nuxt color mode toggles a class on <html>
    const mo = new MutationObserver(() => requestAnimationFrame(sync))
    mo.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class', 'style', 'data-theme'],
    })

    // OS changes while preference is 'system'
    const mq = matchMedia('(prefers-color-scheme: dark)')
    mq.addEventListener('change', sync)

    onScopeDispose(() => {
      mo.disconnect()
      mq.removeEventListener('change', sync)
    })
  })

  useThemeColor(() => override.value ?? color.value)
}
```

## Install

In the app's `nuxt.config.ts`:

```ts
export default defineNuxtConfig({
  extends: ['./layers/theme-color'], // or your monorepo package name
})
```

In `app.vue`:

```ts
useBgThemeColor()
```

## Usage

Temporary override (e.g. a nav overlay):

```ts
const override = useThemeColorOverride()
watch(isOpen, (open) => {
  override.value = open ? '#000000' : null
})
```

Different token or element-specific colour:

```ts
useBgThemeColor({ cssVar: '--ui-bg-elevated' })
```

## Notes and gotchas

- **SSR:** the server can't read computed styles, so the first paint uses `fallback`. Set `fallback` to your light-mode background to minimise any flash.
- **Safari lag:** dynamic updates work in Safari 15+, but the tab bar can lag a frame or two behind.
- **PWA manifest:** `theme_color` in the manifest is static and separate from this.
- **Per-section colours:** feed an IntersectionObserver result into `useThemeColorOverride()`.
- **Custom tokens:** if your background isn't `--ui-bg`, pass the right variable via `cssVar`.
