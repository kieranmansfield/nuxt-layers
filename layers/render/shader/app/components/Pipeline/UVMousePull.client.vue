<script setup lang="ts">
  import { vec2 } from 'three/tsl'

  import { useWindowMouseUniform } from '../../composables/useWindowMouseUniform'

  /**
   * Warps UV toward the mouse cursor — different from UVParallax, which shifts
   * the whole field. This pulls individual UV coords toward the pointer position.
   * q += (pointer - uv) * influence * 0.2
   */
  const { influence = 0.5, order = 0 } = defineProps<{
    /** Pull strength toward the cursor */
    influence?: number
    order?: number
  }>()

  const mouse = useWindowMouseUniform()
  const influenceNode = useUniformProp(() => influence)

  useShaderStage(
    (uvIn) => {
      const pointer = vec2(mouse.x, mouse.y)
      return uvIn.add(pointer.sub(uvIn).mul(influenceNode).mul(0.2))
    },
    order,
    'uv'
  )
</script>
