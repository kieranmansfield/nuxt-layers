# Migration Guide — v6.4.x → v6.5.0

**Audience:** an AI coding agent (or developer) updating a downstream Nuxt app that consumes these
layers.
**What changed:** layers stop making app-wide choices for you, the published package declares the
dependencies its layers import, and two diagnostic API routes are now dev-only.

Work top to bottom. Each change has a **Detect** step and an **Apply** step; skip anything Detect
doesn't find.

## 0. Preconditions

- Update the package to `^6.5.0`, reinstall, run `npx nuxt prepare`.

---

## Required changes

### 1. `core` no longer sets `future.compatibilityVersion: 5` or `devtools`

Layer config merges into the app, so `core` was opting every consumer into Nuxt 5 behaviour and
forcing devtools on. Both are now the app's call.

**Detect:** your app's `nuxt.config.ts` has no `future.compatibilityVersion`.

**Apply:** to keep the behaviour you had on v6.4, add:

```ts
export default defineNuxtConfig({
  future: { compatibilityVersion: 5 },
  devtools: { enabled: true },
})
```

### 2. Install the peers for the layers you use

The root package now lists these as optional peer dependencies. They were always imported at
runtime; previously the app only worked if something else happened to install them.

**Detect:** you extend `mailer`/`forms`, `database`, `auth` or `feeds`.

**Apply:**

| Layer              | Install                                    |
| ------------------ | ------------------------------------------ |
| `mailer` / `forms` | `resend hookable` (plus `zod` for `forms`) |
| `database`         | `drizzle-orm @neondatabase/serverless`     |
| `auth`             | `nuxt-auth-utils`                          |
| `feeds`            | `feed`                                     |

---

## Behaviour changes (no action unless you rely on them)

- **`GET /api/forms/status`** returns only `{ configured }` outside dev. `emailFrom`/`emailTo` are
  dev-only because `emailTo` is the private inbox every contact submission goes to.
- **`GET /api/metadata/status`** returns 404 outside dev. Each call ran a live search on every
  provider, spending real API quota.
- **`GET /api/metadata/search`** rejects an unknown `mediaType` or a non-positive `limit` with a
  400, and caps `limit` at 50.
- **`feeds`** now always extends `core` and `content`. The `FEEDS_STANDALONE` env var is gone.
- **`routing`**: `layerDefaultDeny` now works in npm consumers. Layer pages were never tagged
  before, so a layer page without a `feature` meta will now be denied if you enabled
  `layerDefaultDeny`.
- **`auth`** middleware redirects to `/auth/github` with `external: true`, so client-side
  navigation reaches the OAuth route instead of the 404 page.
- **`forms`**: `contactSchema` moved from `app/utils/` to `shared/utils/`. Import it from
  `#layers/forms/shared/utils/contact-schema` if you imported it by path.
- **`@nuxt/eslint`** loads only when installed, so apps without it no longer fail outside
  production.
- **`feeds`** and **`routing`** server routes now read your `app.config.ts` when Nitro
  auto-imports are on. They imported `useAppConfig` from `nitropack/runtime`, which never sees
  it, so feeds were titled "My Site", linked to the request origin (localhost when prerendered)
  and ignored `feedsLayer`, and `/api/feature-flags` returned `{}`. They now use `site`,
  `feedsLayer` and `routingLayer.features`. With `experimental.nitroAutoImports: false` (the
  Nuxt 5 default) Nuxt can't evaluate app.config.ts in Nitro, so they keep the old defaults;
  set `nitroAutoImports: true` to get your values. Layer server code reads app config through
  core's `readServerAppConfig()`.
- **`core` loading screen** stops being a timer. `minDuration` defaults to `0` (was `1500`) and
  `maxDuration` to `1500` (was `3000`). A new `showAfter` (default `400` ms) keeps the screen
  hidden on fast loads. The percentage moves at real milestones (hydrated, fonts ready, page
  loaded) instead of a simulated trickle; `trickleProgress` is gone. Under
  `prefers-reduced-motion` the screen is hidden and loading ends on mount. `useLoading()` adds
  `finishNow()` and `skipped`. Set `minDuration: 1500` to keep the old pacing.
- **`theming`**: the Reduce Motion switch also ends the boot loading screen.
- **`forms`**: `contactSchema` accepts any non-blank name (was 3+ characters), so short names
  like Li or Ng get through.
