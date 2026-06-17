# layers/forms

`layers/forms` has one moderate component-level complexity finding. Keep this as a local cleanup.

## Complexity Findings

- `1` complexity finding.
- `layers/forms/app/components/Form/Field.vue:64` defines `textInputProps` with moderate complexity.

## Duplication Findings

- No duplication warnings for this layer in the supplied Problems export.

## Component Opportunities

- No component extraction is recommended.

## Composable Opportunities

- No composable extraction is recommended.

## Utility Opportunities

- Extract input prop normalization into a small helper if more field types share the pattern.

## Acceptance Criteria

- `Form/Field.vue` remains the public field component.
- Text input props remain unchanged.
- `pnpm typecheck` passes.
