<script setup lang="ts">
  const { count } = defineProps<{ count: 3 | 4 }>()
</script>

<template>
  <div class="space-y-4">
    <USkeleton class="h-5 w-48" />
    <USkeleton class="h-4 w-full" />
    <div class="grid grid-cols-2 gap-4" :class="count === 4 ? 'sm:grid-cols-4' : 'sm:grid-cols-3'">
      <USkeleton v-for="n in count" :key="n" class="h-12" />
    </div>
  </div>
</template>
