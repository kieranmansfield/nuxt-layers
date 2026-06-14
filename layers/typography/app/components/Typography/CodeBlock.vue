<script lang="ts" setup>
  import { useColor } from '../../composables/color'
  import type { UiColors } from '../../types/colors'
  import type { FontSize } from '../../types/typography'

  defineOptions({ inheritAttrs: false })

  const {
    language,
    color = 'default',
    size,
    class: classProp = '',
  } = defineProps<{
    language?: string
    color?: UiColors
    size?: FontSize
    class?: string
  }>()
  const colorClass = useColor(color, 'text')
</script>

<template>
  <Typography
    tag="pre"
    v-bind="{
      ...$attrs,
      ...(size !== undefined && { size: size }),
      ...(language !== undefined && { 'data-language': language }),
    }"
    class="overflow-x-auto"
    :class="[classProp]"
  >
    <Typography
      tag="code"
      class="font-mono"
      :class="[colorClass, language ? `language-${language}` : '']"
    >
      <slot />
    </Typography>
  </Typography>
</template>
