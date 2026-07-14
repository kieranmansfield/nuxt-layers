# Modernization Assessment — nuxt-layers

Date: 2026-07-03 · Branch: `rebuild/v3` · Baseline release: v2.6.0 (all suites green)
Tooling: `scc`/`cloc` unavailable — LOC via `find`+`wc` grouped by extension; complexity ranked by decision-keyword count; COCOMO-II computed manually (inputs shown). Figures reproducible via `analysis/entire/extract_topology.py`.

## Executive Summary

nuxt-layers is a 73k-LOC (.ts/.vue) Nuxt 4 monorepo of ~27 composable layers plus three apps, released at v2.6.0 with 45 passing test files. Architecture is fundamentally sound — clean acyclic layer graph, one clear orchestration pattern — but carries concentrated debt: a 20k-LOC shader monolith, four copy-paste metadata providers that have already behaviourally diverged, a hand-maintained dependency graph duplicated in three places (all stale), and two exploitable security findings (an unauthenticated endpoint that can leak a live API key, and the drizzle-orm Dependabot high). Recommendation: **Rebuild via `/modernize-reimagine`** (user-directed), executed layer-by-layer against the existing characterization test suite, with the security fixes and provider/feed consolidation designed in rather than patched on.

## System Inventory

| ext | files | LOC |
|---|---|---|
| .vue | 363 | 48,448 |
| .ts | 376 | 24,903 |
| .md | 24 | 4,280 |
| .json | 71 | 1,257 |
| .css | 17 | 1,066 |
| **code (.ts/.vue)** | **739** | **73,351** |

**Tech fingerprint** (evidence: `pnpm-workspace.yaml` catalog, root `package.json`):
- Nuxt **4.4.7** (pinned, with local patch `patches/@nuxt__vite-builder@4.4.7.patch`), Vue **3.5.35**, TypeScript **^6**, Vite ^7
- @nuxt/ui (`latest`!), Tailwind CSS 4, @nuxt/content 3.14, @nuxtjs/seo 5, @nuxt/scripts
- GSAP 3.15 + Locomotive Scroll 5; TresJS 5 / three 0.184 (WebGPU/TSL)
- Zod 4, Drizzle + @neondatabase/serverless, Resend 4, nuxt-auth-utils, `feed` 5
- Build: pnpm workspaces (heavy catalog + 17 conflict-catalogs + overrides), Turbo 2.9
- Tests: Vitest 4 + @nuxt/test-utils + Playwright 1.61 (+ Cypress installed but unused signal)
- Deploy: Netlify (`@netlify/nuxt`, custom buildhook tarballs from *.netlify.app URLs)
- Test presence: 45 test files — 33 unit suites added at v2.6.0 + Playwright smoke/E2E; strong on utils/server logic, thin on components/composables

**Top complexity files** (decision-keyword count / LOC): playground shader demo pages dominate (`shader-background.vue` 233/2330, `shader-pipeline-background.vue` 192/1935, `shader-pipeline.vue` 122/2043, `shader.vue` 97/1777, `gsap.vue` 72/2235), then `layers/layout/app/utils/gridPlacementStyle.ts` (64/197).

## Architecture-at-a-Glance

12 domains (diagram: `ARCHITECTURE.mmd`; interactive: `TOPOLOGY.html` — 709 modules, 1,457 edges, 96 entry points):

| Domain | Layers | Depends on |
|---|---|---|
| Foundation | core | — |
| Presentation/UI | typography, navigation, visual, ui (orchestrator) | core; navigation→scroll+layout |
| Layout | layout | core |
| Motion | scroll, animations, transitions, page-transitions, motion (orchestrator) | core |
| 3D/Graphics | canvas, shader | core |
| SEO & Scripts | seo, scripts | core |
| Communication | mailer, forms | core |
| Data & Identity | database, auth | core |
| Metadata | metadata + 4 provider sub-layers | core |
| Content & Feeds | content, feeds | core; feeds→content (conditional!) |
| Theme & Routing | theme, routing | core |
| Scaffold | starter, baseline | ui, layout, motion, core |

Key structural fact: **69% of edges are implicit** (Nuxt auto-import dispatch), so renames are cross-layer breaking changes with no compiler-visible edge. 3 auto-import symbol name collisions exist today.

## Production Runtime Profile

No telemetry available (Netlify hosting; no APM wired). Gap noted — Netlify analytics/log drains could populate this later. Static proxy for operational risk: the metadata search path (4 external APIs, one with no fetch timeout) is the highest-variance runtime path.

## Technical Debt (top 10, ranked by remediation value)

