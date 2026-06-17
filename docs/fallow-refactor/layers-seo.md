# layers/seo

`layers/seo` has a small complexity finding in config resolution. Treat this as a low-risk utility cleanup.

## Complexity Findings

- `1` complexity finding.
- `1` critical finding.
- `layers/seo/app/composables/useSeoConfig.ts:1` defines `useSeoConfig` with cyclomatic complexity `11`.

## Duplication Findings

- No duplication warnings for this layer in the supplied Problems export.

## Component Opportunities

- No component extraction is relevant.

## Composable Opportunities

- Keep `useSeoConfig()` as the public composable.

## Utility Opportunities

- Extract config defaults into a pure resolver.
- Use small helpers for site metadata, Open Graph defaults, and optional feature flags.

## Acceptance Criteria

- `useSeoConfig()` becomes a thin wrapper around pure resolvers.
- Existing SEO config output remains unchanged.
- `pnpm typecheck` passes.
