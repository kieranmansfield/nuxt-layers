<script setup lang="ts">
  /**
   * Content item skeleton, the twin of NuxtContentIndexTemplate. Slot only: fetching, meta and
   * the section guard belong to the *Page component that fills it.
   */
</script>

<template>
  <LayoutSection>
    <LayoutGridItem>
      <slot />
    </LayoutGridItem>
  </LayoutSection>
</template>
