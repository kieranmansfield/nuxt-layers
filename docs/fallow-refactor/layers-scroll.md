# layers/scroll

`layers/scroll` has complexity in scroll option handling and motion components. The work is mostly local function splitting.

## Complexity Findings

- `10` complexity findings.
- `2` critical findings.
- `layers/scroll/app/composables/useSmoothScroll.ts:63` defines `scrollTo`.
- `layers/scroll/app/composables/useSmoothScroll.ts:116` defines `nativeScrollTo`.
- `layers/scroll/app/components/Motion/Parallax.vue:41` has a high-complexity computed arrow function.

## Duplication Findings

- No duplication warnings for this layer in the supplied Problems export.

## Component Opportunities

- No new component is recommended.
- Keep existing motion components as the public API.

## Composable Opportunities

- Keep `useSmoothScroll()` as the public API.
- Extract option normalization into helper functions inside the composable or a utility module.

## Utility Opportunities

- Create `normalizeScrollTarget()`.
- Create `normalizeScrollOptions()`.
- Create `runNativeScroll()`.
- Create `resolveParallaxTransform()` for the Parallax component.

## Acceptance Criteria

- `scrollTo` and `nativeScrollTo` become small orchestration functions.
- Scroll behavior remains unchanged for string selectors, elements, numbers, and top scrolling.
- `pnpm typecheck` passes.
