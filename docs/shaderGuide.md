# Modular Shader Block System -- v5

## Changelog from v4

- **`CosinePalette`** added as a first-class Scalar Generator -- the single most reusable block in the entire system, backbone of all phobon TSL shaders
- New pipeline pattern formalised: **Scalar Pipeline** (UV → float → colour)
- New Math Primitives: `ComplexDiv`, `ComplexLog` (complex number arithmetic in TSL)
- New Generators: `CosinePalette`, `RingField`, `ComplexPlaneField`, `ChebyshevNoiseField`
- New UV Transformers: `UVColumnOffset`, `UVFractBand`
- New Colour Ops: `TanhTonemap`, `SDFColourMask`
- Shader conversions: imaginary2, dawn2, dawn4, dawn5, flare8, flare9, genuary22

---

## Architecture Overview

    Primitives        Raw values, uniforms, constants, samplers
    Generators        UV → colour  (starting point of most pipelines)
    Scalar Generators UV → float → colour  (CosinePalette family) ← NEW
    UV Transformers   UV → UV (warp, scroll, tile, distort)
    Ray Transformers  Ray → Ray (tilt, reflect, fisheye)
    Colour Ops        colour → colour (blend, grade, shift, remap)
    Overlays          colour → colour (composited effects, post-process style)

### The Scalar Pipeline

All 7 phobon shaders share the same pipeline shape: compute a meaningful float from UV (distance, noise, SDF, imaginary component), feed it into `cosinePalette`, multiply the result by a mask float. This is a distinct pattern from the UV→colour generators and worth formalising:

    UV
     ├─ ScalarSource (uv.y / length(uv) / SDF / noise → float)  ← float lane
     │    └─ CosinePalette (float → colour)
     └─ MaskSource  (SDF / noise → float)                        ← mask lane
          └─ SDFColourMask (colour × mask → colour)
               └─ Overlays

`CosinePalette` is the bridge between the scalar lane and the colour lane. Any float can drive it -- that's what makes it so broadly composable.

---

## System Layers

### Core Infrastructure

- `ShaderPipeline` -- fragment compositor, owns material.colorNode, reduces fragment stages
- `VertexPipeline` -- vertex compositor, owns material.positionNode, reduces vertex stages
- `BackdropPass` -- renders scene to a RenderTarget, exposes as texture for blur/glass effects
- `useShaderStage(fn, order, stage?)` -- registers a block into the correct pipeline
- `useCSSColourUniform(varName)` -- CSS var → TSL uniform, theme-reactive via inject
- `useCSSFloatUniform(varName)` -- CSS numeric var → float uniform
- `useThemeProvider` -- provides `{ mode, palette, contrast }` to the component tree
- `colour.js` -- resolveColour() handles hex, rgb, hsl, hsla, oklch → THREE.Color
- `useWaveLayerDefaults(index, total)` -- generates offset noise params for wave stacking

### Stage Routing

    // useShaderStage.js -- stage: 'fragment' | 'vertex' | 'ray'
    export function useShaderStage(stageFn, order = 0, stage = 'fragment') {
      const { register, unregister } = inject('shaderPipeline')
      onMounted(() => register(stageFn, order, stage))
      onUnmounted(() => unregister(stageFn))
    }

    // ShaderPipeline reduces three targets
    material.colorNode    = fragmentStages.reduce((n, { fn }) => fn(n), vec4(0, 0, 0, 1))
    material.positionNode = vertexStages.reduce((n, { fn }) => fn(n), positionLocal)
    // Ray pipeline: screen coord → normalised ray → consumed by terminal generator
    const rayNode = rayStages.reduce((n, { fn }) => fn(n), screenRayNode)

### Ray Pipeline

Ray-based generators (SkyAtmosphere, RaymarchTunnel) consume a 3D ray direction rather than a 2D UV. The Ray Pipeline converts screen coordinates to a ray, applies 3D transforms (tilt, fisheye, reflection), then feeds into a terminal generator. Ray transformer blocks use `stage: 'ray'`.

**Terminal blocks** -- blocks marked `terminal: true` always sit at `order: 0` and consume the ray output directly. UV transformers have no effect on them. The pipeline compositor warns if a UV transformer is registered before a terminal block.

### Debug / DX

- `ShaderDebugger` -- visualises output of any named stage mid-pipeline
- `ShaderInspector` -- UV coords, stage names, node graph overlay in dev mode
- `useShaderPerf` -- tracks GPU frame time per pipeline

---

## Block Registry

---

## I. Primitives

> Raw values, constants, and data sources.

### Constants & Values

1. `FloatConst` -- static float value
2. `Vec2Const` -- static 2D vector
3. `Vec3Const` -- static 3D vector
4. `Vec4Const` -- static RGBA vector
5. `ColourConst` -- THREE.Color → vec3 uniform
6. `BoolConst` -- 0 or 1 float
7. `IntConst` -- integer uniform
8. `AngleConst` -- degrees-in, radians-out convenience wrapper

### Reactive Uniforms

9. `FloatUniform` -- JS-reactive float (prop-driven)
10. `ColourUniform` -- JS-reactive colour (prop-driven)
11. `Vec2Uniform` -- JS-reactive 2D vector
12. `CSSColourUniform` -- reads from a CSS custom property
13. `CSSFloatUniform` -- reads a numeric CSS custom property
14. `TimeUniform` -- exposes `time` node, speed and offset controls
15. `DeltaTimeUniform` -- frame delta for frame-rate-independent effects
16. `MouseUniform` -- normalised mouse/pointer position vec2 (NDC -1..1)
17. `ScrollUniform` -- normalised scroll progress float (Lenis integration)
18. `ViewportUniform` -- resolution vec2, updates on resize
19. `AspectUniform` -- viewport width/height ratio float
20. `DevicePixelRatioUniform` -- DPR float

### Coordinate Sources

21. `UVSource` -- base uv(), entry point for UV chains
22. `WorldPositionSource` -- vertex world position
23. `NormalSource` -- vertex/fragment normal vec3
24. `DepthSource` -- fragment depth float
25. `ScreenUVSource` -- screen-space UV (0--1 across viewport)
26. `TiledUVSource` -- uv() pre-tiled by a repeat vec2

### Texture Samplers

27. `TextureSampler` -- standard texture2D lookup
28. `VideoSampler` -- HTMLVideoElement as texture
29. `CanvasSampler` -- HTMLCanvasElement as texture (live 2D canvas)
30. `CubemapSampler` -- environment map sampler
31. `NoiseSampler` -- samples a pre-baked noise texture
32. `LUTSampler` -- 3D LUT texture for colour grading
33. `GradientMapSampler` -- 1D gradient texture lookup by luminance

### Math Primitives

34. `Sine` -- sin(x) node
35. `Cosine` -- cos(x) node
36. `Abs` -- abs(x) node
37. `Floor` -- floor(x) node
38. `Fract` -- fract(x) node
39. `Clamp01` -- clamp(x, 0, 1)
40. `Remap` -- remaps a value from one range to another
41. `OneMinus` -- 1.0 - x
42. `Saturate` -- alias for Clamp01
43. `Step` -- step(edge, x)
44. `Smoothstep` -- smoothstep(a, b, x)
45. `Lerp` -- mix(a, b, t) as an explicit primitive

### Channel Ops

46. `SplitChannels` -- exposes .r .g .b .a as individual float nodes
47. `MergeChannels` -- combines float nodes into a vec4
48. `SwizzleXY` -- returns .xy from a vec4
49. `SwizzleZW` -- returns .zw from a vec4
50. `AlphaExtract` -- isolates alpha channel as float

### Alpha / Compositing

51. `CoverageAlpha` -- ★ NEW -- transparency based on max channel coverage (used by ColorBends transparent mode). Alpha = max(r, g, b) rather than a fixed 1.0. Essential for shaders that generate shape from colour intensity.
52. `SunDirectionUniform` ★ NEW -- animated or mouse-driven sun elevation. Inactive: `sin(time)/8 - 0.2`. Active: `-mouse.y / res.y`. Outputs normalised vec3 via `rotX(vec3(0,0,1), angle * 5 + 0.5)`. Used by SkyAtmosphere.
53. `RayCameraUniform` ★ NEW -- source node for the Ray Pipeline. Converts screen fragment coord to a centred, aspect-corrected 3D direction with a fixed z depth.
54. `StateBufferSampler` ★ NEW -- reads vec3 values from specific texels of a small state texture written by a previous render pass. Used by HeightmapTerrain to read camera position from texel (0.5, 0.5) and rotation from texel (1.5, 0). This is the multi-pass state pattern: one pass writes simulation state as pixel values, the next pass reads it back. Takes `texture`, `texelCoord`.
55. `HeightmapSampler` ★ NEW -- samples a height/noise texture with LOD and a coordinate scale factor. Distinct from `NoiseSampler` in that it's specifically for terrain elevation lookup with explicit `textureLod(..., 0)` to prevent mip-blurring artefacts on terrain edges. Takes `texture`, `scale`, `offset`.

### Complex Number Math ★ NEW

56. `ComplexDiv(a, b)` -- complex number division. `vec2((a.x*b.x + a.y*b.y) / dot(b,b), (a.y*b.x - a.x*b.y) / dot(b,b))`. Used in imaginary2 for the Möbius transformation `(z-p)/(z-q)`.
57. `ComplexLog(z)` -- complex natural logarithm. `vec2(log(length(z)), atan(z.y, z.x))`. Produces `(ln|z|, arg(z))` -- the magnitude and angle of a complex number. Used in imaginary2 to compute the winding angle between two poles.

---

## IIa. Ray Transformers ★ NEW CATEGORY

> Ray → Ray. Operate in 3D ray space rather than 2D UV space. All blocks here use `stage: 'ray'` and feed into terminal ray-based generators.

1. `FisheyeRay` -- applies fisheye lens distortion to a ray direction before normalisation. `ray.z -= dot(ray.xy, ray.xy) * 0.5`. Produces the characteristic wide-angle sky dome look.
2. `RayTiltBasis` -- tilts the ray via an orthonormal basis (i, j, k) constructed from a target forward direction. `ray = ray.x*i + ray.y*j + ray.z*k`. Controls camera elevation. Used in SkyAtmosphere to angle the view upward.
3. `RaySphereReflect` -- reflects the ray off a virtual sphere at a given centre and radius. Used in SkyAtmosphere's sphere mode. The reflection creates a mirrored panoramic ball effect.
4. `RayRotateX` -- rotates ray around the X axis by a given angle
5. `RayRotateY` -- rotates ray around the Y axis
6. `RayRotateZ` -- rotates ray around the Z axis
7. `RayMouseOrbit` -- orbits ray direction based on mouse position (horizontal = yaw, vertical = pitch)
8. `RayAutoOrbit` -- continuously orbits ray direction over time at a given speed
9. `RayFromStateBuffer` ★ NEW -- reads camera position and rotation from a StateBufferSampler texture rather than from uniforms. Constructs the view ray using `rotateZ(rot.x) * rotateX(rot.y) * screenCoord`. Used by HeightmapTerrain for the multi-pass camera state pattern where position is simulated separately and written to a texture each frame.

---

## II. Generators

> UV → colour. The starting point of every pipeline.

### Gradients

1. `LinearGradient` -- two-colour gradient along an axis
2. `RadialGradient` -- circular gradient from a centre point
3. `ConicGradient` -- angular sweep gradient
4. `DiamondGradient` -- Chebyshev-distance based diamond shape
5. `SweepGradient` -- atan2-based full 360° sweep
6. `MultiStopGradient` -- n-stop gradient via 1D LUT texture
7. `DiagonalGradient` -- gradient along an arbitrary angle
8. `FocalGradient` -- radial with offset focal point
9. `MeshGradient` -- interpolation across a 2D grid of colour points
10. `NoisyGradient` -- linear gradient with per-pixel noise offset

