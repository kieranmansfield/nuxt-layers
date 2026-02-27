<script setup lang="ts">
/**
 * LayoutSectionGrid — RAM (Repeat Auto Minmax) pattern
 *
 * Auto-wrapping grid that fits as many columns as possible at `minItemWidth`
 * without media queries. Uses `repeat(auto-fit, minmax(..., 1fr))`.
 *
 * @prop {string} minItemWidth - Minimum column width before wrapping (default: '200px')
 * @prop {boolean} fullHeight - Force 100svh on the section (default: false)
 *
 * @slot default - Grid items
 *
 * @example
 * <LayoutSectionGrid min-item-width="250px">
 *   <div>Card 1</div>
 *   <div>Card 2</div>
 *   <div>Card 3</div>
 * </LayoutSectionGrid>
 */

interface Props {
  minItemWidth?: string
  fullHeight?: boolean
}

const { minItemWidth = '200px', fullHeight = false } = defineProps<Props>()
</script>

<template>
  <LayoutSection :full-height>
    <LayoutGridItem>
      <div
        class="ram-grid"
        :style="{ '--min-item-width': minItemWidth }"
      >
        <slot />
      </div>
    </LayoutGridItem>
  </LayoutSection>
</template>

<style scoped>
.ram-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(var(--min-item-width, 200px), 1fr));
  gap: var(--grid-gap, clamp(0.75rem, 1.5vw, 1.5rem));
  width: 100%;
}
</style>
