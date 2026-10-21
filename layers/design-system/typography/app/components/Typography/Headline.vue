<script lang="ts" setup>
  // Explicit import so Headline mounts under vitest's 'vue' project (no Nuxt auto-imports)
  // — same exemption as ElementTw.vue (eslint.config.mjs).
  import { computed } from 'vue'

  import { useColor } from '../../composables/color'
  import { useTypography } from '../../composables/typography'
  import type { UiColors } from '../../types/colors'
  import type {
    FontFamily,
    FontLeading,
    FontSize,
    FontSlant,
    FontTracking,
    FontWeight,
    FontWidth,
    TextAlign,
    TextTransform,
    TypeStep,
  } from '../../types/typography'

  const {
    level = 1,
    weight = 'font-bold',
    width = 'font-stretch-normal',
    slant = 'normal',
    leading = undefined,
    tracking = 'tracking-tight',
    align = 'left',
    transform = 'none',
    color = undefined,
    size = undefined,
    step = undefined,
    font = undefined,
  } = defineProps<{
    level?: 1 | 2 | 3 | 4 | 5 | 6
    weight?: FontWeight
    width?: FontWidth
    slant?: FontSlant
    leading?: FontLeading
    tracking?: FontTracking
    align?: TextAlign
    transform?: TextTransform
    color?: UiColors
    size?: FontSize
    step?: TypeStep
    font?: FontFamily
  }>()
  const tag = computed(() => `h${level}` as const)

  // Modular step by default, mirroring typography.css's h1–h6 base defaults — only
  // used when the caller passes neither `size` nor `step`. An explicit step beats size.
  const defaultSteps: Record<number, TypeStep> = {
    1: 'display',
    2: 3,
    3: 2,
    4: 1,
    5: 0,
    6: 0,
  }

  const appliedStep = computed(() => step ?? (size === undefined ? defaultSteps[level] : undefined))

  const { classes } = useTypography(() => ({
    weight,
    width,
    slant,
    ...(leading !== undefined && { leading }),
    tracking,
    align,
    transform,
    ...(font !== undefined && { font }),
    ...(size !== undefined && { size }),
    ...(appliedStep.value !== undefined && { step: appliedStep.value }),
  }))
  const colorClass = useColor(() => color, 'text')
</script>

<template>
  <component :is="tag" :class="[classes, colorClass]">
    <slot />
  </component>
</template>
