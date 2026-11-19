# Layer Taxonomy Redesign — Part 6: Tier 6 (Render)

## Scope

Forensic audit of `canvas`, `shader`. Cleanup-only pass (per user direction after Tier 5): fix
dead code, structural defects, and stale docs — no new feature wiring. `shader` is large (150+
`Pipeline/*.client.vue` effect components) — sampled several rather than reading all, since they
follow one consistent, correct pattern (`useShaderStage`/`useShaderPipelineContext`, TSL node
composition, reactive `watch` → `uniform.value` sync).

## Findings and resolution

### `shader` app.config.ts structural defect — fixed (9th instance, worst yet)

`app/app.config.ts` was a bare object export (no `defineAppConfig()`), and the split
`app/types/app-config.d.ts` augmented a phantom `shaderLayer?: { name?: string }` shape that
doesn't even match the real config key (`shader: { preferWebGPU, maxPixelRatio, defaultQuality,
debugPanel, toneMapping }`) — worse than prior instances of this repeat pattern, since the type
augmentation was augmenting the wrong shape entirely. **Fixed**: `defineAppConfig()` wrapper,
correct inline `declare module` matching the real `shader` key, deleted `app-config.d.ts`.

### Two dead one-liner exports in `canvas` — deleted

`getQualitySettings()` and `useGlobalShaderTime()` (a global singleton wrapper around
`useShaderTime`) had zero consumers anywhere in the repo. **Fixed**: deleted both, removed the
now-unused `QualitySettings` type import from `useRendererCapabilities.ts`.

### `shader/AGENTS.MD` — stale, describes a structure that doesn't exist — fixed

Documented a `.tsl`/GLSL file-based shader structure (`vertexPlane.tsl`, `noise3D.tsl`, etc.)
that was never built — the real system is TSL-function-based `.ts` modules
(`shaders/common/*.ts`, `shaders/layers/*.ts`, `three/tsl` node functions). **Fixed**: rewrote to
a short, accurate structure map of the real `app/` tree.

## Left open (user decision — not implemented this pass)

### 8 shader composables with zero consumers

`useShaderFloat`, `useShaderVec2`, `useCSSColourUniform`, `useCSSFloatUniform`,
`useSunDirectionUniform`, `useShaderPerf`, `useTSLNodes`, and the whole `useUniforms.ts` file
(`useUniforms`/`useUniform`/`useColorUniform`/`useVector2Uniform`/`useVector3Uniform`) — all
well-built, none wired into any component. Real, actively-used equivalents exist alongside some
of them (`useShaderColor`, `useAmbientMaterials`, `useShaderMixBlend`, `useThemeColors`), which
suggested some of these are superseded scaffolding — but given the size of the shader library
(150+ components still growing) this could equally be toolkit-ahead-of-use rather than dead code.
**User's call: leave them, don't delete.** Not touched.

## Confirmed correct, no action

- `canvas`: `nuxt.config.ts` (Three.js WebGPU SSR stub via custom Vite plugin, TresJS module
  config), `ShaderCanvas.vue`, `useRendererCapabilities` (renderer detection, `useAutoQuality`),
  `useShaderTime`, `types/renderer.ts` — real, correctly consumed by `apps/playground/app/pages/canvas.vue`
  and `shader.client.ts`.
- `shader`: `nuxt.config.ts`, `useShader`/`useBasicShader`/`useStandardShader` (node material
  factory, cleanup-on-unmount), `useShaderRuntime`/`useShaderRuntimeContext` (provide/inject
  global runtime), `useShaderPipeline`/`useShaderStage`/`useShaderPipelineContext` (provide/inject
  stage registry, versioned for recompilation), `useUniformWatchers`'s `watchUniformProp`
  (confirmed consumed by 7 `Material/*.client.vue` components), `useAmbientMaterials`,
  `useShaderColor`/`useShaderMixBlend`/`useThemeColors`/`useThemePreset`/`useMousePosition` (all
  confirmed real consumers), `shader.client.ts` plugin, `shader.css`, sampled `Pipeline/*`
  components (`LinearGradient`, `UVRotate`) — consistent, correct pattern across the sample.

## Consolidated action list (Tier 6)

- [x] Fix `shader/app/app.config.ts` structural defect (9th instance, was augmenting the wrong shape)
- [x] Delete dead `getQualitySettings()`/`useGlobalShaderTime()` from `canvas`
- [x] Rewrite stale `shader/AGENTS.MD`
- [ ] 8 zero-consumer shader composables — left open, user chose not to delete

## Not yet covered

Tier 7 (Delivery). Also still pending from earlier tiers: `theme`'s `app.config.ts` structural
defect, `useMetadataItem`'s fate, openlibrary/google-books provider error-handling divergence,
and the larger deferred Tier 0-2 structural items (ui-layer dissolution, `.mastmain` rename,
`theme`→`theming` rename, typography font-prop system, breakpoint token consolidation,
`AppContainer` clamp() conversion, `compatibilityVersion: 5` flip, `error.vue` real
implementation, `starter` layer audit).
