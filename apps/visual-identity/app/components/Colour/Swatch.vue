<script setup lang="ts">
  defineProps<{
    hex: string
    label?: string
    size?: 'sm' | 'md' | 'lg'
  }>()
</script>

<template>
  <div class="flex flex-col items-center gap-1">
    <div
      class="rounded-lg border border-black/10 dark:border-white/10 shrink-0"
      :class="{
        'size-8': size === 'sm',
        'size-12': size === 'md' || !size,
        'size-16': size === 'lg',
      }"
      :style="{ backgroundColor: hex }"
    />
    <span v-if="label" class="text-[10px] text-(--ui-text-muted) font-mono">{{ label }}</span>
  </div>
</template>
