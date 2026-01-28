<!-- eslint-disable vue/require-default-prop -->
<!-- eslint-disable vue/no-unused-properties -->
<script lang="ts" setup>
import type {
  TypographyTag,
  FontWeight,
  FontWidth,
  FontSlant,
  FontLeading,
  FontTracking,
  TextAlign,
  TextTransform,
} from '#layers/ui/app/types/typography'
import type { UiColors } from '#layers/ui/app/types/colors'
import { useTypography } from '#layers/ui/app/composables/typography'
import { useColor } from '#layers/ui/app/composables/color'

// eslint-disable-next-line vue/define-macros-order
const props = withDefaults(
  defineProps<{
    tag?: TypographyTag
    weight?: FontWeight
    width?: FontWidth
    slant?: FontSlant
    leading?: FontLeading
    tracking?: FontTracking
    align?: TextAlign
    transform?: TextTransform
    color?: UiColors
  }>(),
  {
    tag: 'p',
    weight: 'font-normal',
    width: 'normal',
    slant: 'normal',
    leading: 'leading-normal',
    tracking: 'tracking-normal',
    align: 'left',
    transform: 'none',
  }
)
const { classes } = useTypography(props)
const colorClass = useColor(props.color, 'text')
</script>

<template>
  <component :is="tag" :class="[classes, colorClass]" v-bind="$attrs">
    <slot />
  </component>
</template>