### Wave & Bend

11. `WaveColourLayer` -- noise-driven colour band (Stripe-style). Each layer has its own `noiseFreq`, `noiseSpeed`, `noiseFlow`, `noiseSeed`, `noiseFloor`, `noiseCeil`. Stack multiple instances with offset params.
12. `WaveBendLayer` ★ NEW -- ColorBends-style per-colour wave. Uses `sin(s.yx * freq)`
    - length-based intensity with optional warpStrength domain feedback loop. Different aesthetic to WaveColourLayer -- produces broader, bending colour bands rather than flowing noise ribbons. Stack one per colour.

### Solid / Flat

13. `SolidColour` -- flat colour fill
14. `Checkerboard` -- two-colour tile grid
15. `Stripes` -- repeating stripe pattern, controllable angle and width
16. `Dots` -- polka dot grid, smooth or hard edge
17. `Grid` -- line grid overlay

### Noise & Organic

18. `ValueNoise` -- classic smooth value noise
19. `GradientNoise` -- gradient noise (the `hash()` + smooth interpolation pattern used in Grainient and Shadertoy snippets 3 & 4)
20. `SimplexNoise` -- simplex noise
21. `FBMNoise` -- fractal Brownian motion (layered octaves)
22. `DomainWarpedNoise` -- FBM with domain warping
23. `CellularNoise` -- Worley/Voronoi noise
24. `VoronoiEdges` -- Voronoi cell edge lines only
25. `RidgedNoise` -- abs() of noise for mountain-ridge look
26. `BillowNoise` -- folded noise for cloud-like forms
27. `CurlNoise` -- divergence-free noise for fluid-like motion

### Gradient Blend (Noise-Rotated)

28. `NoisyGradientBlend` ★ NEW -- the full Grainient/Shadertoy gradient pattern as a single generator: GradientNoise → noise-driven UV rotation → sine warp → rotated two-layer colour blend. Exposes all params individually so the pipeline can still intercept at any stage, but provides a convenient self-contained starting point.

### Geometric

29. `Circle` -- smooth SDF circle
30. `Rectangle` -- SDF rounded rectangle
31. `Triangle` -- SDF equilateral or arbitrary triangle
32. `Hexagon` -- SDF hexagon
33. `Star` -- SDF n-pointed star
34. `Ring` -- annulus/donut SDF
35. `Line` -- SDF line segment
36. `Cross` -- SDF plus/cross shape
37. `Arrow` -- SDF directional arrow
38. `Polygon` -- SDF regular n-gon

### Patterns

39. `HexGrid` -- hexagonal tiling pattern
40. `TriangleGrid` -- triangular tiling
41. `PenroseTiling` -- quasi-periodic Penrose pattern
42. `TruchetTiles` -- randomised quarter-circle tile pattern
43. `WavyStripes` -- sine-modulated stripe generator
44. `Chevron` -- repeating chevron/zigzag
45. `Houndstooth` -- classic houndstooth textile pattern
46. `Tartan` -- crossed stripe pattern
47. `Halftone` -- dot-grid halftone screen
48. `CrossHatch` -- angled line cross-hatch

### Procedural Natural

49. `Marble` -- sine + FBM marble veining
50. `Wood` -- concentric ring wood grain
51. `Flame` -- animated upward noise-driven flame
52. `Water` -- animated layered sine water surface
53. `Clouds` -- FBM + remap cloud formation

### Volumetric / Raymarching

54. `RaymarchTunnel` ★ NEW -- the Shadertoy tunnel effect. Raymarching loop in a fragment shader: SDF sphere + fractional XY tiling + additive volumetric glow per step + chromatic time-offset colour. Self-contained, terminal: true. Exposes: `glowColour`, `glowFalloff`, `speed`, `tiling`, `sphereRadius`.

55. `SkyAtmosphere` ★ NEW -- physically-approximated sky dome. Consumes a ray direction from the Ray Pipeline plus a sun direction vec3. Core is an exponential atmospheric gradient with per-channel Rayleigh scattering coefficients `vec3(0.1, 0.3, 0.6)`: `exp2(-(ray.y - raySun*0.5) / scatterCoeffs)`. Darkens sky when sun is low, adds sun disc via `smoothstep(0.9995, 1.0, raySun)`. terminal: true, stage: 'ray'. Exposes: `scatterCoeffs`, `sunDiscSharpness`, `sunDiscColour`, `groundFade`.

56. `BilinearGradient` ★ NEW -- four-corner colour interpolation. The simplest possible 2D colour field: mix bottom-left/right along X, mix top-left/right along X, then mix the two results along Y. Zero noise, zero animation, zero distortion. `mix(mix(bl, br, uv.x), mix(tl, tr, uv.x), uv.y)` Exposes: `colorBL`, `colorBR`, `colorTL`, `colorTR`. Accepts CSS var props for all four corners for theme reactivity.

57. `HeightmapTerrain` ★ NEW -- DDA (Digital Differential Analysis) heightmap traversal producing a voxel-style terrain view. Consumes camera position (vec3) and ray direction (vec3) from the Ray Pipeline or StateBufferSampler.

Internally:

    - Applies a hexagonal grid skew via `F = (sqrt(3)-1)/2` -- skews the XY coordinate space so a square grid behaves like a hexagonal one, giving the terrain its distinctive isometric diamond facets
    - Marches through 2D grid cells using DDA, at each boundary comparing ray Z against the elevation function to find intersection
    - Elevation is `cos`-based terrain shape + distance falloff + HeightmapSampler noise
    - Shading: white/blue facets from `fract(pos.xy)` proximity to grid edges and diagonal lines; shadow tones from adjacent cell elevation difference

Exposes: `heightTexture`, `gridScale`, `terrainAmplitude`, `terrainRadius`, `facetColourA` (light), `facetColourB` (water/shadow), `marchSteps`. terminal: true, hdr: false, stage: 'ray'.

### Scalar Generators ★ NEW CATEGORY

> These take a float input and output a colour. They sit between a scalar source (uv.y, length(uv), SDF result, noise value) and the colour pipeline. The float input can come from any upstream node -- that composability is the point.

58. `CosinePalette` ★ NEW -- **the most reusable block in the system**. Iq's cosine palette formula: `a + b * cos(TAU * (c*t + d))` where a, b, c, d are vec3 parameters and t is a scalar float input. The four parameter vectors control:
    - `a` -- colour offset (brightness centre)
    - `b` -- colour amplitude (contrast)
    - `c` -- frequency per channel (how fast each channel oscillates)
    - `d` -- phase offset per channel (colour shift) Accepts CSS var props for all four vectors for full theme reactivity. Has a `frequency` multiplier prop for the `mul(0.6 * 2.0, PI)` pattern in imaginary2. Input `t` is wired from the previous pipeline stage or an explicit `scalarInput` prop.

59. `RingField` ★ NEW -- one or more ring-shaped SDF fields accumulated into a single float mask. Each ring is `abs(length(uv + offset) - radius)`. Multiple rings are additive. The flare8/flare9 pattern. Accepts an array of ring descriptors `[{ offset: vec2, radius: float, scale: float }]`. Outputs a float mask consumed downstream by `CosinePalette` and `SDFColourMask`. Also includes a built-in vignette term: `oneMinus(length(uv * vignetteScale))`.

60. `ChebyshevNoiseField` ★ NEW -- noise-distorted Chebyshev box shape. The genuary22 pattern: `1 - max(abs(uv.x * scaleX * n), abs(uv.y * scaleY * n2))` where n and n2 are two octaves of simplex noise at different frequencies. Produces a noise-eroded cross/box silhouette. Outputs a float mask.

61. `ComplexPlaneField` ★ NEW -- complex number plane visualisation. The imaginary2 effect: places two poles p and q at angle/distance from origin, computes the Möbius transformation `(z-p)/(z-q)`, takes the complex log, extracts the imaginary component (winding angle), combines with `exp(z.x)/exp(z.y)` for the radial term. Outputs a float t for `CosinePalette`. terminal: true. Exposes: `poleAngle`, `poleDistance`, `imaginaryWeight`, `radialWeight`.

---

## III. UV Transformers

> UV → UV. These never produce colour.

### Basic Transforms

1. `UVScale` -- uniform or non-uniform scale around a pivot
2. `UVTranslate` -- offset UV by a vec2
3. `UVRotate` -- rotate around a pivot point
4. `UVFlipX` -- mirror horizontally
5. `UVFlipY` -- mirror vertically
6. `UVFlipXY` -- mirror both axes
7. `UVSwapAxes` -- transpose x and y
8. `UVCentre` -- recentres UV to -0.5…0.5 space and back
9. `UVAspectCorrect` ★ NEW -- multiplies UV x by (width/height) so downstream effects are circular rather than elliptical. Essential whenever working with length() or radial operations. Used in ColorBends, Grainient, and most noise-rotation patterns.

### Mouse / Pointer

10. `UVParallax` ★ NEW -- offsets UV by pointer NDC position scaled by a parallax factor. Creates the illusion of depth as the mouse moves. Used in ColorBends. `p += uPointer * parallax * 0.1`
11. `UVMousePull` ★ NEW -- additive UV pull toward the current pointer position, scaled by an influence factor. Different from Parallax -- this warps the UV toward the cursor rather than shifting the whole field. Used in ColorBends. `q += (pointer - rp) * mouseInfluence * 0.2`

### Noise-Driven Rotation

12. `UVNoiseRotate` ★ NEW -- rotates UV by an angle derived from GradientNoise sampled at `(time * speed, uv.x * uv.y)`. The core of the Grainient and Shadertoy gradient looks. Exposes `noiseScale`, `rotationAmount` (degrees of max rotation), `speed`. The noise output remapped to `(degree - 0.5) * rotationAmount + 180` prevents the rotation from snapping back to zero.

### Tiling & Repetition

13. `UVTile` -- tile by integer repeat count
14. `UVMirrorTile` -- alternating mirrored tiles
15. `UVOffsetTile` -- brick-offset tiling
16. `UVHexTile` -- hexagonal tiling coordinate system
17. `UVClamp` -- clamps UV to 0--1 (no repeat)
18. `UVCrop` -- maps a sub-region to full 0--1 space

### Distortion

19. `UVWarp` -- sine-based two-axis warp
20. `UVSineWarpXY` ★ NEW -- independent sine warp on both axes simultaneously with frequency multiplier on Y (the `frequency * 1.5` pattern). This is the specific warp used in Grainient and Shadertoy snippets 3 & 4: `tuv.x += sin(tuv.y * freq + speed) / amplitude` `tuv.y += sin(tuv.x * freq * 1.5 + speed) / (amplitude * 0.5)` Distinct from `UVWarp` (which is a single vec2 sine) -- this is asymmetric by design.
21. `UVTwirl` -- spiral distortion from centre
22. `UVFisheye` -- barrel/fisheye lens distortion
23. `UVPinch` -- pinch toward or away from a point
24. `UVBulge` -- radial bulge/push from centre
25. `UVSinWave` -- single-axis sine wave displacement
26. `UVRipple` -- radial ripple from a point
27. `UVShear` -- shear/skew transform
28. `UVPolar` -- converts Cartesian UV to polar coordinates
29. `UVCartesian` -- converts polar back to Cartesian

### Noise-Driven

30. `UVNoiseWarp` -- FBM-driven domain warp
31. `UVTurbulence` -- high-frequency noise displacement
32. `UVCurlWarp` -- curl noise UV advection
33. `UVCrystal` -- Voronoi-warped UV
34. `UVMelt` -- slow downward gravity-like noise drip

