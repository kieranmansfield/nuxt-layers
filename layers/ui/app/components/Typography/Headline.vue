<script lang="ts" setup>
import { useColor } from '#layers/ui/app/composables/color'
import { useTypography } from '#layers/ui/app/composables/typography'
import type { UiColors } from '#layers/ui/app/types/colors'
import type {
  FontLeading,
  FontSlant,
  FontTracking,
  FontWeight,
  FontWidth,
  TextAlign,
  TextTransform,
} from '#layers/ui/app/types/typography'
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    level?: 1 | 2 | 3 | 4 | 5 | 6
    weight?: FontWeight
    width?: FontWidth
    slant?: FontSlant
    leading?: FontLeading
    tracking?: FontTracking
    align?: TextAlign
    transform?: TextTransform
    color?: UiColors
    class?: string
  }>(),
  {
    level: 1,
    weight: 'font-bold',
    width: 'normal',
    slant: 'normal',
    leading: 'leading-tight',
    tracking: 'tracking-tight',
    align: 'left',
    transform: 'none',
    class: '',
  }
)
const tag = computed(() => `h${props.level}` as const)

const sizeClass = computed(() => {
  const sizes: Record<number, string> = {
    1: 'text-4xl sm:text-5xl',
    2: 'text-3xl sm:text-4xl',
    3: 'text-2xl sm:text-3xl',
    4: 'text-xl sm:text-2xl',
    5: 'text-lg sm:text-xl',
    6: 'text-base sm:text-lg',
  }
  return sizes[props.level]
})

const { classes } = useTypography(props)
const colorClass = useColor(props.color, 'text')
</script>

<template>
  <Typography
    :tag
    :weight="props.weight"
    :width="props.width"
    :slant="props.slant"
    :leading="props.leading"
    :tracking="props.tracking"
    :align="props.align"
    :transform="props.transform"
    :class="[sizeClass, classes, colorClass, props.class]"
    v-bind="$attrs"
  >
    <slot />
  </Typography>
</template>
