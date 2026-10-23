<script setup lang="ts">
  import type { ProgressProps } from '@nuxt/ui'

  // The one decision over UProgress: progress is 0–1 (null = indeterminate). Every other
  // UProgress prop stays typed here but falls through as an attr (@vue-ignore).
  const { progress = null } = defineProps<
    { progress?: number | null } & /* @vue-ignore */ Omit<ProgressProps, 'modelValue'>
  >()
</script>

<template>
  <UProgress :model-value="progress == null ? null : progress * 100" />
</template>
