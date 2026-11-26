# tooling-config: share the Nuxt UI ESLint config

Adds Nuxt UI's class linting (`@nuxt/ui/eslint`, built on
`eslint-plugin-better-tailwindcss`) to the shared `eslint.config.mjs` in
`kieranmansfield/tooling-config`, so `lint:sync` spreads it to every repo.

It's already running locally in `nuxt-layers` (see "Proven in nuxt-layers"
below). This doc moves it upstream.

## The problem to solve

`lint:sync` overwrites each repo's `eslint.config.mjs` with the shared copy.
A hand-added `...nuxtUI({...})` block in a repo is lost on the next sync. But
the options are per-repo:

- `entryPoint`: the stylesheet that does `@import 'tailwindcss'` /
  `@import '@nuxt/ui'`. Every repo has a different path.
- `files`: the globs to lint.
- `colors`: the app's colour aliases. Apps set these. Layers must not.

Not every synced repo uses Nuxt UI, so the shared config can't import
`@nuxt/ui/eslint` unconditionally.

## Design: opt-in per-repo options file

The shared config looks for `nuxt-ui-eslint.config.mjs` at the repo root:

- **File missing**: the repo hasn't opted in. Nothing is added and nothing
  from `@nuxt/ui` is imported.
- **File present**: import `@nuxt/ui/eslint` and spread `nuxtUI(options)`.
  If `@nuxt/ui` is too old or the plugin isn't installed, the import fails
  loudly. That's intended: the repo opted in and is misconfigured.

The options file is not in the `lint:sync` file list, so each repo keeps its
own.

### Change to the shared `eslint.config.mjs`

Add near the other imports:

```js
import { existsSync } from 'node:fs'

// Nuxt UI class linting is opt-in per repo: add nuxt-ui-eslint.config.mjs (default-export
// the nuxtUI() options) and install @nuxt/ui >= 4.13 + eslint-plugin-better-tailwindcss.
// Not synced by lint:sync — entryPoint/files/colors differ per repo.
const nuxtUIOptionsFile = new URL('./nuxt-ui-eslint.config.mjs', import.meta.url)
const nuxtUIConfigs = existsSync(nuxtUIOptionsFile)
  ? (await import('@nuxt/ui/eslint')).default((await import(nuxtUIOptionsFile.href)).default)
  : []
```

Then spread it into the `defineConfigWithVueTs(...)` call, **before** the final
`...pluginOxlint.buildFromOxlintConfig(...)` entry (that one must stay last):

```js
  // Nuxt UI class linting (raw palette colours, conflicting classes). Empty unless
  // the repo has nuxt-ui-eslint.config.mjs.
  ...nuxtUIConfigs,

  ...pluginOxlint.buildFromOxlintConfig(viteConfig.lint ?? {})
```

ESLint flat config is ESM, so top-level `await` works. Use `existsSync`
rather than catching `ERR_MODULE_NOT_FOUND`. A try/catch would also hide a
missing `@nuxt/ui/eslint` in a repo that did opt in.

### Per-repo options file

**Layers repo (`nuxt-layers`):**

```js
// nuxt-ui-eslint.config.mjs — options for @nuxt/ui/eslint, read by eslint.config.mjs.
// colors stays at defaults: layer code must use semantic tokens whatever an app aliases.
// no-unknown-classes stays off (default): per-layer CSS utilities aren't visible via core.css.
/** @type {import('@nuxt/ui/eslint').NuxtUIESLintOptions} */
export default {
  // Absolute: the plugin resolves entryPoint against the working directory, and
  // per-layer `eslint .` runs inside each layer folder.
  entryPoint: `${import.meta.dirname}/layers/core/app/assets/css/core.css`,
  files: ['layers/**/*.vue', 'layers/**/app/**/*.ts'],
}
```

**An app (for example fs-studios-frontend):** point at the app's main
stylesheet. Pass `colors` to match the app's `ui.colors` in `app.config.ts`,
so the rule's suggestions use the app's real aliases:

```js
/** @type {import('@nuxt/ui/eslint').NuxtUIESLintOptions} */
export default {
  entryPoint: 'app/assets/css/main.css',
  colors: { neutral: 'old-gray' },
}
```

All options: `entryPoint` (required), `files`, `colors`, `ignore` (regexes for
`no-unknown-classes`), and `rules` (severity for `no-palette-colors`,
`no-conflicting-classes`, `no-unknown-classes`, `enforce-logical-properties`).

## Dependencies in each opted-in repo

