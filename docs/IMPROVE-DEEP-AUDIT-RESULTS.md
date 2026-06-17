# Improve Deep Audit Results

Deep audit written against commit `a2805da` on 2026-06-17.

## Scope

This pass expanded the earlier improve audit across the Nuxt 4 pnpm workspace. It reviewed root tooling, recursive package scripts, published package surfaces, server routes, content composables, feeds, forms and mailer, routing, dependency posture, CSS quality, Fallow health, duplication, dead-code leads, feature flags, and local security candidates.

This pass stayed read-only for source code. It did not read `.env` files. It did not run `pnpm build` because that writes build artifacts. Ignored/generated folders were excluded from findings unless a tool accidentally scanned them; those noisy results were discarded and rerun against tracked source where possible.

## Verification Summary

| Command | Result | Notes |
| --- | --- | --- |
| `pnpm typecheck` | PASS | Root `vue-tsc --noEmit -p tsconfig.typecheck.json` passed. |
| `pnpm -r --if-present --workspace-concurrency=1 --no-bail typecheck` | PASS | Recursive package typecheck completed successfully across workspace packages. |
| `pnpm -r --if-present --workspace-concurrency=1 --no-bail lint` | FAIL | 23 packages passed, `kmcom-layer-feeds` failed on one ESLint error. The run also reported 63 warnings. |
| `pnpm format:check` | FAIL | Reports unknown `ignorePath` config option and 309 formatting failures, including local `.agents` content. |
| `git ls-files '*.css' \| xargs pnpm exec stylelint --allow-empty-input` | FAIL | Tracked CSS only: 96 problems, 84 errors and 12 warnings. |
| `pnpm audit --audit-level high --prod --json` | FAIL | 2 high advisories: `esbuild` and `ws`. Metadata also reports 1 low and 1 moderate advisory. |
| `fallow health --hotspots --targets --format json --quiet` | COMPLETE | 651 files, 2825 functions, 147 functions above Fallow thresholds. |
| `fallow dupes --top 20 --format json --quiet` | COMPLETE | 467 files, 147 with clones, 5593 duplicated lines in the top clone set, 9.18% duplication. |
| `fallow dead-code --unused-deps --unused-files --unused-exports --format json --quiet` | COMPLETE | 260 cleanup candidates: 43 files, 190 exports, 27 dependencies. Treat as trace-required leads. |
| `fallow flags --format json --quiet` | COMPLETE | No feature flags detected by Fallow, despite routing runtime flags being hand-implemented. |
| `fallow security --surface --format json --quiet` | COMPLETE | One low-severity weak-hash candidate in feed ETag generation. |

## Confirmed Findings

