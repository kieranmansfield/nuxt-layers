# layers/typography

`layers/typography` has one moderate normalization finding. Treat this as a low-priority utility cleanup.

## Complexity Findings

- `1` complexity finding.
- `layers/typography/app/composables/typography.ts:17` defines `normalizeAxis` with moderate complexity.

## Duplication Findings

- No duplication warnings for this layer in the supplied Problems export.

## Component Opportunities

- No component extraction is recommended.

## Composable Opportunities

- Keep typography composables stable.

## Utility Opportunities

- Replace branching in `normalizeAxis()` with a lookup table if the supported axes are fixed.

## Acceptance Criteria

- Axis normalization output remains unchanged.
- `pnpm typecheck` passes.
