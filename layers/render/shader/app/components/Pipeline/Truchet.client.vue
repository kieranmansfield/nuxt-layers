<script setup lang="ts">
  import type { TSLNode } from '../../types'
  import { Color } from 'three'
  import { abs, float, floor, fract, length, mix, smoothstep, step, uniform, vec2, vec4 } from 'three/tsl'
  import { hash21 } from '../../shaders/common/noise'

  import { hexToVec3Uniform } from '../../utils/tsl/color'

  const {
    scale = 8,
    thickness = 0.08,
    colorA = '#111827',
    colorB = '#fbbf24',
    order = 0,
  } = defineProps<{
    /** Tiles across the screen */
    scale?: number
    /** Line half-thickness (tile units) */
    thickness?: number
    /** Background colour */
    colorA?: string
    /** Foreground colour */
    colorB?: string
    order?: number
  }>()

  const scaleNode = uniform(scale)
  const thicknessNode = uniform(thickness)
  const colorANode = hexToVec3Uniform(colorA)
  const colorBNode = hexToVec3Uniform(colorB)
  watch(
    () => scale,
    (v) => {
      scaleNode.value = v
    }
  )
  watch(
    () => thickness,
    (v) => {
      thicknessNode.value = v
    }
  )
  watch(
    () => colorA,
    (v) => {
      const c = new Color(v)
      colorANode.value.set(c.r, c.g, c.b)
    }
  )
  watch(
    () => colorB,
    (v) => {
      const c = new Color(v)
      colorBNode.value.set(c.r, c.g, c.b)
    }
  )

  const pipeline = useShaderPipelineContext()

  useShaderStage(() => {
    const p: TSLNode = pipeline.uvNode.value.mul(scaleNode)
    const cell: TSLNode = floor(p)
    const f: TSLNode = fract(p)
    // Random flip per tile selects which pair of quarter-arcs is drawn
    const flip = step(0.5, hash21(cell))
    const q = vec2(mix(f.x, float(1).sub(f.x), flip), f.y)
    const d1 = abs(length(q).sub(0.5))
    const d2 = abs(length(q.sub(1)).sub(0.5))
    const d = d1.min(d2)
    const mask = float(1).sub(smoothstep(thicknessNode, thicknessNode.add(0.02), d))
    return vec4(mix(colorANode, colorBNode, mask), 1.0)
  }, order)
</script>
