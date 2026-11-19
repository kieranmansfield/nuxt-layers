# Layer Taxonomy Redesign — Part 5: Tier 5 (Motion)

## Scope

Forensic audit of `scroll`, `animations`, `transitions`, `page-transitions`, `motion`. Every
real file read, every composable/component traced to actual consumers via grep.

## Findings and resolution

### `scroll` app.config: dead `lenis`/`gsapScrollTrigger` keys — fixed (user decision)

`app/app.config.ts` declared a `lenis` options block (duration, orientation, smoothWheel, etc.)
and a `gsapScrollTrigger` flag. `locomotive-scroll.client.ts` never read either — it hardcodes
its own `lenisOptions` (`lerp`, `smoothWheel`, `wheelMultiplier`) directly in the
`new LocomotiveScroll(...)` call and always calls `ScrollTrigger.update()` unconditionally.

User's call: Locomotive Scroll v5 already wraps Lenis internally, so a separate top-level
`lenis` config key is redundant. **Fixed**: stripped `lenis` and `gsapScrollTrigger` from
`app.config.ts`, keeping only `smoothScroll` (the one key actually read, by
`useSmoothScroll.ts` and the plugin).

### `page-transitions`: reactive state never drove a real transition — fixed (user decision)

`usePageTransition()` / `page-transitions.client.ts` maintained a `page-transition:current`
`useState`, but nothing bound it to Nuxt's actual route-transition mechanism — no `:transition`
on `NuxtPage`, no `page-enter`/`page-leave` CSS. Real navigations never visually transitioned;
only the playground's `/page-transitions` demo page visualized the state via `MotionTransition`.

**Fixed**: added `layers/page-transitions/app/assets/css/page-transitions.css` (fade/slide/default
enter-leave classes, duration driven by a `--page-transition-duration` CSS custom property),
registered via `css:` in `nuxt.config.ts`. `usePageTransition()` now sets that CSS var reactively
via `watchEffect` (client-only). `apps/playground/app/app.vue` binds
`<NuxtPage :transition="{ name: transitionName, mode: 'out-in' }" />`, sourced from
`usePageTransition()`.

### `animations` missing `transitions` layer dependency — fixed (real bug)

`Motion/Staggered.vue` applies `animate-${animation}` classes that are only defined in the
`transitions` layer's CSS (`animate-fade-in`, `animate-slide-in-up`, etc.), but
`animations/nuxt.config.ts` only declared `extends: ['../scroll']` — not `transitions`. Relying
on the playground's load order to happen to also load `transitions` is exactly the anti-pattern
the repo's own `nuxt-layers.md` rule warns against. **Fixed**: `extends: ['../scroll',
'../transitions']`.

### `Motion/Staggered.vue`: `animation` prop default didn't match any real CSS class — fixed (real bug)

Default `animation = 'fadeIn'` produced class `animate-fadeIn`; the actual CSS (now confirmed
reachable per the fix above) only defines kebab-case classes (`animate-fade-in`,
`animate-slide-in-up`, ...). The mismatch was cosmetic in practice (the component's own
`.animated` rule unconditionally sets `opacity: 1` regardless of which named class matched), but
the specific keyframe animation silently never played. **Fixed**: default changed to `'fade-in'`,
prop doc comment clarifies it's a `transitions` layer `animate-*` suffix.

### `Motion/Marquee.vue`: dead commented-out `<style>` block — fixed

Trailing HTML comment held a fully-commented-out, stale `<style scoped>` block (superseded by
Tailwind utility classes already on the template). **Fixed**: deleted.

### `animations/app/types/` — dead duplicate type, unused alias — fixed

`types/animations.ts` exported `UseCountUpOptions`, but `useCountUp.ts` declares its own local
`UseCountUpOptions` and never imports the "shared" one — the exported type had zero consumers
anywhere in the repo (verified via grep), and the `#layers/animations/types` alias was also
unconsumed externally. **Fixed**: deleted `types/animations.ts` and `types/index.ts`, removed the
now-pointless alias entry from `nuxt.config.ts`. `useCountUp.ts`'s local type is untouched — one
producer, one consumer, no need for a shared export.