```bash
pnpm add -D eslint-plugin-better-tailwindcss   # @nuxt/ui peer range: ^4.10
pnpm up @nuxt/ui --latest --dedupe             # needs >= 4.13 for @nuxt/ui/eslint
```

- **Release-age gate:** pnpm 12's `minimumReleaseAge` holds back very new
  releases. If the newest `@nuxt/ui` is less than a day old, `pnpm up`
  installs the previous one without warning. To take it anyway, add an
  exact-version entry to `minimumReleaseAgeExclude` in `pnpm-workspace.yaml`
  (for example `'@nuxt/ui@4.13.1'`), as the repo already does for others.
- **Run `--dedupe`, or `pnpm dedupe` afterwards.** In nuxt-layers the bump left
  four peer variants of `@nuxt/content`. The generated collection types then
  augmented the wrong copy, and `vue-tsc` reported 39 `never` errors across
  the content layer. `pnpm dedupe` plus `nuxt prepare` brought it back to 0.
- Don't register `eslint-plugin-better-tailwindcss` anywhere else (another
  shared block or a local addition). ESLint fails on a plugin defined twice.

## Rollout

1. In tooling-config, add the `existsSync` block and the `...nuxtUIConfigs`
   spread, and document the opt-in in its README if it has one.
2. In each repo that wants it, add the dependencies (above), add
   `nuxt-ui-eslint.config.mjs`, run `pnpm lint:sync`, then
   `npx eslint <files>`.
3. In nuxt-layers, after the sync: confirm the hand-added
   `import nuxtUI from '@nuxt/ui/eslint'` and `...nuxtUI({...})` block are
   gone (the sync overwrites them), and that the same options now come from
   `nuxt-ui-eslint.config.mjs`. Lint output should be unchanged: 0 Nuxt UI
   warnings.

## Before syncing: tooling-config is behind nuxt-layers

As of tooling-config `c284102d`, its `eslint.config.mjs` is older than
nuxt-layers' local copy. Running `lint:sync` today would undo local fixes in
nuxt-layers:

- Old flat layer paths (`layers/*/app/**`, `layers/*/server/**`,
  `layers/navigation/...`). The tier reorg nests layers
  (`layers/<tier>/<layer>`), so these should be `layers/**/...`. Several
  per-file overrides (render-function components, normalisers, shader
  `max-params`) are also missing or point at old paths.
- Rule settings that differ: `complexity` max 10 there vs 12 here,
  `max-params` 3 vs 4, and `vue/require-default-prop: 'off'` missing there.
- `lint:sync` in nuxt-layers' `package.json` checks out
  `prettier.config.cjs` and `.prettierignore`. tooling-config no longer has
  either (commit `084c7d86` replaced prettier with the Vite+ config), so
  `git checkout` fails on those paths. The file list also leaves out
  `vite.config.ts`, `commitlint.config.mjs` and `.vite-hooks/`.

Either copy nuxt-layers' current `eslint.config.mjs` up into tooling-config
first and add the Nuxt UI change on top, or settle the differences
deliberately. A shared config holding nuxt-layers-specific paths
(`layers/render/shader/**`, and so on) is a separate question about what
"shared" should contain. It's worth deciding, but it isn't part of this
change.

## Proven in nuxt-layers

- `@nuxt/ui` 4.12.2 → 4.13.1, plus `eslint-plugin-better-tailwindcss` 4.11.0.
- The first run over 293 layer `.vue` files gave **7 hits**, not the ~25 a
  grep had suggested:
  - `ScrollStats.vue`: `bg-green-500` → `bg-success`; `gray-500/600` →
    `neutral-500/600`. This component always has a dark background
    (`bg-black/80`), so the fixed shades keep contrast while still following
    the app's neutral alias. Theme-flipping tokens like `text-muted` would
    not.
  - `ObsidianCard.vue`: `text-violet-500` is the Obsidian brand colour, so it
    stays, with an inline
    `eslint-disable-next-line ... -- reason`.
- The rule doesn't flag `text-white` / `bg-black/*`, so overlay classes need
  no triage.
- **Blind spot:** classes in plain `<script>` objects (for example a
  `Record<kind, { strip: 'bg-orange-400' }>` map) aren't checked. Only
  template `class` / `:class`, `:ui`, `<UTheme>` and `app.config.ts` `ui` are.
  A disable comment there gets reported as unused, so use a plain comment to
  record intent (as in `Feeds/RouteCard.vue`).
- Typecheck 0 errors (after dedupe), unit tests 441/441, ESLint over all
  layer files clean.
