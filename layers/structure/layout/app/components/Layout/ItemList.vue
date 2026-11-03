<script setup lang="ts" generic="T extends Record<string, any>">
  /**
   * LayoutItemList - Generic tabular list (header row + one row per item)
   *
   * @prop {T[]} items - Rows to render
   * @prop {ItemListColumn[]} columns - Column defs; `class` sizes the cell (e.g. flex-basis)
   * @prop {string | ((item: T) => string)} itemKey - Unique key field or fn (default: index)
   * @prop {string | ((item: T) => string | undefined)} href - Row link field or fn
   * @prop {boolean} external - Open row links in a new tab
   * @prop {boolean} numbered - Show a zero-padded index column
   *
   * @slot cell-<key> - Override a cell: { item, index, value }
   * @slot index - Override the index cell: { index }
   * @slot trailing - Override the trailing marker: { item, index }
   *
   * @example
   * <LayoutItemList :items="works" :columns="cols" href="link" external numbered />
   */

  export interface ItemListColumn {
    key: string
    label?: string
    class?: string
  }

  const {
    items,
    columns,
    itemKey = undefined,
    href = undefined,
    external = false,
    numbered = false,
  } = defineProps<{
    items: T[]
    columns: ItemListColumn[]
    itemKey?: string | ((item: T) => string)
    href?: string | ((item: T) => string | undefined)
    external?: boolean
    numbered?: boolean
  }>()

  const keyOf = (item: T, index: number) =>
    typeof itemKey === 'function'
      ? itemKey(item)
      : itemKey
        ? String(item[itemKey])
        : index

  const hrefOf = (item: T) =>
    typeof href === 'function' ? href(item) : href ? item[href] : undefined

  const pad = (n: number) => String(n + 1).padStart(2, '0')
  const rowCls = 'flex flex-wrap items-baseline gap-x-6 gap-y-2'
</script>

<template>
  <div>
    <div
      class="max-md:hidden border-b border-default pb-3" :class="[rowCls]"
      aria-hidden="true"
    >
      <span v-if="numbered" class="flex-[0_0_48px]">No.</span>
      <span v-for="col in columns" :key="col.key" :class="col.class">
        {{ col.label }}
      </span>
      <span v-if="href" class="flex-[0_0_24px]" />
    </div>
    <ul class="m-0 list-none p-0">
      <li v-for="(item, index) in items" :key="keyOf(item, index)">
        <component
          :is="hrefOf(item) ? 'a' : 'div'"
          :href="hrefOf(item)"
          :target="hrefOf(item) && external ? '_blank' : undefined"
          :rel="hrefOf(item) && external ? 'noreferrer' : undefined"
          class="border-b border-default py-5" :class="[rowCls]"
        >
          <span v-if="numbered" class="flex-[0_0_48px]">
            <slot name="index" :index>{{ pad(index) }}</slot>
          </span>
          <span v-for="col in columns" :key="col.key" :class="col.class">
            <slot
              :name="`cell-${col.key}`"
              :item
              :index
              :value="item[col.key]"
            >
              {{ item[col.key] }}
            </slot>
          </span>
          <span v-if="href" aria-hidden="true" class="flex-[0_0_24px] text-right">
            <slot name="trailing" :item :index>{{
              external ? '↗' : '→'
            }}</slot>
          </span>
        </component>
      </li>
    </ul>
  </div>
</template>
