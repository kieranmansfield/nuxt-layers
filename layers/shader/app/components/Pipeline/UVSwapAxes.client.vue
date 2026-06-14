<script setup lang="ts">
  import { vec2 } from 'three/tsl'

  const { order = 0 } = defineProps<{ order?: number }>()

  useShaderStage((uvIn) => vec2(uvIn.y, uvIn.x), order, 'uv')
</script>