| Priority | Finding | Impact | Effort | Confidence | Evidence |
| --- | --- | --- | --- | --- | --- |
| P0 | Public forms status endpoint exposes configured email addresses. | Any visitor can read operational sender and recipient addresses, increasing spam and metadata exposure. | S | HIGH | `layers/forms/server/api/forms/status.get.ts:4`, `layers/forms/server/api/forms/status.get.ts:7`, `apps/playground/app/pages/forms.vue:662`, `apps/playground/app/pages/forms.vue:675` |
| P0 | Contact email endpoint has no server-side abuse controls. | The public POST path can burn Resend quota, spam the configured recipient, and create noisy hooks. | M | HIGH | `layers/forms/server/api/contact.post.ts:11`, `layers/forms/server/api/contact.post.ts:22`, `layers/mailer/server/utils/email.ts:17` |
| P0 | Production dependency audit has high advisories. | `pnpm audit` reports high-severity `esbuild` and `ws` paths in production dependency graphs. | S/M | HIGH | `pnpm-lock.yaml:6770`, `pnpm-lock.yaml:6775`, `pnpm-lock.yaml:12275`, `package.json:106`, `package.json:112`, `package.json:115` |
| P1 | Content list composables reuse cache keys while accepting different query options. | Calls with different `tags`, `limit`, `featured`, or `excludeDrafts` can share or cancel the wrong `useAsyncData` payload. | S/M | HIGH | `layers/content/app/composables/useContentData.ts:1`, `layers/content/app/composables/useBlogPosts.ts:3`, `layers/content/app/composables/useBlogPosts.ts:6`, `layers/content/app/composables/useGalleryItems.ts:3`, `layers/content/app/composables/usePortfolioItems.ts:3`, `layers/content/app/composables/createPortfolioComposables.ts:20` |
| P1 | Published server files are outside root typecheck and type-aware lint. | `layers/*/server/**` ships in the package but is excluded from root typechecking and has type-aware ESLint disabled. | M | HIGH | `package.json:37`, `tsconfig.typecheck.json:25`, `eslint.config.mjs:387`, `eslint.config.mjs:390` |
| P1 | Main lint baseline is red. | Recursive lint has one hard error, so CI or pre-commit adoption cannot rely on lint yet. | S | HIGH | `layers/feeds/server/utils/content-adapter.ts:25`, recursive lint summary: 1 fail, 23 pass |
| P1 | Format baseline is noisy and includes local agent assets. | `pnpm format:check` fails on 309 files and warns that `ignorePath` is not a valid config option. The ignore file does not exclude `.agents/` or `.claude/`. | S | HIGH | `prettier.config.cjs:46`, `.prettierignore:1`, `.prettierignore:85` |
| P1 | No tracked behavior tests exist. | Feed serialization, forms/mailer, routing governance, content composables, and shader utilities rely on manual checks plus lint/typecheck. | M/L | HIGH | `package.json:41`, `package.json:246`; `git ls-files` found no `*.test.*`, `*.spec.*`, `tests`, or `__tests__` paths. |
| P2 | Feed dynamic collection routes accept arbitrary collection names. | `/feed/:collection/:format` passes unvalidated path segments into `queryCollection(event, collection)`, so invalid collections become uncontrolled content-query failures instead of 404s. | S | HIGH | `layers/feeds/server/routes/feed/[collection]/rss.get.ts:2`, `layers/feeds/server/utils/content-adapter.ts:28`, `layers/feeds/app/app.config.ts:5`, `layers/feeds/server/routes/feed/discovery.get.ts:20` |
| P2 | Feed generation fetches whole collections before filtering and limiting. | Large collections make every feed request filter, sort, and slice in memory instead of pushing draft/date/limit work into the Nuxt Content query. | M | HIGH | `layers/feeds/server/utils/content-adapter.ts:61`, `layers/feeds/server/utils/content-adapter.ts:63`, `layers/feeds/server/utils/feed-service.ts:16` |
| P2 | Feed date handling can turn bad frontmatter into runtime feed failures. | `new Date(...)` is not validated before `toISOString()`. Invalid dates can crash JSON or Atom serialization. | S | MED | `layers/feeds/server/utils/content-adapter.ts:50`, `layers/feeds/server/utils/formats/json.ts:16`, `layers/feeds/server/utils/formats/atom.ts:13`, `layers/feeds/server/utils/formats/atom.ts:22` |
| P2 | CSS lint rules are configured but tracked CSS fails them. | Stylelint reports 84 errors and 12 warnings against tracked CSS only, mostly token fallback hex colors, import ordering, keyframe casing, and deprecated properties. | M | HIGH | `stylelint.config.mjs:48`, `stylelint.config.mjs:123`, `layers/core/app/assets/css/core.css:6`, `layers/feeds/public/feed/style.css:15`, `layers/feeds/app/assets/css/feeds.css:20` |
| P2 | Routing runtime flags have a client fetch contract but no shipped endpoint. | Product and enterprise presets enable `runtimeFlags`, and the client fetches `/api/feature-flags`; the layer does not provide that server route. Consumers need an explicit contract or optional route. | S/M | HIGH | `layers/routing/app/plugins/feature-flags.client.ts:8`, `layers/routing/app/plugins/feature-flags.client.ts:12`, `layers/routing/app/types/routing.ts:47`, `layers/routing/app/types/routing.ts:56` |
| P3 | Feed ETag generation uses MD5. | This is not password/signature crypto, but modern cache fingerprints should use SHA-256 to avoid weak-crypto findings. | S | HIGH | `layers/feeds/server/utils/cache.ts:5` |

