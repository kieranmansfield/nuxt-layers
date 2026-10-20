# 0002 — Each app owns its `content.config.ts`; don't hoist collections into the layer

Status: accepted (2026-10-20)

## Context

`apps/playground/content.config.ts` redeclares the four collections that
`layers/content/content.config.ts` also defines, which looks like duplication.

`@nuxt/content` 3.15.2 (`loadContentConfig`) loads `content.config.ts` from every layer in
`nuxt.options._layers` and merges collections by name, with the app last. Each collection is
tagged `__rootDir` = the config's own layer directory, and source scanning is rooted there. A
collection defined only in the layer therefore reads `layers/content/content/**`, never the
app's `content/` folder.

## Decision

Each consumer app declares its own collections. The layer's `content.config.ts` serves standalone
runs only, and it is not in the published package `files`. Do not try to remove the playground
copy, wrap `defineCollection` in layer-exported factories, or point `source` at the app from the
layer.

## Consequences

- Drift risk is limited to four glob strings per app; `layers/content/CLAUDE.md` holds the
  copy-paste config.
- Schemas must still never be passed to `defineCollection` (c12/jiti validator issue).
