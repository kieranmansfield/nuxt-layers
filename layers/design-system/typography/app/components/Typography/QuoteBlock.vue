<script setup lang="ts">
  import { useColor } from '../../composables/color'
  import { useTypography } from '../../composables/typography'
  import type { TypographyStyleProps } from '../../types/typography'

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
    step = undefined,
    font = undefined,
  } = defineProps<TypographyStyleProps>()
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
    ...(step !== undefined && { step }),
  }))
  const colorClass = useColor(() => color, 'text')
</script>

<template>
  <blockquote :class="[classes, colorClass]">
    <slot />
  </blockquote>
</template>
