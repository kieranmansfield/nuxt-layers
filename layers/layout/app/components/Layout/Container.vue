<script setup lang="ts">
/**
 * LayoutContainer — constrained content width wrapper.
 *
 * Provides four standard container widths that sit within the grid:
 *
 * | size    | max-width | use case                        |
 * |---------|-----------|----------------------------------|
 * | content | 65ch      | Long-form prose, articles        |
 * | wide    | 90rem     | Cards, media-rich sections       |
 * | fluid   | 100%      | Full bleed within grid padding   |
 * | full    | 100vw     | True full-bleed (escapes padding)|
 *
 * The container is centred with `margin-inline: auto` for `content` and `wide`.
 *
 * @prop {GridContainerSize} size — Container width variant (default: 'wide')
 * @prop {string}            tag  — HTML element to render (default: 'div')
 *
 * @example
 * <LayoutContainer size="content">
 *   <p>Readable prose constrained to ~65 characters wide.</p>
 * </LayoutContainer>
 */

import type { GridContainerSize } from '#layers/layout/app/types/layouts'

interface Props {
  size?: GridContainerSize
  tag?: string
}

const { size = 'wide', tag = 'div' } = defineProps<Props>()

const sizeClass: Record<GridContainerSize, string> = {
  content: 'layout-container-content',
  wide: 'layout-container-wide',
  fluid: 'layout-container-fluid',
  full: 'layout-container-full',
}
</script>

<template>
  <component
    :is="tag"
    :class="sizeClass[size]"
  >
    <slot />
  </component>
</template>
