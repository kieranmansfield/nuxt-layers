<script setup lang="ts">
  import type { TSLNode } from '../../types'
  import { abs, float, floor, fract, mix, mod, smoothstep, uniform, vec3, vec4 } from 'three/tsl'

  const {
    scale = 40,
    contrast = 0.6,
    order = 0,
  } = defineProps<{
    /** Weave cells across the screen */
    scale?: number
    /** Highlight contrast between threads (0-1) */
    contrast?: number
    order?: number
  }>()

  const scaleNode = uniform(scale)
  const contrastNode = uniform(contrast)
  watch(
    () => scale,
    (v) => {
      scaleNode.value = v
    }
  )
  watch(
    () => contrast,
    (v) => {
      contrastNode.value = v
    }
  )

  const pipeline = useShaderPipelineContext()

  useShaderStage(() => {
    const p: TSLNode = pipeline.uvNode.value.mul(scaleNode)
    const cell: TSLNode = floor(p)
    const f: TSLNode = fract(p)
    // 2x2 twill: alternate which direction the thread highlight runs per cell
    const flip = mod(cell.x.add(cell.y), 2)
    const t = mix(f.x, f.y, flip)
    // Thread cross-section lighting: bright across the middle of each thread
    const light = float(1).sub(smoothstep(0.0, 0.5, abs(t.sub(0.5))))
    const shade = float(0.12).add(light.mul(contrastNode).mul(0.25))
    return vec4(vec3(shade), 1.0)
  }, order)
</script>
