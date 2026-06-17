# layers/page-transitions

`layers/page-transitions` has only low-risk moderate complexity findings.

## Complexity Findings

- `2` complexity findings.
- Both are moderate.
- Main findings include `usePageTransition.ts:12` and `page-transitions.client.ts:3`.

## Duplication Findings

- No duplication warnings for this layer in the supplied Problems export.

## Component Opportunities

- No component extraction is recommended.

## Composable Opportunities

- Keep `usePageTransition()` as the public API.

## Utility Opportunities

- Extract transition config defaulting if more transition modes are added.

## Acceptance Criteria

- No behavior changes to page transition config.
- `pnpm typecheck` passes.
