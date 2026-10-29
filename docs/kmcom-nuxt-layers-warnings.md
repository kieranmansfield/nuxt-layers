# kmcom-nuxt-layers 5.0.5: install-time warnings

Seen during `pnpm install` (`postinstall: nuxt prepare`) in the frontend, Nuxt 4.6.2 with `compatibilityVersion: 5`.
Both are emitted from inside the published package, so the fix belongs in the `kmcom-nuxt-layers` repo.
The app builds and the 7 hydration tests pass, so neither is blocking.

## 1. `[NUXT_B5023]` config loaded through jiti

```
WARN [NUXT_B5023] The config file .../kmcom-nuxt-layers/layers/core/nuxt.config.ts was loaded
through jiti because the runtime could not load it: Stripping types is currently unsupported
for files under "node_modules"
fix: Loading it natively is faster, as jiti has to transform the file first. Relative imports
need an explicit file extension, and import.meta.dirname replaces __dirname.
```

- **Cause:** Node's native type stripping refuses `.ts` files under `node_modules`, so Nuxt falls back to jiti.
- **Impact:** slower config load. No functional break.
- **Fix options:**
  - Ship the layer config as `.mjs`/`.js` (compiled), or
  - keep `.ts` but follow the hint: explicit file extensions on relative imports, `import.meta.dirname` instead of `__dirname`. Note that native loading still fails for `node_modules` paths, so the warning may persist unless the config is compiled JS.

## 2. `[unimport]` failed to resolve `#layers/canvas/types/renderer`

```
WARN [unimport] failed to resolve ".../kmcom-nuxt-layers/layers/render/shader/app/types/#layers/canvas/types/renderer", skip scanning
```

(emitted three times per run)

- **Cause (from the message, not yet verified in source):** a file under `layers/render/shader/app/types/` imports `#layers/canvas/types/renderer`. The `#layers/...` alias isn't resolved, so unimport joins it onto the importing directory and skips the file.
- **Impact:** that file is not scanned for auto-imports. Any types or composables it exports won't auto-import.
- **Fix options:**
  - Replace the alias with a relative import in that file, or
  - make sure the `canvas` layer is registered and the `#layers` alias is defined whenever the `render/shader` layer is loaded (check layer order and `alias` in the layer configs).

## To investigate in the layers repo

1. `grep -rn "#layers/canvas/types/renderer" layers/render/shader`
2. Check that `layers/render/shader/nuxt.config.ts` extends or depends on the `canvas` layer.
3. Decide whether to publish compiled JS config files for the jiti warning.
