<script setup lang="ts">
/**
 * SectionSplit - Two-column layout section
 *
 * Creates a balanced two-column layout with optional column reversal on mobile.
 * Each column spans 9 columns (half of 18-column grid).
 *
 * @prop {boolean} fullHeight - Force 100svh (default: false)
 * @prop {boolean} reverse - Swap column order on mobile (default: false)
 *
 * @slot left - Left column content (stacks first on mobile unless reverse=true)
 * @slot right - Right column content (stacks second on mobile unless reverse=true)
 *
 * @example
 * <SectionSplit reverse>
 *   <template #left>
 *     <NuxtImg src="/image.jpg" class="size-full object-cover" />
 *   </template>
 *   <template #right>
 *     <h2>Content</h2>
 *     <p>Description...</p>
 *   </template>
 * </SectionSplit>
 */

interface Props {
  fullHeight?: boolean
  reverse?: boolean
}

const { fullHeight = false, reverse = false } = defineProps<Props>()
</script>

<template>
  <LayoutSection :full-height>
    <LayoutGridItem
      :col-start="{ default: 1, md: 1, lg: 1 }"
      :col-span="{ default: 6, md: 12, lg: 9 }"
      :row-start="{ default: 1, md: 1, lg: 1 }"
      :row-span="{ default: 12, md: 12, lg: 12 }"
      :class="{ 'order-2': reverse }"
    >
      <slot name="left" />
    </LayoutGridItem>

    <LayoutGridItem
      :col-start="{ default: 1, md: 1, lg: 10 }"
      :col-span="{ default: 6, md: 12, lg: 9 }"
      :row-start="{ default: 13, md: 13, lg: 1 }"
      :row-span="{ default: 12, md: 12, lg: 12 }"
      :class="{ 'order-1': reverse }"
    >
      <slot name="right" />
    </LayoutGridItem>
  </LayoutSection>
</template>
