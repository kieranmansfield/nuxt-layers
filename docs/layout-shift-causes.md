# Layout Shift Root Causes

Catalogue of layout shift (CLS) issues found and fixed in this monorepo, with root cause and resolution for each.

---

## 1. `Math.random()` SVG gradient ID — `Progress/Circular.vue`

**Cause:** `Math.random()` produces a different value on every call. Server and client generate different IDs for the `linearGradient`, so the `stroke="url(#...)"` reference breaks after hydration.

**Fix:** Replace with Nuxt's `useId()` which produces the same deterministic ID across server and client for a given component instance.

---

## 2. Locale-dependent date formatting — `Blog/Article.vue`

**Cause:** `new Date().toLocaleDateString()` with no locale argument uses the runtime's default locale. Node.js (server) and the browser may have different default locales, producing different date strings.

**Fix:** Pass an explicit locale string: `toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })`.

---

## 3. Year computed independently on server and client — `Mast/Footer.vue`

**Cause:** `new Date().getFullYear()` is evaluated independently on server and client. Around year boundaries (different timezones, late-night requests) the two values can differ.

**Fix:** Use `useState('footer-year', () => new Date().getFullYear())` so the year is serialised in the Nuxt payload and reused by the client without re-computing.

---

## 4. Feature flags all `false` on server — `DiagnosticsPage.vue`

**Cause:** `useFeatures()` detects browser capabilities which are unavailable on the server, so all flags default to `false`. The server renders `✗` for every feature; the client flips many to `true`, causing mismatches on every `v-if`.

**Fix:** Wrap the content in `<ClientOnly>` — browser capability detection is inherently client-only.

---

## 5. Theme composables using `useLocalStorage` — theme layer

**Cause:** `useLocalStorage` reads from localStorage which doesn't exist on the server. The server renders with the default value; the client reads the user's saved preference and produces different output.

**Fix:** Replace `useLocalStorage` with `useState` (SSR-safe, serialised to the Nuxt payload). A `.client.ts` plugin reads localStorage post-hydration and calls the setters to restore preferences — a deliberate two-phase update that avoids the mismatch.

---

## 6. Tailwind 4 `@config` restricting content scanning — `core.css`

**Cause:** The `tailwind.config.js` loaded via `@config` contained a `content:` array pointing only to the core layer's files. In Tailwind 4, this array restricts scanning to those paths, so utilities from `ui`, `layout`, `theme`, etc. layers were absent from the initial CSS bundle. In dev mode, Tailwind discovers them lazily via HMR, causing a visible shift.

**Fix:** Remove the `content:` array from `tailwind.config.js`. Tailwind 4's Vite plugin auto-discovers all Vite-processed files. Also added `@source` globs in `core.css` covering all layer and app directories for belt-and-suspenders eager scanning.

---

## 7. Vite CSS code splitting deferring stylesheets

**Cause:** Vite's default `cssCodeSplit: true` bundles CSS with the JS chunk that imports it. CSS for lazily-loaded components only arrives when that JS chunk is first requested, leaving the initial render unstyled.

**Fix:** Set `cssCodeSplit: false` in the playground app's `vite.build` config to merge all CSS into one bundle loaded at first paint.

---

## 8. `@layer` in a CSS file not processed by Tailwind — `ui.css`, `theme.css`

**Cause:** Using `@layer utilities { ... }` or `@layer base { ... }` inside a CSS file loaded via Nuxt's `css: []` array (not via `@import 'tailwindcss'`) creates a raw CSS cascade layer declaration outside Tailwind's pipeline. The browser processes this as a separate layer, triggering a style recalculation after initial paint.

**Fix:** Replace `@layer` blocks with plain selectors in any CSS file that isn't processed by Tailwind. Only CSS files that contain `@import 'tailwindcss'` should use `@layer`.

**Rule:** Never use `@layer` (or `@utility`) in a file loaded via `css: []` unless it also imports Tailwind.

---

## 9. `NuxtAnnouncer` / `NuxtRouteAnnouncer` inside a CSS grid — `app.vue`

**Cause:** `<NuxtAnnouncer>` and `<NuxtRouteAnnouncer>` were inside the `<NuxtLayout>` slot, making them direct children of the `mastmain` CSS grid. Before their `position: absolute` CSS loaded, they auto-placed as grid rows and pushed the `basesection` down by ~85px. When the CSS loaded and removed them from grid flow, the section jumped back up.

**Fix:** Remove `<NuxtAnnouncer>` and `<NuxtRouteAnnouncer>` entirely — they are boilerplate and not needed in this project.

---

## 10. Layout header hydration mismatch — `ui/layouts/default.vue`

**Cause:** The layout used `resolveComponent('MastHeader')` at runtime to detect whether a header component existed. In Nuxt 4, components are registered via compile-time auto-imports, not via `app.component()`, so `resolveComponent` always returns a string at runtime. Server-side Vue resolves it differently, so the header rendered on the server but not after client hydration — causing the section to shift up by the header height.

**Fix:** Remove the `resolveComponent` guard. The layout always renders `<MastHeader />` and `<MastFooter />` unconditionally; the components themselves handle empty states via `appConfig`.

---

## Key Rules Going Forward

- Never use `@layer` / `@utility` in CSS files loaded via `css: []` — use plain selectors instead.
- Never use runtime `resolveComponent` to conditionally render components in Nuxt 4 — components are compile-time, not runtime-registered.
- Use `useState` (not `useLocalStorage`) for any value rendered during SSR that might differ between server and client.
- Keep accessibility-only elements (`aria-live` regions, announcers) outside CSS grid containers to prevent them participating in grid flow.
