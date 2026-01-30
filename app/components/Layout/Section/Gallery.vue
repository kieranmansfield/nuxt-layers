<script setup lang="ts" generic="T">
/**
 * SectionGallery - Auto-placing grid for collections
 *
 * Creates an evenly-distributed gallery layout with auto-placing grid items.
 * Items flow automatically based on the specified column count.
 *
 * @prop {T[]} items - Array of items to render (required)
 * @prop {2 | 3 | 4 | 6} columns - Number of columns (default: 3)
 * @prop {number} itemRowSpan - Rows per item (default: 4)
 * @prop {boolean} fullHeight - Force 100svh (default: false)
 *
 * @slot item - Template for each item
 *   @param {T} item - The current item
 *   @param {number} index - Item index
 *
 * @example
 * <SectionGallery :items="images" :columns="3" :item-row-span="4">
 *   <template #item="{ item, index }">
 *     <NuxtImg :src="item.src" class="size-full object-cover" />
 *   </template>
 * </SectionGallery>
 */

interface Props<T> {
  items: T[]
  columns?: 2 | 3 | 4 | 6
  itemRowSpan?: number
  fullHeight?: boolean
}

const { items, columns = 3, itemRowSpan = 4, fullHeight = false } = defineProps<Props<T>>()

// Responsive column spans that work across 6/12/18 column grids
const columnSpan = computed(() => {
  // On mobile (6 cols): Always 1 column (full width)
  // On tablet (12 cols): 2 columns max
  // On desktop (18 cols): Use requested columns

  if (columns === 2) {
    return { default: 6, md: 6, lg: 9 } // 1 col mobile, 2 cols tablet, 2 cols desktop
  }
  if (columns === 3) {
    return { default: 6, md: 6, lg: 6 } // 1 col mobile, 2 cols tablet, 3 cols desktop
  }
  if (columns === 4) {
    return { default: 6, md: 6, lg: 4 } // 1 col mobile, 2 cols tablet, 4-5 cols desktop
  }
  if (columns === 6) {
    return { default: 6, md: 4, lg: 3 } // 1 col mobile, 3 cols tablet, 6 cols desktop
  }

  return { default: 6, md: 6, lg: 6 }
})
</script>

<template>
  <LayoutSection :full-height="fullHeight">
    <LayoutGridItem
      v-for="(item, index) in items"
      :key="index"
      :col-span="columnSpan"
      :row-span="itemRowSpan"
    >
      <slot name="item" :item :index />
    </LayoutGridItem>
  </LayoutSection>
</template>
