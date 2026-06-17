# layers/mailer

`layers/mailer` has one high-complexity email helper and one type-like duplicate group.

## Complexity Findings

- `1` complexity finding.
- `layers/mailer/server/utils/email.ts:9` defines `sendContactEmail` with high complexity.

## Duplication Findings

- `2` duplicate warnings.
- `app/types/mailer.ts:7-24` duplicates `server/utils/hooks.ts:3-20`.

## Component Opportunities

- No component extraction is relevant.

## Composable Opportunities

- No composable extraction is recommended.

## Utility Opportunities

- Move shared hook/event types into one importable type module.
- Split `sendContactEmail()` into payload validation, recipient resolution, template data creation, and provider send call.

## Acceptance Criteria

- The duplicated mailer type block has one source of truth.
- Server email sending behavior remains unchanged.
- `pnpm typecheck` passes.
