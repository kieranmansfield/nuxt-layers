<script setup lang="ts">
  const {
    hex,
    label = '',
    size = 'md',
  } = defineProps<{
    hex: string
    label?: string
    size?: 'sm' | 'md' | 'lg'
  }>()
</script>

<template>
  <div class="flex flex-col items-center gap-1">
    <div
      class="shrink-0 rounded-lg border border-black/10 dark:border-white/10"
      :class="{
        'size-8': size === 'sm',
        'size-12': size === 'md' || !size,
        'size-16': size === 'lg',
      }"
      :style="{ backgroundColor: hex }"
    />
    <span v-if="label" class="text-muted font-mono text-[10px]">{{ label }}</span>
  </div>
</template>
