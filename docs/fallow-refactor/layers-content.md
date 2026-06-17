# layers/content

`layers/content` has small, repeated collection query composables. Use a generic composable and keep domain wrappers.

## Complexity Findings

- `6` complexity findings.
- All are moderate.
- Main findings include portfolio, gallery, and blog collection helpers/components.

## Duplication Findings

- `2` duplicate warnings.
- `useGalleryItems.ts:11-20` duplicates `usePortfolioItems.ts:15-24`.

## Component Opportunities

- No component extraction is recommended from the current findings.

## Composable Opportunities

- Create `useCollectionItems()` that accepts collection name, query options, ordering, and limit.
- Keep `useGalleryItems()` and `usePortfolioItems()` as thin wrappers.

## Utility Opportunities

- Extract shared query option normalization if needed.

## Acceptance Criteria

- The gallery/portfolio duplicate group disappears.
- Domain-specific wrapper composables remain available.
- `pnpm typecheck` passes.
