# kmcom-nuxt-layers v5: fixes found while adopting it in a consumer app

Found migrating `fs-studios-frontend` (Nuxt 4.6.1, Nitro 2.13, Vite+ 1.3, pnpm 11) from the
old v2 layer layout to `kmcom-nuxt-layers@5.0.x`. Fixes 1-3 are bugs, 4-9 are
contract/docs gaps. Items already shipped are marked **done**.

Consumer facts that matter: the package is installed under `node_modules/.pnpm/...`, the app
runs `vue-tsc` with `typescript.strict: true`, and it does **not** define the blog / portfolio /
gallery content collections.

## Already fixed

| Release | Fix                                                                                                                                                                                                                                                                                                                                                                |
| ------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 5.0.3   | navigation templates called auto-imports (`useSite()`, `useGridConfig()`) directly in `<template>`, which `vue-tsc` cannot see (TS2339). Moved into `<script setup>`.                                                                                                                                                                                              |
| 5.0.4   | `Links/Named.vue` `to` typed via `navigateTo`'s param, which is wider than `ULink`'s prop (TS2322). Cast to the router location type.                                                                                                                                                                                                                              |
| 5.0.5   | "Duplicated imports" warnings: `TintConfig`/`TintColorSlot`/`TintLevel`/`TINT_LEVEL_OPACITY` (visual `types/index.ts` re-exported `tint.ts`), `ScrollToOptions` (defined in `utils/scroll.ts` and `types/scroll.ts`), `ScrollSceneContext` (re-exported from `useScrollSteps.ts`), `BrowserInfo` (two different shapes; the utils one is now `ParsedBrowserInfo`). |

## 1. Server routes use Nitro auto-imports, which Nitro skips in `node_modules` (P1)

**Symptom.** Dev server answers every request with
`500 Cannot access 'renderer$1' before initialization`. That message is a side effect. The real
error is earlier in the dev log:

```
ERROR [uncaughtException] defineEventHandler is not defined
    at .nuxt/dev/index.mjs:13141:22
```

The Nitro dev bundle throws while evaluating `contact.post.ts`, so later modules (including the
Nuxt renderer) never initialise.

**Cause.** Nitro applies auto-imports (`defineEventHandler`, `getQuery`, `useRuntimeConfig`,
...) only to files outside `node_modules`. The layers' server files are inside it for every
consumer, and they use bare auto-imports. They work in the repo's own playground (source files
are not under `node_modules`), so CI never sees it.

Typecheck passes everywhere because the auto-import typings exist; only the runtime transform
is missing.

**Fix.** Import explicitly from `h3` / `nitropack/runtime` in every layer server file:

```ts
import { defineEventHandler, getQuery, createError } from 'h3'
import { useRuntimeConfig } from 'nitropack/runtime'
```

Find the offenders (server files that use h3/Nitro helpers without importing `h3`):

```bash
grep -rLE "from 'h3'" $(find layers -path '*/server/*' -name '*.ts' -not -name '*.test.ts' \
  -not -path '*/node_modules/*' -not -path '*/.nuxt/*') \
  | xargs grep -lE "defineEventHandler|getQuery|readBody|createError|useRuntimeConfig|getRouterParam|setResponseHeader|defineCachedEventHandler|defineNitroPlugin|useStorage|defineCachedFunction"
```

At 5.0.4 that lists about 33 files:

- `data/forms/server/api/contact.post.ts`, `data/forms/server/api/forms/status.get.ts`
- `structure/routing/server/api/feature-flags.get.ts`
- `data/mailer/server/utils/config.ts`, `data/database/server/utils/sql.ts`
- `data/metadata/server/api/metadata/*.get|post.ts`, `data/metadata/server/utils/metadata/cache.ts`
- `data/metadata/providers/*/server/plugins/*-register.ts`, `.../server/utils/*/client.ts`
- `delivery/feeds/server/routes/feed/**/*.get.ts`
- `design-system/theming/server/plugins/theme-fouc.ts`

