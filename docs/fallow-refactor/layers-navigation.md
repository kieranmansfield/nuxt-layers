# layers/navigation

`layers/navigation` has a small high-complexity composable finding. It also has a circular dependency warning outside this scope, but this document focuses on complexity and duplication only.

## Complexity Findings

- `1` complexity finding.
- `layers/navigation/app/composables/useSite.ts:3` defines `useSite` with high complexity.

## Duplication Findings

- No duplication warnings for this layer in the supplied Problems export.

## Component Opportunities

- No component extraction is recommended from the current findings.

## Composable Opportunities

- Keep `useSite()` as the public composable.

## Utility Opportunities

- Extract site config default resolution into a pure helper.
- Use small helpers for title, subtitle, nav groups, and footer defaults if those branches exist in the composable.

## Acceptance Criteria

- `useSite()` keeps its public return shape.
- Config fallback behavior remains unchanged.
- `pnpm typecheck` passes.
