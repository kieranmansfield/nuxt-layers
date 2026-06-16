# kmcom-nuxt-layers Patch Handoff

This is the current patch target for `kmcom-nuxt-layers` after the frontend started surfacing 1847 type errors from the package.

## What is already fixed in `2.2.9`

The installed `2.2.9` package already contains these package-distribution fixes:

- `./layers/feeds` is exported from the root `package.json`
- `layers/*/server/**` is included in the published `files`

So the remaining breakage is not coming from those two items anymore.

## What is still broken

### 1. `#types` is still missing from the published tarball

File: root `package.json`

`layers/core/nuxt.config.ts` aliases `#types` to `../../types`, but the package tarball does not publish the root `types/` directory. That makes type-only imports fail in layer files such as:

- `layers/theme/app/types/theme.ts`
- `layers/typography/app/types/colors.ts`

Add the package-level types tree to `files`:

```json
"files": [
  "layers/*/nuxt.config.ts",
  "layers/*/app.config.ts",
  "layers/*/package.json",
  "layers/*/tsconfig.json",
  "layers/*/tailwind.config.*",
  "layers/*/app/**",
  "layers/*/server/**",
  "types/**",
  "docs/"
]
```

### 2. `TSLNode` is too generic for the shader layer

File: `layers/shader/app/types/tsl.ts`

`export type TSLNode = Node` resolves to `Node<unknown>` in the `three` typings. That removes the chaining methods the shader helpers depend on, which is why the first cascade starts in:

- `layers/shader/app/utils/tsl/uv.ts`
- `layers/shader/app/utils/tsl/animation.ts`
- `layers/shader/app/shaders/common/*.ts`

Replace the alias with a concrete node type that preserves numeric/vector/color chaining.

Suggested direction:

```ts
import type { FloatVecType, Node, NumType } from 'three/webgpu'

export type TSLNode = Node<NumType | FloatVecType | 'color'>
```

Keep matrix aliases separate if they are needed:

- `TSLMat3`
- `TSLMat4`

Do not leave the catch-all alias as bare `Node`.

## Why this matters

The frontend `exclude` list is not the issue. Nuxt generates aliases into `kmcom-nuxt-layers`, the app imports those aliases, and TypeScript follows them into the package source. If the package ships broken types, the consumer typecheck will still fail.

## Verification

After patching the package:

1. Run the package publish dry-run or inspect the packed tarball.
2. Confirm `types/**` is included in the published output.
3. Reinstall the frontend dependency.
4. Re-run `pnpm typecheck`.
5. Confirm the first errors no longer point at `layers/theme/app/types/theme.ts`, `layers/typography/app/types/colors.ts`, or `layers/shader/app/utils/tsl/uv.ts`.
