# Bugfix plan — kmcom-nuxt-layers v4.0.1

Found on 2026-10-05 during a read-through of `layers/` at commit `12695c0` (`chore(release): v4.0.1`, clean tree). Each bug below was checked against the code; the ones marked **Reproduced** were also executed. Written for an AI agent (or developer) to execute.

> **Executor instructions**
>
> - Read this whole file before starting. Work through the bugs in the order of the status table.
> - Make **one commit per bug**, using a conventional commit (e.g. `fix(theming): read stored preferences in FOUC script`).
> - Run each bug's **Verify** steps before moving on. If a **STOP condition** triggers, stop and report; don't improvise.
> - Do **not** bump the version, publish, push or open a PR unless the operator asks.
> - When a bug is done, update its row in the status table (`DONE`, `SKIPPED — reason` or `BLOCKED — reason`).

## Drift check (run first)

```sh
git log --oneline 12695c0..HEAD -- layers/design-system/theming layers/core layers/render layers/motion/scroll layers/data/forms layers/content/app/components/Gallery layers/structure/layout
```

If any file named in a bug changed since `12695c0`, re-read it and confirm the bug still exists before fixing it.

## Baseline

On 2026-10-05, `pnpm exec vitest run --project unit` gave **38 test files, 332 tests, all passing**. pnpm may run an install/postinstall step first; that's expected.

## Commands

| Purpose                                  | Command                                                             | Expected |
| ---------------------------------------- | ------------------------------------------------------------------- | -------- |
| Unit tests (node, `layers/**/*.test.ts`) | `pnpm exec vitest run --project unit`                               | all pass |
| Nuxt-env tests (`tests/nuxt/**`)         | `pnpm test:nuxt`                                                    | all pass |
| Vue/happy-dom tests                      | `pnpm test:vue`                                                     | all pass |
| All vitest projects                      | `pnpm test`                                                         | all pass |
| Typecheck                                | `pnpm typecheck`                                                    | exit 0   |
| Lint                                     | `pnpm lint`                                                         | exit 0   |
| Format check                             | `pnpm format:check`                                                 | exit 0   |
| Playground                               | `pnpm dev` (`PLAYGROUND_LAYERS=core,<layer> pnpm dev` for a subset) | boots    |

## Status

| #   | Bug                                                          | Priority | Effort | Status |
| --- | ------------------------------------------------------------ | -------- | ------ | ------ |
| 1   | FOUC init script can't read stored theme preferences         | P1       | M      | TODO   |
| 2   | Loading-screen `minDuration` test value shipped as default   | P1       | S      | TODO   |
| 3   | `useRendering().isHydrated` never updates                    | P2       | S      | TODO   |
| 4   | `useThemeColors` can loop forever on `requestAnimationFrame` | P2       | M      | TODO   |
| 5   | Contact rate limiter: spoofable key, unbounded memory        | P2       | M      | TODO   |
| 6   | `useSmoothScroll().isReady` is always `true`                 | P3       | S      | TODO   |
| 7   | CSS-var shader uniforms ignore accent changes                | P3       | S      | TODO   |
| 8   | `useShaderTime().scaled` applies speed twice                 | P3       | S      | TODO   |
| 9   | Dead Tailwind v3 configs (`safelist` is ignored in v4)       | P3       | S      | TODO   |
| 10  | `useElementStyle` creates a computed inside a computed       | P3       | S      | TODO   |
| 11  | Small cleanups                                               | P3       | S      | TODO   |

Bugs 6–8 are **latent**: nothing in this repo calls the broken API, but the composables are auto-imported for consumers.

---

## 1. FOUC init script can't read stored theme preferences — P1 (Reproduced)

**Where:** `layers/design-system/theming/server/utils/fouc-config.ts` (`buildPrefFragment`, line 74; `buildThemeInitScript`, line 88), plus its test `fouc-config.test.ts`.

**Problem:** the blocking init script injected by `server/plugins/theme-fouc.ts` reads every stored preference with `JSON.parse`. Every writer stores **raw strings**, though:

- `app/composables/useAccentColor.ts:22` → `localStorage.setItem('theme-colour', color)`
- `useThemeContrast.ts:17`, `useThemeMotion.ts:17` and `useThemeTransparency.ts:17` do the same for their keys.