`useAppConfig()` / `useStorage()` / `useRuntimeConfig()` need the same treatment (import from
`nitropack/runtime`).

**Add a guard.** A small test (or lint rule) that fails when a file under `layers/**/server/`
uses these helpers without importing them, so this cannot regress. Better still, run the
playground against the installed tarball (`npm pack` then install) in CI, which would have
caught it.

**Do not** rely on a consumer-side workaround. Setting `nitro.imports.exclude` in the consumer
to let `kmcom-nuxt-layers` through fixed `contact.post.ts`, but broke `defineAppConfig` in the
consumer's own `app.config.ts`. The consumer's stop-gap is `forms: false` and `routing: false`
in its layer config.

## 2. Layer `nuxt.config.ts` files are loaded through jiti with a warning (P2)

```
WARN [NUXT_B5023] The config file .../layers/core/nuxt.config.ts was loaded through jiti
because the runtime could not load it: Stripping types is currently unsupported for files
under node_modules
```

Appears once per layer on every `nuxt dev` / `build` / `prepare`. Harmless but noisy, and it
costs startup time (jiti transforms each file).

**Cause.** The package ships `.ts` configs; Node refuses to strip types under `node_modules`.

**Fix.** Publish compiled JS configs and point `exports` at them, for example:

```jsonc
"exports": {
  "./layers/core": "./layers/core/nuxt.config.mjs",
  ...
}
```

Generate `nuxt.config.mjs` per layer in a `prepack` step (tsdown / esbuild, no bundling, keep
`import.meta.dirname`). Keep `.ts` in the source tree for the playground. Relative imports
inside configs need explicit extensions (the warning says the same).

## 3. Strict mode is an undocumented requirement (P2)

The layers assume `typescript.strict: true` (core sets it). A consumer with `strict: false`
gets type errors from the layers' own sources, because Nuxt pulls layer source into the
consumer's `vue-tsc` graph:

- `data/forms/server/api/contact.post.ts` (4x TS2345, optional props vs `ContactEmailData`)
- `structure/layout/app/utils/gridPlacementStyle.ts:45` (TS2322, `T | ResponsiveValue<T>`)

Either document "your app must set `typescript.strict: true`" in `docs/USAGE.md`, or fix the
two spots so they type-check under non-strict too.

## 4. Content layer contract is not documented, and its typings are not picked up (P2)

Two separate gaps in the `content` layer.

**a. Collections are required but not stated.** `Blog`, `Portfolio` and `Gallery` components
and the `useBlogPosts` / `useGalleryItems` composables are typed against collections named
`blog`, `portfolio`, `gallery`. A consumer that only defines `content` gets about 20 errors
such as `Argument of type '"blog"' is not assignable to parameter of type '"content"'`.
Document it in `docs/USAGE.md`, with the minimal definition:

```ts
blog: defineCollection({ type: 'page', source: 'blog/**/*.md' }),
portfolio: defineCollection({ type: 'page', source: 'portfolio/**/*.md' }),
gallery: defineCollection({ type: 'page', source: 'gallery/**/*.md' }),
```

Empty collections are fine.

**b. `layers/content/app/types/collections.d.ts` is not seen by the consumer's type-check.**
It augments `@nuxt/content` with the frontmatter fields (`date`, `image`, `tags`, `images`,
`client`, ...). Nuxt only references layer `.d.ts` files that live in generated `.nuxt` types,
so the consumer gets about 40 "Property 'date' does not exist on type 'BlogCollectionItem'"
errors even after defining the collections.

Consumer workaround (works): `app/types/content-collections.d.ts` containing
`import '#layers/content/types/collections'`.

**Fix.** Have the layer register the file itself so no consumer workaround is needed, for
example in `layers/content/nuxt.config.ts`:

```ts
hooks: {
  'prepare:types': ({ references }) => {
    references.push({ path: `${import.meta.dirname}/app/types/collections.d.ts` })
  },
},
```