## Structural Findings

Fallow health reports the codebase is broadly maintainable but has concentrated complexity. It analyzed 651 files and 2825 functions; 147 functions exceed Fallow thresholds, with 28 critical, 37 high, and 82 moderate findings. The hottest files include `layers/feeds/server/utils/feed-service.ts`, content composables, `layers/layout/app/components/Layout/Grid/Item.vue`, theme/client plugin code, scroll helpers, and large shader playground pages.

The shader area is the largest duplication cluster. Fallow dupes reports 5593 duplicated lines in the top clone set, with repeated shader pipeline color watchers across 29 components, repeated material mouse uniform watchers across 8 components, and repeated theme preset boilerplate across 7 components. Evidence starts at `layers/shader/app/components/Pipeline/Aurora.client.vue:41`, `layers/shader/app/components/Material/AmbientAurora.client.vue:61`, and `layers/shader/app/components/Preset/ThemeAurora.client.vue:2`.

The largest demo pages are also carrying application logic. `apps/playground/app/pages/shader-background.vue` and `apps/playground/app/pages/shader-pipeline-background.vue` both contain large `getActiveBlocks()` switches at `apps/playground/app/pages/shader-background.vue:299` and `apps/playground/app/pages/shader-pipeline-background.vue:221`. These are good refactor candidates after the quality gates are green, but they are less urgent than public server and dependency issues.

`layers/layout/app/components/Layout/Grid/Item.vue` has a high-impact computed style block starting at `layers/layout/app/components/Layout/Grid/Item.vue:139`. Fallow marks it as a high-priority refactor target because many files depend on it and its responsive grid logic is complex.

Fallow dead-code reports 260 cleanup candidates, but many are Nuxt-layer assets, auto-import surfaces, CSS files, and public exported types. Treat those as leads only. Trace each candidate before deletion with `fallow dead-code --trace ...` or `fallow dead-code --trace-file ...`.

## Tooling Notes

The root `format:check` failure is partly self-inflicted. Prettier reads `.prettierignore` by default, but `ignorePath` inside `prettier.config.cjs` is not a supported config key. The current `.prettierignore` also omits `.agents/` and `.claude/`, so local agent skill files get formatted as project content.

The stylelint run against raw globs originally picked up ignored build output such as `apps/playground/dist`. The result above uses `git ls-files '*.css'`, so it represents tracked CSS only.

Depcheck reported unused dependencies, but it also read local agent skill files and Nuxt layer side effects poorly. I did not use depcheck as evidence for removal. Fallow dependency findings are still trace-required because dependencies can be required by Nuxt modules, `nuxt.config.ts`, peer dependency contracts, or package publishing.

## Considered And Rejected

- The Nuxt Content schema workaround remains intentionally documented. `docs/MIGRATION.md` explains why schemas are not passed directly to `defineCollection()`, so this audit does not recommend a simple schema attachment change.
- Ignored generated output under `.nuxt`, `.output`, `.netlify`, `dist`, and local package caches is not treated as source debt. When a tool scanned those paths, I reran a scoped command.
- Fallow reported no feature flags, but the routing layer uses a custom runtime flag pattern. That means Fallow did not detect the pattern; it does not mean runtime flags are absent.
- The MD5 feed ETag finding is a hardening item, not a confirmed exploit. The hash is used for response cache validation, not credential storage or signature verification.

## Recommended Triage Order

1. Fix public server risks first: remove address exposure from the status endpoint and add abuse controls to contact submission.
2. Resolve high dependency advisories and the current feeds lint failure so the baseline is trustworthy.
3. Bring `layers/*/server/**/*.ts` into typecheck or a dedicated Nitro server typecheck before changing server routes.
4. Fix content composable cache keys and add targeted tests for content list variants.
5. Harden feed routes with collection allowlisting, query pushdown, and date validation.
6. Clean the formatting and CSS lint baselines so future reports are not buried in noise.
7. Use the existing Fallow refactor docs plus this report to sequence shader/layout/playground structural work after tests exist.
