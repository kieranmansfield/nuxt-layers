# Nuxt Layers Feeds Page Design

Date: 2026-06-17
Status: Draft

## Summary

Add a reusable feeds index component to `kmcom-nuxt-layers`, then let each consuming app expose its own `/feeds` page when needed. The shared component should derive its feed list from `app.config.ts`, while `content.config.ts` remains the source of truth for the actual content collections.

This keeps the feed catalog consistent across apps without forcing a page route into every consumer.

## Problem

The layer already owns the machine-readable feed endpoints and feed discovery behavior. What is missing is a human-facing page that lists all available feeds in one place.

That page should be:

- reusable across apps
- easy to mount locally
- driven by configuration instead of duplicated route lists
- consistent with the existing feed layer behavior

## Goals

- Provide a shared component that renders all feed links for the configured site.
- Keep the actual `/feeds` route local to each app.
- Use `app.config.ts` as the canonical feed configuration source.
- Avoid duplicating the same feed catalog in page files, components, and route config.
- Preserve existing machine feed routes such as `/feed/rss`, `/feed/atom`, `/feed/json`, and `/feed/<collection>/*`.

## Non-Goals

- Moving the `/feeds` route itself into the shared layer.
- Replacing `content.config.ts` as the definition of content collections.
- Changing the current feed serializer, XML/JSON output, or discovery endpoints.
- Adding a second config system just for feeds.

## Recommended Structure

### Shared layer responsibility

Add a component in `kmcom-nuxt-layers` that renders the feed catalog. The component should read from `useAppConfig()` and derive the list of links from the existing `feedsLayer.feed` settings.

The component should list:

- site-wide shorthand feeds:
  - `/feed/rss`
  - `/feed/atom`
  - `/feed/json`
- machine-readable feed endpoints:
  - `/feed`
  - `/feed/discovery`
- collection feeds for every configured collection:
  - `/feed/<collection>/rss`
  - `/feed/<collection>/atom`
  - `/feed/<collection>/json`

The component should not accept a duplicate feed definition prop unless there is a strong need later. The goal is to keep `app.config.ts` as the single source of truth.

### App responsibility

Each app can add its own page file, for example:

- `app/pages/feeds.vue`

That page should be thin:

- set the page title and metadata
- wrap the shared component in the app’s existing layout primitives
- optionally add local intro copy

### Config responsibility

Use `app.config.ts` for the feed catalog and presentation metadata:

- `site` for canonical site metadata
- `feedsLayer.feed.collections` for the set of exposed collections
- `feedsLayer.feed.defaultCollection` for the shorthand feed target
- `feedsLayer.feed.limit` for the per-feed item cap

Keep `content.config.ts` as the authoritative definition of what collections exist. The shared component can read the app config, but the build should still fail or warn clearly if the feed config names a collection that does not exist.

## Source of Truth Model

The ownership split should be:

| Concern | Source |
|---|---|
| Site title, URL, author metadata | `app.config.ts` |
| Which collections exist | `content.config.ts` |
| Which collections are exposed as feeds | `app.config.ts` |
| Feed rendering and link generation | `kmcom-nuxt-layers` component |
| Feed routes and prerender behavior | app `nuxt.config.ts` |

This is the cleanest balance between reuse and app-specific control.

## Proposed API

The shared component should be intentionally small.

Suggested shape:

```vue
<FeedsIndex />
```

Optional page-level props can be added later for layout text only, such as a title or description. They should not redefine the feed catalog itself.

If the component needs to expose data for testing or advanced usage, prefer a small composable behind the component rather than a broad prop surface.

## Validation Rules

- If `feedsLayer.feed.collections` includes a name that does not exist in `content.config.ts`, the mismatch should be surfaced clearly.
- The component should not hardcode collection names.
- The page should still render if a site only exposes the default `blog` collection.
- The layer should remain usable without forcing a local `/feeds` page.

## Implementation Notes

- Keep the layer component presentation-only where possible.
- Derive feed URLs from config rather than duplicating string literals in multiple files.
- Preserve the existing `/feed` routes and redirects.
- If the app later wants to add `/feeds` to navigation, that should be a local app choice, not a layer requirement.

## Rollout Plan

1. Add the shared feed index component to `kmcom-nuxt-layers`.
2. Add a local `/feeds` page in the app that uses the shared component.
3. Keep the existing machine-feed routes unchanged.
4. Add or update any local navigation link if the site wants the page surfaced.
5. Verify the rendered page and the feed links after build.

## Acceptance Criteria

- The app can render a `/feeds` page without duplicating feed URLs.
- The page reflects the configured collections from `app.config.ts`.
- The component works for the current blog-only setup and for future multi-collection setups.
- The machine-readable feed endpoints continue to work unchanged.

## Open Questions

- Should the component show all feed formats equally, or emphasize RSS first?
- Should collection feeds be grouped by collection, or presented as one flat list?
- Should the page include short human descriptions for each format, or only links?

The default assumption is a flat list with concise labels unless a consuming app wants a richer presentation.
