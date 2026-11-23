# Patch: `MastNavModal` breaks consumer typechecks (kmcom-nuxt-layers v6.16.0)

**Repo to patch:** `kieranmansfield/nuxt-layers` (local: `~/Developer/layers/nuxt-layers`)
**File:** `layers/structure/navigation/app/components/Mast/NavModal.vue`
**Found in:** fortuna-studios (Nuxt 4.6.4, vue-router 5.5.1, `future.compatibilityVersion: 5`)
**Still present on:** `main` at `91cfa44f` (no navigation changes since `v6.16.0`)

## Symptom

Every consuming app's `vue-tsc --noEmit` (or `nuxt typecheck`) fails with two errors from inside
`node_modules`, even if the app never renders `<MastNavModal>` (its own `MastNav` override is
enough; the layer component is still type-checked):

```
NavModal.vue(42,29): error TS2769: No overload matches this call.
  Overload 1 of 2, '(to: RouteLocationAsRelativeTyped<RouteNamedMap, keyof RouteNamedMap>, …)'
    Argument of type 'string | { name: string; params?: …; query?: … }' is not assignable to
    parameter of type 'RouteLocationAsRelativeTyped<RouteNamedMap, keyof RouteNamedMap>'.

NavModal.vue(72,18): error TS2345: Argument of type 'string | { name: string; params?: …;
  query?: … }' is not assignable to parameter of type 'RouteLocationRaw | null | undefined'.
    … Types of property 'name' are incompatible.
      Type 'string' is not assignable to type '"about"'.
```

The same bug existed in v5.0.8 (then at `NavModal.vue(31,18)`).

## Cause

`MastNavLink.to` (`layers/structure/navigation/app/types/nav.ts`) is typed with
`name: string`. With typed routes on, the consumer's router only accepts route names in its own
`RouteNamedMap` (`'index' | 'about' | 'slug'` here), so passing `link.to` straight through fails
at both call sites:

| Line | Call                      | Error  |
| ---- | ------------------------- | ------ |
| 42   | `router.resolve(link.to)` | TS2769 |
| 72   | `navigateTo(link.to)`     | TS2345 |

The layer can't know the consumer's route names, so `name: string` is correct for
`mastNav.links`. Names are already checked at runtime: `matchesRoute()` wraps `resolve()` in a
`try` for a named route that doesn't exist.

## Fix

Cast at the two router call sites; leave `MastNavLink` as it is.

```diff
 <script setup lang="ts">
+  import type { RouteLocationRaw } from 'vue-router'
   import type { MastNavLink, MastNavUi } from '../../types/nav'
```

```diff
   function matchesRoute(link: MastNavLink) {
     try {
-      return router.resolve(link.to).path === route.path
+      // MastNavLink names are app-defined strings; typed routes can't check them here
+      return router.resolve(link.to as RouteLocationRaw).path === route.path
     } catch {
       return false // a named route that doesn't exist
     }
   }
```

```diff
     } else {
-      navigateTo(link.to)
+      navigateTo(link.to as RouteLocationRaw)
     }
```

Verified in fortuna-studios with a throwaway file using the same `MastNavLink['to']` shape: the
uncast calls reproduce both errors, the cast calls typecheck clean.

### Why not retype `MastNavLink.to` as `RouteLocationRaw`

- The layer's own default `mastNav.links` in `app.config.ts` would then be checked against each
  consumer's route map, so a consumer without one of those routes would fail to typecheck.
- `nav.ts` already avoids pulling router/Nuxt UI types into app-config types (see the
  `MastNavTrigger` comment about type cycles).

## Also check

Grep the other layers for the same pattern: a config-typed `{ name: string }` route passed to
`router.resolve`, `router.push`, `navigateTo` or `<NuxtLink :to>`:

```sh
grep -rnE "(resolve|push|replace|navigateTo)\(\s*[a-zA-Z.]+\.to\b" layers --include=*.vue --include=*.ts
```

## Verify

1. The layers repo's own typecheck still passes.
2. In a consumer with typed routes (fortuna-studios: `vp exec vue-tsc --noEmit --strict`), the two
   `NavModal.vue` errors are gone. Before this fix, that command reported only those 2 errors.
3. Behaviour unchanged: in the playground, the nav opens, links route, the current page's link is
   active, and a link to a missing route name is just not active (no throw).
4. Release a patch (`6.16.1`), then bump fortuna-studios to it.
