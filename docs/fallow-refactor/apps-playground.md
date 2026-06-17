# apps/playground

`apps/playground` has the highest-value overlap between complexity and duplication. Start here before touching lower-risk layers.

## Complexity Findings

- `15` complexity findings.
- `7` critical findings.
- `apps/playground/app/pages/shader-background.vue:299` defines `getActiveBlocks` with cyclomatic complexity `57` and cognitive complexity `101`.
- `apps/playground/app/pages/shader-pipeline-background.vue:221` defines a matching `getActiveBlocks` with cyclomatic complexity `57` and cognitive complexity `101`.
- `apps/playground/app/pages/routing.vue:126` computes `simResult` with high branching.

## Duplication Findings

- `16` duplicate warnings.
- `shader-background.vue:299-546` duplicates `shader-pipeline-background.vue:221-468` for `248` lines.
- `shader-background.vue:72-182` duplicates `shader-pipeline-background.vue:60-163` for `111` lines.
- `typography.vue:2-83` duplicates `ui.vue:2-91` for `90` lines.
- `Demo/ThemeNode.client.vue:51-92` duplicates `Demo/ThemeCanvas.client.vue:90-133` for `44` lines.

## Component Opportunities

- Create `Demo/ShaderDemoShell.vue` for the shared full-screen shader demo layout.
- Create `Demo/ShaderPresetGrid.vue` for category-specific preset buttons.
- Create `Demo/ShaderBackgroundControls.vue` for the right-hand controls.
- Create `Demo/ShaderGrainLayerRenderer.vue` for repeated grain rendering blocks.

## Composable Opportunities

- Create `useShaderBackgroundDemo()` for category state, active preset state, grain state, active labels, and generated code.
- Create `useDemoAccent()` for repeated `setPageAccent()` and cleanup patterns.
- Create `useThemeNodeUniforms()` for shared theme color and ambient uniform watchers used by `ThemeNode` and `ThemeCanvas`.
- Move routing demo logic to `useRoutingDemo()` if the page keeps reactive simulator state.

## Utility Opportunities

- Create `apps/playground/app/utils/shaderBackgroundPresets.ts` for preset metadata and block serialization.
- Create `apps/playground/app/utils/routingSimulation.ts` for the governance simulator.
- Create `apps/playground/app/utils/demoSnippets.ts` for UI and typography code snippets.

## Acceptance Criteria

- The two `getActiveBlocks` complexity findings disappear or drop below threshold.
- The `248` line shader page duplicate group disappears.
- The page output and generated code output remain equivalent.
- `pnpm typecheck` passes.
