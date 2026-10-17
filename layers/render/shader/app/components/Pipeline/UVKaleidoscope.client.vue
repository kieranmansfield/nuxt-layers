<script setup lang="ts">
  import { kaleidoscopeUV } from '../../shaders/common/uv'

  const {
    segments = 6,
    rotation = 0,
    order = 0,
  } = defineProps<{
    /** Number of mirrored wedges */
    segments?: number
    /** Rotation of the fold, in turns (1 = full revolution) */
    rotation?: number
    order?: number
  }>()

  useShaderStage((uvIn) => kaleidoscopeUV(uvIn, segments, [0.5, 0.5], rotation), order, 'uv')
</script>
