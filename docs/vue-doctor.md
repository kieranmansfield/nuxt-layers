# Vue Doctor

[vue-doctor](https://github.com/healerlab/vue-doctor) (`@healerlab/vue-doctor`, pinned in the pnpm
catalog) scores Vue/Nuxt health from oxlint, eslint-plugin-vue and its own Vue rules.

| Where      | What runs                                                                 | Gate                            |
| ---------- | ------------------------------------------------------------------------- | ------------------------------- |
| pre-commit | `vue-doctor . --diff=--cached --min-score 75` via `vp staged` (see below) | blocks below 75                 |
| CI         | `.github/workflows/vue-doctor.yml`: full scan on every PR + release       | report-only until score is high |
| local      | `pnpm vue-doctor`                                                         | —                               |

The pre-commit hook (`.vite-hooks/pre-commit`, installed by `prepare: vp config`) runs
`vp staged --hide-unstaged`; the commands live in the `staged` block of `vite.config.ts`, next to
`fallow audit --changed-since HEAD` (fails only on findings the commit introduces). Conflicted
merges skip the gates — CI covers the merge result.

## Ignored rules (`.vue-doctorrc.json`)

vue-doctor turns on many oxlint pedantic/style rules on top of the repo's own oxlint + ESLint
config. These clash with repo conventions or are size heuristics, so they are off. For a single
deliberate exception elsewhere, use `// oxlint-disable-next-line <rule> -- <reason>` instead of
adding a rule here.

| Rule                                                                     | Why ignored                                                                                                                                                             |
| ------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `vue-doctor/reactivity-destructure-props`                                | Flags every destructured `defineProps`. Reactive props destructure is stable since Vue 3.5 and is the repo convention.                                                  |
| `vue-doctor/perf-giant-component`, `max-lines`, `max-lines-per-function` | Size heuristics. `<script setup>` counts as one function; hits were playground/starter demo pages that are exhaustive on purpose. Splits are refactors, not lint fixes. |
| `max-classes-per-file`                                                   | Related error classes live together (`metadata/errors.ts`).                                                                                                             |
| `require-unicode-regexp`                                                 | Style. Adding `u` changes regex semantics (escapes, char classes) for no gain on ASCII patterns.                                                                        |
| `no-useless-undefined`                                                   | Explicit `undefined` documents intent in `ref(undefined)`, emits and optional args.                                                                                     |
| `no-underscore-dangle`                                                   | `__dirname`, `window.__*` boot flags, and the `_`-prefixed TSL node helpers in the shader layer.                                                                        |
| `no-inline-comments`                                                     | Style; repo uses trailing comments.                                                                                                                                     |
| `no-await-in-loop`                                                       | Remaining hits are deliberately sequential: capture CLI browser steps, Playwright actions, build scripts.                                                               |
| `require-await`                                                          | `async` without `await` satisfies Promise-returning contracts (provider clients, handlers, `vi.fn` mocks).                                                              |
| `no-map-spread`                                                          | Immutable `{ ...x, y }` updates are intended; arrays are tiny.                                                                                                          |
| `sort-vars`                                                              | Style.                                                                                                                                                                  |

Ignored paths: `.agents/**`, `.claude/**` (vendored skill scripts) and
`.vue-doctor-eslint.config.mjs` (vue-doctor's own temp file).

## Known gaps in 0.0.4

- **eslint-plugin-vue pass is inactive.** vue-doctor calls `eslint --no-eslintrc`, which ESLint 10
  rejects; it then parses empty output as zero findings. Template rules (`vue/require-v-for-key`
  etc.) come from `vp run lint` in `check.yml` instead.
- **`deadCode` in config is ignored** — the CLI default wins. Pass `--no-dead-code` (the
  `pnpm vue-doctor` script and CI do). fallow owns dead code; vue-doctor's knip pass also breaks on
  Nuxt's stdout.
- **No new-only mode.** Diff scans score whole files, so a commit touching a file with old debt
  inherits it.
