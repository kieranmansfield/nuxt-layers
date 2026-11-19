<script setup lang="ts">
  /**
   * AppContainer — constrained content width wrapper.
   *
   * | size    | max-width | use case                          |
   * |---------|-----------|------------------------------------|
   * | content | 65ch      | Long-form prose, articles          |
   * | wide    | clamp(64rem, 85vw, 90rem) | Cards, media-rich sections |
   * | fluid   | 100%      | Full bleed within grid padding      |
   * | full    | 100vw     | True full-bleed (escapes padding)   |
   */

  import type { ContainerSize } from '#layers/core/types/tokens'

  const { size = 'wide', tag = 'div' } = defineProps<{
    size?: ContainerSize
    tag?: string
  }>()

  const sizeClass: Record<ContainerSize, string> = {
    content: 'container-content',
    wide: 'container-wide',
    fluid: 'container-fluid',
    full: 'container-full',
  }
</script>

<template>
  <component :is="tag" :class="sizeClass[size]">
    <slot />
  </component>
</template>
