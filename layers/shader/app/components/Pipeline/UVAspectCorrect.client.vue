<script setup lang="ts">
  import { screenSize, vec2 } from 'three/tsl'

  const { order = 0 } = defineProps<{ order?: number }>()

  useShaderStage((uvIn) => uvIn.mul(vec2(screenSize.x.div(screenSize.y), 1.0)), order, 'uv')
</script>
