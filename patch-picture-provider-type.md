# Patch: Picture.vue provider type cast

**Package:** `kmcom-nuxt-layers`
**Target version:** `2.2.5` (or next patch)
**Status:** Workaround live via pnpm patch at `patches/kmcom-nuxt-layers@2.2.4.patch`

---

## Problem

`layers/visual/app/components/Media/Picture.vue` passes the `provider` prop directly to `<NuxtPicture>`:

```html
:provider
```

`PictureProps.provider` is typed as `string | undefined` (correctly widened in 2.2.4), but `NuxtPicture`'s `provider` prop is generated from `ConfiguredImageProviders` — a module-augmentation interface that narrows to the app's actual configured provider names (e.g. `"netlify" | undefined`).

Passing `string` to `"netlify"` fails the type check:

```
error TS2322: Type 'string | undefined' is not assignable to type '"netlify" | undefined'.
  Type 'string' is not assignable to type '"netlify"'.
```

The error appears in every consuming app that configures a non-`ipx` provider.

---

## Fix

**File:** `layers/visual/app/components/Media/Picture.vue`, line 43

```diff
-    :provider
+    :provider="(provider as any)"
```

The cast is necessary because `NuxtPicture`'s prop type is dynamically generated per-app. The layer cannot know the consuming app's provider set at build time, so any typed pass-through will always fail for non-default providers.

---

## Verification

After publishing, in a consuming app using a non-`ipx` provider (e.g. `netlify`):

```sh
pnpm install
pnpm typecheck   # should pass with zero errors
```

Once the new version is published, bump `package.json` here and remove `patches/kmcom-nuxt-layers@2.2.4.patch`.