### `motion` layer: fictional README + dead stub component — fixed (user decision)

`motion/README.md` documented an API that has never existed in this layer: `useMotion`,
`useTransition`, `useAnimation` composables, a `$motion` plugin, `<MotionTransition>` and
`<MotionStaggered>` described as if built here (they're real, but live in `transitions` and
`animations` respectively). `motion/app/components/Motion/index.vue` was a dead stub (just
wraps `<slot />`) with zero consumers anywhere. `TASKS.MD` was an unrelated stray to-do note.

**Fixed**: rewrote `README.md` to describe `motion` accurately — a pure orchestrator with no
components/composables of its own, just an `extends` list, plus a table pointing at which real
layer provides what. Deleted the dead stub component and `TASKS.MD`. Left
`docs/MarqueeText.md` as-is — it's accurate, and `motion` is a reasonable place for
orchestrator-level consumer docs even though the component itself lives in `animations`.

## Confirmed correct, no action

- `scroll`: `useGsap`, `useSmoothScroll`, `useSectionProgress`, `useScrollSteps`,
  `locomotive-scroll.client.ts`, `utils/scroll.ts` — all real, correctly cleaned up (GSAP
  tweens/ScrollTriggers killed in `onUnmounted`, confirmed against prior-session fixes for the
  HorizontalScroll/PinnedSection cleanup and FOUC bugs). All 8 `Motion/*` scroll components
  (`HorizontalScroll`, `Parallax`, `PinnedSection`, `ScrollLink`, `ScrollProgress`,
  `ScrollScene`, `ScrollStats`, `ScrollStep`) traced to real consumers in the playground
  (`/scroll`, `/scrollytelling`, `/locomotive-scroll`, `/layout-blind-reveal`,
  `/layout-stacking`, `/motion`).
- `animations`: `useMarqueeVelocity`, `useMarqueeCopies`, `useCountUp`, `useCursorFollower`,
  `useMagneticElement`, `useTiltEffect`, `pointerMotion.ts` (shared spring-physics helper) — real,
  correctly ticker-based (GSAP `gsap.ticker.add`/`remove` pairs, no leaks). All 9 `Motion/*`
  components traced to consumers (`/animations`, `/motion`, `/motion-interactions`,
  `/marquee-text`, `/locomotive-scroll`).
- `transitions`: `transitions.css` (transition/animation utility classes), `Motion/Transition.vue`
  — real, consumed by `/transitions` and `/page-transitions`.
- `page-transitions`: `app.config.ts` structure already correct (colocated `declare module`,
  8th-tier-audit pattern holds here without needing a fix).
- `motion`: `nuxt.config.ts` — correct orchestrator `extends` list, no runtime code of its own
  beyond what was fixed above.

## Consolidated action list (Tier 5)

- [x] Strip dead `lenis`/`gsapScrollTrigger` keys from `scroll/app/app.config.ts`
- [x] Wire `usePageTransition` state to a real Nuxt page transition (CSS + `NuxtPage :transition`)
- [x] Add missing `transitions` dependency to `animations/nuxt.config.ts`
- [x] Fix `Motion/Staggered.vue`'s default `animation` prop to match real CSS class names
- [x] Delete dead commented-out `<style>` block in `Motion/Marquee.vue`
- [x] Delete unused `animations/app/types/` (dead duplicate type + unused alias)
- [x] Rewrite `motion/README.md`, delete dead `Motion/index.vue` stub and stray `TASKS.MD`

## Not yet covered

Tiers 6 (Render: `canvas`, `shader`), 7 (Delivery). Also still pending from earlier tiers:
`theme`'s and `shader`'s `app.config.ts` structural defects, `useMetadataItem`'s fate, the
openlibrary/google-books provider error-handling divergence, and the larger deferred Tier 0-2
structural items (ui-layer dissolution, `.mastmain` rename, `theme`→`theming` rename, typography
font-prop system, breakpoint token consolidation, `AppContainer` clamp() conversion,
`compatibilityVersion: 5` flip, `error.vue` real implementation, `starter` layer audit).
