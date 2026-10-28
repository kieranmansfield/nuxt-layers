<script setup lang="ts">
  import { float, vec2 } from 'three/tsl'

  /**
   * Mirrors UVs on one or both axes (v7 merged UVFlipX/UVFlipY/UVFlipXY). `axis` is read once,
   * when the node graph is built; give the node a `:key` to change it at runtime.
   */
  const { axis = 'x', order = 0 } = defineProps<{ axis?: 'x' | 'y' | 'xy'; order?: number }>()

  const flipX = axis !== 'y'
  const flipY = axis !== 'x'

  useShaderStage(
    (uvIn) => vec2(flipX ? float(1).sub(uvIn.x) : uvIn.x, flipY ? float(1).sub(uvIn.y) : uvIn.y),
    order,
    'uv'
  )
</script>
