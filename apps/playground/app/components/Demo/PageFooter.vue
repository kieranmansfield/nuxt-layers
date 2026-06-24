<script setup lang="ts">
  interface FooterLink {
    label: string
    to: string
    icon?: string
  }

  const {
    name,
    description,
    links = [],
  } = defineProps<{
    name: string
    description: string
    links?: FooterLink[]
  }>()
</script>

<template>
  <section class="py-16 bg-default border-t border-default">
    <UContainer>
      <div class="flex flex-col md:flex-row gap-8 items-start md:items-center justify-between">
        <div>
          <h2 class="text-2xl font-bold text-highlighted mb-2">{{ name }}</h2>
          <p class="text-muted">{{ description }}</p>
        </div>
        <div class="flex flex-wrap gap-3">
          <UButton
            v-for="link in links"
            :key="link.to"
            variant="ghost"
            :to="link.to"
            :icon="link.icon"
          >
            {{ link.label }}
          </UButton>
          <UButton to="/" variant="outline" icon="i-lucide-home"> Home </UButton>
        </div>
      </div>
    </UContainer>
  </section>
</template>
