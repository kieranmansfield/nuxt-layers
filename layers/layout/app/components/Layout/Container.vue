<script setup lang="ts">
  /**
   * LayoutContainer — back-compat shim.
   *
   * Container migrated to layers/core's shared <Container> (auto-imported,
   * since layout extends core). Same props, same values, no visual change.
   * See nuxt-declarative-layout-system-spec.md §10/§20.
   */

  import type { GridContainerSize } from '#layers/layout/app/types/layouts'

  const { size = 'wide', tag = 'div' } = defineProps<{
    size?: GridContainerSize
    tag?: string
  }>()
</script>

<template>
  <Container :size :tag>
    <slot />
  </Container>
</template>