`JSON.parse('red')` and `JSON.parse('on')` throw. The whole script sits in a single `try/catch`, so the first throw silently skips **every** attribute after it. The result: any visitor who has saved a preference gets exactly the flash this script exists to prevent. (`data-theme-mode` is still set separately by `@nuxtjs/color-mode`'s own script.) The mismatch dates back to `3c36068`: VueUse's `useLocalStorage` with a string default also stored raw values.

**Evidence:** executing the generated script with values stored the way the composables write them:

```text
nothing stored   -> all 5 attributes set (defaults)
accent 'red'     -> {}                                  // nothing applied at all
contrast 'on'    -> { 'data-theme-colour': 'blue' }     // everything after contrast skipped
accent '"red"'   -> all 5 set                           // only JSON-quoted values work; nothing writes those
```

The current tests only assert substrings of the generated script and check that `new Function(script)` compiles. They never run it, which is why this passed.

**Fix:** keep the storage format raw (the composables and `theme.client.ts` already agree on it) and make the script read it tolerantly.

1. Drop `jsonParsed` from the `TriStatePreference` type and from every `THEME_PREFERENCES` entry.
2. Inside the IIFE, add one reader that never throws and accepts both raw and legacy JSON-quoted values, then use it for every key, including `theme-colour` and `theme-mode`:

   ```ts
   // Raw ('red') is what every composable writes; JSON-quoted ('"red"') is accepted for old values.
   const READ_HELPER =
     'var r=function(k){var v=null;try{v=localStorage.getItem(k)}catch(e){}' +
     "if(v==null)return null;try{var p=JSON.parse(v);if(typeof p==='string')return p}catch(e){}return v};"

   function buildPrefFragment(p: TriStatePreference): string {
     return (
       `var ${p.varName}v=r('${p.storageKey}')||'system';` +
       `if(${p.varName}v==='${p.conditionA}'){h.setAttribute('${p.attribute}','${p.valueA}')}` +
       `else if(${p.varName}v==='${p.conditionB}'){h.setAttribute('${p.attribute}','${p.valueB}')}` +
       `else{h.setAttribute('${p.attribute}',(window.matchMedia&&window.matchMedia('${p.mediaQuery}').matches)?'${p.mediaTrue}':'${p.mediaFalse}')}`
     )
   }

   export function buildThemeInitScript(defaultAccent: string): string {
     const colourBlock = `h.setAttribute('data-theme-colour',r('theme-colour')||${JSON.stringify(defaultAccent)});`
     return (
       '(function(){try{var h=document.documentElement;' +
       READ_HELPER +
       colourBlock +
       THEME_PREFERENCES.map(buildPrefFragment).join('') +
       '}catch(e){}})()'
     )
   }
   ```

   `JSON.stringify(defaultAccent)` also stops a config value containing a quote from breaking out of the inline script.

**Test:** rewrite `fouc-config.test.ts` so it **executes** the script against stubbed globals instead of matching substrings. Keep the "evaluable JavaScript" test.

```ts
function runInitScript(
  stored: Record<string, string>,
  matches: (q: string) => boolean = () => false
) {
  const attrs: Record<string, string> = {}
  vi.stubGlobal('localStorage', { getItem: (k: string) => stored[k] ?? null })
  vi.stubGlobal('document', {
    documentElement: {
      setAttribute: (k: string, v: string) => {
        attrs[k] = v
      },
    },
  })
  vi.stubGlobal('window', { matchMedia: (q: string) => ({ matches: matches(q) }) })
  new Function(buildThemeInitScript('blue'))()
  vi.unstubAllGlobals()
  return attrs
}
```

Cases to cover:

- nothing stored → `blue / standard / full / full / light`
- a raw accent (`'red'`) → `data-theme-colour: red`, and the other four are still set
- a raw `'on'` for contrast → `high`, with motion, transparency and mode still set
- `'off'` → the standard/full value
- `'system'` with `matchMedia` true → the media value
- a legacy JSON-quoted `'"red"'` → `red`
- a raw `theme-mode` of `'dark'` → `dark`
- `buildThemeInitScript('rose')` with nothing stored → `rose`

**Verify:** `pnpm exec vitest run --project unit layers/design-system/theming` passes. In the playground, choose a non-default accent and turn on high contrast, then hard-reload: neither should flash back to the default.

**STOP if:** another writer of these keys appears (grep `theme-colour`, `theme-contrast`, `theme-motion`, `theme-transparency`) that stores something other than raw strings.

---

## 2. Loading-screen `minDuration` test value shipped as default — P1

**Where:** `layers/core/app/app.config.ts:37`

```ts
minDuration: 3000, // Temporarily increased for testing
```

**Problem:** this test value was added in `c273307` (2026-01-24) and shipped through v4.0.1. Every consumer that doesn't override it shows the loading screen for at least 3 s after load. KMCOMv5 is affected: its `LoadingScreen.vue` override reads `coreLayer.loading.minDuration || 500`. Before `c273307` the default was `500` (commented "Min time to show (prevents flash)"), which also matches the `|| 500` fallback in `core/app/components/LoadingScreen.vue:20`.

**Fix:** change it to `minDuration: 500, // Min time to show (prevents flash)`.

**Verify:** `grep -n "minDuration" layers/core/app/app.config.ts` shows 500. The playground loader disappears about 0.5 s after load.

**Note, not in scope:** `loading.maxDuration` is declared, typed and documented, but no logic reads it (`useLoading` uses fixed 150 ms ticks up to 90%). Leave it.

---

## 3. `useRendering().isHydrated` never updates — P2

**Where:** `layers/core/app/composables/useRendering.ts:40-51`. Consumers: `core/app/components/DiagnosticsPage.vue:18,191` and `apps/playground/app/pages/core.vue:75`.

**Problem:** `computed(() => !nuxtApp.isHydrating)`. `nuxtApp` is a plain object and `isHydrating` a plain boolean (see `node_modules/nuxt/dist/app/nuxt.js`: `isHydrating: import.meta.client`, later set to `false` right before `callHook('app:suspense:resolve')`). The computed has no reactive dependency, so it caches its first value. On a direct page load `DiagnosticsPage` shows "Hydrated: No" forever. `isHydrating` has the same problem.

**Fix:** keep the flag in SSR-safe state and flip it on the hook Nuxt calls after hydration.

```ts
// nuxtApp is a plain object, so a computed over nuxtApp.isHydrating would never re-run.
const hydrated = useState('core:rendering:hydrated', () => false)
if (import.meta.client && !hydrated.value) {
  if (!nuxtApp.isHydrating) hydrated.value = true
  else
    nuxtApp.hooks.hookOnce('app:suspense:resolve', () => {
      hydrated.value = true
    })
}
const isHydrated = computed(() => hydrated.value)
const isHydrating = computed(() => import.meta.client && !hydrated.value)
```

The server serialises `false`, so the client hydrates with `false` (no mismatch) and flips to `true` afterwards.

**Test:** add `tests/nuxt/use-rendering.test.ts`. Call `clearNuxtState('core:rendering:hydrated')` and set `useNuxtApp().isHydrating = true`, then call `useRendering()` and expect `false`. Set `isHydrating = false`, `await useNuxtApp().callHook('app:suspense:resolve')`, and expect `isHydrated` to be `true` and `isHydrating` `false`.

**Verify:** `pnpm test:nuxt` passes. In the playground, hard-load the core diagnostics page: "Hydrated" shows **Yes**.

---

## 4. `useThemeColors` can loop forever on `requestAnimationFrame` — P2

**Where:** `layers/render/shader/app/composables/useThemeColors.ts:14-32`. Used by all 7 `Preset/Theme*.client.vue` components.

**Problem:** `cssVarToHex` returns the sentinel `'#888888'` both when the CSS var is **empty** (not ready yet) and when it **can't be parsed**. `parseOKLCH` only accepts `oklch(L C H)`: no alpha, no hex, no rgb. `applyColors` treats the sentinel as "not ready" and reschedules itself with no limit. If a consumer's `--ui-color-primary-500` is hex, `rgb()` or `oklch(… / a)`, the preset calls `getComputedStyle` on every frame for the life of the page and never applies colours.

**Fix:**

1. Extract a pure, exported helper, e.g. `cssColourToHex(raw: string): string | null` in `app/utils/tsl/oklch.ts` or a new `app/utils/cssColour.ts`. It should try `parseOKLCH`, then for `/^(#|rgb|hsl)/i` fall back to `new Color().setStyle(raw)`, and return `null` for anything else. Optionally widen the `parseOKLCH` regex to accept an `/ alpha` part and a `deg` hue unit.
2. In `applyColors`: an **empty** value means "not ready", so retry for up to N frames (e.g. `MAX_RETRY_FRAMES = 30`). A **non-empty value that can't be parsed** means give up: keep the defaults and `console.warn` once in dev.

**Test:** unit-test the helper (`three`'s `Color` works in the node `unit` project):

- `oklch(62.3% 0.214 259.815)` gives a hex string
- `oklch(0.565 0.215 263)` gives a hex string
- `#3b82f6` → `#3b82f6`
- `rgb(59 130 246)` gives a hex string
- `''` → `null`
- `'garbage'` → `null`

**Verify:** unit tests pass. In the playground, a Theme preset still follows accent changes. With `--ui-color-primary-500` overridden to a hex value in devtools, there's no endless rAF in the Performance panel.

---

## 5. Contact rate limiter: spoofable key, unbounded memory — P2

**Where:** `layers/data/forms/server/api/contact.post.ts:7-31`

**Problems:**

1. **The key is spoofable.** `getRequestIP(event, { xForwardedFor: true })` (h3 1.15.11) returns the **leftmost** `X-Forwarded-For` entry, which the client controls when proxies append to the header. Sending a new header value each request bypasses the limit.
2. **Memory grows without bound.** `rateLimitStore` never evicts expired entries, so a long-running server grows forever.
3. **The limit is per instance.** It lives in memory, so it doesn't hold across serverless instances. Document this; don't fix it here.

**Fix (minimal):**

- Move the limiter into `layers/data/forms/server/utils/rateLimit.ts` as a pure function with an injectable clock:
  `checkRateLimit(store, key, now, { max = 5, windowMs = 60_000, sweepAbove = 1000 })`. When `store.size > sweepAbove`, delete expired entries first.
- Resolve the key from trusted sources only: `getRequestHeader(event, 'x-nf-client-connection-ip') ?? getRequestIP(event) ?? 'unknown'`. Netlify sets that header at its edge (confirm in Netlify's docs), and `getRequestIP` without `xForwardedFor` uses `event.context.clientAddress` or the socket address.
- Add a comment naming the ceiling: the limit is per instance; use shared storage (Nitro `useStorage` with Netlify Blobs or Upstash) if abuse ever matters.

**Test:** add `layers/data/forms/server/utils/rateLimit.test.ts` covering:

- 5 allowed, then the 6th blocked
- allowed again after the window
- separate keys are independent
- expired entries are swept once `sweepAbove` is exceeded

**Verify:** unit tests pass. Manual check against the playground: send 6 POSTs to `/api/contact` with an **invalid** body (so no email is sent; the rate check runs before validation), each with a different `X-Forwarded-For`. Expect 400 five times, then 429.

**STOP if:** the operator wants a cross-instance (shared-store) limiter. That's a design decision, not this fix.

---

## 6. `useSmoothScroll().isReady` is always `true` — P3 (latent)

**Where:** `layers/motion/scroll/app/composables/useSmoothScroll.ts:24-30`

**Problem:** `locomotiveScroll` resolves with `?? undefined`, but `isReady` checks `locomotiveScroll.value !== null`, which is always true. No in-repo consumers.

**Fix:** `const isReady = computed(() => locomotiveScroll.value !== undefined)`

**Test:** add `tests/nuxt/use-smooth-scroll.test.ts`. Use `mockNuxtImport('useNuxtApp', …)` returning `$locomotiveScroll: shallowRef(null)`, expect `isReady` to be `false`, then set an instance and expect `true`.

---

## 7. CSS-var shader uniforms ignore accent changes — P3 (latent)

**Where:** `layers/render/shader/app/composables/useCSSColourUniform.ts:29-33` and `useCSSFloatUniform.ts:21-25`

**Problem:** the `MutationObserver` on `<html>` uses `attributeFilter: ['style', 'class']`. Accent switches only change `data-theme-colour` (and contrast only `data-theme-contrast`), so the uniforms keep stale values. Colour-mode switches _are_ caught, because `@nuxtjs/color-mode` also toggles a `dark`/`light` class. No in-repo consumers; the Theme presets use `useThemeColors`, which watches `activeAccent` directly.

**Fix:** use `attributeFilter: ['style', 'class', 'data-theme-colour', 'data-theme-mode', 'data-theme-contrast']` in both files.

**Test (optional):** in the `vue` project, spy on `MutationObserver.prototype.observe` and assert that the filter includes `data-theme-colour`.

---

## 8. `useShaderTime().scaled` applies speed twice — P3 (latent)

**Where:** `layers/render/canvas/app/composables/useShaderTime.ts:28-40`

**Problem:** `tick()` already accumulates speed-scaled time: `elapsed = (now - startTime) * speed + pausedTime`. `scaled = computed(() => elapsed.value * speed.value)` applies speed again (speed²). Meanwhile `elapsedNode` and `scaledNode` both receive `elapsed`. No in-repo consumers of `scaled` or `scaledNode`.

**Fix:** `const scaled = computed(() => elapsed.value)`, plus a JSDoc note that `elapsed` is already speed-scaled animation time and that `elapsedNode` and `scaledNode` carry the same value.

**STOP if:** a consumer outside this repo turns out to rely on raw wall-clock time. In that case, track an unscaled clock separately instead.

---

## 9. Dead Tailwind v3 configs (`safelist` is ignored in v4) — P3

**Where:** `layers/core/tailwind.config.js` (loaded by `@config` at `layers/core/app/assets/css/core.css:23`) and `layers/structure/layout/tailwind.config.js` (referenced nowhere).

**Problem:** both exist only to `safelist` `/^(md|lg):(col|row)-(start|span)-[0-9]+$/`. Tailwind 4.3.3 never reads `safelist`: the string `safelist` appears nowhere in `tailwindcss/dist`. The layout file also carries a v3 `content` array. Grid placement now uses CSS custom properties (`Layout/Grid/Item.vue`), and the only literal `lg:col-span-*` classes are in playground pages, which are scanned normally.

**Fix:** delete `layers/structure/layout/tailwind.config.js`. Delete `layers/core/tailwind.config.js` and the `@config '#layers/core/tailwind.config.js';` line in `core.css` too: that file holds nothing else (`theme.extend: {}`, `plugins: []`).

**STOP if:** `grep -rnE "\`(md|lg):(col|row)-|'(md|lg):(col|row)-" layers --include='_.vue' --include='_.ts'`finds class names built dynamically. In that case replace the safelist with`@source inline("{md:,lg:}{col,row}-{start,span}-{1..18}");`in`core.css` instead of deleting it.

**Verify:** `pnpm typecheck` and `pnpm test` pass. `pnpm dev`: the playground's grid and shader pages render unchanged.

---

## 10. `useElementStyle` creates a computed inside a computed — P3

**Where:** `layers/core/app/composables/useElementStyle.ts:21-37` and `useLayoutAttrs.ts`

**Problem:** the outer `computed` calls `useLayoutAttrs(...)` on every evaluation, and that allocates a new `computed` each time, per `Element`/`ElementTw` instance, on every prop change.

**Fix:** extract a pure `resolveLayoutAttrsStyle(input: LayoutAttrsInput): CSSProperties` out of `useLayoutAttrs`. `useLayoutAttrs` then becomes `computed(() => resolveLayoutAttrsStyle(toValue(input)))`, and `useElementStyle` calls the pure function directly.

**Verify:** the existing tests stay green: `core/app/composables/useLayoutAttrs.test.ts`, `core/app/components/Element.test.ts`, `ElementTw.test.ts` and `tests/nuxt/use-layout-attrs.test.ts`. Add a unit test for `resolveLayoutAttrsStyle`.

---

## 11. Small cleanups — P3

1. `layers/design-system/theming/app/assets/css/theme.css:38-39` has `backdrop-filter: none !important;` twice. Delete one (Safari 18+ supports the unprefixed property).
2. `layers/content/app/components/Gallery/Lightbox.vue` keeps its global `keydown` listener active while closed, so arrow keys change `currentIndex` in the background. Add `if (!open.value) return` at the top of `onKeydown`.
3. `layers/core/nuxt.config.ts` has the comment "Force light mode for consistent appearance" above `colorMode: { preference: 'system', fallback: 'light' }`. Reword it to match what the config does.
4. _Optional:_ the `@source '../../../../*/app/**/*.{vue,ts}'` glob in `core.css:28` only matches `layers/core` and `layers/content` since the v4 regrouping. It's also redundant: `@nuxt/ui` generates an `@source` for every extended layer's `app/` (seen in a consumer's `.nuxt/ui.css`). Delete lines 28–29, then check that no HMR layout shift comes back in `pnpm dev`. If it does, restore them with `'../../../../*/*/app/**/*.{vue,ts}'` added.

---

## Done criteria

- [ ] Status table updated for every row
- [ ] `pnpm test` passes, with new tests for bugs 1, 3, 4 and 5 (and 6 and 10 if done)
- [ ] `pnpm typecheck`, `pnpm lint` and `pnpm format:check` pass
- [ ] `pnpm dev` boots; the theme picker survives a hard reload with no flash (bug 1); the loader clears in about 0.5 s (bug 2)
- [ ] One conventional commit per bug; nothing pushed or published

## After release (operator)

KMCOMv5-frontend pins `kmcom-nuxt-layers` at `4.0.1`. Bugs 1 and 2 are visible on the live site, so bump the consumer once a release containing them is published.
