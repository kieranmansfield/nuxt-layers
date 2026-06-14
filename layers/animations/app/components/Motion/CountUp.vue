<script setup lang="ts">
  const {
    to,
    from = 0,
    duration = 2,
    ease = 'power2.out',
    format = undefined,
    once = true,
    prefix = '',
    suffix = '',
    as = 'span',
  } = defineProps<{
    to: number
    from?: number
    duration?: number
    ease?: string
    format?: (n: number) => string
    once?: boolean
    prefix?: string
    suffix?: string
    as?: string
  }>()

  // const el = ref<HTMLElement | null>(null)
  const el = useTemplateRef<HTMLElement | null>(null)
  const { displayValue, isComplete } = useCountUp(el, {
    to,
    from,
    duration,
    ease,
    once,
    ...(format !== undefined ? { format } : {}),
  })
</script>

<template>
  <component :is="as" ref="el" :class="{ 'is-complete': isComplete }">
    {{ prefix }}{{ displayValue }}{{ suffix }}
  </component>
</template>