### Time-Driven

35. `UVScroll` -- constant UV translation over time
36. `UVScrollX` -- horizontal scroll only
37. `UVScrollY` -- vertical scroll only
38. `UVPulse` -- oscillating scale over time
39. `UVOrbit` -- UV rotates around a centre point over time
40. `UVBreath` -- gentle scale oscillation

### Mapping

41. `UVSpherical` -- spherical projection mapping
42. `UVCylindrical` -- cylindrical projection
43. `UVPlanar` -- planar world-space projection
44. `UVTriplanar` -- world-normal-blended triplanar mapping
45. `UVScreenSpace` -- projects to screen-space UV regardless of geometry
46. `UVReflect` -- reflection vector-based UV
47. `UVMatCap` -- MatCap/LitSphere normal-based UV
48. `UVFlowMap` -- samples a flow map texture to drive UV offset

### Experimental

49. `UVKaleidoscope` -- mirror-fold UV into kaleidoscope symmetry
50. `UVFractalZoom` -- recursive self-similar UV zoom
51. `UVPixelate` -- floor UV to a pixel grid
52. `UVScan` -- animated scanline sweep
53. `UVShatter` -- Voronoi-cell-based UV fragmentation
54. `UVMosaic` -- large-block mosaic coordinate snapping
55. `UVFeedback` -- previous frame UV offset (requires render target pass)

### Banding & Repetition ★ NEW

56. `UVColumnOffset` ★ NEW -- offsets UV Y by a column-index-derived value, creating vertical bands that are each slightly offset. The dawn4/5 pattern: `floor(uv.x * repetitions) * repetitions * factor`. Combined with sine: `uv.y += columnOffset + sin(s * softness)`. Creates the vertical stripe morphing effect. Exposes: `repetitions`, `offsetFactor`, `sineSoftness`.
57. `UVFractBand` ★ NEW -- applies `fract(uv.y * frequency) * scale` to create horizontal banding via the fractional part. Outputs a float that adds to colour via `pow(s, 2.0)`. The dawn2 shimmer band pattern. Exposes: `frequency`, `scale`, `power`. Note: this outputs a float additive term, not a UV -- it straddles the UV/Scalar boundary, best used as a `ScalarAddend` passed to `CosinePalette` or added to the final colour directly.

---

## IV. Colour Ops

> colour → colour. Applied to the output of generators or previous ops.

### Blending

1. `MixBlend` -- linear interpolation between two colour inputs
2. `MultiplyBlend` -- Multiply mode
3. `ScreenBlend` -- Screen mode
4. `OverlayBlend` -- Overlay mode
5. `SoftLightBlend` -- Soft Light
6. `HardLightBlend` -- Hard Light
7. `DifferenceBlend` -- Difference (abs subtraction)
8. `ExclusionBlend` -- softer Difference
9. `DodgeBlend` -- colour dodge
10. `BurnBlend` -- colour burn
11. `AddBlend` -- additive blend
12. `SubtractBlend` -- subtractive blend
13. `DivideBlend` -- division blend
14. `DarkenBlend` -- min() per channel
15. `LightenBlend` -- max() per channel

### Gradient Blend Ops

16. `RotatedGradientBlend` ★ NEW -- blends two colours along a rotated axis using smoothstep. The `(tuv * Rot(angle)).x` pattern from Grainient and Shadertoy snippets 3 & 4. Takes `colorA`, `colorB`, `angle`, `edge0`, `edge1`. Used as the base colour layer before the Y-axis layer mix.

### Grading

17. `BrightnessContrast` -- lift and compress tonal range
18. `Exposure` -- multiply-based exposure stop adjustment
19. `Gamma` -- power-curve gamma correction. `pow(max(col, 0), 1/gamma)`
20. `Levels` -- input/output range remapping
21. `Curves` -- arbitrary tone curve via 1D LUT texture
22. `WhiteBalance` -- colour temperature and tint adjustment
23. `LiftGammaGain` -- cinematic three-way colour grade
24. `Hue` -- hue rotation in HSL space
25. `Saturation` -- HSL saturation adjustment. `mix(vec3(luma), col, saturation)`
26. `Vibrance` -- saturation boost that protects already-saturated colours
27. `Lightness` -- HSL lightness adjustment

### Channel Operations

28. `ChannelMixer` -- arbitrary RGB channel mixing matrix
29. `SwapChannels` -- remap colour channels
30. `Tint` -- multiply colour by a tint colour
31. `ColourBalance` -- shadows/midtones/highlights colour push
32. `SelectiveColour` -- adjust a specific hue range only

### Remapping

33. `Invert` -- 1 - colour
34. `Posterise` -- quantise to n colour steps
35. `Threshold` -- binary black/white from luminance
36. `ColourRamp` -- map luminance to a colour gradient
37. `DuoTone` -- map shadows/highlights to two colours
38. `Tritone` -- three-stop colour mapping
39. `FalseColour` -- scientific false colour mapping
40. `ThermalMap` -- cool-to-hot colour ramp
41. `Solarise` -- Sabattier photographic effect

### Colour Space

42. `LinearToSRGB` -- gamma encode for display
43. `SRGBToLinear` -- gamma decode to linear light
44. `RGBToHSL` -- colour space conversion
45. `HSLToRGB` -- colour space conversion
46. `RGBToOKLab` -- perceptually uniform colour space
47. `OKLabToRGB` -- back to RGB from OKLab
48. `Desaturate` -- perceptual luminance-preserving greyscale
49. `MonochromeTint` -- desaturate then tint with a single colour
50. `SplitTone` -- separate tint for shadows vs highlights

### Time-Based Colour

51. `DayNightCycle` ★ NEW -- sinusoidal interpolation between two sets of colours over time. `sin(time * speed)` remapped to 0--1 with a power curve for easing. Used in Shadertoy snippet 4 to cycle between light and dark palettes. `t = (sign(cycle) * pow(abs(cycle), 0.6) + 1.) / 2.` Takes `colorsLight[]`, `colorsDark[]`, `speed`. Returns the time-blended colour set.

52. `ChromaticAberration` -- per-channel UV offset

### Tonemapping & Colour Science

53. `ACESTonemap` ★ NEW -- ACES filmic tone mapping via two 3x3 matrix transforms. Industry-standard operator that compresses HDR values to display range with a characteristic S-curve and warm highlight rolloff. Essential companion to any HDR-range generator (SkyAtmosphere, RaymarchTunnel, Bloom). Input/output both vec3 RGB. No uniforms required -- the matrices are constant.
54. `ReinhardTonemap` -- simple Reinhard `col / (col + 1)` tone compression
55. `TanhTonemap` ★ NEW -- `tanh(col * exposure)` soft sigmoid compression. Gentler than ACES -- preserves saturation and has no warm rolloff. Used in dawn5. Particularly good for procedural colour fields that can briefly exceed 1.0. `exposure` prop controls how aggressively values are compressed (dawn5 uses 2.5).
56. `ExponentialFog` ★ NEW -- depth/height based fog blend to a fog colour using `exp2(-depth * density)` falloff.

### SDF-to-Colour ★ NEW

57. `SDFColourMask` ★ NEW -- multiplies a colour by a float mask value. The `col.mul(t)` pattern that appears in every phobon shader -- applies a SDF or noise-derived float as a multiplicative mask to the colour. While technically equivalent to `MultiplyBlend` with a greyscale input, naming it explicitly makes the scalar-pipeline intent clear. Exposes: `maskInput` (float node), `clampMask` (bool, default true).
58. `SDFRadialMask` ★ NEW -- `oneMinus(length(uv * scale))` -- simple radial falloff from centre without smoothstep. Softer than Vignette, additive rather than darkening. The `r.addAssign(oneMinus(length(_uv.mul(vignette))))` pattern in flare8/9. Exposes: `scale`, `offset`.

---

## V. Overlays

> colour → colour, additive or composited, post-process in nature.

### Film & Analogue

1. `Grain` -- white noise film grain (fract/sin/dot pattern)
2. `FilmGrain` ★ NEW -- hash-based film grain using length(hash(uv)) rather than the fract(sin(dot())) pattern. Produces a slightly coarser, more organic texture. Used in Shadertoy snippet 4. `filmGrainNoise = length(hash(vec2(uv.x, uv.y)))`. Subtracted from colour rather than added, darkening rather than brightening.
3. `ColourGrain` -- per-channel coloured grain
4. `FilmBurn` -- orange-edge light leak effect
5. `Halation` -- red glow bleed around highlights
6. `Dust` -- random static dust particle overlay
7. `Scratches` -- animated vertical film scratch lines
8. `AgedFilm` -- combined grain + scratch + tone shift preset
9. `CRTScanlines` -- horizontal scanline darkening. The simple vertical sine `sin(uv.y) / 2 + 0.7` pattern from the CRT snippet.
10. `CRTCurvature` -- barrel distortion + edge darkening
11. `VHSBleed` -- colour bleed + horizontal noise drift

### CRT / Screen Effects

12. `ChromaticScreenWaves` ★ NEW -- per-channel animated sine waves along the Y axis, producing a chromatic oscillation effect. Each RGB channel gets its own phase offset: `R: sin(20/res.y * uv.y + (-time*2 - 0.4)) / 10 + 0.85` `G: sin(20/res.y * uv.y + (-time*2)) / 10 + 0.85` `B: sin(20/res.y * uv.y + (-time*2 + 0.4)) / 10 + 0.85` Combined with screen stripe and applied as a multiplicative overlay. From the CRT Shadertoy snippet. Takes `amplitude`, `frequency`, `speed`, `phaseOffset` (the 0.4 channel separation).

### Spatial

13. `Vignette` -- edge darkening
14. `ColourVignette` -- vignette that shifts colour rather than just darkens
15. `Bloom` -- glow on bright areas (requires BackdropPass)
16. `LensFlare` -- procedural lens flare
17. `GodRays` -- volumetric light shaft from a point
18. `DepthFog` -- depth-based fog blend
19. `ChromaticAberration` -- RGB fringe at screen edges. The subtle UV offset pattern from the CRT snippet: `UR = U + vec2(0.001, 0)` etc.
20. `MotionBlur` -- velocity-based directional blur
21. `RadialBlur` -- zoom blur from centre
22. `TiltShift` -- simulated tilt-shift focus blur bands

### Texture & Surface

23. `Roughness` -- micro-detail noise
24. `PaperTexture` -- overlaid paper grain texture
25. `CanvasTexture` -- woven canvas fibre texture
26. `WatercolourEdge` -- soft paint bleed at edges
27. `HalftoneOverlay` -- dot-screen halftone blend
28. `CrossHatchOverlay` -- ink crosshatch texture
29. `RisographGrain` -- coarse risograph-style grain per layer
30. `PrintNoise` -- ink spread simulation
31. `FabricWeave` -- fine woven texture overlay
32. `ConcreteSurface` -- rough mineral surface texture

### Atmosphere

33. `Haze` -- additive white haze toward screen edges
34. `DustAtmosphere` -- floating particles in depth
35. `Bokeh` -- out-of-focus circular light discs
36. `Starfield` -- procedural star point field
37. `Aurora` -- layered animated colour bands
38. `LightShaft` -- single animated crepuscular ray
39. `Caustics` -- animated refracted light patterns
40. `HeatHaze` -- animated UV distortion simulating heat
41. `RainDrops` -- animated spherical lens drops on surface
42. `SnowOverlay` -- drifting particle snow

### Edge & Shape

