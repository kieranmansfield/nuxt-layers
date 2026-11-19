<script setup lang="ts">
  const {
    status,
    hasItems = true,
    emptyMessage = 'No items found',
    errorMessage = "These items couldn't be loaded. Try again shortly.",
  } = defineProps<{
    status: 'idle' | 'pending' | 'success' | 'error'
    hasItems?: boolean
    emptyMessage?: string
    errorMessage?: string
  }>()
</script>

<template>
  <div>
    <USkeleton v-if="status === 'pending'" class="h-64 w-full" />
    <slot v-else-if="status === 'error'" name="error">
      <UAlert color="error" variant="subtle" icon="lucide:circle-alert" :title="errorMessage" />
    </slot>
    <template v-else-if="hasItems">
      <slot />
    </template>
    <div v-else class="text-muted py-12 text-center">{{ emptyMessage }}</div>
  </div>
</template>
