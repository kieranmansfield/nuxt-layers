# layers/visual

`layers/visual` has complexity in responsive image size formatting and gradient style helpers. Prefer pure utilities.

## Complexity Findings

- `7` complexity findings.
- `1` critical finding.
- `layers/visual/app/composables/picture.ts:34` defines `responsiveSizesToString` with cyclomatic complexity `13` and cognitive complexity `17`.
- `layers/visual/app/composables/gradient.ts` has several high-complexity color and style helpers.

## Duplication Findings

- No duplication warnings for this layer in the supplied Problems export.

## Component Opportunities

- No component extraction is recommended.

## Composable Opportunities

- Keep `picture.ts` and `gradient.ts` composable entry points stable.

## Utility Opportunities

- Split `responsiveSizesToString()` into parser, normalizer, and serializer helpers.
- Extract shared color resolution used by accent and gradient helpers.
- Create a gradient style builder utility that has no Vue dependencies.

## Acceptance Criteria

- `responsiveSizesToString` drops below critical complexity.
- Existing `Media/Picture.vue` behavior remains unchanged.
- `pnpm typecheck` passes.
