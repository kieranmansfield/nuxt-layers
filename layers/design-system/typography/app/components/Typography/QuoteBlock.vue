<script setup lang="ts">
  import { useColor } from '../../composables/color'
  import { useTypography } from '../../composables/typography'
  import type { UiColors } from '../../types/colors'
  import type {
    FluidFontSize,
    FontFamily,
    FontLeading,
    FontSize,
    FontSlant,
    FontTracking,
    FontWeight,
    FontWidth,
    TextAlign,
    TextTransform,
  } from '../../types/typography'

  const {
    weight = 'font-normal',
    width = 'font-stretch-normal',
    slant = 'italic',
    leading = 'leading-normal',
    tracking = 'tracking-normal',
    align = 'left',
    transform = 'none',
    color = undefined,
    size = undefined,
    fluidSize = undefined,
    font = undefined,
  } = defineProps<{
    weight?: FontWeight
    width?: FontWidth
    slant?: FontSlant
    leading?: FontLeading
    tracking?: FontTracking
    align?: TextAlign
    transform?: TextTransform
    color?: UiColors
    size?: FontSize
    fluidSize?: FluidFontSize
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
    ...(font !== undefined && { font }),
    ...(size !== undefined && { size }),
    ...(fluidSize !== undefined && { fluidSize }),
  }))
  const colorClass = useColor(color, 'text')
</script>

<template>
  <blockquote :class="[classes, colorClass]">
    <slot />
  </blockquote>
</template>
