<!-- eslint-disable vue/require-default-prop -->
<script setup lang="ts">
const {
  title,
  description,
  image,
  tags = [],
  client,
  year,
  to,
} = defineProps<{
  title: string
  description?: string
  image?: string
  tags?: string[]
  client?: string
  year?: number
  to?: string
}>()
</script>

<template>
  <UPageCard :title :description :to variant="outline">
    <img v-if="image" :src="image" :alt="title" class="w-full h-48 object-cover rounded" />
    <template #footer>
      <div class="flex flex-wrap gap-1.5">
        <UBadge v-if="client" color="primary" variant="subtle" size="xs">
          {{ client }}
        </UBadge>
        <UBadge v-if="year" color="neutral" variant="subtle" size="xs">
          {{ year }}
        </UBadge>
        <UBadge v-for="tag in tags" :key="tag" color="neutral" variant="subtle" size="xs">
          {{ tag }}
        </UBadge>
      </div>
    </template>
  </UPageCard>
</template>