## 5. Docs still use pre-v5 layer names (P2)

`README.md` and `docs/USAGE.md` still show `kmcom-nuxt-layers/layers/ui` and a `theme` layer.
Neither export exists in v5. Consumers get a silent miss: Nuxt only warns
`Cannot extend config from .../layers/layout`, and the layer is not loaded (we lost
`useSite`, `useSmoothScroll` and the navigation components this way).

Current exports: `core`, `typography`, `navigation`, `visual`, `layout`, `scroll`,
`animations`, `transitions`, `page-transitions`, `motion`, `canvas`, `shader`, `mailer`,
`forms`, `database`, `auth`, `theming`, `content`, `feeds`, `routing`, `metadata`, `seo`,
`scripts`. Update the tables and examples, and add a "v2 to v5" rename table:

| v2        | v5                                     |
| --------- | -------------------------------------- |
| `ui`      | `typography` + `navigation` + `visual` |
| `theme`   | `theming`                              |
| `starter` | removed                                |

Consider making a missing layer a hard error (e.g. a `nuxt.config` `$meta` check) rather than a
warning, since the failure mode is a half-working app.

## 6. `scripts` layer needs `baseline-status`, which is not listed (P3)

`layers/delivery/scripts/app/plugins/baseline-status.client.ts` imports `baseline-status`. It
is declared only in `layers/delivery/scripts/package.json` (`catalog:`), not in the root
`peerDependencies`, so a consumer's build fails with
`Rolldown failed to resolve import "baseline-status"`. Add it to the root
`peerDependencies` (optional, alongside `@nuxt/scripts`) and to `docs/USAGE.md`.

## 7. `pwa` config key is untyped in the consumer (P3)

The `core` layer loads `@vite-pwa/nuxt`, so consumers legitimately set `pwa:` in their
`nuxt.config.ts`. The type only exists if the consumer lists the module itself, so the app
needs `// @ts-expect-error`. Either augment `NuxtConfig` with `pwa` from the layer's typings,
or document the workaround.

## 8. Server dependency chain and Nuxt version (P3)

- The consumer needed `nuxt >= 4.6.1`. With `nuxt@4.5.2` it resolved `@nuxt/schema@4.6.1` through
  the layers' deps, and the Nitro config types failed (`externals` not in
  `ResolveNuxtNitroConfig`). Set the root `peerDependencies.nuxt` to the minimum that works.
- The consumer pins `unhead` to one version via a pnpm override so Nitro's file trace includes
  `unhead/dist/legacy.mjs`. Worth documenting if `@nuxtjs/seo` is enabled.

## 9. Components and utils to double check after the above

- `useBrowser()` now returns `ParsedBrowserInfo`; nothing else in the repo imports the old name,
  but external consumers might. Mention the rename in the 5.0.5 release notes.
- `useSmoothScroll()`'s `ScrollToOptions` now allows `undefined` on each field (needed for
  `exactOptionalPropertyTypes`); `scrollTo` callers are unaffected.

## Suggested order

1. Fix 1 (explicit server imports) plus the guard. It is the only one that crashes a consumer.
2. Fix 5 (docs and rename table) and 4 (content typings) together; they remove most of the
   adoption friction.
3. Fix 2 (compiled configs), then 3, 6, 7, 8.
4. Release as one minor (5.1.0): fix 1 changes how server files are authored, and fix 2 changes
   the `exports` map.

## How to verify against a real consumer

Do not rely on the playground. Pack and install the tarball into a scratch Nuxt app that
extends the layers from `node_modules`:

```bash
pnpm pack
# in a scratch app: pnpm add ../path/kmcom-nuxt-layers-<ver>.tgz
nuxt dev          # expect no uncaughtException, no NUXT_B5023 / Duplicated imports warnings
vue-tsc --noEmit  # expect 0 errors with typescript.strict true
nuxt build
```
