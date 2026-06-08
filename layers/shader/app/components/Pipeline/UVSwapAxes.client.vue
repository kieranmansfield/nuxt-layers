<!-- eslint-disable vue/define-props-destructuring -->
<!-- eslint-disable @typescript-eslint/ban-ts-comment -->
<script setup lang="ts">
  // @ts-nocheck
  import { vec2 } from 'three/tsl'

  const { order = 0 } = defineProps<{ order?: number }>()

  useShaderStage((uvIn) => vec2(uvIn.y, uvIn.x), order, 'uv')
</script>
