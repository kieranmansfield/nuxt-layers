<script lang="ts" setup>
defineOptions({ inheritAttrs: false })
import { useColor } from '#layers/ui/app/composables/color'
import type { UiColors } from '#layers/ui/app/types/colors'
import type { FontSize } from '#layers/ui/app/types/typography'

const props = withDefaults(
  defineProps<{
    language?: string
    color?: UiColors
    size?: FontSize
    class?: string
  }>(),
  {
    language: undefined,
    class: '',
    color: 'default',
  }
)
const colorClass = useColor(props.color, 'text')
</script>

<template>
  <Typography
    tag="pre"
    v-bind="$attrs"
    :size="props.size"
    class="overflow-x-auto"
    :class="[props.class]"
    :data-language="props.language"
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
