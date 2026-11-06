# Improve Audit Results

Audit written against commit `a2805da`.

## Scope

Standard hotspot-weighted audit of the Nuxt 4 pnpm workspace. The pass focused on root tooling, CI, published layer configuration, feed/form/mailer server paths, content composables, dependency posture, and existing architecture/migration docs.

This pass did not audit ignored generated folders, local `.env`, or every Vue demo page exhaustively. It did not run `pnpm build` because that writes build artifacts.

## Verification

| Command                                | Result | Notes                                                                              |
| -------------------------------------- | ------ | ---------------------------------------------------------------------------------- |
| `pnpm typecheck`                       | PASS   | Uses `vue-tsc --noEmit -p tsconfig.typecheck.json`.                                |
| `pnpm lint`                            | FAIL   | Fails in `kmcom-layer-feeds` on `layers/feeds/server/utils/content-adapter.ts:25`. |
| `pnpm -F kmcom-layer-feeds typecheck`  | PASS   | Passes even though feeds server files are outside the root typecheck include.      |
| `pnpm audit --audit-level high --prod` | FAIL   | Reports high advisories for `esbuild` and `ws`.                                    |

## Findings

| #   | Finding                                                                      | Category                | Impact                                                                                                                                    | Effort | Risk | Confidence | Evidence                                                                                          |
| --- | ---------------------------------------------------------------------------- | ----------------------- | ----------------------------------------------------------------------------------------------------------------------------------------- | ------ | ---- | ---------- | ------------------------------------------------------------------------------------------------- |
| 1   | `pnpm lint` currently fails on feeds server code                             | DX / Tooling            | The main local quality gate is red, so CI cannot safely adopt it yet.                                                                     | S      | LOW  | HIGH       | `layers/feeds/server/utils/content-adapter.ts:25`                                                 |
| 2   | Published server routes are excluded from root typecheck and type-aware lint | Correctness / DX        | Feed/form/mailer server code ships in npm but can pass `pnpm typecheck` with type errors hiding there.                                    | M      | MED  | HIGH       | `tsconfig.typecheck.json:25`, `eslint.config.mjs:387`, `package.json:37`                          |
| 3   | Public forms status endpoint exposes configured email addresses              | Security                | Any visitor can read `emailFrom` and `emailTo`, leaking operational inboxes and increasing spam targeting.                                | S      | LOW  | HIGH       | `layers/forms/server/api/forms/status.get.ts:4`, `layers/forms/server/api/forms/status.get.ts:7`  |
| 4   | Forms demo documents the wrong mailer env var namespace                      | Correctness / Docs      | Users following the UI instructions set `NUXT_FORMS_LAYER_*`, but runtime config reads `NUXT_MAILER_LAYER_*`, leaving email unconfigured. | S      | LOW  | HIGH       | `apps/playground/app/pages/forms.vue:732`, `layers/mailer/nuxt.config.ts:16`                      |
| 5   | Contact email endpoint has no server-side abuse controls                     | Security                | The public POST path can be used to burn Resend quota or spam the configured recipient.                                                   | M      | MED  | HIGH       | `layers/forms/server/api/contact.post.ts:11`, `layers/mailer/server/utils/email.ts:17`            |
| 6   | Lockfile still contains high-advisory `esbuild` and `ws` versions            | Security / Dependencies | Build/tooling and Nuxt Content dependency paths remain vulnerable per `pnpm audit --prod`.                                                | S/M    | MED  | HIGH       | `pnpm-lock.yaml:6770`, `pnpm-lock.yaml:12275`                                                     |
| 7   | No automated behavior tests exist for the published layers                   | Test Coverage           | Feed serialization, contact email, routing governance, and content composables have no regression harness.                                | M/L    | LOW  | HIGH       | `package.json:41`, `package.json:246`                                                             |
| 8   | Feed generation fetches whole collections before filtering/limiting          | Performance             | Large content collections make each feed request do avoidable in-memory filtering, sorting, and slicing.                                  | M      | MED  | HIGH       | `layers/feeds/server/utils/content-adapter.ts:61`, `layers/feeds/server/utils/feed-service.ts:16` |

