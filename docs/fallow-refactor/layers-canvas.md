# layers/canvas

`layers/canvas` has moderate renderer capability complexity. This is a local utility refactor, not a component extraction.

## Complexity Findings

- `3` complexity findings.
- `1` high finding.
- Main findings include `useRendererCapabilities.ts:97`, `useRendererCapabilities.ts:17`, and `nuxt.config.ts:133`.

## Duplication Findings

- No duplication warnings for this layer in the supplied Problems export.

## Component Opportunities

- No component extraction is recommended.

## Composable Opportunities

- Keep `useRendererCapabilities()` as the public composable.

## Utility Opportunities

- Extract renderer feature detection into pure predicate helpers.
- Extract capability normalization into one resolver.

## Acceptance Criteria

- Renderer detection remains stable across WebGL, WebGPU, and fallback cases.
- `useRendererCapabilities()` keeps its public return shape.
- `pnpm typecheck` passes.
