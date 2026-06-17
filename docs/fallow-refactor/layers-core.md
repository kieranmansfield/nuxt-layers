# layers/core

`layers/core` has several utility-style complexity findings. Prefer rule tables and pure helpers while keeping composable APIs stable.

## Complexity Findings

- `20` complexity findings.
- `4` critical findings.
- `layers/core/app/composables/useBrowser.ts:13` defines `parseBrowserInfo` with cyclomatic complexity `27` and cognitive complexity `20`.
- `layers/core/app/plugins/init.ts:14` defines a high-complexity setup function.
- `layers/core/app/composables/useFeatures.ts:139` defines `applyFeatureClasses`.

## Duplication Findings

- `2` duplicate warnings.
- `layers/core/app/pages/[...slug].vue:4-29` duplicates `layers/core/app/types/app-config.d.ts:13-34`.
- Treat this duplicate group as low priority until verified. It may be structural or type-like rather than real runtime duplication.

## Component Opportunities

- No component extraction is recommended.

## Composable Opportunities

- Keep `useBrowser()` and `useFeatures()` as public composables.
- Move parsing and class mapping out of the composables.

## Utility Opportunities

- Create `layers/core/app/utils/browserInfo.ts` with OS and browser detection rule tables.
- Create `layers/core/app/utils/featureClasses.ts` for feature class mapping.
- Split plugin setup helpers by responsibility in `layers/core/app/plugins/init.ts`.

## Acceptance Criteria

- `parseBrowserInfo` no longer uses a long `if`/`else` chain.
- `applyFeatureClasses` uses a feature-to-class map.
- Public composable return shapes remain stable.
- `pnpm typecheck` passes.
