# kmcom-nuxt-layers Upstream Fixes

This document captures the package-side changes needed for consumers like `KMCOMv5/frontend`.

## What is not the problem

The frontend `tsconfig.json` `exclude` list is not the reason this package shows up in typechecking.

TypeScript only uses `exclude` to decide which files become root inputs. Once Nuxt generates layer aliases like `#layers/theme` and the app imports one of those paths, TypeScript follows the resolved package files under `node_modules` and typechecks them.

That is expected behavior.

## Required changes in `kmcom-nuxt-layers`

### 1. Widen the image provider prop

File: `layers/visual/app/types/media.ts`

Problem: `PictureProps.provider` is typed too narrowly as `'ipx'`, which breaks apps that configure a different Nuxt Image provider.

Change the prop type to `string` and keep the runtime pass-through unchanged.

```ts
// BEFORE
provider?: 'ipx'

// AFTER
provider?: string
```

### 2. Export the feeds layer

File: root `package.json`

Problem: `package.json` exports do not include `./layers/feeds`, so consumers cannot extend the feeds layer reliably.

Add the missing export entry:

```json
"exports": {
  "./layers/core": "./layers/core/nuxt.config.ts",
  "./layers/ui": "./layers/ui/nuxt.config.ts",
  "./layers/content": "./layers/content/nuxt.config.ts",
  "./layers/feeds": "./layers/feeds/nuxt.config.ts",
  "./layers/routing": "./layers/routing/nuxt.config.ts"
}
```

### 3. Ship feed server routes in the npm tarball

File: root `package.json`

Problem: the published `files` list needs to include `layers/*/server/**`. Without that, feed handlers are stripped from the package and the feed routes 404 in consuming apps.

Add the server glob to `files`:

```json
"files": [
  "layers/*/nuxt.config.ts",
  "layers/*/app.config.ts",
  "layers/*/package.json",
  "layers/*/tsconfig.json",
  "layers/*/tailwind.config.*",
  "layers/*/app/**",
  "layers/*/server/**",
  "docs/"
]
```

## Consumer impact

After these changes land in `kmcom-nuxt-layers`, the frontend should:

1. Bump the dependency version in `package.json`.
2. Reinstall dependencies.
3. Re-run `pnpm typecheck`.
4. Re-check feed routes such as `/feed/rss` and `/feed/blog/json`.

## Verification in the package repo

1. Run the package typecheck.
2. Run a package publish dry-run or inspect the packed tarball.
3. Confirm `layers/feeds/server/**` is present in the published output.
4. Confirm consumers can extend `kmcom-nuxt-layers/layers/feeds` without a package exports warning.
