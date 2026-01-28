<script lang="ts" setup>
import type { UiColors } from '#layers/ui/app/types/colors'
import { useColor } from '#layers/ui/app/composables/color'

// eslint-disable-next-line vue/define-macros-order
const props = withDefaults(
  defineProps<{
    language?: string
    color?: UiColors
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
    class="overflow-x-auto"
    :class="[props.class]"
    :data-language="props.language"
  >
    <Typography
      tag="code"
      v-bind="$attrs"
      class="font-mono"
      :class="[colorClass, props.language ? `language-${props.language}` : '']"
    >
      <slot />
    </Typography>
  </Typography>
</template>
