# kmcom-nuxt-layers v3.0.0 — typecheck issues

Found while upgrading KMCOMv5-frontend from `kmcom-nuxt-layers@2.6.3` to `3.0.0`. These are internal to the package (not fixable from a consuming app) and surface via `pnpm nuxt typecheck` / `pnpm nuxt build`.

## 1. `layers/data/mailer` — broken internal import path

```
layers/data/mailer/server/utils/email.ts(1,39): error TS2307: Cannot find module '#layers/mailer/shared/contact'
layers/data/mailer/server/utils/hooks.ts(1,39): error TS2307: Cannot find module '#layers/mailer/shared/contact'
```

Both files still import from `#layers/mailer/shared/contact`, the pre-v3 alias root. After the v3 restructure the mailer layer lives at `layers/data/mailer`, so the alias should resolve under whatever the new mailer subpath alias is (mirrors the `layers/theme` → `layers/theming` rename pattern seen elsewhere in this release). Needs updating in the package itself.

## 2. `layers/render/canvas` — untyped `navigator.gpu`

```
layers/render/canvas/app/composables/useRendererCapabilities.ts(75,27): error TS18046: 'navigator.gpu' is of type 'unknown'.
```

`navigator.gpu` (WebGPU) isn't declared without the `@webgpu/types` lib/types reference. Needs a type declaration or reference (`/// <reference types="@webgpu/types" />`) or a local ambient type in the canvas layer.

## 3. `layers/render/shader` — `Plane.vue` position prop type mismatch

```
layers/render/shader/app/components/Mesh/Plane.vue(20,14): error TS2322: Type '[number, number, number]' is not assignable to type 'Vector3 | Readonly<Vector3 | undefined>'.
  Type '[number, number, number]' is not assignable to type 'Readonly<Vector3>'.
```

A tuple literal is passed where TresJS/Three expects a `Vector3` instance (or its readonly form). Either cast/construct a `Vector3` in the component, or widen the prop type to accept a tuple.

## Also fixed downstream (not upstream bugs, but related to the same v3 restructure)

- `layers/ui` export removed entirely, no replacement — dropped from consuming app's `nuxt.config.ts` extends.
- `layers/theme` renamed to `layers/theming` — alias imports (`#layers/theme/...`) need updating to `#layers/theming/...`.
- Per-collection composables `usePortfolioItems` / `useBlogPost` removed in favor of generic `useCollectionItems(collectionName, opts)` / `useCollectionItem(collectionName, slug)` — worth calling out in `MIGRATION.md`, which still describes the old per-collection factory API (`createPortfolioComposables`, etc.) as current.
