<script setup lang="ts">
  const {
    to,
    icon,
    title,
    description,
    target = undefined,
  } = defineProps<{
    to: string
    icon: string
    title: string
    description: string
    target?: '_blank'
  }>()
</script>

<template>
  <UCard :to :target class="hover:ring-primary transition-colors">
    <div class="flex items-center gap-3">
      <UIcon :name="icon" class="text-primary shrink-0 text-xl" />
      <div>
        <p class="text-highlighted font-semibold">{{ title }}</p>
        <p class="text-muted text-sm">{{ description }}</p>
      </div>
    </div>
  </UCard>
</template>