43. `EdgeGlow` -- glow along detected colour edges
44. `OuterGlow` -- glow emanating outward from shapes
45. `InnerGlow` -- glow emanating inward from edges
46. `Outline` -- hard edge detection outline
47. `Emboss` -- directional normal-map style emboss
48. `NeonGlow` -- intense additive bloom on saturated colours
49. `DropShadow` -- procedural directional shadow offset
50. `FrostEdge` -- crystalline frost texture toward edges
51. `BurnEdge` -- darkened scorch mark at edges
52. `GlitchEdge` -- pixel displacement noise on detected edges

---

## VI. Shader Conversions

> Each existing shader mapped to block compositions.

---

### 1. ColorBends (vue-bits)

**What it does:** Rotatable, aspect-corrected, mouse-reactive field of colour bands. Each colour generates a sine-based wave layer. Blended with a length-based intensity and optional coverage-based transparency.

**Key insight:** The `q /= 0.5 + 0.2 * dot(q, q)` line is a lens/fisheye distortion applied in UV space before the wave layers. Worth exposing as a standalone UV op.

    <ShaderPipeline>
      <!-- UV prep -->
      <UVAspectCorrect :order="0" />
      <UVCentre :order="1" />
      <UVRotate :angle-prop="rotation" :auto-rotate="autoRotate" :order="2" />
      <UVScale :scale="scale" :order="3" />
      <UVFisheye :strength="0.2" :order="4" />  <!-- q /= 0.5 + 0.2*dot(q,q) -->
      <UVParallax :factor="parallax" :order="5" />
      <UVMousePull :influence="mouseInfluence" :order="6" />

      <!-- One WaveBendLayer per colour, stacked -->
      <WaveBendLayer
        v-for="(color, i) in colors"
        :key="i"
        :color="color"
        :frequency="frequency"
        :warp-strength="warpStrength"
        :index="i"
        :order="7 + i"
      />

      <!-- Alpha mode -->
      <CoverageAlpha v-if="transparent" :order="20" />

      <!-- Overlays -->
      <Grain :intensity="noise" :animated="true" :order="21" />
    </ShaderPipeline>

**Uniform reactivity:** `rotation` and `autoRotate` drive a computed vec2 `(cos(rad), sin(rad))` uniform updated in the render loop. The rotation is not a UV transform in the traditional sense -- it's a rotation matrix applied before the wave layers, so it lives in the UV chain. `UVRotate` handles this with a `time-driven` prop for auto-rotation.

**New blocks identified:** `UVAspectCorrect`, `UVParallax`, `UVMousePull`, `WaveBendLayer`, `CoverageAlpha`

---

### 2. Grainient (vue-bits / OGL)

**What it does:** Noise-driven UV rotation, asymmetric sine warp, two-layer rotated gradient blend, grain + contrast/gamma/saturation post-processing.

    <ShaderPipeline>
      <!-- UV transforms -->
      <UVAspectCorrect :order="0" />
      <UVCentre :order="1" />
      <UVScale :scale="zoom" :offset-x="centerX" :offset-y="centerY" :order="2" />
      <UVNoiseRotate
        :noise-scale="noiseScale"
        :rotation-amount="rotationAmount"
        :speed="0.1"
        :order="3"
      />
      <UVSineWarpXY
        :frequency="warpFrequency"
        :amplitude="warpAmplitude"
        :speed="warpSpeed"
        :order="4"
      />

      <!-- Two colour layers blended by Y axis -->
      <RotatedGradientBlend
        :color-a="color3"
        :color-b="color2"
        :angle="-blendAngle"
        :edge0="edge0"
        :edge1="edge1"
        :layer="1"
        :order="5"
      />
      <RotatedGradientBlend
        :color-a="color2"
        :color-b="color1"
        :angle="-blendAngle"
        :edge0="edge0"
        :edge1="edge1"
        :layer="2"
        :order="6"
      />
      <!-- Mix the two layers by tuv.y -->
      <MixBlend :axis="'y'" :edge0="blendSoftness" :order="7" />

      <!-- Post-processing -->
      <BrightnessContrast :contrast="contrast" :order="8" />
      <Saturation :amount="saturation" :order="9" />
      <Gamma :value="gamma" :order="10" />

      <!-- Overlay -->
      <Grain
        :intensity="grainAmount"
        :scale="grainScale"
        :animated="grainAnimated"
        :order="11"
      />
    </ShaderPipeline>

**New blocks identified:** `UVNoiseRotate`, `UVSineWarpXY`, `RotatedGradientBlend`

---

### 3. Shadertoy -- Basic Gradient (snippet 3)

**What it does:** Same core as Grainient but no grain, no post-processing, hardcoded two colour pairs, single blend rotation angle.

    <ShaderPipeline>
      <UVAspectCorrect :order="0" />
      <UVCentre :order="1" />
      <UVNoiseRotate :rotation-amount="720" :speed="0.1" :order="2" />
      <UVSineWarpXY :frequency="5" :amplitude="30" :speed="2" :order="3" />

      <RotatedGradientBlend
        color-a="#f4cd9f"
        color-b="#3162ee"
        :angle="-5"
        :edge0="-0.3"
        :edge1="0.2"
        :layer="1"
        :order="4"
      />
      <RotatedGradientBlend
        color-a="#e882cc"
        color-b="#59b5f3"
        :angle="-5"
        :edge0="-0.3"
        :edge1="0.2"
        :layer="2"
        :order="5"
      />
      <MixBlend :axis="'y'" :edge0="0.5" :edge1="-0.3" :order="6" />
    </ShaderPipeline>

This is the minimal form of the Grainient pattern -- useful as a named preset `<BasicGradient />`.

---

### 4. Shadertoy -- Grainient + Day/Night Cycle (snippet 4)

**What it does:** Same warp as snippet 3, but colours cycle between light and dark palettes using a sinusoidal time function, and adds hash-based film grain.

    <ShaderPipeline>
      <UVAspectCorrect :order="0" />
      <UVCentre :order="1" />
      <UVNoiseRotate :rotation-amount="720" :speed="0.05" :order="2" />
      <UVSineWarpXY :frequency="5" :amplitude="30" :speed="2" :order="3" />

      <!-- Day/night colour cycle -->
      <DayNightCycle
        :colors-light="['#4bba89', '#3162ee', '#f69292', '#59b5f3']"
        :colors-dark="['#6931f5', '#202a32', '#e93334', '#e9a04b']"
        :speed="0.5"
        :order="4"
      />
      <!-- The cycle outputs 4 resolved colours used by the gradient layers below -->

      <RotatedGradientBlend :angle="-5" :edge0="-0.3" :edge1="0.2" :layer="1" :order="5" />
      <RotatedGradientBlend :angle="-5" :edge0="-0.3" :edge1="0.2" :layer="2" :order="6" />
      <MixBlend :axis="'y'" :edge0="0.5" :edge1="-0.3" :order="7" />

      <!-- Hash-based film grain, subtractive -->
      <FilmGrain :intensity="0.05" :subtractive="true" :order="8" />
    </ShaderPipeline>

**New blocks identified:** `DayNightCycle`, `FilmGrain`

---

### 5. Shadertoy -- Volumetric Tunnel (snippet 1)

**What it does:** A raymarching loop producing a glowing volumetric tunnel. SDF sphere at z=15, fractional XY tiling with a rotation matrix driven by sin(z)\*sin(time), additive colour accumulation per step with chromatic time offsets.

This cannot be meaningfully decomposed -- the raymarching loop is load-bearing. It lives as a self-contained `RaymarchTunnel` generator.

    <ShaderPipeline>
      <RaymarchTunnel
        :glow-color="[0.2, 0.1, 0.04]"
        :glow-falloff="0.1"
        :steps="100"
        :sphere-radius="1.0"
        :sphere-z="15.0"
        :tiling-rotation="true"
        :speed="0.5"
        :chromatic-spread="0.15"
        :order="0"
      />

      <!-- Overlays are still composable on top -->
      <Vignette :strength="0.3" :order="1" />
    </ShaderPipeline>

**Architecture note:** `RaymarchTunnel` is the first generator that uses a loop internally. TSL supports `Loop()` nodes natively, so this compiles correctly -- but it means the block cannot feed into or receive from UV transformers in the normal pipeline sense. It reads `uv()` and `time` directly and outputs the final colour. Mark this block as `terminal: true` -- it should always be `order: 0` and UV transformers have no effect on it.

---

### 6. Shadertoy -- CRT / Chromatic Screen Effect (snippet 2)

**What it does:** Takes a background texture (iChannel0), applies subtle per-channel UV offset for chromatic aberration, multiplies by per-channel animated sine waves plus a screen stripe, and adjusts for contrast loss.

    <ShaderPipeline>
      <!-- Base texture with RGB channel split -->
      <TextureSampler :src="backgroundTexture" :order="0" />
      <ChromaticAberration :red-offset="[0.001, 0]" :blue-offset="[-0.001, 0]" :order="1" />

      <!-- CRT screen overlays -->
      <CRTScanlines :order="2" />
      <ChromaticScreenWaves
        :amplitude="0.1"
        :frequency="20"
        :speed="2"
        :phase-offset="0.4"
        :order="3"
      />

      <!-- Compensate for contrast loss from blending -->
      <BrightnessContrast :contrast="1.25" :order="4" />
    </ShaderPipeline>

**New blocks identified:** `ChromaticScreenWaves`

---

### 7. Stripe Gradient

**What it does:** Subdivided plane with vertex noise displacement, per-colour simplex noise wave layers in the fragment shader, diagonal cut via CSS.

    <!-- CSS container: transform: skewY(-12deg); overflow: hidden -->
    <TresCanvas>
      <TresMesh>
        <TresPlaneGeometry :args="[2, 2, 320, 80]" />
        <ShaderPipeline>
          <!-- Vertex stage -->
          <MeshWarp
            :noise-freq="[2, 3]"
            :noise-amp="320"
            :noise-speed="0.2"
            :noise-flow="3"
            :incline="0.4"
            stage="vertex"
            :order="0"
          />

          <!-- Fragment stages -->
          <SolidColour css-color="--color-stripe-base" :order="0" />
          <WaveColourLayer
            v-for="(color, i) in stripeColors"
            :key="i"
            :css-color="`--color-stripe-${i + 1}`"
            v-bind="useWaveLayerDefaults(i, stripeColors.length)"
            :order="1 + i"
          />
        </ShaderPipeline>
      </TresMesh>
    </TresCanvas>

---

### 8. Heatmap

**What it does:** Pre-processed image texture (R=contour, G=outerBlur, B=innerBlur), animated organic shadow shapes (3 time-offset copies), heat float → n-colour gradient.

    <ShaderPipeline>
      <ProcessedImageSampler :src="imageSrc" :order="0" />
      <ShadowShape
        :inner-glow="innerGlow"
        :contour="contour"
        :order="1"
      />
      <OuterHeatGlow
        :outer-glow="outerGlow"
        :angle="angle"
        :order="2"
      />
      <HeatToGradient
        :colors="colors"
        css-color-back="--color-bg-base"
        :order="3"
      />
      <Grain :intensity="noise" :order="4" />
    </ShaderPipeline>

**CPU pre-processing step lives outside the shader system:**

    const { blob } = await processHeatmapImage(src)
    // Bakes contour(R), outerBlur(G), innerBlur(B) into a single texture

---

### 9. Glass / Wave Distortion

**What it does:** FBM-derived normal map drives refraction UV offset into a blurred backdrop sample. Fresnel edge brightening, tint, chromatic aberration.

    <TresCanvas>
      <SceneContent />
      <BackdropPass :blur="12" id="scene-backdrop" />

      <TresMesh>
        <ShaderPipeline backdrop="scene-backdrop">
          <FBMNoise :octaves="3" :scale="2.0" :order="0" />
          <NormalFromHeight :strength="0.04" :order="1" />
          <RefractionOffset :ior="0.08" :order="2" />
          <BackdropBlur :order="3" />
          <MixBlend css-color="--color-glass-tint" :factor="0.08" :order="4" />
          <FresnelBlend css-color="--color-glass-edge" :power="2.0" :order="5" />
          <ChromaticAberration :strength="0.003" :order="6" />
          <EdgeGlow :strength="0.15" :order="7" />
        </ShaderPipeline>
      </TresMesh>
    </TresCanvas>