## Direction Options

1. Define the routing runtime flags contract. The client fetches `/api/feature-flags`, and product/enterprise presets enable runtime flags, but the layer ships no endpoint. This should become a documented consumer contract or a small optional server route. Evidence: `layers/routing/app/plugins/feature-flags.client.ts:12`, `layers/routing/app/types/routing.ts:47`.

2. Convert the existing fallow refactor docs into executable plans after the verification baseline is green. The repo already has a useful priority order in `docs/FALLOW-COMPLEXITY-DUPLICATION-AUDIT.md`, but those refactors should wait until lint/typecheck and focused tests protect behavior.

## Considered And Rejected

- The Nuxt Content schemas in `layers/content/content.config.ts` are not directly attached to `defineCollection()`, but `docs/MIGRATION.md:91` and `layers/content/app/types/collections.d.ts:4` document this as an intentional c12/jiti workaround. Treat future work here as decision/code drift investigation, not a simple schema attachment fix.
- The previously documented picture provider and feeds packaging fixes were not reported again. Current source has `provider?: string`, exports `./layers/feeds`, and includes `layers/*/server/**` in package files.
- No tracked credential values were found. Hits were environment variable names, examples, or GitHub Actions secret references.

## Recommended Planning Order

1. Fix finding 1 so `pnpm lint` is green.
2. Fix finding 2 so server code is covered by the type system and type-aware lint.
3. Fix findings 3 and 4 while the server route coverage is fresh.
4. Add focused tests for the same paths before larger refactors.
5. Address dependency advisories and feed query performance after the baseline is stable.

## Rerun (6 Nov 2026)

Surveyed `feat/flip-views` at `8e469e8` with uncommitted review fixes, not `main`. Not covered: the
Vitest `nuxt` project, production builds, `apps/visual-identity`, `apps/debug`, `apps/starter`, the
capture CLI, and most shader internals. Priorities and status live in the review artifact, as
`IM-01` to `IM-15`.

**Fixed since August:** forms status addresses, behaviour tests, content list cache keys, format
baseline, CSS lint, and the routing flags endpoint. The `esbuild` and `ws` advisories are gone too,
but overall advisories got worse (`IM-15`). `Layout/Grid/Item.vue` complexity has improved.

**Still present from August:**

- Server code is outside root typecheck and type-aware lint (`IM-12`)
- Forms demo shows the wrong env names (`IM-14`)
- Feeds fetch a whole collection before applying the limit
- Invalid feed dates crash serialisation (`IM-13`)
- Feed ETags use MD5 (`IM-06`)
- Shader duplication (`IM-07`) and the playground `getActiveBlocks()` switches

**New:**

| ID      | Finding                                                             | Severity | Effort |
| ------- | ------------------------------------------------------------------- | -------- | ------ |
| `IM-01` | Feed `collections` allowlist is not enforced on the server          | Medium   | S      |
| `IM-02` | Public metadata routes bypass the quota guard `sync` has            | Medium   | S      |
| `IM-03` | Collection feeds advertise the wrong self URL and share one Atom ID | Medium   | S      |
| `IM-04` | Metadata search caches provider outages as empty results            | Medium   | XS     |
| `IM-05` | Metadata composable cache keys omit inputs                          | Low      | XS     |
| `IM-06` | Twelve copy-paste feed route handlers                               | Low      | S      |
| `IM-07` | Shader uniform wiring has three parallel APIs                       | Medium   | L      |
| `IM-08` | Feeds app-config shape declared several times                       | Low      | S      |
| `IM-09` | `useErrorLog` reads a bearer token from public app config           | Low      | S      |
| `IM-10` | `createModal` is in the wrong layer                                 | Low      | XS     |
| `IM-11` | Unused shader composables and two helper libraries                  | Low      | M      |

A spot check of `IM-01`, `IM-03`, `IM-04` and `IM-14` against the code confirmed them. The rest come
from the survey's own file-level evidence and haven't been exercised at runtime.
