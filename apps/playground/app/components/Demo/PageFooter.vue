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
  <section class="bg-default border-default border-t py-16">
    <UContainer>
      <div class="flex flex-col items-start justify-between gap-8 md:flex-row md:items-center">
        <div>
          <h2 class="text-highlighted mb-2 text-2xl font-bold">{{ name }}</h2>
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
