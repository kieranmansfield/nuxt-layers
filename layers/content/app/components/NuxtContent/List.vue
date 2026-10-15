<script setup lang="ts">
  const {
    status,
    hasItems = true,
    emptyMessage = 'No items found',
  } = defineProps<{
    status: string
    hasItems?: boolean
    emptyMessage?: string
  }>()
</script>

<template>
  <div>
    <USkeleton v-if="status === 'pending'" class="h-64 w-full" />
    <template v-else-if="hasItems">
      <slot />
    </template>
    <div v-else class="text-muted py-12 text-center">{{ emptyMessage }}</div>
  </div>
</template>
