# layers/theme

`layers/theme` has one duplicate with the playground and one server-side CSS generation complexity finding.

## Complexity Findings

- `2` complexity findings.
- `layers/theme/server/plugins/theme-fouc.ts:86` defines `buildAccentCSS` with high complexity.
- `layers/theme/app/plugins/theme.client.ts:5` has a moderate setup finding.

## Duplication Findings

- `1` duplicate warning.
- `ThemePicker/Menu.vue:12-27` duplicates `apps/playground/app/pages/theme.vue:29-45`.

## Component Opportunities

- Keep the canonical theme picker menu in `layers/theme`.
- Update the playground theme page to consume the layer component instead of duplicating menu behavior.

## Composable Opportunities

- No new composable is required from the current findings.

## Utility Opportunities

- Split `buildAccentCSS()` into token extraction, CSS variable formatting, and selector assembly helpers.

## Acceptance Criteria

- The playground theme page no longer duplicates `ThemePicker/Menu.vue` logic.
- `buildAccentCSS()` delegates formatting to pure helpers.
- `pnpm typecheck` passes.
