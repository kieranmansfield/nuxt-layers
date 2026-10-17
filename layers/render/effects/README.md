# effects

Wraps the [`shaders`](https://github.com/shader-effects-inc/shaders) package (WGSL / WebGPU, MIT,
200+ effects) as a Nuxt layer. It renders in its **own canvas** via its own renderer, so it is
independent of TresJS/three — `extends: ['../../core']` only. For effects that must live inside a
TresJS scene or compose with the TSL pipeline, use the `shader` layer instead.

## Usage

```vue
<script setup lang="ts">
  import { LinearGradient, CursorTrail } from 'shaders/vue'
</script>

<template>
  <FxShader class="h-96 w-full">
    <LinearGradient color-a="#0f172a" color-b="#7c3aed" />
    <CursorTrail />
    <template #fallback><img src="/hero.jpg" alt="" /></template>
  </FxShader>
</template>
```

- `FxShader` is client-only and renders nothing on the server. Give it a sized container.
- Import effects from `shaders/vue` directly (tree-shakeable); they are intentionally **not**
  auto-registered, since names like `Aurora` or `Blur` would clash with other layers.
- `useEffectsSupport()` returns `{ supported }` (WebGPU available, client-side).

## Config (`app.config.ts` → `effects`)

| Key | Default | |
| --- | --- | --- |
| `telemetry` | `false` | The library samples 5% of sessions and posts domain, browser family, device type and frame stats to `shaders.com/api/telemetry`. Disabled unless you set this to `true` (app-wide). |
| `colorSpace` | `'p3-linear'` | Passed to `<Shader>` |
| `toneMapping` | `'linear'` | Passed to `<Shader>` |

## Licensing

Engine, components and Vue bindings are MIT. The shaders.com design editor, presets and sections
have separate terms.
