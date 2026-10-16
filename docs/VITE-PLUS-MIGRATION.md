# Migrating to Vite+ (nuxt-layers v5.0.0)

**Audience:** a developer or AI coding agent updating a downstream Nuxt app that consumes
`kmcom-nuxt-layers`, and wants the same toolchain this repo moved to in v5.0.0.

> Using the layers does **not** force you onto Vite+. The layers are plain Nuxt layers and keep
> working in an app on stock Vite/Vitest/Prettier. This guide is for apps that want to adopt the
> same toolchain. Sections 1–2 say what changed in the repo; sections 3–9 are the steps.

Work top to bottom. Each step has a **Detect** (does it apply?) and an **Apply**. Run the
**Verify** checklist at the end before calling it done. Where this guide and the repo disagree,
the repo wins — the reference files are listed at the bottom.

## 1. What Vite+ is, and what v5.0.0 changed

[Vite+](https://viteplus.dev) (`vp`, package `vite-plus`) is one CLI over the Vite ecosystem:
dev/build (Vite), test (Vitest), lint (oxlint), format (oxfmt), and a managed Node runtime.

In this repo the migration (`vp migrate`, then hand fixes) did:

| Area      | Before                             | After                                                          |
| --------- | ---------------------------------- | -------------------------------------------------------------- |
| Vite      | `vite: ^8`                         | `vite: npm:@voidzero-dev/vite-plus-core@1.2.0` (catalog alias) |
| Vitest    | `vitest ^4`                        | `vitest 5.0.4` + `@vitest/coverage-v8 5.0.4`                   |
| Test API  | `import … from 'vitest'`           | `import … from 'vite-plus/test'`                               |
| Formatter | Prettier + 6 plugins               | oxfmt (`vp fmt`), config in `vite.config.ts`                   |
| Linter    | ESLint only                        | `vp lint` (oxlint) chained before the per-package ESLint       |
| Scripts   | `vitest run`, `prettier --write .` | `vp test run`, `vp fmt .`                                      |
| Node file | `.nvmrc`                           | `.node-version`                                                |
| pnpm      | 11                                 | 12 (`packageManager: pnpm@12.10.1`)                            |
| `nuxt`    | `latest`                           | pinned `4.6.1`                                                 |

**Breaking for consumers:** Node 24 only (`engines: >=24 <25`), and the toolchain/script names
above. The layers' runtime behaviour is unchanged.

## 2. Preconditions

- Node 24 (`node -v`). Vite+ can manage this for you via `.node-version`.
- pnpm 12 (`corepack enable && corepack use pnpm@12`). pnpm 10/11 will not read the new settings
  locations in step 4.
- A clean git tree, on a new branch. `vp migrate` rewrites many files.

## 3. Install Vite+ and run the migration

**Detect:** your `package.json` has `vite`, `vitest`, or `prettier` in `devDependencies`.

**Apply:**

```bash
git switch -c chore/migrate-to-vite-plus
vp migrate                     # rewrites vite/vitest deps, test imports, scripts, prettier → oxfmt
pnpm install
```

`vp migrate` handles the mechanical parts: dependency swap, `vitest` → `vite-plus/test` imports,
script renames, `.nvmrc` → `.node-version`. Review the diff before moving on — it is the source
of truth for what changed in _your_ app.

If you use a pnpm catalog, point `vite` / `vitest` / `@vitest/coverage-v8` at the Vite+ entries
(see the table in section 1) and add overrides so transitive deps resolve to the same copy:

```yaml
# pnpm-workspace.yaml
overrides:
  vite@*: 'catalog:'
  vitest@*: 'catalog:'
```

## 4. pnpm 12 settings (don't skip)

**Detect:** your `.npmrc` contains `shamefully-hoist` or `strict-peer-dependencies`.

pnpm 12 **ignores those keys in `.npmrc`**. Symptom: dev server dies with
`"extend" … no default export` (a CJS interop failure from a package that is no longer hoisted).

**Apply:** move them to `pnpm-workspace.yaml` (create it for single-package projects):

```yaml
shamefullyHoist: true
strictPeerDependencies: false
```

Keep `allowBuilds` for packages with install scripts (`esbuild`, `sharp`, `@parcel/watcher`, …).

## 5. Pin Nuxt (and the Vite builder patch)

**Detect:** your `nuxt` version is `latest` or a loose range.

This repo patches `@nuxt/vite-builder` (a `listenAndRestrict` `ENOENT` guard on the vite-node
socket chmod). A pnpm patch targets an **exact** version, so an unpinned `nuxt` silently breaks it
on the next release.

**Apply:**

1. Pin `nuxt` to an exact version (this repo: `4.6.1`).
2. Only if you hit `NUXT_B7018` on the vite-node socket, copy
   `patches/@nuxt__vite-builder@4.6.1.patch` and register it:

```yaml
patchedDependencies:
  '@nuxt/vite-builder@4.6.1': patches/@nuxt__vite-builder@4.6.1.patch
```

If you do not hit that error, you do not need the patch. Patches are **not** inherited from the
layers package — they only apply where declared.

## 6. Declare `typescript` in every app

**Detect:** `pnpm why typescript` shows two versions (e.g. 5.9.3 and 6.0.3), or
`@nuxt/test-utils` fails with
`Failed to resolve import "./diagnostics/core.js" from … nuxt-vitest-app-entry.js`.

pnpm builds a separate `nuxt` install per set of resolved peers. If an app doesn't declare
`typescript`, it can resolve a different TS than the rest of the workspace and get a `nuxt`
variant whose generated test entry can't find its own files.

**Apply:** add `"typescript": "catalog:"` (or the same range as the rest of the repo) to each
app's `devDependencies`, then `pnpm install`. Confirm one `nuxt` variant per app with
`ls -d node_modules/.pnpm/nuxt@*`.

## 7. Replace Prettier with oxfmt

**Detect:** `prettier`, `prettier-plugin-*`, `.prettierrc*`, or `prettier` scripts exist.

**Apply:**

- Delete Prettier and every plugin from `devDependencies`, and remove `eslint-plugin-prettier` /
  `stylelint-prettier` from your ESLint and Stylelint configs.
- Put formatter options in `vite.config.ts` under `fmt` (this repo: no semicolons, single quotes,
  ES5 trailing commas, 100 columns, `sortTailwindcss: {}`, `vueIndentScriptAndStyle: true`).
- Move `.prettierignore` entries into `fmt.ignorePatterns`.
- Scripts: `"format": "vp fmt ."`, `"format:check": "vp fmt --check ."`.
- Run `vp fmt .` once as its own commit (`style: format with oxfmt`) so it stays out of review diffs.

Expect small differences from Prettier output (quote style in CSS `@import`, JSON line widths).
Reformatting generated baselines or lockfiles is churn — ignore them.

## 8. Lint: oxlint first, ESLint second

**Apply:**

```ts
// vite.config.ts
import { defineConfig } from 'vite-plus'

export default defineConfig({
  lint: {
    jsPlugins: [{ name: 'vite-plus', specifier: 'vite-plus/oxlint-plugin' }],
    rules: { 'vite-plus/prefer-vite-plus-imports': 'error' },
    // Nuxt auto-imports are invisible to oxlint's type analysis — keep these off
    // or every `ref`/`computed`/`useFetch` is reported as undefined.
    options: { typeAware: false, typeCheck: false },
  },
})
```

```jsonc
// package.json
"lint": "vp lint && turbo run lint",          // or just `vp lint && eslint .` without Turbo
"lint:fix": "vp lint --fix && turbo run lint -- --fix"
```

`vp lint` is the built-in oxlint with rules from `vite.config.ts`; `pnpm lint` runs your
`package.json` script. They are different commands.

### Stylelint with Tailwind v4

If you run Stylelint, these false positives are expected with Tailwind v4 and layer CSS:

- `at-rule-no-unknown` / `no-invalid-position-at-import-rule`: ignore `layer`, `config`,
  `custom-variant`, `source`, `plugin`, `utility`, `variant`.
- `no-invalid-position-declaration`: off for `.vue`.
- `value-keyword-case`: ignore font properties and `--*font*` custom properties.
- `declaration-no-important`: allow only in files that implement user-preference overrides
  (reduced motion / transparency) that must beat utilities and inline styles. Scope it with an
  `overrides` entry — do not disable it globally.
- Ignore `**/dist/**`, `**/.output/**`, `**/.nuxt/**`.

## 9. Tests

**Apply:**

- `vitest` imports → `vite-plus/test` (done by `vp migrate`; `vite-plus/prefer-vite-plus-imports`
  keeps it that way).
- Scripts: `"test": "vp test run"`, `"test:watch": "vp test"`, `"test:coverage": "vp test run --coverage"`.
- If tests relied on mock call history surviving between tests, keep
  `test: { clearMocks: false }` in `vite.config.ts` (newer Vitest versions clear mocks by default).
- `@nuxt/test-utils` projects (`defineVitestProject`) keep working; see step 6 if they fail to load.
- Playwright: the repo's Playwright wants its own browser build. Run
  `pnpm exec playwright install chromium` (not a globally installed Playwright) before e2e.
  Stop dev servers with `pkill -f "nuxt dev"` **and** delete a stale
  `apps/<app>/.nuxt/nuxt.lock` if the next start says "Another Nuxt dev server is already running".

## 10. Nuxt-specific issues you may meet

These came up during this migration and are independent of Vite+ itself:

- **Hydration mismatches** after changing theme state: don't read `localStorage` during plugin
  setup — apply stored prefs in `useNuxtApp().hook('app:mounted', …)`, and keep per-page state in
  `useState`. A Playwright spec that fails on any `hydrat` console message is a cheap guard
  (see `tests/playwright/hydration.spec.ts`).
- **`NUXT_E4004` / "Component inside `<Transition>` renders non-element root node"**: a page root
  that is a fragment (multiple roots, a root-level HTML comment, or a renderless provider like
  `ShaderRuntime`). Wrap in `<div class="contents">` — `display: contents` generates no box, so
  grid children still lay out as direct children of the parent grid.
- **jiti warnings for layer configs**: use explicit `.ts` extensions in layer `nuxt.config.ts`
  relative imports.
- **Dev prebundling**: this repo adds `@vue/devtools-core` to `vite.optimizeDeps.include`
  (see `apps/playground/nuxt.config.ts`) so dev doesn't re-optimise it on first load. Only needed
  if you see repeated dependency re-optimisation reloads.

## Verify checklist

Run all of these; every one should be clean.

```bash
pnpm install --frozen-lockfile     # lockfile consistent
vp fmt --check .                   # formatting
command vp lint                    # oxlint, 0 warnings
pnpm lint                          # oxlint + ESLint across packages
pnpm typecheck                     # vue-tsc
vp test run                        # unit / nuxt-env tests
pnpm test:e2e                      # Playwright (needs matching chromium)
pnpm build                         # production build
```

Also: `ls -d node_modules/.pnpm/nuxt@*` shows one variant per app, `pnpm why typescript` shows one
version, and the dev server starts with no `no default export` error.

## Rollback

The migration is mechanical and lives on one branch. To back out: `git revert` the migration and
format commits, restore `.nvmrc`, and `pnpm install`. Nothing in the layers package requires
Vite+, so rolling back does not break layer consumption.

## Reference files in this repo

| Topic                  | File                                      |
| ---------------------- | ----------------------------------------- |
| Vite+ config           | `vite.config.ts`                          |
| Catalog / overrides    | `pnpm-workspace.yaml`                     |
| Scripts                | `package.json`                            |
| Builder patch          | `patches/@nuxt__vite-builder@4.6.1.patch` |
| Stylelint overrides    | `stylelint.config.mjs`                    |
| Hydration spec         | `tests/playwright/hydration.spec.ts`      |
| Migration PR / release | PR #57, #58; release `v5.0.0`             |
