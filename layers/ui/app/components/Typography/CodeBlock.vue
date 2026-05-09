<script lang="ts" setup>
import { useColor } from '../../composables/color'
import type { UiColors } from '../../types/colors'
import type { FontSize } from '../../types/typography'

defineOptions({ inheritAttrs: false })

const props = withDefaults(
  defineProps<{
    language?: string
    color?: UiColors
    size?: FontSize
    class?: string
  }>(),
  {
    class: '',
    color: 'default',
  }
)
const colorClass = useColor(props.color, 'text')
</script>

<template>
  <Typography
    tag="pre"
    v-bind="{
      ...$attrs,
      ...(props.size !== undefined && { size: props.size }),
      ...(props.language !== undefined && { 'data-language': props.language }),
    }"
    class="overflow-x-auto"
    :class="[props.class]"
  >
    <Typography
      tag="code"
      class="font-mono"
      :class="[colorClass, props.language ? `language-${props.language}` : '']"
    >
      <slot />
    </Typography>
  </Typography>
</template>
