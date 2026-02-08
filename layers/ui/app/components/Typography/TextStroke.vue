<script lang="ts" setup>
import { usePreferredContrast } from '@vueuse/core'

const id = useId()
const contrast = usePreferredContrast()

const props = withDefaults(
  defineProps<{
    text: string
    strokeWidth?: number
    strokeColor?: string
    fill?: string
    linejoin?: 'round' | 'miter' | 'bevel'
    tag?: string
  }>(),
  {
    strokeWidth: 1.5,
    strokeColor: 'currentColor',
    fill: 'none',
    linejoin: 'round',
    tag: 'div',
  }
)

const effectiveStrokeWidth = computed(() =>
  contrast.value === 'more' ? props.strokeWidth * 1.5 : props.strokeWidth
)
</script>

<template>
  <component
    :is="tag"
    class="text-stroke inline-grid leading-none *:[grid-area:1/1]"
    :aria-labelledby="`stroke-text-${id}`"
    v-bind="$attrs"
  >
    <!-- Sizer: transparent text for natural sizing + selectable -->
    <span class="text-stroke-sizer text-transparent whitespace-nowrap" aria-hidden="true">{{ text }}</span>

    <!-- Visual SVG stroke -->
    <svg
      aria-hidden="true"
      role="img"
      focusable="false"
      class="text-stroke-svg pointer-events-none overflow-visible"
      width="100%"
      height="100%"
    >
      <!-- Outline mode: mask clips stroke to outside glyph only -->
      <defs v-if="fill === 'none'">
        <mask :id="`stroke-mask-${id}`">
          <rect x="-9999" y="-9999" width="99999" height="99999" fill="white" />
          <text
            x="0" y="0"
            dominant-baseline="text-before-edge"
            fill="black"
            style="font: inherit"
          >{{ text }}</text>
        </mask>
      </defs>

      <text
        v-if="fill === 'none'"
        x="0" y="0"
        dominant-baseline="text-before-edge"
        fill="none"
        :stroke="strokeColor"
        :stroke-width="effectiveStrokeWidth * 2"
        :stroke-linejoin="linejoin"
        vector-effect="non-scaling-stroke"
        :mask="`url(#stroke-mask-${id})`"
        style="font: inherit"
      >{{ text }}</text>

      <!-- Fill+stroke mode: paint-order renders stroke behind fill -->
      <text
        v-else
        x="0" y="0"
        dominant-baseline="text-before-edge"
        :fill="fill"
        :stroke="strokeColor"
        :stroke-width="effectiveStrokeWidth"
        :stroke-linejoin="linejoin"
        vector-effect="non-scaling-stroke"
        paint-order="stroke"
        style="font: inherit"
      >{{ text }}</text>
    </svg>

    <!-- Accessible label for screen readers -->
    <span
      :id="`stroke-text-${id}`"
      class="sr-only"
    >{{ text }}</span>
  </component>
</template>

<style scoped>

@media (forced-colors: active) {
  .text-stroke-sizer {
    visibility: visible;
    color: CanvasText;
  }
  .text-stroke-svg {
    display: none;
  }
}
</style>
