# Shader Layer — TSL Structure

TSL (Three Shading Language) shader system, function-based (not `.tsl`/GLSL files — real code
lives in `.ts` modules using `three/tsl` node functions like `Fn`, `uniform`, `vec3`, etc.).

```
app/shaders/
  common/       # noise, math, patterns, palette, grain, lighting, tonemapping, blend, uv, sdf, shapes
  layers/       # composed effects (aurora, meshGradient, paperShading, shaderGradient, stripe)
  createMaterial.ts   # factory wrapping TSL nodes into a Three.js node material
  types.ts
app/utils/tsl/  # animation, color, math, noise, oklch, patterns, tween, uv helpers
app/components/
  Material/     # ambient background materials (Aurora, Flow, Nebula, Ocean, GradientMesh, ...)
  Pipeline/     # single-effect TSL building blocks (gradients, noise, blends, UV transforms, tonemapping, ...)
  Node/         # composable graph nodes (Color, Fresnel, Gradient, Mix, Noise)
  Preset/       # ready-made scenes composing Pipeline/Material/Node pieces
  Shader/       # host/runtime/pipeline orchestration (Background, Host, Runtime, Pipeline, PipelineContext)
  Effect/       # post-processing (Bloom, ChromaticAberration, PostProcessing)
app/composables/    # useShader*, useUniforms, useTSLNodes, useThemeColors/useThemePreset, etc.
```

Extends `canvas` (TresJS + WebGPU renderer setup).
