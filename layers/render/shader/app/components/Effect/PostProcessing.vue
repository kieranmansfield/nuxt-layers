<script setup lang="ts">
  import { EffectComposer } from '@tresjs/post-processing'

  const { enabled = true } = defineProps<{
    enabled?: boolean
  }>()
</script>

<template>
  <Suspense>
    <EffectComposer v-if="enabled">
      <slot />
    </EffectComposer>
  </Suspense>
</template>
