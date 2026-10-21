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

  // Display hierarchy by default: each level sits one scale step below the previous, starting
  // at the fluid display step, so every level stays fluid (h1 51 → 97px, h2 40 → 77px …). Set as
  // --step rather than a class so typography.css's h1–h6 base rules size it. Only when neither
  // `step` nor `size` is passed; an explicit step beats size.
  const defaultStepStyle = computed(() => {
    if (step !== undefined || size !== undefined) return undefined
    const below = level - 1
    return { '--step': below ? `calc(var(--step-display) - ${below})` : 'var(--step-display)' }
  })

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
    ...(step !== undefined && { step }),
  }))
  const colorClass = useColor(() => color, 'text')
</script>

<template>
  <component :is="tag" :class="[classes, colorClass]" :style="defaultStepStyle">
    <slot />
  </component>
</template>
