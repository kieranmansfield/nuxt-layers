<script lang="ts" setup>
  import { useColor } from '../../composables/color'
  import { useTypography } from '../../composables/typography'
  import type { UiColors } from '../../types/colors'
  import type {
    FluidFontSize,
    FontLeading,
    FontSlant,
    FontTracking,
    FontWeight,
    FontWidth,
    TextAlign,
    TextTransform,
  } from '../../types/typography'

  defineOptions({ inheritAttrs: false })

  const {
    level = 1,
    fluidSize = '2xl',
    weight = 'font-bold',
    width = 'font-stretch-normal',
    slant = 'normal',
    leading = 'leading-tight',
    tracking = 'tracking-tight',
    align = 'left',
    transform = 'none',
    color = undefined,
    class: classProp = '',
  } = defineProps<{
    level?: 1 | 2 | 3 | 4 | 5 | 6
    fluidSize?: FluidFontSize
    weight?: FontWeight
    width?: FontWidth
    slant?: FontSlant
    leading?: FontLeading
    tracking?: FontTracking
    align?: TextAlign
    transform?: TextTransform
    color?: UiColors
    class?: string
  }>()

  const tag = computed(() => `h${level}` as const)

  const { classes } = useTypography({
    weight: weight,
    width: width,
    slant: slant,
    leading: leading,
    tracking: tracking,
    align: align,
    transform: transform,
    fluidSize: fluidSize,
  })

  const colorClass = useColor(color, 'text')
</script>

<template>
  <component :is="tag" :class="[classes, colorClass, classProp]" v-bind="$attrs">
    <slot />
  </component>
</template>
