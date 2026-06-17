# layers/routing

`layers/routing` has modest complexity in route resolution and middleware checks. Keep the public utility API stable.

## Complexity Findings

- `3` complexity findings.
- `1` critical finding.
- `layers/routing/app/utils/resolveRoute.ts:8` defines `resolveRoute` with cyclomatic complexity `10`.
- `layers/routing/nuxt.config.ts:27` and `middleware/02.governance.global.ts:4` have moderate findings.

## Duplication Findings

- No duplication warnings for this layer in the supplied Problems export.

## Component Opportunities

- No component extraction is relevant.

## Composable Opportunities

- No composable extraction is recommended.

## Utility Opportunities

- Split `resolveRoute()` into maintenance, strict deny, layer deny, and feature result helpers.
- Keep the exported `resolveRoute()` as the orchestration function.

## Acceptance Criteria

- `resolveRoute()` keeps the same input and output contract.
- Individual rule helpers can be tested independently.
- `pnpm typecheck` passes.
