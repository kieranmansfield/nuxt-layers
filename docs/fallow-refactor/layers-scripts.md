# layers/scripts

`layers/scripts` has high-complexity script and analytics composables. Split consent decisions from script loading.

## Complexity Findings

- `2` complexity findings.
- Both are high.
- Main findings include `useAnalytics.ts:10` and `useGtm.ts:1`.
- Fallow also identifies `useScriptsConsent.ts` as a high-impact split target because several files depend on it.

## Duplication Findings

- No duplication warnings for this layer in the supplied Problems export.

## Component Opportunities

- No component extraction is relevant.

## Composable Opportunities

- Keep `useAnalytics()`, `useGtm()`, and `useScriptsConsent()` as public APIs.
- Extract consent evaluation from script loading side effects.

## Utility Opportunities

- Create `resolveScriptConsentState()`.
- Create `shouldLoadScriptProvider()`.
- Create provider-specific script config builders.

## Acceptance Criteria

- Consent logic can be tested without loading scripts.
- Public composable return shapes stay stable.
- `pnpm typecheck` passes.