---

## Block Interaction Map

Reliable composition patterns:

    UVNoiseRotate + UVSineWarpXY + RotatedGradientBlend   → Grainient family
    UVNoiseRotate + UVSineWarpXY + DayNightCycle           → animated palette gradient
    WaveBendLayer × n + CoverageAlpha                      → ColorBends
    WaveColourLayer × n + MeshWarp (vertex)                → Stripe gradient
    FBMNoise + NormalFromHeight + RefractionOffset         → glass refraction
    TextureSampler + ChromaticAberration + ChromaticScreenWaves + CRTScanlines → CRT
    UVPolar + Stripes                                      → radial spokes
    DomainWarpedNoise + ColourRamp                         → flowing lava / aurora
    UVKaleidoscope + any generator                        → mandala
    Halation + Bloom + ColourGrain                         → cinematic film look
    DuoTone + Grain + Vignette                             → risograph print preset
    DayNightCycle + Grain + FilmGrain                      → animated film look
    RaymarchTunnel + Vignette                              → tunnel scene
    FisheyeRay + RayTiltBasis + SkyAtmosphere + ACESTonemap → sky dome
    FisheyeRay + RaySphereReflect + SkyAtmosphere          → mirrored sky ball
    BilinearGradient (4 CSS vars)                          → fully theme-reactive background
    SkyAtmosphere + ExponentialFog + Grain                 → hazy atmospheric scene

    // CosinePalette scalar pipeline patterns
    CosinePalette(uv.y) + UVFractBand + Grain              → dawn2 animated shimmer
    CosinePalette(sdSphere * noise) + UVColumnOffset + SDFColourMask → dawn4/5 family
    CosinePalette(length(uv) * noise) + ChebyshevNoiseField → genuary22
    CosinePalette(imaginary) + ComplexPlaneField + Grain   → imaginary2 complex field
    CosinePalette(uv.y) + RingField × n + SDFRadialMask    → flare8/9 ring gradient
    any SDF + CosinePalette + SDFColourMask               → any shape with palette colouring
    SimplexNoise → CosinePalette                          → animated noise gradient

---

### 13. imaginary2 (phobon TSL)

**What it does:** Visualises the imaginary component of a complex logarithm of a Möbius transformation. Two poles at `p` and `q` (placed by angle/distance) divide the screen. For every pixel `z`, computes `log((z-p)/(z-q))` -- the imaginary part gives the winding angle around the two poles, creating smooth bands that wrap the plane. Combined with a radial `exp(z.x)/exp(z.y)` term for the hyperbolic texture.

    <ShaderPipeline>
      <!-- Scalar pipeline: UV → complex field float → palette → colour -->
      <ComplexPlaneField
        :pole-angle="PI * 1.8"
        :pole-distance="0.25"
        :imaginary-weight="0.75"
        :radial-weight="1.0"
        :order="0"
      />
      <!-- t from ComplexPlaneField feeds CosinePalette -->
      <CosinePalette
        :a="[0.5, 0.52, 0.53]"
        :b="[0.46, 0.32, 0.35]"
        :c="[0.82, 0.84, 0.65]"
        :d="[0.53, 0.23, 0.22]"
        :frequency="0.6 * 2 * PI"
        :order="1"
      />
      <Grain :intensity="0.2" :order="2" />
    </ShaderPipeline>

---

### 14. dawn2 (phobon TSL)

**What it does:** Animated cosine palette scrolling vertically. Adds a fract-banding shimmer: `fract(uv.y * 24) * 0.3` raised to power 2 creates bright horizontal flicker lines that sit on top of the smooth gradient.

    <ShaderPipeline>
      <!-- Base: time-scrolling cosine palette on Y -->
      <CosinePalette
        :a="[0.5, 0.5, 0.5]"
        :b="[0.5, 0.5, 0.5]"
        :c="[1.0, 0.7, 0.4]"
        :d="[0.0, 0.15, 0.2]"
        scalar-input="uv.y - time * 0.1"
        :order="0"
      />
      <!-- Additive shimmer bands -->
      <UVFractBand
        :frequency="24"
        :scale="0.3"
        :power="2.0"
        :order="1"
      />
      <Grain :intensity="0.2" :order="2" />
    </ShaderPipeline>

**Note:** `scalar-input="uv.y - time * 0.1"` is a string expression shorthand. In practice this would be a TSL node: `uv().y.sub(time.mul(0.1))` passed as a prop.

---

### 15. dawn4 (phobon TSL)

**What it does:** Column-offset UV creates vertical banding, simplex noise drives both a box SDF mask and the cosine palette. Two noise octaves at different frequencies.

    <ShaderPipeline>
      <!-- UV: column offset + sine softening -->
      <UVAspectCorrect :order="0" />
      <UVColumnOffset
        :repetitions="12"
        :offset-factor="0.005"
        :sine-softness="0.05"
        :order="1"
      />

      <!-- Scalar pipeline: sdSphere * noise → palette -->
      <CosinePalette
        :a="[0.8, 0.5, 0.4]"
        :b="[0.2, 0.4, 0.2]"
        :c="[2.0, 1.0, 1.0]"
        :d="[0.0, 0.25, 0.25]"
        scalar-input="sdSphere(uv0) * noise3d(offsetUv)"
        :order="2"
      />

      <!-- Mask: 1 - sdBox2d(uv * noise) applied multiplicatively -->
      <SDFColourMask
        mask-input="oneMinus(sdBox2d(offsetUv * noiseScale))"
        :order="3"
      />

      <Grain :intensity="0.2" :order="4" />
    </ShaderPipeline>

---

### 16. dawn5 (phobon TSL)

**What it does:** Like dawn4 but uses `abs(sdSphere) + noise` for the mask (creates a ring-like silhouette rather than box), and applies `tanh` tonemapping.

    <ShaderPipeline>
      <UVAspectCorrect :order="0" />
      <UVColumnOffset :repetitions="12" :offset-factor="0.005" :order="1" />

      <CosinePalette
        :a="[0.5, 0.5, 0.5]"
        :b="[0.5, 0.5, 0.5]"
        :c="[1.0, 1.0, 0.5]"
        :d="[0.8, 0.9, 0.3]"
        scalar-input="sdSphere(uv0) + noise3d(offsetUv * 3, time * 0.25) * 0.12"
        :order="2"
      />

      <!-- Ring mask: 1 - |sdSphere(offsetUv)| - noise -->
      <SDFColourMask
        mask-input="oneMinus(abs(sdSphere(offsetUv)) + noise)"
        :order="3"
      />

      <!-- Tanh tone compression before grain -->
      <TanhTonemap :exposure="2.5" :order="4" />
      <Grain :intensity="0.2" :order="5" />
    </ShaderPipeline>

---

### 17. flare9 (phobon TSL)

**What it does:** Single ring field (`abs(length(uv + offset) - radius)`) combined with a radial vignette mask. Cosine palette on uv.y.

    <ShaderPipeline>
      <UVAspectCorrect :order="0" />

      <!-- Ring SDF accumulated with radial vignette into a float mask -->
      <RingField
        :rings="[{ offset: [0.5, -0.5], radius: 0.55, scale: 1.75 }]"
        :vignette-scale="3"
        :order="1"
      />

      <!-- Palette driven by uv.y -->
      <CosinePalette
        :a="[0.5, 0.5, 0.5]"
        :b="[0.5, 0.5, 0.5]"
        :c="[1.0, 1.0, 1.0]"
        :d="[0.0, 0.33, 0.67]"
        scalar-input="uv.y * 0.25 + 2.25"
        :order="2"
      />

      <!-- Ring mask applied multiplicatively to palette colour -->
      <SDFColourMask :order="3" />
      <Grain :intensity="0.2" :order="4" />
    </ShaderPipeline>

---

### 18. flare8 (phobon TSL)

**What it does:** Three overlapping rings at different positions, scales, and radii, accumulated into a single mask. More complex ring field than flare9. Uniform-driven so all parameters are live-adjustable.

    <ShaderPipeline>
      <UVAspectCorrect :order="0" />

      <!-- Three rings accumulated + radial vignette -->
      <RingField
        :rings="[
          { offset: [0.1,  0.5],  radius: 0.25, scale: 1.5,  mode: 'abs'        },
          { offset: [-0.25,-0.3], radius: 0.45, scale: 1.75, mode: 'oneMinus'   },
          { offset: [0.25, -0.5], radius: 0.75, scale: 0.5,  mode: 'abs'        }
        ]"
        :vignette-scale="3"
        :order="1"
      />

      <CosinePalette
        css-a="--shader-palette-a"
        css-b="--shader-palette-b"
        css-c="--shader-palette-c"
        css-d="--shader-palette-d"
        :offset="0.5"
        scalar-input="uv.y * 0.5 + offset"
        :order="2"
      />

      <SDFColourMask :order="3" />
      <Grain :intensity="0.2" :order="4" />
    </ShaderPipeline>

**Note:** flare8 uses `uniform()` for its palette parameters -- mapped directly to CSS var props on `CosinePalette` (`css-a`, `css-b` etc.) for full theme reactivity.

---

### 19. genuary22 (phobon TSL)

**What it does:** Noise-distorted Chebyshev box shape coloured by cosine palette. Two simplex noise octaves modulate both the mask and the palette input. No grain.

    <ShaderPipeline>
      <UVAspectCorrect :order="0" />

      <!-- Noise-eroded Chebyshev cross mask -->
      <ChebyshevNoiseField
        :scale-x="2.5"
        :scale-y="1.5"
        :noise-frequency-2="2.0"
        :time-speed="0.1"
        :order="1"
      />

      <!-- Palette: length(uv) * noise as input -->
      <CosinePalette
        :a="[0.5, 0.5, 0.5]"
        :b="[0.5, 0.5, 0.5]"
        :c="[1.0, 0.7, 0.4]"
        :d="[0.0, 0.15, 0.2]"
        scalar-input="length(uv) * noise"
        :order="2"
      />

      <SDFColourMask :order="3" />
    </ShaderPipeline>

**New blocks identified:** `CosinePalette`, `RingField`, `ChebyshevNoiseField`, `ComplexPlaneField`, `SDFColourMask`, `SDFRadialMask`, `TanhTonemap`, `UVColumnOffset`, `UVFractBand`, `ComplexDiv`, `ComplexLog`

---

### 10. Four-Corner Gradient (Shadertoy snippet 2)

**What it does:** The simplest possible 2D colour field. Four colours at each corner, bilinearly interpolated across the UV space. No animation, no noise, no distortion.

    <ShaderPipeline>
      <BilinearGradient
        css-color-bl="--color-bg-base"
        css-color-br="--color-accent"
        css-color-tl="--color-surface"
        css-color-tr="--color-highlight"
        :order="0"
      />
    </ShaderPipeline>

This is the atomic baseline generator -- worth having as a named block purely because it composes so well with UV transformers. Run it through `UVNoiseRotate` + `UVSineWarpXY` and you get a variant of the Grainient family with distinct corner anchors.

---

### 11. Sky Gradient (Shadertoy -- Hazel Quantock)

**What it does:** Physically-approximated sky dome using exponential atmospheric scattering. Ray-based -- converts screen coords to a 3D ray, tilts it upward, applies optional fisheye and sphere reflection, evaluates sky colour + sun disc, ACES tonemaps.

