# Shader port — leftovers

Status of porting [`shader-effects-inc/shaders`](https://github.com/shader-effects-inc/shaders)
(WGSL, ~204 effects) into the TSL `shader` layer (`layers/render/shader`). The "basics" pass is
done; this file tracks what is **not** ported. For the library itself, use the `effects` layer
(`layers/render/effects`), which wraps the `shaders` package directly.

## Ported (new Pipeline blocks, 33)

`Dither`, `UVKaleidoscope`, `CRTScreen`, `UVGlitch`, `ContourLines`, `BrickPattern`, `Heart`,
`Flower`, `Chevron`, `CarbonFiber`, `Blur`, `RadialBlur`, `Edge`, `Frost`, `Emboss`, `Solarize`,
`Tritone`, `UVMirror`, `UVPolar`, `Sharpness`, `Glow`, `TiltShift`, `LinearBlur`, `Ellipse`,
`Spiral`, `SineWave`, `Truchet`, `Plasma`, `Heatmap`, `Neon`, `ChannelBlur`, `Scratches`,
`UVStretch`.

Source-texture blocks (`Blur`, `RadialBlur`, `Edge`, `Frost`, `Emboss`, `Sharpness`, `Glow`,
`TiltShift`, `LinearBlur`, `Neon`, `ChannelBlur`) use three's `convertToTexture`, so each adds a
render-target pass.

**Not yet verified in a browser.** Lint and `pnpm --filter kmcom-layer-shader typecheck` pass for
the new files, but the TSL graphs have never been rendered (no WebGPU in the dev container).

## Already covered by an existing block (do not port)

| Library | Existing block |
| --- | --- |
| Duotone, GradientMap | `DuoTone`, `Tritone` |
| Posterize | `Posterise` |
| Pixelate | `UVPixelate` |
| Swirl, Twirl | `UVTwirl` |
| Ripples, WaveDistortion | `UVRipple`, `UVSineWarpXY` |
| Mirror, Kaleidoscope, Stretch | `UVMirror`, `UVKaleidoscope`, `UVStretch` |
| Glitch | `UVGlitch` |
| Bulge, Spherize | `UVBulge` |
| ZoomBlur | `RadialBlur` |
| Fog, Godrays | `ExponentialFog`, `GodRays` |
| Grayscale, HueShift | `Desaturate`, `Hue` |
| FractalNoise, PerlinNoise, WorleyNoise, Voronoi | `FBMNoise`, `GradientNoise`, `CellularNoise`, `VoronoiEdges` |
| SolidColor, DotGrid, HexGrid, RoundedRect | `SolidColour`, `Dots`, `Hexagon`, `roundedRect()` helper |
| PolarCoordinates | `UVPolar` |

## Left to port — portable with the current pipeline

- **Source-texture effects:** `Glass`, `FlutedGlass`, `GlassTiles`, `Frost` variants,
  `DropShadow`, `LensDistortion`, `Ascii`, `BokehBlur`, `AngularBlur`, `DiffuseBlur`,
  `ProgressiveBlur`, `Bend`, `CornerPin`, `Perspective`, `Flip`, `Repeater`, `Satin`, `Engraving`,
  `CompressionArtifacts`, `PixelSort`, `Liquify`, `DataMosh`, `VHS`, `FilmStock`
- **Per-pixel / UV / shape generators:** `Arc`, `Crescent`, `Line`, `Parallelogram`, `Trapezoid`,
  `Vesica`, `TriangularGrid`, `FallingLines`, `Weave`, `Wool`, `Stone`, `Paper`, `Chalkboard`,
  `BrushedMetal`, `Chrome`, `Plastic`, `Obsidian`, `Crystal`, `Hologram`, `Holographic`, `Prism`,
  `ThinFilm`, `Sparkle`, `SunBurst`, `Beam`, `LightEdge`, `LightLeak`, `Irradiance`, `Blob`,
  `Teardrop`, `Waveform`, `Strands`, `ColorWheel`, `ConcentricSpin`, `RectangularCoordinates`,
  `BlockNoise`, `BlueNoise`, `ErosionNoise`, `GaborNoise`, `WaveletNoise`, `FlowingGradient`,
  `MeshGradient`, `MultiPointGradient`, `ChromaFlow`, `InkFlow`, `Smoke`/`SmokeFill`/`SmokeFlow`,
  `Watercolor`, `Goo`, `Shatter`, `Voxels`, `IsometricCubes`, `StudioBackground`

## Left to port — needs new infrastructure

- **Ping-pong / stateful (previous-frame buffers):** `CursorTrail`, `CursorRipples`, `Boids`,
  `FlowField`, `ParticleField`/`ParticleFlow`/`Particles`/`FloatingParticles`,
  `ReactionDiffusion`, `MagneticFilings`, `TimeTrail`, `PixelThrow`
- **Two-input transitions / wipes:** `BarnDoors`, `BarShift`, `BlockDissolve`, `CheckerWipe`,
  `DiamondWipe`, `IrisWipe`, `LinearWipe`, `NoiseDissolve`, `PagePeel`, `RadialWipe`,
  `RandomBars`, `RippleWipe`, `SliceWipe`, `VenetianBlinds`, `DisplacementMap`, `GridDistortion`
- **External media / DOM / 3D:** `ImageTexture`, `VideoTexture`, `WebcamTexture`, `DOMTexture`,
  `HTMLInCanvas`, `Text`, `Surface3D`, `Form3D`, `ReflectivePlane`, `ObjectTracker`, `LiquidMetal`
- **Library plumbing (not effects):** `CustomShader`, `Group`, `KeyFrames`, `Preview`, `Shader`

## Notes

- Layer type-checking: use `pnpm --filter kmcom-layer-shader typecheck`. Running `vue-tsc` from
  the playground does **not** check layer files.
- Anything in the "Left to port" lists can be used today through the `effects` layer instead.
