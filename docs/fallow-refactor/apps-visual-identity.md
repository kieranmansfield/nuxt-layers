# apps/visual-identity

`apps/visual-identity` has small but clear duplication and moderate complexity. Treat this as a focused cleanup after the larger shader and playground work.

## Complexity Findings

- `10` complexity findings.
- `2` critical findings.
- `apps/visual-identity/app/composables/useExport.ts:135` has a high-complexity `generateTailwindV4`.
- `apps/visual-identity/app/composables/useExport.ts:90` has a high-complexity `generateCssVars`.
- `apps/visual-identity/app/composables/useBrandState.ts:151` has a critical `migrateState`.
- `apps/visual-identity/app/components/Colour/ModePreview.vue:31` has a critical `mixOklch`.

## Duplication Findings

- `6` duplicate warnings.
- `useExport.ts:114-126` duplicates `useExport.ts:158-170`.
- Typography page setup duplicates between `typography/index.vue` and `typography/scale.vue`.
- `colour/themes.vue` contains two small same-file duplicate groups.

## Component Opportunities

- Add a small typography page header component only if the same header pattern appears in more than the current two files.
- Keep color preview components domain-specific.

## Composable Opportunities

- Keep `useExport()` as the public composable.
- Move migration logic behind a small `useBrandStateMigrations()` helper only if migrations grow beyond the current version.

## Utility Opportunities

- Create `apps/visual-identity/app/utils/exportWriters.ts` for token line generation.
- Create `apps/visual-identity/app/utils/brandStateMigrations.ts` for versioned state migration.
- Create `apps/visual-identity/app/utils/oklchMix.ts` for OKLCH mixing used by components.

## Acceptance Criteria

- Duplicate export writer blocks disappear.
- `generateCssVars` and `generateTailwindV4` use shared writer helpers.
- `pnpm typecheck` passes.
