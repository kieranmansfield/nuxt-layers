# kmcom-nuxt-layers — Two Fixes Required

Discovered while migrating KMCOMv5/frontend to v2.2.3 and wiring up feeds.

---

## Fix 1 — `PictureProps.provider` hardcoded to `'ipx'`

**File:** `layers/visual/app/types/media.ts`, line 154

**Problem:** The `provider` prop is typed as a literal `'ipx'`, so any app that configures
a different Nuxt Image provider (e.g. `netlify`) gets a TypeScript error when `NuxtPicture`
receives the prop:

```
Type '"ipx" | undefined' is not assignable to type '"netlify" | undefined'.
```

**Fix:** Widen the type to `string` so any configured provider is accepted.

```ts
// BEFORE
/** Image provider - defaults to 'ipx' (Nuxt's built-in image optimizer) */
provider?: 'ipx'

// AFTER
/** Image provider override. Defaults to the app's configured Nuxt Image provider. */
provider?: string
```

No other changes needed — the prop is already passed through as-is to `NuxtPicture`.

---

## Fix 2 — `feeds` layer missing from package exports and server routes excluded from published files

**Problem:** The `feeds` layer has two packaging issues that prevent it from working in
consuming apps:

### 2a — Missing export entry

`package.json` `exports` lists every other layer but not `feeds`, so Node's package
exports map rejects the import and Nuxt emits:

```
WARN  Cannot extend config from kmcom-nuxt-layers/layers/feeds
```

**Fix:** Add one line to the `exports` map in the root `package.json`:

```json
"exports": {
  "./layers/core": "./layers/core/nuxt.config.ts",
  ...
  "./layers/content": "./layers/content/nuxt.config.ts",
  "./layers/feeds": "./layers/feeds/nuxt.config.ts",   // ← add this
  "./layers/routing": "./layers/routing/nuxt.config.ts"
}
```

### 2b — Server routes excluded from published files

The `files` glob only covers `layers/*/app/**`. Feed endpoints live in
`layers/feeds/server/` and are therefore stripped from the npm tarball, so the
`/feed/rss`, `/feed/atom`, `/feed/json`, and `/feed/blog/*` routes are never shipped.

**Fix:** Add a `server` glob to the `files` array in the root `package.json`:

```json
"files": [
  "layers/*/nuxt.config.ts",
  "layers/*/app.config.ts",
  "layers/*/package.json",
  "layers/*/tsconfig.json",
  "layers/*/tailwind.config.*",
  "layers/*/app/**",
  "layers/*/server/**",   // ← add this
  "docs/"
]
```

Both changes are required. Without 2a the layer is silently skipped; without 2b the
layer loads but all feed routes return 404 because the server handlers are absent.

---

## Verification (after publishing a new version)

In KMCOMv5/frontend, bump `kmcom-nuxt-layers` to the new version and run:

```sh
pnpm install
pnpm typecheck          # should pass with zero errors
pnpm dev
```

Then visit:
- `/feed/rss` — styled RSS XML, blog items present
- `/feed/blog/json` — JSON Feed 1.1 with items
- `/feed` — index listing the blog collection
- View source on any page → `<link rel="alternate" ...>` tags in `<head>`
