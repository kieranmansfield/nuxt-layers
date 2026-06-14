<script lang="ts" setup>
  import { useColor } from '../../composables/color'
  import { useTypography } from '../../composables/typography'
  import type { UiColors } from '../../types/colors'
  import type {
    FontLeading,
    FontScreenSize,
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
    size = 'screen-xxl',
    weight = 'font-bold',
    width = 'font-stretch-normal',
    slant = 'normal',
    leading = 'leading-tight',
    tracking = 'tracking-tight',
    align = 'left',
    transform = 'none',
    color,
    class: classProp = '',
  } = defineProps<{
    level?: 1 | 2 | 3 | 4 | 5 | 6
    size?: FontScreenSize
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

  const sizeMap: Record<string, string> = {
    screen: 'text-screen',
    'screen-xl': 'text-screen-xl',
    'screen-xxl': 'text-screen-xxl',
    'screen-xxxl': 'text-screen-xxxl',
  }
  const sizeClass = computed(() => sizeMap[size] ?? 'text-screen-xxl')

  const { classes } = useTypography({
    weight: weight,
    width: width,
    slant: slant,
    leading: leading,
    tracking: tracking,
    align: align,
    transform: transform,
  })

  const colorClass = useColor(color, 'text')
</script>

<template>
  <component :is="tag" :class="[sizeClass, classes, colorClass, classProp]" v-bind="$attrs">
    <slot />
  </component>
</template>
