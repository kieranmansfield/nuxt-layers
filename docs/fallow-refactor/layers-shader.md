# layers/shader

`layers/shader` dominates the duplication report. It also has several critical complexity findings, but most work should preserve public component names and extract shared internals.

## Complexity Findings

- `41` complexity findings.
- `6` critical findings.
- `layers/shader/app/composables/useShader.ts:38` defines `applyConfig` with cyclomatic complexity `18` and cognitive complexity `20`.
- Other critical findings include `Material/Gradient.client.vue`, `Material/Node.client.vue`, `Shader/Background.client.vue`, and shader layer uniform update functions.

## Duplication Findings

- `341` duplicate warnings.
- `useAmbientMaterials.ts:272-368` duplicates `useAmbientMaterials.ts:496-563` for `97` lines.
- `Material/AmbientFlow.client.vue:22-102` duplicates `Material/AmbientNebula.client.vue:23-103` for `81` lines.
- `Material/AmbientGradientMesh.client.vue:30-100` duplicates `Material/AmbientNebula.client.vue:30-100` for `71` lines.
- `Material/AmbientAurora.client.vue:28-92` duplicates `Material/AmbientOcean.client.vue:30-94` for `65` lines.
- Many `Pipeline/*` components duplicate uniform setup and stage registration.
- `Preset/Theme*.client.vue` files share a repeated theme preset wrapper pattern.

## Component Opportunities

- Create an internal material host component for repeated canvas and plane markup.
- Create a shared preset shell for ambient preset components.
- Consider `Preset/Theme.client.vue` with a `preset` prop, while keeping existing `Preset/ThemeWave.client.vue`, `Preset/ThemeAurora.client.vue`, and similar wrappers.

## Composable Opportunities

- Create `useReactiveShaderUniforms()` for repeated prop-to-uniform watchers.
- Create `useAmbientMaterial()` for shared speed, intensity, mouse, and color uniforms.
- Create `usePipelineStageUniforms()` for repeated `uniform()` plus `watch()` setup in pipeline components.
- Create `useShaderMaterialPlane()` for material creation, disposal, and render-plane lifecycle.

## Utility Opportunities

- Create `layers/shader/app/utils/materialConfig.ts` for `applyNodeMaterialConfig()`.
- Create `layers/shader/app/utils/uniformSetters.ts` for repeated uniform updates.
- Create `layers/shader/app/utils/tsl/ambient.ts` for mouse offset, radial falloff, flow warp, aurora curtain, and palette mixing helpers.
- Extract shared noise pipeline builders that accept a noise strategy and color strategy.

## Refactor Constraints

- Do not collapse all public pipeline components into one dynamic component unless there is a migration plan.
- Keep public auto-import component files as thin wrappers if needed.
- Consolidate internals before changing public component APIs.

## Acceptance Criteria

- The largest shader duplicate groups shrink materially.
- Public shader component names continue to auto-import.
- `applyConfig` drops below critical complexity.
- `pnpm typecheck` passes.
