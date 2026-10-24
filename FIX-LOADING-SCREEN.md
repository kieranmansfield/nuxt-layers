# Fix: Loading Screen Delays Every First Visit on a Timer

## Problem

The `enabled` toggle works: with `coreLayer.loading.enabled: false`, nothing renders and the
plugin exits. The problem is how the screen behaves when it's on.

On kieranmansfield.com the screen counted to 100% in about 2.5 seconds however fast the page
actually was (UX review, 22 October 2026):

| Conditions             | Screen visible |
| ---------------------- | -------------- |
| Fast desktop           | 0.54 – 3.19 s  |
| Phone, Slow 4G, 4× CPU | 1.40 – 3.90 s  |
| Reduced motion on      | 0.19 – 2.68 s  |

The site has turned it off for now. Five things cause the delay.

1. **The minimum duration is a timer.** `minDuration` defaults to `1500`
   (`layers/core/app/app.config.ts:37`, `layers/core/app/utils/loading.ts:6`).
   `useLoading.ts:45` only lets the count reach 100 once `elapsed >= minDuration`, even when
   hydration, fonts and images finished long before.
2. **The percentage is simulated.** `trickleProgress` (`utils/loading.ts:38`) eases toward about
   90% on a curve paced by `minDuration` (`useLoading.ts:34-35`). The number has no link to real
   loading. The screen still announces it to screen readers as `role="progressbar"` with
   `aria-valuenow` (`LoadingScreen.vue:57-61`).
3. **Reduced motion still gets the full wait.** The `prefers-reduced-motion` block
   (`LoadingScreen.vue:176`) only swaps the entrance animation for a fade. The overlay still
   covers the page and still holds for `minDuration`. The theming layer's Reduce Motion switch
   (`useThemeMotion().effectiveReducedMotion`) is never consulted.
4. **Everything else waits behind it.** While the screen is visible, the scroll layer pauses
   GSAP's global timeline and holds Lenis (`layers/motion/scroll/app/plugins/locomotive-scroll.client.ts:23-31, 65`),
   and the screen locks body scroll (`LoadingScreen.vue:25`). Entrance animations only start
   after it leaves, which adds to the wait.
5. **It can wait up to 3 more seconds after mount.** `maxDuration: 3000`
   (`plugins/loading.client.ts:35-36`) covers fonts and every image on the first page.

## Fixes

**Repository:** `/Users/kieranmansfield/Developer/layers/nuxt-layers`

In order of value.

### 1. Default `minDuration` to 0

- `layers/core/app/app.config.ts:37` and `layers/core/app/utils/loading.ts:6`: `1500` → `0`.
- Update the comment in `useLoading.ts:21` ("Holds below 100 until `minDuration` has passed").
- The count then finishes as soon as the work does. A site that wants a deliberate brand moment
  can still set `minDuration`.

### 2. Don't show it for fast loads

The server-rendered overlay is visible from first paint, before any JavaScript runs. Start it
transparent and fade it in only after a short delay, in CSS, so fast loads never see it:

```css
.loading-screen {
  opacity: 0;
  animation: loading-show 200ms ease var(--loading-show-after, 400ms) forwards;
}

@keyframes loading-show {
  to {
    opacity: 1;
  }
}
```

Add a `showAfter` option (default about 400 ms) to `coreLayer.loading` and feed it in as
`--loading-show-after`.

### 3. Honour reduced motion

- **System setting, no JavaScript:** in `LoadingScreen.vue`, hide the overlay under
  `@media (prefers-reduced-motion: reduce) { .loading-screen { display: none; } }`.
- **Same in the plugin:** in `plugins/loading.client.ts`, if
  `matchMedia('(prefers-reduced-motion: reduce)').matches`, finish at once (progress 100, screen
  `hidden`) so GSAP and Lenis are never paused.
- **The site's own switch:** theming already extends core (`layers/design-system/theming/nuxt.config.ts:15`).
  Give `useLoading()` a `finishNow()` that ends the screen immediately, and have the theming
  plugin (`app/plugins/theme.client.ts`) call it when `effectiveReducedMotion` is true.

### 4. Show real progress or none

Drop `trickleProgress` and choose one:

- **Simplest:** no percentage by default (`showProgress: false`). Show an indeterminate
  indicator, and replace the progressbar role with `role="status"` and a visually hidden
  "Loading".
- **Real milestones:** step the count through what the plugin already waits for. Hydrated
  (`app:mounted`), then fonts ready, then images loaded (count `document.images` that are
  complete). Keep `role="progressbar"` only if `aria-valuenow` is real.

### 5. Lower `maxDuration`

`3000` → about `1500`, or document why a page should wait longer than that for images.

## Tests

- `layers/core/app/utils/loading.test.ts` exists. Update it for the new defaults, drop the
  trickle cases if the trickle goes, and add:
  - with `minDuration: 0`, the count reaches 100 as soon as the work is done;
  - `finishNow()` hides the screen and leaves GSAP unpaused.
- Playwright, against `apps/playground` with the loader on:
  - with `reducedMotion: 'reduce'`, the overlay is never visible;
  - on a fast local page, the overlay's opacity stays 0 for the whole load.

## Consumer Notes

- Release notes: `minDuration` and `maxDuration` change defaults, and the percentage changes or
  goes. Sites that want the old pacing set `minDuration: 1500`.
- KMCOM frontend: `coreLayer.loading.enabled` is `false`. Once this ships it can go back to
  `true` if the screen is wanted.
