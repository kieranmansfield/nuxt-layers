<script lang="ts" setup>
  import { useColor } from '../../composables/color'
  import { useTypography } from '../../composables/typography'
  import type { UiColors } from '../../types/colors'
  import type {
    FontLeading,
    FontSize,
    FontSlant,
    FontTracking,
    FontWeight,
    FontWidth,
    TextAlign,
    TextTransform,
    TypographyTag,
  } from '../../types/typography'

  defineOptions({ inheritAttrs: false })

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
    size = 'base',
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
  }>()
  const { classes } = useTypography(() => ({
    weight,
    width,
    slant,
    leading,
    tracking,
    align,
    transform,
    size,
  }))
  const colorClass = useColor(color, 'text')
</script>

<template>
  <component :is="tag" :class="[classes, colorClass]" v-bind="$attrs">
    <slot />
  </component>
</template>
