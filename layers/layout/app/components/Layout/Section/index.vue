<script setup lang="ts">
/**
 * BaseSection - Full-viewport section using subgrid
 *
 * Inherits the parent MastMain's 18-column grid lines using CSS subgrid.
 * Spans 12 rows (1 viewport height) for full-screen sections.
 * Child GridItem elements position themselves on these inherited grid lines.
 *
 * @prop {boolean} fullHeight - Optional min-height safety net
 * @prop {boolean} fullWidth - Break outside the grid gutters for edge-to-edge content
 */
interface Props {
  fullHeight?: boolean
  fullWidth?: boolean
}

withDefaults(defineProps<Props>(), {
  fullHeight: false,
  fullWidth: false,
})
</script>

<template>
  <section class="basesection" :class="{ 'min-h-svh': fullHeight, 'section-bleed': fullWidth }">
    <slot />
  </section>
</template>

<style scoped>
.section-bleed {
  --bleed: var(--grid-padding, clamp(1rem, 2.5vw, 2rem));
  --gap: var(--grid-gap, clamp(0.75rem, 1.5vw, 1.5rem));

  margin-inline: calc(-1 * var(--bleed));
  margin-block: calc(-0.5 * var(--gap));
  width: calc(100% + 2 * var(--bleed));
  max-width: none;
}
</style>
