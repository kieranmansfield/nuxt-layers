<script setup lang="ts" generic="T extends Record<string, any>">
  /**
   * LayoutItemCards - Generic auto-fit card grid (media + caption)
   *
   * @prop {T[]} items - Cards to render
   * @prop {string | ((item: T) => string)} itemKey - Unique key field or fn (default: index)
   * @prop {string} min - Min card width (default: 280px)
   *
   * @slot media - Card media: { item, index }
   * @slot caption - Card caption: { item, index }
   *
   * @example
   * <LayoutItemCards :items="works" item-key="path">
   *   <template #media="{ item }"><img :src="item.image" /></template>
   *   <template #caption="{ item }">{{ item.name }}</template>
   * </LayoutItemCards>
   */
  const {
    items,
    itemKey = undefined,
    min = '280px',
  } = defineProps<{
    items: T[]
    itemKey?: string | ((item: T) => string)
    min?: string
  }>()

  const keyOf = (item: T, index: number) =>
    typeof itemKey === 'function' ? itemKey(item) : itemKey ? String(item[itemKey]) : index
</script>

<template>
  <div
    class="grid gap-6"
    :style="{
      gridTemplateColumns: `repeat(auto-fit, minmax(min(${min}, 100%), 1fr))`,
    }"
  >
    <figure
      v-for="(item, index) in items"
      :key="keyOf(item, index)"
      class="m-0 flex flex-col gap-3"
    >
      <slot name="media" :item :index />
      <figcaption>
        <slot name="caption" :item :index />
      </figcaption>
    </figure>
  </div>
</template>
