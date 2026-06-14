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
  } from '../../types/typography'

  defineOptions({ inheritAttrs: false })

  const {
    level = 1,
    weight = 'font-bold',
    width = 'font-stretch-normal',
    slant = 'normal',
    leading = 'leading-tight',
    tracking = 'tracking-tight',
    align = 'left',
    transform = 'none',
    color,
    size,
    class: classProp = '',
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
    class?: string
  }>()
  const tag = computed(() => `h${level}` as const)

  const sizeClass = computed(() => {
    if (size) return null

    const sizes: Record<number, string> = {
      1: 'text-4xl sm:text-5xl',
      2: 'text-3xl sm:text-4xl',
      3: 'text-2xl sm:text-3xl',
      4: 'text-xl sm:text-2xl',
      5: 'text-lg sm:text-xl',
      6: 'text-base sm:text-lg',
    }
    return sizes[level]
  })

  const { classes } = useTypography({
    weight: weight,
    width: width,
    slant: slant,
    leading: leading,
    tracking: tracking,
    align: align,
    transform: transform,
    ...(size !== undefined && { size: size }),
  })
  const colorClass = useColor(color, 'text')
</script>

<template>
  <Typography
    :tag
    :weight
    :width
    :slant
    :leading
    :tracking
    :align
    :transform
    :class="[sizeClass, classes, colorClass, classProp]"
    v-bind="{ ...(size !== undefined && { size: size }), ...$attrs }"
  >
    <slot />
  </Typography>
</template>
