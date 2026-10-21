<script lang="ts" setup>
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
    TypographyTag,
  } from '../../types/typography'

  const {
    tag = 'p',
    weight = 'font-normal',
    width = 'font-stretch-normal',
    slant = 'normal',
    leading = 'leading-normal',
    tracking = 'tracking-normal',
    align = 'left',
    transform = 'none',
    color = undefined,
    // No default size: body copy inherits the body step (20 → 24px) rather than pinning
    // Tailwind's 16px text-base inside it.
    size = undefined,
    step = undefined,
    font = undefined,
  } = defineProps<{
    tag?: TypographyTag
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
  const { classes } = useTypography(() => ({
    weight,
    width,
    slant,
    leading,
    tracking,
    align,
    transform,
    ...(size !== undefined && { size }),
    ...(font !== undefined && { font }),
    ...(step !== undefined && { step }),
  }))
  const colorClass = useColor(() => color, 'text')
</script>

<template>
  <ElementTw :as="tag" :component-props="{ class: [classes, colorClass] }">
    <slot />
  </ElementTw>
</template>