**Key insight:** The sky is built from three separable concerns -- the ray setup, the atmospheric function, and the tonemapping. Each maps cleanly to a block.

    <ShaderPipeline>
      <!-- Ray Pipeline (stage: 'ray') -- builds and transforms the view ray -->
      <FisheyeRay :strength="0.5" stage="ray" :order="0" />
      <RayTiltBasis :forward="[0, 0.8, 1]" stage="ray" :order="1" />
      <!-- Optional: -->
      <!-- <RaySphereReflect :centre-z="1.8" :radius="1.0" stage="ray" :order="2" /> -->

      <!-- Terminal generator -- consumes ray, outputs sky colour (HDR range) -->
      <SkyAtmosphere
        :scatter-coeffs="[0.1, 0.3, 0.6]"
        :sun-disc-sharpness="0.9995"
        :sun-disc-colour="[10, 3, 0.2]"
        :order="0"
      >
        <!-- Sun direction driven by mouse or time -->
        <SunDirectionUniform slot="sunDir" :speed="0.5" :mouse-driven="true" />
      </SkyAtmosphere>

      <!-- Tonemapping -- ACES compresses HDR sky values to display range -->
      <ACESTonemap :order="1" />

      <!-- Overlays still composable on top -->
      <ExponentialFog css-color="--color-fog" :density="0.1" :order="2" />
    </ShaderPipeline>

**The sun direction slot** is a new pattern -- `SkyAtmosphere` exposes a named input slot for its sun direction uniform rather than taking it as a plain prop. This lets you swap between `SunDirectionUniform` (mouse/time driven), `CSSFloatUniform` (theme driven), or a static `AngleConst` without changing the generator itself.

**ACES is mandatory here** -- `SkyAtmosphere` outputs HDR values (sun disc peaks at `vec3(10, 3, 0.2)`). Without tonemapping the canvas clips to white. The pipeline compositor should warn if a terminal HDR generator has no tonemap op downstream.

**New blocks identified:** `SkyAtmosphere`, `BilinearGradient`, `FisheyeRay`, `RayTiltBasis`, `RaySphereReflect`, `SunDirectionUniform`, `RayCameraUniform`, `ACESTonemap`, `ExponentialFog`, `ReinhardTonemap`

---

### 12. Mountain Terrain (Shadertoy -- DDA Heightmap Raymarcher)

**What it does:** First-person voxel terrain using 2D DDA traversal. A separate buffer pass (iChannel0) stores and updates camera position and rotation each frame. The main pass reads that state, builds a view ray, then marches through a hexagonally-skewed grid, sampling a noise texture for height at each cell boundary until the ray intersects the terrain surface.

**The three non-obvious parts:**

1. **Hexagonal grid skew** -- `F = (sqrt(3)-1)/2` is the skew factor that transforms a square grid into one where diagonal traversal is equal cost to axis-aligned traversal. It gives the terrain its diamond/isometric facet appearance without using actual hexagonal geometry.

2. **DDA traversal** -- not raymarching in the SDF sense. The loop steps cell by cell in 2D, choosing X or Y boundary based on which is closer, then comparing the ray Z against the elevation at that cell. When `e1 >= fpos.z` the ray has gone underground -- binary interpolate back to the surface.

3. **Multi-pass state** -- the camera controller lives in a separate buffer shader that reads keyboard/mouse input and integrates position over time, writing the result as pixel colours. The terrain shader reads this back via `texture(iChannel0, ...)`. This is outside the block system's scope -- it's a simulation pass, not a shader effect. The block system receives the final position/rotation as uniforms.

**Block composition:**

    <!--
      Camera state comes from outside the shader system --
      a separate simulation pass or JS-driven uniforms.
      The terrain block receives position and rotation as plain uniforms.
    -->
    <ShaderPipeline>

      <!-- Ray Pipeline: build view ray from camera state -->
      <RayFromStateBuffer
        :position-uniform="cameraPosition"
        :rotation-uniform="cameraRotation"
        stage="ray"
        :order="0"
      />

      <!-- Terminal generator: DDA terrain traversal -->
      <HeightmapTerrain
        :height-texture="noiseTexture"
        :grid-scale="100"
        :terrain-amplitude="5"
        :terrain-radius="20"
        :facet-colour-a="[1.0, 1.0, 1.0]"
        :facet-colour-b="[0.15, 0.3, 0.5]"
        :march-steps="32"
        :order="0"
      />

      <!-- Overlays still fully composable -->
      <ExponentialFog
        css-color="--color-sky-horizon"
        :density="0.04"
        :order="1"
      />
      <Vignette :strength="0.25" :order="2" />

    </ShaderPipeline>

**The simulation pass** (camera movement) sits outside `ShaderPipeline` entirely. In a TresJS context this is a `useRenderTarget` composable that runs each frame, writing position/rotation into a 2×1 float texture that gets passed to the terrain block as a uniform. It does not participate in the block pipeline -- it's infrastructure.

    // Outside the shader system -- camera simulation
    const { texture: cameraState } = useSimulationPass({
      width: 2, height: 1,
      shader: cameraSimulationGLSL, // integrates velocity, handles input
      floatTexture: true
    })
    // cameraState passed as :position-uniform and :rotation-uniform to RayFromStateBuffer

**New blocks identified:** `HeightmapTerrain`, `HeightmapSampler`, `StateBufferSampler`, `RayFromStateBuffer`

**New system concept:** `useSimulationPass` -- a composable for multi-pass state simulation that sits outside the block pipeline but feeds into it via uniforms. This is the same pattern needed for fluid simulation, particle systems, and anything that requires frame-to-frame state accumulation.

---

## Implementation Priority

Reliable composition patterns worth noting:

    RayFromStateBuffer + HeightmapTerrain + ExponentialFog  → terrain flythrough
    RayFromStateBuffer + HeightmapTerrain + Vignette        → minimal terrain view
    FisheyeRay + RayTiltBasis + SkyAtmosphere + ACESTonemap → sky dome
    BilinearGradient + UVNoiseRotate + UVSineWarpXY         → theme-anchored gradient
    useSimulationPass → StateBufferSampler → any ray generator → stateful camera

### Phase 1 -- Foundation

Primitives (values, uniforms, CSS bridge, CoverageAlpha), SolidColour, LinearGradient, RadialGradient, GradientNoise, FBMNoise, SimplexNoise, UVAspectCorrect, UVCentre, UVScale, UVRotate, UVNoiseRotate, UVSineWarpXY, UVScroll, **CosinePalette** ← promote to Phase 1 -- backbone of the scalar pipeline, SDFColourMask, SDFRadialMask, RotatedGradientBlend, MixBlend, BrightnessContrast, Gamma, Saturation, TanhTonemap, Grain, FilmGrain, Vignette

### Phase 2 -- Expression

WaveBendLayer, WaveColourLayer, MeshWarp (vertex), UVParallax, UVMousePull, UVWarp, UVTwirl, UVPolar, UVColumnOffset, UVFractBand, DayNightCycle, ColourRamp, DuoTone, Desaturate, Tint, RingField, ChebyshevNoiseField, ChromaticAberration, ChromaticScreenWaves, CRTScanlines, Bloom, Halation

### Phase 3 -- Depth

ProcessedImageSampler, ShadowShape, HeatToGradient, BackdropPass, BackdropBlur, RefractionOffset, FresnelBlend, NormalFromHeight, MultiStopGradient, MeshGradient, DomainWarpedNoise, UVKaleidoscope, UVFeedback, CurlNoise, LiftGammaGain, Curves (LUT), FilmBurn, RaymarchTunnel, BilinearGradient, ACESTonemap, ReinhardTonemap, ComplexPlaneField, ComplexDiv, ComplexLog

### Phase 4 -- Ray & Atmosphere

Ray Pipeline infrastructure (RayCameraUniform, FisheyeRay, RayTiltBasis, RayFromStateBuffer), SkyAtmosphere, SunDirectionUniform, RaySphereReflect, ExponentialFog, RayMouseOrbit, RayAutoOrbit

### Phase 5 -- Terrain & Simulation

HeightmapTerrain, HeightmapSampler, StateBufferSampler, useSimulationPass, UVFeedback (render target), fluid simulation pass, particle simulation pass

### Phase 6 -- Surface & Detail

All texture overlays, GodRays, LensFlare, Caustics, Bokeh, FabricWeave, WatercolourEdge, TriplanarMapping, FlowMap, MotionBlur, full film grain suite, CRTCurvature, VHSBleed, AgedFilm preset, RisographGrain preset

---

## VII. Implementation Guide

> Complete code for core infrastructure plus one reference implementation per category. All remaining blocks follow the same patterns -- build these first, then use them as templates.

---

### File Structure

    layers/shader/
    ├── index.ts                          # barrel export
    ├── composables/
    │   ├── useShaderStage.ts
    │   ├── useCSSUniform.ts
    │   └── useThemeProvider.ts
    ├── components/
    │   ├── ShaderPipeline.vue            # core compositor
    │   ├── primitives/
    │   │   ├── FloatUniform.vue
    │   │   └── ColourUniform.vue
    │   ├── generators/
    │   │   ├── SolidColour.vue
    │   │   ├── LinearGradient.vue
    │   │   └── CosinePalette.vue         # scalar generator
    │   ├── uvTransformers/
    │   │   ├── UVAspectCorrect.vue
    │   │   ├── UVNoiseRotate.vue
    │   │   └── UVSineWarpXY.vue
    │   ├── colourOps/
    │   │   ├── BrightnessContrast.vue
    │   │   ├── TanhTonemap.vue
    │   │   └── SDFColourMask.vue
    │   └── overlays/
    │       ├── Grain.vue
    │       └── Vignette.vue
    ├── tsl/
    │   ├── utils/
    │   │   ├── screenAspectUV.ts
    │   │   └── colour.ts                 # CSS colour resolution
    │   ├── generators/
    │   │   ├── solidColour.ts
    │   │   ├── linearGradient.ts
    │   │   └── cosinePalette.ts
    │   ├── uvTransformers/
    │   │   ├── uvAspectCorrect.ts
    │   │   ├── uvNoiseRotate.ts
    │   │   └── uvSineWarpXY.ts
    │   ├── colourOps/
    │   │   ├── brightnessContrast.ts
    │   │   └── tanhTonemap.ts
    │   ├── overlays/
    │   │   ├── grain.ts
    │   │   └── vignette.ts
    │   ├── noise/
    │   │   └── gradientNoise.ts
    │   └── sdf/
    │       └── shapes.ts
    └── types.ts

---

### 1. Types

    // layers/shader/types.ts
    import type { Node } from 'three/tsl'

    export type ShaderStage = 'fragment' | 'vertex' | 'ray'

    export interface StageEntry {
      fn: (input: Node) => Node
      order: number
      stage: ShaderStage
    }

    export interface ShaderPipelineContext {
      register: (fn: StageEntry['fn'], order: number, stage: ShaderStage) => void
      unregister: (fn: StageEntry['fn']) => void
    }

    export interface CosineParams {
      a: [number, number, number]
      b: [number, number, number]
      c: [number, number, number]
      d: [number, number, number]
    }

---

