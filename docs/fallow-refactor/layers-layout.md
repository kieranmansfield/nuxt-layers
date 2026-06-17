# layers/layout

`layers/layout` has one concentrated complexity hotspot in grid placement style generation. This wants utilities, not new components.

## Complexity Findings

- `5` complexity findings.
- `1` critical finding.
- `layers/layout/app/components/Layout/Grid/Item.vue:139` defines a computed `style` function with cyclomatic complexity `35` and cognitive complexity `52`.

## Duplication Findings

- `4` duplicate warnings.
- All duplicate warnings sit inside `Layout/Grid/Item.vue`.
- The duplicate blocks repeat responsive `md` and `lg` CSS variable assignment for row and column placement.

## Component Opportunities

- No new component is needed.
- Keep `Layout/Grid/Item.vue` as the component boundary.

## Composable Opportunities

- Share logic with `layers/layout/app/composables/GridPlacement.ts` only if it needs reactive state.
- Prefer pure utilities first.

## Utility Opportunities

- Create `layers/layout/app/utils/gridPlacementStyle.ts`.
- Extract `resolveDefaultPlacement()`.
- Extract `resolveResponsivePlacementVars()`.
- Extract `resolveBleedStyles()`.
- Extract `resolveAlignmentStyles()`.
- Extract `resolveRhythmStyles()`.
- Extract `resolveLayerStyles()`.

## Acceptance Criteria

- `Grid/Item.vue:139` drops below critical complexity.
- Local responsive-var duplicate warnings disappear.
- Full-span, bleed-left, bleed-right, responsive row, and responsive column behavior stays unchanged.
- `pnpm typecheck` passes.
