<script setup lang="ts">
  // Centred h2 + lead over a demo body. id and extra classes fall through to the <section>.
  const { title, description } = defineProps<{
    title: string
    description?: string
  }>()
</script>

<template>
  <section class="bg-default py-24">
    <UContainer>
      <div class="mb-16 text-center">
        <h2 class="text-highlighted mb-4 text-4xl font-bold md:text-5xl">{{ title }}</h2>
        <p v-if="description || $slots.description" class="text-muted text-lg">
          <slot name="description">{{ description }}</slot>
        </p>
      </div>
      <slot />
    </UContainer>
  </section>
</template>
