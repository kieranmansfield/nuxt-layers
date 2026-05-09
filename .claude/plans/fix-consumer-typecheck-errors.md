# Fix: Layer source files failing consumer vue-tsc

**Repo:** `/Users/kieranmansfield/Developer/layers/nuxt-layers`

---

## Why this is happening

When a Nuxt layer is installed as an npm package and referenced via `extends` in `nuxt.config.ts`, Nuxt intentionally adds all of the layer's `app/**/*` source files as **explicit root files** in the generated `.nuxt/tsconfig.json` of the consuming project:

```json
"include": [
  "../node_modules/kmcom-nuxt-layers/layers/core/app/**/*",
  "../node_modules/kmcom-nuxt-layers/layers/ui/app/**/*",
  ...
]
```

This is by design — it gives the consumer app proper type inference for layer-provided composables, components, and utilities.

`nuxt typecheck` runs `vue-tsc` against `.nuxt/tsconfig.json` directly (not the consumer's root `tsconfig.json`), so the consumer's `exclude: ["node_modules"]` has no effect. The layer source is always evaluated.

The consumer project (`KMCOMv5/frontend`) runs with strict settings that include `noUnusedLocals`, `noUnusedParameters`, `exactOptionalPropertyTypes`, `noUncheckedIndexedAccess`, `noImplicitOverride`, and `verbatimModuleSyntax`. Any layer file that doesn't satisfy these produces errors in the consumer's typecheck.

---

## The fix

The layer source must be type-correct under the consumer's strict compiler settings. The approach is to add a `typecheck` script per layer (and a root turbo task) that runs `vue-tsc` with a strict tsconfig that mirrors what the consumer uses.

---

## Step 1 — Create `tsconfig.typecheck.json` at the monorepo root

This config is used solely for running typecheck across all layers without needing a playground `.nuxt/` directory.

**File:** `/Users/kieranmansfield/Developer/layers/nuxt-layers/tsconfig.typecheck.json`

```json
{
  "compilerOptions": {
    "target": "ESNext",
    "module": "preserve",
    "moduleResolution": "Bundler",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "exactOptionalPropertyTypes": true,
    "noUncheckedIndexedAccess": true,
    "noImplicitOverride": true,
    "noFallthroughCasesInSwitch": true,
    "verbatimModuleSyntax": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "jsxImportSource": "vue",
    "allowJs": true,
    "resolveJsonModule": true,
    "skipLibCheck": true,
    "noEmit": true,
    "lib": ["ESNext", "dom", "dom.iterable"]
  },
  "include": [
    "layers/*/app/**/*.ts",
    "layers/*/app/**/*.vue"
  ],
  "exclude": [
    "node_modules",
    "**/node_modules/**",
    "layers/*/app/**/*.test.ts"
  ]
}
```

---

## Step 2 — Add `typecheck` script to each layer's `package.json`

For each file in `layers/*/package.json`, add (or update) the `typecheck` script:

```json
"scripts": {
  "typecheck": "vue-tsc --noEmit -p ../../tsconfig.typecheck.json"
}
```

Layers to update:
- `layers/core/package.json`
- `layers/ui/package.json`
- `layers/layout/package.json`
- `layers/motion/package.json`
- `layers/forms/package.json`
- `layers/theme/package.json`
- `layers/content/package.json`
- `layers/shader/package.json`
- `layers/routing/package.json`

---

## Step 3 — Wire up turbo

**File:** `/Users/kieranmansfield/Developer/layers/nuxt-layers/turbo.json`

Add `typecheck` to the tasks (it already exists but verify it has the right shape):

```json
{
  "$schema": "https://turbo.build/schema.json",
  "tasks": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": ["dist/**"]
    },
    "typecheck": {
      "dependsOn": ["^typecheck"]
    },
    "dev": {
      "cache": false,
      "persistent": true,
      "env": ["PLAYGROUND_LAYERS"]
    },
    "lint": {}
  }
}
```

---

## Step 4 — Run typecheck and fix all errors

From the repo root:

```bash
pnpm turbo run typecheck
```

Then fix every error surfaced. Common failure patterns in Nuxt layers under strict settings:

- **`verbatimModuleSyntax`**: Replace `import { Foo }` with `import type { Foo }` for type-only imports.
- **`noUnusedLocals` / `noUnusedParameters`**: Prefix intentionally unused params with `_`.
- **`exactOptionalPropertyTypes`**: Don't assign `undefined` to optional props unless the type explicitly allows `| undefined`.
- **`noUncheckedIndexedAccess`**: Guard array/object index access (`arr[0]` is now `T | undefined`).
- **`noImplicitOverride`**: Add `override` keyword to methods that override base class/interface methods.

---

## Step 5 — Add typecheck to CI / publish pipeline

In the root `package.json` scripts, ensure typecheck runs before publish:

```json
"scripts": {
  "typecheck": "turbo run typecheck",
  "prepublishOnly": "pnpm typecheck"
}
```

---

## Verification

After fixes, run the following in the **consumer** (`KMCOMv5/frontend`):

```bash
pnpm nuxt typecheck
```

There should be zero errors originating from `node_modules/kmcom-nuxt-layers/`.

The root `tsconfig.json` `exclude` in the consumer remains untouched — that's a red herring and should not be modified to work around layer errors.