### 2. Core Composables

    // layers/shader/composables/useThemeProvider.ts
    import { ref, provide, watch } from 'vue'
    import { useColorMode } from '@vueuse/core'

    export function useThemeProvider() {
      const mode    = useColorMode()
      const palette  = ref('default')
      const contrast = ref('standard')

      provide('shaderTheme', { mode, palette, contrast })
      return { mode, palette, contrast }
    }



    // layers/shader/composables/useShaderStage.ts
    import { inject, onMounted, onUnmounted } from 'vue'
    import type { Node } from 'three/tsl'
    import type { ShaderPipelineContext, ShaderStage } from '../types'

    export function useShaderStage(
      stageFn: (input: Node) => Node,
      order = 0,
      stage: ShaderStage = 'fragment'
    ) {
      const pipeline = inject<ShaderPipelineContext>('shaderPipeline')
      if (!pipeline) {
        console.warn('[useShaderStage] No ShaderPipeline found in parent tree')
        return
      }
      onMounted(() => pipeline.register(stageFn, order, stage))
      onUnmounted(() => pipeline.unregister(stageFn))
    }



    // layers/shader/composables/useCSSUniform.ts
    import { uniform } from 'three/tsl'
    import { Color } from 'three'
    import { inject, watch, nextTick, onUnmounted } from 'vue'
    import { resolveColour } from '../tsl/utils/colour'

    function readColourVar(varName: string) {
      const raw = getComputedStyle(document.documentElement)
        .getPropertyValue(varName).trim()
      return new Color(resolveColour(raw || '#000000'))
    }

    function readFloatVar(varName: string) {
      return parseFloat(
        getComputedStyle(document.documentElement).getPropertyValue(varName)
      ) || 0
    }

    export function useCSSColourUniform(varName: string) {
      const { mode, palette, contrast } = inject<any>('shaderTheme')
      const node = uniform(readColourVar(varName))

      const stop = watch([mode, palette, contrast], () => {
        nextTick(() => { node.value.set(readColourVar(varName)) })
      })

      onUnmounted(stop)
      return node
    }

    export function useCSSFloatUniform(varName: string) {
      const { mode, palette, contrast } = inject<any>('shaderTheme')
      const node = uniform(readFloatVar(varName))

      const stop = watch([mode, palette, contrast], () => {
        nextTick(() => { node.value = readFloatVar(varName) })
      })

      onUnmounted(stop)
      return node
    }

---

