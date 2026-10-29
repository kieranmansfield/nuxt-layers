# Fix: Feeds (and Feature Flags) Read an Empty App Config on the Server

**Status:** fixed in 6.5.0.

## Problem

Every site that extends the `feeds` layer publishes feeds that ignore its `app.config.ts`.
The live feed on kieranmansfield.com (`/feed/blog/rss`, 24 October 2026):

```xml
<title>My Site — Blog</title>
<link>http://localhost/</link>
<description></description>
```

The site's `app.config.ts` sets `site.title`, `site.url` and `site.description`, and none of
them arrive. `My Site` is the fallback in `feed-config.ts:22`. The link is the prerender
request's own origin (`feed-config.ts:50-53`), so a prerendered feed points readers at
`http://localhost`. The consumer's `feedsLayer.feed` settings (`limit`, `collections`,
`defaultCollection`) are ignored the same way, so the layer defaults apply.

The routing layer has the same bug: `/api/feature-flags` always returns `{}`, whatever the app
sets in `routingLayer.features`.

## Root Cause

Three server files import `useAppConfig` explicitly from `nitropack/runtime`:

| File                                                       | Import | Call    |
| ---------------------------------------------------------- | ------ | ------- |
| `layers/delivery/feeds/server/utils/feed-service.ts`       | line 3 | line 19 |
| `layers/delivery/feeds/server/routes/feed/demo.get.ts`     | line 3 | line 29 |
| `layers/structure/routing/server/api/feature-flags.get.ts` | line 2 | line 6  |

Nitropack's `useAppConfig` returns Nitro's own inline app config
(`#nitro-internal-virtual/app-config`, built from `nitro.appConfig`). Nuxt doesn't put the merged
`app.config.ts` there. It serves that through its own `useAppConfig`: the one Nitro auto-imports
when Nitro auto-imports are on, and the explicit export from `nuxt/server` (Nuxt 4.6.0 and later).
The explicit `nitropack/runtime` import, there so the layers work with Nitro auto-imports off,
bypasses it.

Measured in the KMCOM frontend (Nuxt 4.6.2, dev server) with a temporary server route that
called both:

| Import              | What it returned                                                                                         |
| ------------------- | -------------------------------------------------------------------------------------------------------- |
| `nitropack/runtime` | An empty object, even with `appConfig` or `nitro.appConfig` set in `nuxt.config.ts`                      |
| `nuxt/server`       | The full merged config: `ui`, `site`, `mastNav`, `routingLayer`, `feedsLayer` (`limit: 30`) and the rest |

So consumers have no workaround: nothing set in `nuxt.config.ts` reaches the nitropack version.
KMCOM tried both and reverted them (frontend commit `7edbc91`).

Not affected: `useRuntimeConfig`, `useStorage` and `defineNitroPlugin` from `nitropack/runtime`
(mailer, database, metadata providers, theming). Nuxt does share runtime config with Nitro.

## Fix Required

**Repository:** `/Users/kieranmansfield/Developer/layers/nuxt-layers`

### Why not `nuxt/server`

The first fix imported `useAppConfig` from `nuxt/server`. That works when Nitro auto-imports are
on (the KMCOM frontend), but not in Nuxt 5 mode (`experimental.nitroAutoImports: false`, the
default under `compatibilityVersion: 5`, which the playground uses). Loading `nuxt/server`
evaluates every `app.config.ts`, and their `defineAppConfig` only exists in Nitro as an
auto-import. In the playground it threw `defineAppConfig is not defined` as an uncaught
exception: the routes returned 500, and a `try`/`import()` fallback couldn't catch it because
Nitro's dev build inlines dynamic imports.

### What shipped in 6.5.0

`layers/core/server/utils/app-config.ts` exports `readServerAppConfig()`. It calls Nuxt's merged
`useAppConfig`, which Nitro injects as an auto-import, and deliberately doesn't import it. When
nothing is injected (`typeof useAppConfig !== 'function'`), it falls back to Nitro's own app
config, empty as before. `feed-service.ts`, `routes/feed/demo.get.ts` and
`routing/server/api/feature-flags.get.ts` call it through `#layers/core/server/utils/app-config`.

Checked in the playground:

| Nitro auto-imports | `/feed/rss`                                   | `/api/feature-flags`            |
| ------------------ | --------------------------------------------- | ------------------------------- |
| On                 | Titled from `site.title`, links to `site.url` | Returns `routingLayer.features` |
| Off (Nuxt 5 mode)  | `My Site`, as before, no crash                | `{}`, as before, no crash       |

So sites in Nuxt 5 mode still get defaults until Nuxt can evaluate app.config.ts in Nitro
without auto-imports. They can opt in with `experimental: { nitroAutoImports: true }`.

### Stop it coming back

An ESLint `no-restricted-imports` rule rejects `useAppConfig` from `nitropack/runtime` in layer
server code. The helper's fallback is the one exception, with a disable comment saying why.

### `collections`

Nuxt's merged config gives `feedsLayer.feed.collections` as `['blog', 'blog']`: app config arrays
concatenate across layers. No change needed: `feed-catalog.ts` already removes repeats with
`unique()`, and the server only reads `defaultCollection`.

## Verification

1. In `apps/playground` (or any consumer), set `site.title`, `site.url` and `site.description` in
   `app.config.ts` and run the dev server. `curl /feed/rss` shows that title and description,
   and the channel `<link>` is `site.url`, not localhost.
2. Set `routingLayer.features` in the playground. `curl /api/feature-flags` returns them.
3. Run `nuxt generate`. `.output/public/feed/rss` and `/feed/blog/rss` carry the same title and
   absolute `site.url` links.
4. `feedsLayer.feed.limit` caps the number of items.

## Consumer Follow-up

KMCOM frontend: bump `kmcom-nuxt-layers` once this ships, then check `/feed/blog/rss`. There is
no workaround to remove; the attempt was reverted.
