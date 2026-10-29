<script setup lang="ts">
  const {
    label,
    value,
    icon = undefined,
  } = defineProps<{
    label: string
    /** Numbers render compact (`12.3K`) with the exact figure as a tooltip */
    value: number | string
    icon?: string
  }>()
</script>

<template>
  <div class="min-w-0">
    <dt class="text-muted flex items-center gap-1.5 text-xs">
      <UIcon v-if="icon" :name="icon" class="size-3.5 shrink-0" />
      <span class="truncate">{{ label }}</span>
    </dt>
    <dd
      class="text-highlighted mt-1 truncate text-xl font-semibold tabular-nums"
      v-bind="typeof value === 'number' ? { title: formatStatCountExact(value) } : {}"
    >
      {{ typeof value === 'number' ? formatStatCount(value) : value }}
    </dd>
  </div>
</template>
