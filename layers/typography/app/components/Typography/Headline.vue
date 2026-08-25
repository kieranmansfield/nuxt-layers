<script lang="ts" setup>
  import { useColor } from '../../composables/color'
  import { useTypography } from '../../composables/typography'
  import type { UiColors } from '../../types/colors'
  import type {
    FluidFontSize,
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
    color = undefined,
    size = undefined,
    fluidSize = undefined,
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
    fluidSize?: FluidFontSize
    class?: string
  }>()
  const tag = computed(() => `h${level}` as const)

  // Fluid by default (continuous scaling, no mobile-first breakpoint step) —
  // only used when the caller passes neither `size` nor `fluidSize`.
  const defaultFluidSizes: Record<number, FluidFontSize> = {
    1: '6xl',
    2: '5xl',
    3: '4xl',
    4: '3xl',
    5: 'xl',
    6: 'lg',
  }

  const appliedFluidSize = computed(() =>
    size !== undefined ? undefined : (fluidSize ?? defaultFluidSizes[level])
  )

  const { classes } = useTypography({
    weight: weight,
    width: width,
    slant: slant,
    leading: leading,
    tracking: tracking,
    align: align,
    transform: transform,
    ...(size !== undefined && { size: size }),
    ...(appliedFluidSize.value !== undefined && { fluidSize: appliedFluidSize.value }),
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
    :class="[classes, colorClass, classProp]"
    v-bind="{
      ...(size !== undefined && { size: size }),
      ...(appliedFluidSize !== undefined && { fluidSize: appliedFluidSize }),
      ...$attrs,
    }"
  >
    <slot />
  </Typography>
</template>
