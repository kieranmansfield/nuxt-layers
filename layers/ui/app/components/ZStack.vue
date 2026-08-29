<script setup lang="ts">
  /**
   * ZStack — layered content. `position: relative` wrapper; direct slot
   * children get `position: absolute; inset: 0` unless they opt out with
   * their own positioning. See nuxt-declarative-layout-system-spec.md §8.
   *
   * ponytail: no placement prop yet (start/center/end vocabulary is deferred
   * until a concrete need arises — inset:0 already fills the stack for the
   * common case).
   */
</script>

<template>
  <div class="z-stack">
    <slot />
  </div>
</template>

<style scoped>
  .z-stack {
    position: relative;
  }

  :slotted(*) {
    position: absolute;
    inset: 0;
  }
</style>