1. **Layer graph maintained by hand in 3 places, all drifted** — `apps/playground/nuxt.config.ts:2-98` (`AVAILABLE_LAYERS`/`LAYER_PATHS`/`LAYER_DEPENDENCIES`) vs CLAUDE.md vs `.claude/rules/nuxt-layers.md`; feeds/baseline/starter registered in playground but absent from docs. Fix: derive from each layer's `extends`; generate docs.
2. **`layers/shader` monolith** — 243 files / 20,050 LOC (vs canvas: 6 files); dead 282-line barrel `app/shaders/index.ts` imported by nothing. Fix: delete dead barrels; split shader-core / shader-presets.
3. **4× copy-paste metadata providers, already diverged** — ~440 LOC duplicated scaffolding; openlibrary has a timeout on 1 of 4 calls, others none; comicvine reads baseUrl from config, openlibrary hardcodes it. Fix: `defineMetadataProvider` factory + shared `providerFetch` (timeout/error wrapping).
4. **`StarterDesignSystem.vue` god component** — 1,913 LOC single SFC. Fix: per-section components.
5. **Feed formats inconsistent** — rss.ts uses `feed` pkg + shared id/link helpers; atom.ts and json.ts hand-roll both (3 divergent copies of id/link logic). Fix: one pipeline for all three formats.
6. **Provider clients swallow errors** — openlibrary `lookupByIsbn` catches everything → `null` (= "not found"); search failures only `console.error`, callers can't see partial results. Fix: catch 404 only; return `{ results, failedProviders }`.
7. **Dead artifacts tracked** — `layers/content/_jiti_test.ts`; commented-out config blocks in playground.
8. **Duplicated Vite `optimizeDeps` blocks** — identical 6-entry list twice in playground config.
9. **Unconditional debug logging in core** — `layers/core/app/plugins/init.ts:16-72`, six console.log blocks on every consumer's boot; 52 raw console.* across layers. Fix: gate behind `import.meta.dev`/scoped logger.
10. **Deprecated APIs without sunset + muted complexity linter** — deprecated layout mode + `useThemePreferences`; ~30 `fallow-ignore-next-line complexity` suppressions (5 in `gridPlacementStyle.ts` alone). Fix: remove deprecated paths pre-1.0; treat suppression clusters as refactor queue.

Also: `@nuxt/ui: latest` in the catalog is a reproducibility hazard (any publish changes the build).

## Security Findings

`pnpm audit`: **2 vulnerabilities (1 high, 1 low)** — matches Dependabot. No hardcoded secrets in tracked source; `.env` files gitignored (verified). Credential inventory in SECRETS.local.md (gitignored; not for sharing).

| CWE | Sev | Location | Finding | Fix |
|---|---|---|---|---|
| CWE-209/200 | **High** | `layers/metadata/server/api/metadata/status.get.ts:21` + comicvine `client.ts:24` | Unauthed `/api/metadata/status` returns raw `err.message`; FetchError messages embed full upstream URL incl. `?api_key=…` → live ComicVine key disclosable by one GET during upstream 401/429 | Sanitize provider errors (strip URL/query); return generic "provider unavailable" |
| CWE-1395 | **High** | `pnpm-lock.yaml` (`@nuxt/content>db0>drizzle-orm`) | drizzle-orm GHSA-gpj5-g38j-94v9 | pnpm override to patched version |
| CWE-306/400 | Med | `metadata/sync.post.ts`, `lookup.get.ts`, `search.get.ts` | Unauthed endpoints; `sync force:true` bypasses cache → billable upstream calls; cache writes have no TTL → unbounded growth | Session/token gate; TTL on `setCacheRecord`; rate clamp |
| CWE-20/74 | Med | all 4 provider `client.ts` lookup paths | Raw `providerId` interpolated into upstream URL paths (`/movie/${id}`) → arbitrary endpoint access with your key + cache poisoning | Per-provider id regex validation or `encodeURIComponent` |
| CWE-20 | Med | `search.get.ts:14` | `limit` unclamped (`NaN`/`-1`/`99999` forwarded upstream) | Clamp 1–50 |
| CWE-770 | Low | `forms/server/api/contact.post.ts:24` | Rate limit keys on client-supplied XFF (bypassable) and per-instance Map (useless on serverless) | Netlify `x-nf-client-connection-ip`; shared storage counter |
| CWE-1395 | Low | `pnpm-lock.yaml` (`vite>esbuild`) | esbuild GHSA-g7r4-m6w7-qqqr (dev-only, Windows) | Override ≥0.28.1 when convenient |

## Documentation Gaps (top 5)

1. CLAUDE.md architecture omits `feeds`, `starter`, `baseline` layers and `apps/visual-identity`, `apps/debug` — the docs' layer graph is stale against the playground resolver.
2. `layers/feeds` conditional `extends` (`FEEDS_STANDALONE`) contradicts the documented "MUST declare full extends" rule — intent undocumented.
3. The metadata provider registry contract (register plugin + provider interface + cache semantics) has no doc; a new provider is written by copying an existing one.
4. Only 11% of layer source files have any header comment; the 20k-LOC shader layer's public surface (which of 243 files are API?) is undocumented beyond `docs/shaderGuide.md`.
5. The pnpm catalog's 17 `conflicts_*` catalogs and the `@nuxt/vite-builder` patch have no explanation of when they can be removed.

## Relative Scale

COCOMO-II basic index: `2.94 × 73.4^1.10 ≈ 331` (KSLOC = 73.351, nominal scale factors). **This is a relative size/complexity signal for ranking against other systems — not a timeline, cost, or effort estimate.** It assumes human-team productivity curves that agentic transformation does not follow; no schedule or person-month figure is implied. Within the estate: shader ≈ 27% of layer code; playground demo pages ≈ 38% of total .vue LOC.

## Recommended Modernization Pattern

**Rebuild → `/modernize-reimagine`** (user-directed: "old version is the spec"). Honest caveat: on pure findings this system would grade as *Refactor* — the architecture is good and tests are green; the debt is localized (providers, shader, feeds, config duplication). The rebuild directive is best served by treating it as a **module-by-module reimagine on the same stack**, ordered leaf-first along the layer graph, where each layer is rebuilt to a tightened spec (debt items 1–10 and all security findings designed out) and must pass the existing + expanded characterization suite before the next layer starts. That converges to the 10x version without a big-bang integration risk.