### 3. Colour Utility

    // layers/shader/tsl/utils/colour.ts
    export function resolveColour(raw: string): string {
      const str = raw.trim()
      if (/^oklch\(/i.test(str)) return oklchToHex(str)
      if (/^hsla?\(/i.test(str)) return hslaToHex(str)
      return canvasResolve(str)
    }

    function canvasResolve(str: string): string {
      const ctx = Object.assign(
        document.createElement('canvas'), { width: 1, height: 1 }
      ).getContext('2d')!
      ctx.fillStyle = str
      return ctx.fillStyle
    }

    function oklchToHex(str: string): string {
      const [l, c, h] = parseArgs(str).map(Number)
      const hRad = (h * Math.PI) / 180
      const a = c * Math.cos(hRad)
      const b = c * Math.sin(hRad)
      const lr = l + 0.3963377774 * a + 0.2158037573 * b
      const lg = l - 0.1055613458 * a - 0.0638541728 * b
      const lb = l - 0.0894841775 * a - 1.2914855480 * b
      const r  = gamma(lr**3 *  4.0767416621 + lg**3 * -3.3077115913 + lb**3 *  0.2309699292)
      const g  = gamma(lr**3 * -1.2684380046 + lg**3 *  2.6097574011 + lb**3 * -0.3413193965)
      const bv = gamma(lr**3 * -0.0041960863 + lg**3 * -0.7034186147 + lb**3 *  1.7076147010)
      return toHex(r, g, bv)
    }

    function hslaToHex(str: string): string {
      let [h, s, l] = parseArgs(str).map(Number)
      s /= 100; l /= 100
      const k = (n: number) => (n + h / 30) % 12
      const f = (n: number) => l - s * Math.min(l, 1 - l) * Math.max(-1, Math.min(k(n) - 3, 9 - k(n), 1))
      return toHex(f(0), f(8), f(4))
    }

    const parseArgs = (s: string) =>
      s.replace(/^[\w-]+\(/, '').replace(')', '').split(/[\s,\/]+/).filter(Boolean)
    const gamma = (x: number) => x <= 0.0031308 ? 12.92 * x : 1.055 * x ** (1/2.4) - 0.055
    const sat   = (x: number) => Math.max(0, Math.min(1, x))
    const toHex = (r: number, g: number, b: number) =>
      '#' + [r, g, b].map(v => Math.round(sat(v) * 255).toString(16).padStart(2, '0')).join('')

---

### 4. TSL Utilities

    // layers/shader/tsl/utils/screenAspectUV.ts
    import { Fn, uv, vec2, screenSize } from 'three/tsl'

    // Aspect-corrected UV centred at origin (-0.5..0.5 on short axis)
    export const screenAspectUV = Fn(() => {
      const aspect = screenSize.x.div(screenSize.y)
      return uv().sub(0.5).mul(vec2(aspect, 1.0))
    })



    // layers/shader/tsl/noise/gradientNoise.ts
    import { Fn, vec2, dot, fract, sin, floor, mix } from 'three/tsl'

    // Inigo Quilez gradient noise -- same hash used across phobon shaders
    const hash2 = Fn(([p]: [any]) => {
      const q = vec2(
        dot(p, vec2(2127.1, 81.17)),
        dot(p, vec2(1269.5, 283.37))
      )
      return fract(sin(q).mul(43758.5453))
    })

    export const gradientNoise = Fn(([p]: [any]) => {
      const i = floor(p)
      const f = fract(p)
      const u = f.mul(f).mul(f.oneMinus().mul(2).add(1)) // smoothstep

      const n = mix(
        mix(
          dot(hash2(i.add(vec2(0, 0))).mul(2).sub(1), f.sub(vec2(0, 0))),
          dot(hash2(i.add(vec2(1, 0))).mul(2).sub(1), f.sub(vec2(1, 0))),
          u.x
        ),
        mix(
          dot(hash2(i.add(vec2(0, 1))).mul(2).sub(1), f.sub(vec2(0, 1))),
          dot(hash2(i.add(vec2(1, 1))).mul(2).sub(1), f.sub(vec2(1, 1))),
          u.x
        ),
        u.y
      )
      return n.mul(0.5).add(0.5) // remap to 0..1
    })



    // layers/shader/tsl/sdf/shapes.ts
    import { Fn, length, abs, max, vec2 } from 'three/tsl'

    // Signed distance to a sphere/circle at origin
    export const sdSphere = Fn(([p]: [any]) => length(p))

    // Signed distance to a 2D box centred at origin, half-extents b
    export const sdBox2d = Fn(([p, b]: [any, any]) => {
      const d = abs(p).sub(b)
      return length(max(d, 0.0)).add(max(d.x, d.y).min(0.0))
    })

---

### 5. ShaderPipeline Component

    <!-- layers/shader/components/ShaderPipeline.vue -->
    <script setup lang="ts">
    import { provide, shallowRef, watch } from 'vue'
    import * as THREE from 'three'
    import { vec4, positionLocal } from 'three/tsl'
    import type { Node } from 'three/tsl'
    import type { StageEntry, ShaderPipelineContext } from '../types'

    const fragmentStages = shallowRef<StageEntry[]>([])
    const vertexStages   = shallowRef<StageEntry[]>([])

    // MeshBasicNodeMaterial works with WebGPU and WebGL2 via TSL
    const material = new THREE.MeshBasicNodeMaterial({ transparent: true })

    function sortedInsert(arr: StageEntry[], entry: StageEntry): StageEntry[] {
      return [...arr, entry].sort((a, b) => a.order - b.order)
    }

    const ctx: ShaderPipelineContext = {
      register(fn, order = 0, stage = 'fragment') {
        const entry: StageEntry = { fn, order, stage }
        if (stage === 'vertex') {
          vertexStages.value = sortedInsert(vertexStages.value, entry)
        } else {
          fragmentStages.value = sortedInsert(fragmentStages.value, entry)
        }
      },
      unregister(fn) {
        fragmentStages.value = fragmentStages.value.filter(s => s.fn !== fn)
        vertexStages.value   = vertexStages.value.filter(s => s.fn !== fn)
      }
    }

    provide('shaderPipeline', ctx)

    // Rebuild colorNode whenever fragment stages change
    watch(fragmentStages, (stages) => {
      material.colorNode = stages.reduce<Node>(
        (node, { fn }) => fn(node),
        vec4(0, 0, 0, 1)
      )
      material.needsUpdate = true
    }, { deep: true })

    // Rebuild positionNode whenever vertex stages change
    watch(vertexStages, (stages) => {
      if (stages.length === 0) {
        material.positionNode = null
        return
      }
      material.positionNode = stages.reduce<Node>(
        (node, { fn }) => fn(node),
        positionLocal
      )
      material.needsUpdate = true
    }, { deep: true })

    defineExpose({ material })
    </script>

    <template>
      <primitive :object="material" />
      <slot />
    </template>

---

### 6. Generators

#### TSL functions

    // layers/shader/tsl/generators/solidColour.ts
    import { Fn, vec4 } from 'three/tsl'

    export const solidColour = Fn(([colour]: [any]) => vec4(colour, 1.0))



    // layers/shader/tsl/generators/linearGradient.ts
    import { Fn, mix, uv, vec4, smoothstep } from 'three/tsl'

    export const linearGradient = Fn(([colourA, colourB, axis, smooth]: [any, any, any, any]) => {
      const t = axis // pass uv().y or uv().x from the component
      const factor = smooth.equal(1).select(t.smoothstep(0, 1), t)
      return mix(vec4(colourA, 1), vec4(colourB, 1), factor)
    })



    // layers/shader/tsl/generators/cosinePalette.ts
    import { Fn, add, mul, cos, vec3 } from 'three/tsl'

    // IQ cosine palette: a + b * cos(TAU * (c*t + d))
    // All params are vec3 nodes; t is a float node
    export const cosinePalette = Fn(([t, a, b, c, d]: [any, any, any, any, any]) => {
      const TAU = 6.28318530718
      return add(a, mul(b, cos(mul(TAU, add(mul(c, t), d)))))
    })

#### Vue components

    <!-- layers/shader/components/generators/SolidColour.vue -->
    <script setup lang="ts">
    import { uniform, vec3, vec4 } from 'three/tsl'
    import { Color } from 'three'
    import { watch } from 'vue'
    import { useShaderStage } from '../../composables/useShaderStage'
    import { useCSSColourUniform } from '../../composables/useCSSUniform'
    import { resolveColour } from '../../tsl/utils/colour'

    const props = defineProps<{
      color?: string
      cssColor?: string
      order?: number
    }>()

    const colorNode = props.cssColor
      ? useCSSColourUniform(props.cssColor)
      : uniform(new Color(resolveColour(props.color ?? '#000000')))

    if (!props.cssColor && props.color) {
      watch(() => props.color, v => {
        if (v) (colorNode as any).value.set(resolveColour(v))
      })
    }

    useShaderStage(
      (_prev) => vec4(colorNode, 1.0),
      props.order ?? 0
    )
    </script>

    <template />



    <!-- layers/shader/components/generators/CosinePalette.vue -->
    <script setup lang="ts">
    import { uniform, vec3, vec4, uv, time, length } from 'three/tsl'
    import { Color } from 'three'
    import { watch } from 'vue'
    import { useShaderStage } from '../../composables/useShaderStage'
    import { useCSSColourUniform } from '../../composables/useCSSUniform'
    import { cosinePalette as cosinePaletteFn } from '../../tsl/generators/cosinePalette'

    type Vec3Tuple = [number, number, number]

    const props = defineProps<{
      // Palette vectors -- static or CSS var
      a?: Vec3Tuple;  cssA?: string
      b?: Vec3Tuple;  cssB?: string
      c?: Vec3Tuple;  cssC?: string
      d?: Vec3Tuple;  cssD?: string
      // Scalar input source
      scalarSource?: 'uv.y' | 'uv.x' | 'radial' | 'prev.r'
      offset?: number
      timeScale?: number
      order?: number
    }>()

    const toNode = (css: string | undefined, val: Vec3Tuple = [0.5, 0.5, 0.5]) =>
      css
        ? useCSSColourUniform(css)
        : uniform(new Color().setRGB(...val))

    const aNode = toNode(props.cssA, props.a)
    const bNode = toNode(props.cssB, props.b)
    const cNode = toNode(props.cssC, props.c)
    const dNode = toNode(props.cssD, props.d)

    const offsetU    = uniform(props.offset    ?? 0)
    const timeScaleU = uniform(props.timeScale ?? 0)

    watch(() => props.offset,    v => { offsetU.value    = v ?? 0 })
    watch(() => props.timeScale, v => { timeScaleU.value = v ?? 0 })

    useShaderStage((_prev) => {
      // Derive t from chosen scalar source
      let t: any
      switch (props.scalarSource ?? 'uv.y') {
        case 'uv.x':   t = uv().x.add(offsetU).sub(time.mul(timeScaleU)); break
        case 'radial': t = length(uv().sub(0.5)).add(offsetU); break
        case 'prev.r': t = _prev.r.add(offsetU); break
        default:       t = uv().y.add(offsetU).sub(time.mul(timeScaleU))
      }

      const col = cosinePaletteFn(t, aNode, bNode, cNode, dNode)
      return vec4(col, 1.0)
    }, props.order ?? 0)
    </script>

    <template />

---

### 7. UV Transformers

#### TSL functions

    // layers/shader/tsl/uvTransformers/uvAspectCorrect.ts
    import { Fn, uv, vec2, screenSize } from 'three/tsl'

    export const uvAspectCorrect = Fn(() => {
      const aspect = screenSize.x.div(screenSize.y)
      return uv().sub(0.5).mul(vec2(aspect, 1.0))
    })



    // layers/shader/tsl/uvTransformers/uvNoiseRotate.ts
    import { Fn, vec2, cos, sin, time } from 'three/tsl'
    import { gradientNoise } from '../noise/gradientNoise'

    // Rotate UV by a noise-derived angle -- the Grainient core
    export const uvNoiseRotate = Fn(([uvIn, noiseScale, rotationAmount, speed]: [any, any, any, any]) => {
      const t     = time.mul(speed)
      const deg   = gradientNoise(vec2(t.mul(0.1), uvIn.x.mul(uvIn.y)).mul(noiseScale))
      const angle = deg.sub(0.5).mul(rotationAmount).add(180).mul(0.017453293) // to radians

      const aspect = vec2(1.0) // already aspect-corrected upstream
      const c = cos(angle)
      const s = sin(angle)

      const centred = uvIn
      const rotated = vec2(
        c.mul(centred.x).sub(s.mul(centred.y)),
        s.mul(centred.x).add(c.mul(centred.y))
      )
      // Restore aspect
      return rotated
    })



    // layers/shader/tsl/uvTransformers/uvSineWarpXY.ts
    import { Fn, vec2, sin, time } from 'three/tsl'

    // Asymmetric sine warp -- the Grainient/dawn family pattern
    export const uvSineWarpXY = Fn(([uvIn, frequency, amplitude, speed]: [any, any, any, any]) => {
      const t = time.mul(speed)
      const wx = sin(uvIn.y.mul(frequency).add(t)).div(amplitude)
      const wy = sin(uvIn.x.mul(frequency.mul(1.5)).add(t)).div(amplitude.mul(0.5))
      return uvIn.add(vec2(wx, wy))
    })

#### Vue component pattern

    <!-- layers/shader/components/uvTransformers/UVAspectCorrect.vue -->
    <script setup lang="ts">
    import { uv, vec2, screenSize } from 'three/tsl'
    import { useShaderStage } from '../../composables/useShaderStage'

    const props = defineProps<{ order?: number }>()

    useShaderStage(
      (_prev) => {
        const aspect = screenSize.x.div(screenSize.y)
        return uv().sub(0.5).mul(vec2(aspect, 1.0))
      },
      props.order ?? 0
    )
    </script>

    <template />



    <!-- layers/shader/components/uvTransformers/UVSineWarpXY.vue -->
    <script setup lang="ts">
    import { uniform } from 'three/tsl'
    import { watch } from 'vue'
    import { useShaderStage } from '../../composables/useShaderStage'
    import { uvSineWarpXY } from '../../tsl/uvTransformers/uvSineWarpXY'

    const props = defineProps<{
      frequency?: number
      amplitude?: number
      speed?: number
      order?: number
    }>()

    const freqU = uniform(props.frequency ?? 5.0)
    const ampU  = uniform(props.amplitude ?? 30.0)
    const spdU  = uniform(props.speed     ?? 2.0)

    watch(() => props.frequency, v => { freqU.value = v ?? 5.0 })
    watch(() => props.amplitude, v => { ampU.value  = v ?? 30.0 })
    watch(() => props.speed,     v => { spdU.value  = v ?? 2.0 })

    useShaderStage(
      (prev) => uvSineWarpXY(prev, freqU, ampU, spdU),
      props.order ?? 0
    )
    </script>

    <template />

---

### 8. Colour Ops

    // layers/shader/tsl/colourOps/brightnessContrast.ts
    import { Fn, clamp } from 'three/tsl'

    export const brightnessContrast = Fn(([col, brightness, contrast]: [any, any, any]) =>
      clamp(col.add(brightness).sub(0.5).mul(contrast).add(0.5), 0, 1)
    )



    // layers/shader/tsl/colourOps/tanhTonemap.ts
    import { Fn, tanh } from 'three/tsl'

    // Soft sigmoid tone compression -- gentler than ACES, preserves saturation
    export const tanhTonemap = Fn(([col, exposure]: [any, any]) =>
      tanh(col.mul(exposure))
    )



    <!-- layers/shader/components/colourOps/TanhTonemap.vue -->
    <script setup lang="ts">
    import { uniform } from 'three/tsl'
    import { watch } from 'vue'
    import { vec4 } from 'three/tsl'
    import { useShaderStage } from '../../composables/useShaderStage'
    import { tanhTonemap } from '../../tsl/colourOps/tanhTonemap'

    const props = defineProps<{ exposure?: number; order?: number }>()

    const expU = uniform(props.exposure ?? 1.0)
    watch(() => props.exposure, v => { expU.value = v ?? 1.0 })

    useShaderStage(
      (prev) => vec4(tanhTonemap(prev.rgb, expU), prev.a),
      props.order ?? 0
    )
    </script>

    <template />

---

### 9. Overlays

    // layers/shader/tsl/overlays/grain.ts
    import { Fn, fract, sin, dot, uv, time, vec2, clamp } from 'three/tsl'

    export const grain = Fn(([col, intensity, animated]: [any, any, any]) => {
      const seed   = animated.equal(1).select(uv().add(time.mul(0.001)), uv())
      const noise  = fract(sin(dot(seed, vec2(12.9898, 78.233))).mul(43758.5453))
      return clamp(col.add(noise.sub(0.5).mul(intensity)), 0, 1)
    })



    // layers/shader/tsl/overlays/vignette.ts
    import { Fn, uv, vec2, length, smoothstep, mix } from 'three/tsl'

    export const vignette = Fn(([col, strength, softness]: [any, any, any]) => {
      const dist = length(uv().sub(0.5)).mul(1.4142) // normalise: corner = 1
      const vig  = dist.smoothstep(strength.oneMinus().mul(softness), 1.0).mul(strength)
      return mix(col, col.mul(0), vig)
    })



    <!-- layers/shader/components/overlays/Grain.vue -->
    <script setup lang="ts">
    import { uniform, vec4 } from 'three/tsl'
    import { watch } from 'vue'
    import { useShaderStage } from '../../composables/useShaderStage'
    import { grain as grainFn } from '../../tsl/overlays/grain'

    const props = defineProps<{
      intensity?: number
      animated?: boolean
      order?: number
    }>()

    const intU  = uniform(props.intensity ?? 0.04)
    const animU = uniform(props.animated ? 1 : 0)

    watch(() => props.intensity, v => { intU.value  = v ?? 0.04 })
    watch(() => props.animated,  v => { animU.value = v ? 1 : 0 })

    useShaderStage(
      (prev) => vec4(grainFn(prev.rgb, intU, animU), prev.a),
      props.order ?? 0
    )
    </script>

    <template />

---

### 10. Barrel Export

    // layers/shader/index.ts
    // Core
    export { default as ShaderPipeline } from './components/ShaderPipeline.vue'
    export { useShaderStage }             from './composables/useShaderStage'
    export { useThemeProvider }           from './composables/useThemeProvider'
    export { useCSSColourUniform, useCSSFloatUniform } from './composables/useCSSUniform'

    // Generators
    export { default as SolidColour }   from './components/generators/SolidColour.vue'
    export { default as CosinePalette } from './components/generators/CosinePalette.vue'
    export { default as LinearGradient } from './components/generators/LinearGradient.vue'

    // UV Transformers
    export { default as UVAspectCorrect } from './components/uvTransformers/UVAspectCorrect.vue'
    export { default as UVSineWarpXY }    from './components/uvTransformers/UVSineWarpXY.vue'

    // Colour Ops
    export { default as TanhTonemap } from './components/colourOps/TanhTonemap.vue'

    // Overlays
    export { default as Grain }    from './components/overlays/Grain.vue'
    export { default as Vignette } from './components/overlays/Vignette.vue'

    // TSL primitives (for building custom blocks)
    export { cosinePalette }    from './tsl/generators/cosinePalette'
    export { gradientNoise }    from './tsl/noise/gradientNoise'
    export { screenAspectUV }   from './tsl/utils/screenAspectUV'
    export { sdSphere, sdBox2d } from './tsl/sdf/shapes'
    export { resolveColour }    from './tsl/utils/colour'

---

### 11. Usage Example -- Dawn2 Recreation

    <!-- A complete working shader using the block system -->
    <script setup lang="ts">
    import { TresCanvas } from '@tresjs/core'
    import {
      ShaderPipeline,
      CosinePalette,
      UVAspectCorrect,
      Grain,
      useThemeProvider
    } from '@/layers/shader'

    useThemeProvider()
    </script>

    <template>
      <TresCanvas>
        <TresMesh>
          <TresPlaneGeometry :args="[2, 2]" />
          <ShaderPipeline>
            <UVAspectCorrect :order="0" />
            <CosinePalette
              :a="[0.5, 0.5, 0.5]"
              :b="[0.5, 0.5, 0.5]"
              :c="[1.0, 0.7, 0.4]"
              :d="[0.0, 0.15, 0.2]"
              scalar-source="uv.y"
              :time-scale="0.1"
              :order="1"
            />
            <Grain :intensity="0.2" :animated="true" :order="2" />
          </ShaderPipeline>
        </TresMesh>
      </TresCanvas>
    </template>

---

### 12. Building New Blocks -- Rules

Every block follows this exact pattern:

**TSL function** (`tsl/<category>/<name>.ts`)

- Pure TSL node function, no Vue, no Three scene knowledge
- Takes node params, returns a node
- Exported as a named `Fn`

**Vue component** (`components/<category>/<Name>.vue`)

- `<template />` -- always empty
- Props → `uniform()` nodes with `watch` for reactivity
- CSS var props → `useCSSColourUniform()` / `useCSSFloatUniform()`
- Calls `useShaderStage(stageFn, order, stage)` in `<script setup>`
- `stageFn` signature: `(prev: Node) => Node`
  - Generators ignore `prev` and return a new colour node
  - UV Transformers return a new UV node (the whole pipeline is UV-shaped at that point)
  - Colour Ops and Overlays receive and return a `vec4` colour node
