<script setup lang="ts">
const { value, loading = false } = defineProps<{
  value: unknown
  loading?: boolean
}>()
</script>

<template>
  <div>
    <USkeleton v-if="loading" class="h-64 w-full" />
    <ContentRenderer v-else-if="value" :value />
    <div v-else class="text-muted text-center py-12">Content not found</div>
  </div>
</template>
