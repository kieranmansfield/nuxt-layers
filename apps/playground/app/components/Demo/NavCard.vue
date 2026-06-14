<script setup lang="ts">
  const { to, icon, title, description, target } = defineProps<{
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
      <UIcon :name="icon" class="text-primary text-xl shrink-0" />
      <div>
        <p class="font-semibold text-highlighted">{{ title }}</p>
        <p class="text-sm text-muted">{{ description }}</p>
      </div>
    </div>
  </UCard>
</template>
