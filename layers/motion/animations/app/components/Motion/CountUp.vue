<script setup lang="ts">
  import type { MotionDuration } from '#layers/core/app/types/tokens'

  const {
    to,
    from = 0,
    duration = 2000,
    ease = 'power2.out',
    format = undefined,
    once = true,
    prefix = '',
    suffix = '',
    as = 'span',
  } = defineProps<{
    to: number
    from?: number
    /** Milliseconds, or a duration token */
    duration?: MotionDuration | number
    ease?: string
    format?: (n: number) => string
    once?: boolean
    prefix?: string
    suffix?: string
    as?: string
  }>()

  const el = useTemplateRef<HTMLElement>('el')
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
