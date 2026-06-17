# layers/feeds

`layers/feeds` has complexity in server-side feed assembly and formatters. The best target is pure utilities with thin route handlers.

## Complexity Findings

- `8` complexity findings.
- `3` critical findings.
- `layers/feeds/server/utils/feed-service.ts:6` defines `buildFeed` with cyclomatic complexity `22` and cognitive complexity `16`.
- `layers/feeds/server/utils/formats/rss.ts:5` defines `toRSS` with high complexity.
- `layers/feeds/server/utils/content-adapter.ts:33` defines `resolveFeedAuthor`.

## Duplication Findings

- No duplication warnings for this layer in the supplied Problems export.

## Component Opportunities

- No component extraction is relevant.

## Composable Opportunities

- No app composable extraction is recommended for the server-side findings.

## Utility Opportunities

- Create `layers/feeds/server/utils/feed-config.ts`.
- Extract `resolveFeedSiteConfig()`.
- Extract `resolveFeedCollection()`.
- Extract `createFeedConfig()`.
- Create `layers/feeds/server/utils/feed-author.ts`.
- Create `layers/feeds/server/utils/feed-xml.ts` for XML escaping and repeated RSS serialization helpers.

## Acceptance Criteria

- Route handlers remain thin orchestration functions.
- `buildFeed` delegates config and collection resolution.
- RSS formatting uses smaller helpers for item URL, author, media, dates, and XML escaping.
- `pnpm typecheck` passes.
