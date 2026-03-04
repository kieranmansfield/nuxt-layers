<script setup lang="ts">
const {
  progress = null,
  color,
  size,
  orientation,
  status,
  animation,
  inverted,
} = defineProps<{
  progress?: number | null
  color?: 'primary' | 'secondary' | 'success' | 'info' | 'warning' | 'error' | 'neutral'
  size?: '2xs' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl'
  orientation?: 'horizontal' | 'vertical'
  status?: boolean
  animation?: 'carousel' | 'carousel-inverse' | 'swing' | 'elastic'
  inverted?: boolean
}>()

const modelValue = computed(() => (progress != null ? progress * 100 : undefined))
</script>

<template>
  <UProgress :model-value="modelValue" :color :size :orientation :status :animation :inverted />
</template>
