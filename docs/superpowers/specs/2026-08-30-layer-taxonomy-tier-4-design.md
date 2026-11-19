# Layer Taxonomy Redesign — Part 4: Tier 4 (Data)

## Scope

Forensic audit of `database`, `auth`, `metadata` (+ 4 providers: `comicvine`, `openlibrary`,
`google-books`, `themoviedb`), `forms`, `mailer`. Every real file read, every composable/route
traced to actual consumers via grep.

## Findings and resolution

### `mailer`: runtime-config augmentation split + wrong module — fixed

`mailer/nuxt.config.ts` declared `runtimeConfig.mailerLayer` but had no `declare module
'@nuxt/schema'` block at all. Instead `server/types.d.ts` augmented `declare module 'nitropack' {
interface NitroRuntimeConfig }` — a different ambient module than every other layer uses, and
still split into a separate file. `database` (same tier) shows the correct pattern: augmentation
inline in `nuxt.config.ts` targeting `@nuxt/schema`.

**Fixed**: moved the augmentation into `mailer/nuxt.config.ts` as `declare module '@nuxt/schema' {
interface RuntimeConfig }`, deleted `server/types.d.ts`.

### `forms`: app.config.ts structural defect — fixed (8th instance)

Same repeat defect as `core`/`layout`/`routing`/`content` (Tiers 0-3): bare `export default
{...}`, augmentation split into `app/types/app-config.d.ts`. Fixed identically:
`defineAppConfig()`, merged `declare module` into the same file, deleted the `.d.ts`.
`theme` and `shader`'s own instances of this are still pending — not this tier's layers.

### `metadata` providers: `type RuntimeConfig` instead of `interface RuntimeConfig` — fixed (real bug)

`comicvine`, `google-books`, `themoviedb`'s `nuxt.config.ts` each declared:

```ts
declare module '@nuxt/schema' {
  type RuntimeConfig = { ... }
}
```

A `type` alias inside a `declare module` block does not merge with the ambient `RuntimeConfig`
interface the way `interface RuntimeConfig { ... }` does — every other augmented `RuntimeConfig` in
the repo (`database`, `mailer`) uses `interface`. With `typeCheck: false` this was silently
masked, but it's wrong and would break under a real typecheck (duplicate/non-merging declaration
of the same global name three times). `openlibrary` has no runtime config (public API, no key) so
it was unaffected.

**Fixed**: `type RuntimeConfig` → `interface RuntimeConfig` in all three.

## Confirmed correct, no action

- `database`: `useSql()`/`useDrizzle()` — minimal, correct, real. `nuxt.config.ts` augmentation
  pattern is the reference example other layers should match.
- `auth`: `nuxt-auth-utils` + GitHub OAuth handler + opt-in `auth` middleware — real, correct,
  appropriately thin (session/oauth runtimeConfig keys belong to the module, not custom, so no
  augmentation needed).
- `metadata` core: `provider-registry.ts`, `cache.ts` (memory-storage `useStorage('metadata')`,
  documented as non-persistent across restarts — acceptable for a demo/dev cache), `search.ts`
  (parallel provider fan-out via `Promise.all` + per-provider try/catch + dedup + cache), all four
  `server/api/metadata/*.get.ts`/`sync.post.ts` routes — real, correct, well-built.
- All four providers' `provider.ts`/`normalise.ts`/`types.ts` — real, correctly registered via
  `server/plugins/*-register.ts`, correctly composed in the playground's `metadata.vue` (search,
  provider registry list, live status check).
- `forms`: `useFormSchema`, `fieldConfigs` registry (`FieldType` derived from `keyof typeof`),
  `Form/Contact.vue` + `Form/Field.vue`, `contact.post.ts` (rate-limited, hook-driven), all real
  and correctly wired end to end (verified via the playground `/forms` and `/mailer` pages).
- `mailer`: `sendContactEmail`, `mailerLayerHooks` (hookable-based `contact:submitted/sent/failed`
  hooks, consumed by `forms/server/api/contact.post.ts`) — real, correctly layered.

## Resolved this pass (user decision)

### `useMetadataSearch` — wired up, duplicate logic in the page deleted

User chose: wire the composable up rather than delete it. `useMetadataSearch` now takes
`mediaType`/`providers`/`limit` as `MaybeRef` and an optional `debounceMs` (default 300, via
`refDebounced` internally — closes the previously-flagged missing-debounce gap instead of leaving
it patched only at the call site). `metadata.vue` was migrated onto it: the manual
`refDebounced`/`$fetch`/loading/error state block is gone, replaced by
`useMetadataSearch(rawQuery, { mediaType, limit: 20 })` and `status`-derived `isLoading`/
`hasSearched`. Verified template usages (`results?.length`, `error.message`, `v-for="item in
results"`) still resolve correctly against the new `data`/`status`/`error` shape.

`useMetadataItem` remains unwired (no lookup/detail page exists) — user explicitly deferred that
decision (build a detail page vs. delete) rather than resolving it now. Still open.

## Open — needs a decision, not implemented this pass

### `useMetadataItem` — still no consumer

Deferred per above. Left in place, not deleted, pending a decision on whether a lookup/detail page
gets built for it.

### Provider error-handling divergence (confirmed, pre-existing finding; deferred, low severity)

`comicvine` (`status_code !== 1` check) and `tmdb` (try/catch wrapper) throw `MetadataProviderError`
from their client layer. `openlibrary` and `google-books` let raw `$fetch` errors propagate
unwrapped (except `openlibrary`'s `lookupByIsbn`, which swallows to `null`). Harmless on the
`/search` path — `searchMetadata()` already catches per-provider and degrades gracefully — but
`/lookup` and `/sync` have no top-level try/catch, so an openlibrary/google-books failure surfaces
as an opaque Nitro fetch error instead of a clean `MetadataProviderError`-shaped one. Low severity,
cosmetic-on-error-message only. Left open — fixing means adding the same try/catch wrapper to two
more clients, a bounded fix but not done here pending direction on the composable question above
(same investigation pass, similar size).

## Consolidated action list (Tier 4)

- [x] Fix `mailer/nuxt.config.ts` runtime-config augmentation (wrong module + split file)
- [x] Fix `forms/app/app.config.ts` structural defect (8th instance of the repeat pattern)
- [x] Fix `type RuntimeConfig` → `interface RuntimeConfig` in comicvine/google-books/tmdb
- [x] Wire `useMetadataSearch` into `metadata.vue` (with debounce fixed), delete duplicate logic
- [x] `useMetadataItem` — user decision: keep as-is, unwired. Intended as a standalone composable
      for future projects to consume directly, not necessarily via a playground page. Not dead
      code, not building a page for it.
- [x] Normalised openlibrary/google-books client error handling — wrapped `searchOpenLibrary`,
      `lookupOpenLibraryWork`, `lookupOpenLibraryEdition`, `searchGoogleBooks`,
      `fetchGoogleBooksVolume` in try/catch throwing `MetadataProviderError`, matching
      comicvine/tmdb. Left `lookupByIsbn`'s swallow-to-null alone (deliberate not-found handling,
      zero real callers either way).

## Not yet covered

Tiers 5 (Motion), 6 (Render), 7 (Delivery). Also still pending from earlier tiers: `theme`'s and
`shader`'s app.config.ts structural defects, and the larger deferred Tier 0-2 structural items
(ui-layer dissolution, `.mastmain` rename, `theme`→`theming` rename, typography font-prop system,
breakpoint token consolidation, `AppContainer` clamp() conversion, `compatibilityVersion: 5` flip,
`error.vue` real implementation, `starter` layer audit).
