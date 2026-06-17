# layers/animations

`layers/animations` has duplicated pointer/motion logic and several high-complexity animation callbacks. Keep public animation composables separate.

## Complexity Findings

- `8` complexity findings.
- `5` high findings.
- Main findings include `useTiltEffect.ts:17`, `useMagneticElement.ts:17`, `MarqueeText.vue:80`, and `Marquee.vue:87`.

## Duplication Findings

- `2` duplicate warnings.
- `useMagneticElement.ts:42-50` duplicates `useTiltEffect.ts:42-54`.

## Component Opportunities

- No new component is recommended.

## Composable Opportunities

- Create `usePointerMotionFrame()` for shared RAF setup, cleanup, and pointer interpolation.
- Keep `useMagneticElement()` and `useTiltEffect()` as public composables because their interaction semantics differ.

## Utility Opportunities

- Extract shared lerp, bounds, and transform math helpers if they repeat after composable extraction.

## Acceptance Criteria

- The magnetic/tilt duplicate group disappears.
- Public composable signatures remain stable.
- Motion behavior remains visually equivalent.
- `pnpm typecheck` passes.
