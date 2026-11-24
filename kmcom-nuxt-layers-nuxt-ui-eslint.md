# Upstream candidate for kmcom-nuxt-layers: Nuxt UI ESLint config

Nuxt UI 4.13 ships an ESLint config built on
`eslint-plugin-better-tailwindcss` that checks Tailwind classes against the
theme. Docs:
<https://ui.nuxt.com/docs/getting-started/integrations/eslint/nuxt> (Nuxt)
and `/vue` (standalone flat config).

| Rule                         | Default | Catches                                                                          |
| ---------------------------- | ------- | -------------------------------------------------------------------------------- |
| `no-palette-colors`          | warn    | `text-gray-500` → `text-muted`, `bg-red-500` → `bg-error-500`, hardcoded colours |
| `no-conflicting-classes`     | warn    | `p-2 p-4` in one list (stylesheet order wins, not source order)                  |
| `no-unknown-classes`         | off     | classes the stylesheet doesn't generate                                          |
| `enforce-logical-properties` | off     | `ml-2`/`text-left` → logical (RTL)                                               |

It checks `class` attributes, `:ui` objects, `<UTheme>` `:ui`/`:props`, and
the `ui` in `app.config.ts`. Neither warn rule has an autofix.

## Why the layers repo, not the apps

This is where the payoff is. Survey of the published package (v6.16.0,
`node_modules/kmcom-nuxt-layers/layers/**`):

- 293 `.vue` files, against 15 in fs-studios-frontend.
- About 25 raw palette or hardcoded colour classes, for example:
  - `text-white` ×8, `text-gray-500` ×4, `bg-gray-600`
  - `bg-black/50|70|80|95`
  - `bg-violet-400/500`, `bg-orange-400/500`, `bg-green-500`, `bg-amber-500`

  Some are deliberate (overlays, demo swatches). Most `gray` uses should be
  `neutral`-aliased semantic tokens so consuming apps that set
  `ui.colors.neutral` (fs-studios uses `old-gray`) actually re-skin them.
  Raw `gray-*` ignores the app's neutral alias. That's a real theming bug
  for consumers, not just style.

- Layer components are consumed by every app, so drift here multiplies.

## Proposed setup

1. Install the plugin:

   ```bash
   vp add -D eslint-plugin-better-tailwindcss
   ```

2. Use the **standalone** import in the repo's `eslint.config.mjs`. Don't
   use `ui: { eslint: true }`: that only injects into the config `@nuxt/eslint`
   generates (`withNuxt()`). The tooling-config `eslint.config.mjs` is
   hand-written and doesn't consume it. Check this in the layers repo. If it
   does use `withNuxt()`, `ui.eslint` in the playground `nuxt.config.ts`
   works instead.

   ```js
   import nuxtUI from '@nuxt/ui/eslint'

   // ...before the final pluginOxlint.buildFromOxlintConfig(...) entry:
   ...nuxtUI({
     entryPoint: 'layers/core/app/assets/css/core.css',
     files: ['layers/**/*.vue', 'layers/**/app/**/*.ts'],
   }),
   ```

   - `entryPoint`: `layers/core/app/assets/css/core.css` is the stylesheet
     that does `@import 'tailwindcss'` / `@import '@nuxt/ui'`. That's the
     path in the published package. Adjust to the source repo's path (it
     may be `layers/<group>/core/...` there).
   - `colors`: leave it at the defaults. Layers shouldn't assume an app's
     aliases, and checking against defaults is the right target: layer code
     should only use semantic tokens, whatever the aliases point at.

3. Triage the existing hits:
   - `gray-*` / `neutral-*` with shade → semantic (`text-muted`,
     `text-dimmed`, `bg-elevated`, `border-default`, …).
   - Status-coloured badges/swatches (`green`/`amber`/`orange`/`violet`) →
     `success`/`warning`/`info`/… aliases where they mean status. If
     they're deliberate demo swatches, use an inline
     `eslint-disable-next-line` with a reason.
   - `text-white` / `bg-black/*` on image overlays → usually deliberate
     (contrast over media regardless of theme). Disable with a reason, or
     use `text-inverted` / `bg-inverted/*` if the overlay should follow the
     theme.

4. Leave `no-unknown-classes` off at first. Layers define utilities in
   per-layer CSS that the single `core.css` entry point won't see. Turn it
   on later with an `ignore` list if it proves useful.

## Effort

About 30 minutes: install, add the config block, run `vp exec eslint layers`,
then a triage pass over the ~25 hits. A minor version bump if any component
class changes are visible (`gray` → semantic changes the rendered colour in
apps with a custom `neutral`, which is the point, but note it in the
changelog).

## Follow-on

- Once it's in the layers repo, consider adding it to `tooling-config` so
  `lint:sync` spreads it. `entryPoint` and `colors` are per-project, so the
  shared config would need to read them from somewhere (env, or a small
  per-repo `nuxt-ui-eslint.config.mjs` it imports).
- Don't register `eslint-plugin-better-tailwindcss` twice (shared config +
  local block). ESLint fails.
