<!-- eslint-disable vue/no-boolean-default -->
<!-- eslint-disable vue/define-props-destructuring -->
<!-- eslint-disable @typescript-eslint/no-unused-vars -->
<!-- eslint-disable @typescript-eslint/ban-ts-comment -->
<script setup lang="ts">
  // @ts-nocheck
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
