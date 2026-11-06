<script setup lang="ts">
  import { float, smoothstep, step, vec2, vec4 } from 'three/tsl'

  import type { TSLNode } from '../../shaders/types'

  /**
   * Procedural lens flare — starburst + ghost circle artefacts along the flare axis.
   */
  const {
    position = [0.7, 0.8],
    color = '#fffde0',
    intensity = 0.6,
    ghostCount = 4,
    order = 0,
  } = defineProps<{
    /** Light source position in UV space */
    position?: [number, number]
    /** Flare colour */
    color?: string
    /** Overall brightness */
    intensity?: number
    /** How many ghost circles along the axis (0-8) */
    ghostCount?: number
    order?: number
  }>()

  // The first `ghostCount` of these are shown. `at` is the distance along the flare axis, where 1 is
  // screen centre. ponytail: fixed table so the count can change without a shader recompile; a
  // TSL Loop would allow any count if 8 ever falls short.
  const GHOSTS = [
    { at: 0.4, radius: 0.05, weight: 0.4 },
    { at: 0.7, radius: 0.03, weight: 0.3 },
    { at: 1.1, radius: 0.04, weight: 0.2 },
    { at: 1.5, radius: 0.06, weight: 0.15 },
    { at: 0.25, radius: 0.02, weight: 0.25 },
    { at: 0.9, radius: 0.025, weight: 0.2 },
    { at: 1.3, radius: 0.035, weight: 0.12 },
    { at: 1.8, radius: 0.05, weight: 0.1 },
  ]

  const posNode = useVector2Prop(() => position)
  const colorNode = useColorProp(() => color)
  const intensityNode = useUniformProp(() => intensity)
  const ghostCountNode = useUniformProp(() => ghostCount)

  const pipeline = useShaderPipelineContext()

  useShaderStage((prev) => {
    const uv = pipeline.uvNode.value
    const src = vec2(posNode.x, posNode.y)

    // Starburst: bright disc at source
    const distToSrc = uv.sub(src).length()
    const burst = smoothstep(float(0.08), float(0), distToSrc).mul(intensityNode)

    // Ghost circles along the axis toward and past screen centre
    const axis = vec2(0.5, 0.5).sub(src)
    const ghosts = GHOSTS.reduce<TSLNode>((sum, { at, radius, weight }, index) => {
      const dist = uv.sub(src.add(axis.mul(at))).length()
      const shown = step(float(index + 0.5), ghostCountNode)
      return sum.add(smoothstep(float(radius), float(0), dist).mul(weight).mul(shown))
    }, float(0)).mul(intensityNode)
    const flare = colorNode.mul(burst.add(ghosts))

    return vec4(prev.xyz.add(flare), prev.w)
  }, order)
</script>
