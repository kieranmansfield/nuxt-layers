<script setup lang="ts">
  /**
   * ZStack — layered content. A single-area CSS grid; direct slot children
   * all share that one grid area, stacking by source order (later = on top).
   * See nuxt-declarative-layout-system-spec.md §8.
   *
   * ponytail: no placement prop yet (start/center/end vocabulary is deferred
   * until a concrete need arises — the shared grid area already fills the
   * stack for the common case).
   */
</script>

<template>
  <div class="z-stack">
    <slot />
  </div>
</template>

<style scoped>
  .z-stack {
    display: grid;
    grid-template-areas: 'stack';
  }

  :slotted(*) {
    grid-area: stack;
  }
</style>
