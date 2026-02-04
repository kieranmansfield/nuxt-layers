<script setup lang="ts">
import { EffectComposer } from '@tresjs/post-processing'

const props = withDefaults(
  defineProps<{
    enabled?: boolean
  }>(),
  {
    enabled: true,
  }
)
</script>

<template>
  <Suspense>
    <EffectComposer v-if="enabled">
      <slot />
    </EffectComposer>
  </Suspense>
</template>
