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

const progressProps = computed(() => ({
  ...(modelValue.value !== undefined && { modelValue: modelValue.value }),
  ...(color !== undefined && { color: color as 'primary' | 'neutral' }),
  ...(size !== undefined && { size }),
  ...(orientation !== undefined && { orientation }),
  ...(status !== undefined && { status }),
  ...(animation !== undefined && { animation }),
  ...(inverted !== undefined && { inverted }),
}))
</script>

<template>
  <UProgress v-bind="progressProps" />
</template>
