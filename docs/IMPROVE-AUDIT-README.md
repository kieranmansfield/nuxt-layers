# Improve Audit

Audit written against commit `a2805da`.

## Files

| File | Purpose |
| --- | --- |
| [IMPROVE-AUDIT-RESULTS.md](./IMPROVE-AUDIT-RESULTS.md) | Vetted improve audit findings, direction options, verification results, and recommended planning order. |

## Recommended Next Work

Recommended first implementation set:

1. Fix the current feeds lint failure.
2. Bring published server routes into root typecheck and type-aware lint coverage.
3. Stop exposing configured mailer addresses from the public forms status endpoint.
4. Correct the forms demo mailer environment variable names.
5. Add focused behavior tests around feed, forms/mailer, and routing paths.

## Dependency Order

| Order | Finding | Depends On | Status |
| --- | --- | --- | --- |
| 1 | Current feeds lint failure | None | TODO |
| 2 | Server route typecheck coverage | Feeds lint fix recommended first | TODO |
| 3 | Public forms status endpoint leaks email addresses | Server route typecheck coverage recommended first | TODO |
| 4 | Wrong mailer env var docs in forms demo | None | TODO |
| 5 | Missing behavior tests | Typecheck/lint baseline | TODO |

