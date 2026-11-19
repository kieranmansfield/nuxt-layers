# Layer Taxonomy Redesign — Part 7: Tier 7 (Delivery)

## Scope

Forensic audit of `seo`, `scripts`, `feeds`, plus the `baseline` → `scripts` merge carried over
as an open decision from Tier 0-1. Cleanup-only pass, per user direction from Tier 6.

## Findings and resolution

### `seo`: stale `OgImageBasic` fallback — fixed (real bug, low severity)

`resolveOgImageConfig()`'s fallback (used only when `seoLayer` config is entirely absent) still
returned `'OgImageBasic'` — the old default, already fixed at the `app.config.ts` level to
`'OgImageNuxtSeo'` in an earlier session (`OgImageBasic` doesn't exist in `nuxt-og-image@6`). The
fallback path is effectively dead in practice (app.config always provides `seoLayer`), but the
stale value was still wrong and the test asserted the same stale value. **Fixed**: fallback and
test both updated to `'OgImageNuxtSeo'`.

### `scripts/app/types/` — dead duplicate types — deleted

`types/scripts.ts` exported `LoadStrategy`, `ScriptLoaderOptions`, and `AnalyticsProxy` — zero
consumers anywhere. `useScriptLoader.ts` declares its own local `LoadStrategy`/
`ScriptLoaderOptions` instead of importing the "shared" ones, and `AnalyticsProxy` was unused even
internally (the real type in use is `AnalyticsClient` in `scriptClients.ts`). **Fixed**: deleted
`types/scripts.ts` and `types/index.ts`, removed the now-pointless `#layers/scripts/types` alias.

### `baseline` merged into `scripts` — done (user decision, carried over from Tier 0-1)

`baseline` was 3 files (`BaselineStatus.vue`, a client plugin registering the `baseline-status`
web component, an `isCustomElement` compiler config) — a third-party embed integration, the same
shape as `scripts`' existing analytics/GTM facades, not a standalone tier member. **Done**: moved
`BaselineStatus.vue` and `baseline-status.client.ts` into `layers/scripts/app/`, added the
`isCustomElement` compiler option and the `baseline-status` dependency to `scripts`, deleted
`layers/baseline`, removed `baseline` from the playground's `AVAILABLE_LAYERS`/`LAYER_PATHS`/
`LAYER_DEPENDENCIES`. Component name is unchanged (`BaselineStatus`, auto-imported by filename
regardless of layer), so `apps/playground/app/pages/baseline.vue` and `index.vue` needed no edits.

## Confirmed correct, no action

- `seo`: `nuxt.config.ts` (`@nuxtjs/seo` module + `site` config), `app.config.ts` (correct
  `defineAppConfig()` + colocated `declare module`), `useSeoConfig`/`resolveSeoConfig` — real,
  consumed by `apps/playground/app/pages/seo.vue`, well-tested (`seoConfig.test.ts`, now updated).
- `scripts`: `app.config.ts` (correct structure), `useAnalytics`/`useGtm`/`useScriptsConsent`/
  `useScriptLoader`/`useYoutubeEmbed`, `scriptClients.ts` (provider factories: ga4/plausible/
  fathom/GTM, consent-gated triggers, noop fallbacks) — all real, consumed by
  `apps/playground/app/pages/scripts.vue`.
- `feeds`: `nuxt.config.ts`'s conditional `extends` (empty unless `FEEDS_STANDALONE` env var is
  set) looks like the "don't rely on load order" anti-pattern at first glance, but it isn't — the
  playground's own `LAYER_DEPENDENCIES` mechanism (`feeds: ['core', 'content']`) is the actual
  dependency-injection path for this repo's layer resolver, and the env-conditional `extends`
  exists specifically to let `feeds` also be consumed as a truly standalone layer outside this
  playground. `app.config.ts`, `feed-catalog.ts` (collection resolution, missing-collection
  warnings), `feed-head.ts` plugin (auto-discovery `<link rel="alternate">` tags), `feed-service.ts`,
  all `server/routes/feed/**` handlers (sampled `rss.get.ts`, `index.get.ts` — consistent), `Feeds/
  Index.vue`, `Feeds/RouteCard.vue` — real, thorough, already well-tested
  (`content-adapter.test.ts`, `feed-author.test.ts`, `feed-config.test.ts`, `formats.test.ts`),
  consumed by `apps/playground/app/pages/feeds.vue`.

## Consolidated action list (Tier 7)

- [x] Fix stale `OgImageBasic` fallback + test in `seo`
- [x] Delete dead `scripts/app/types/` (unused duplicate types)
- [x] Merge `baseline` into `scripts`, delete the `baseline` layer, update playground registration

## Not yet covered

That closes the 8-tier sweep (Foundation → Design System → Structure → Content → Data → Motion →
Render → Delivery). Still pending from earlier tiers, none touched this pass: `theme`'s
`app.config.ts` structural defect and the `theme`→`theming` rename, `typography`'s font-prop
infrastructure, breakpoint token consolidation, `AppContainer` clamp() conversion,
`compatibilityVersion: 5` flip, `error.vue` real implementation, `starter` layer relocation into
`apps/`, `useMetadataItem`'s fate, the openlibrary/google-books provider error-handling
divergence, and the 8 zero-consumer `shader` composables left open in Tier 6.
