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
  } from '../../types/typography'

  const {
    language = undefined,
    weight = 'font-normal',
    width = 'font-stretch-normal',
    slant = 'normal',
    leading = 'leading-normal',
    tracking = 'tracking-normal',
    align = 'left',
    transform = 'none',
    color = 'default',
    size = undefined,
    step = undefined,
    font = 'mono',
  } = defineProps<{
    language?: string
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
    font,
    ...(size !== undefined && { size }),
    ...(step !== undefined && { step }),
  }))
  const colorClass = useColor(() => color, 'text')
</script>

<template>
  <pre
    class="overflow-x-auto"
    :data-language="language"
  ><code :class="[classes, colorClass, language ? `language-${language}` : '']"><slot /></code></pre>
</template>
