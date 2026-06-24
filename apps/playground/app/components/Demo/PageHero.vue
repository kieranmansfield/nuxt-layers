<script setup lang="ts">
  const { name, description } = defineProps<{
    name: string
    description: string
  }>()
</script>

<template>
  <section
    class="min-h-[80vh] flex items-center justify-center relative overflow-hidden bg-[var(--demo-hero-bg)] pt-16 pb-8"
  >
    <div class="demo-hero-bg absolute inset-0">
      <slot name="background" />
    </div>
    <div
      class="demo-hero-accent absolute inset-0 bg-linear-to-b from-primary via-transparent to-transparent pointer-events-none"
    />
    <div
      class="demo-hero-shadow absolute bottom-0 left-0 right-0 h-12 opacity-50 bg-linear-to-t from-[var(--ui-bg)] to-transparent pointer-events-none"
    />

    <NuxtLink
      to="/"
      class="absolute top-6 left-6 flex items-center gap-2 text-muted hover:text-highlighted transition-colors text-sm font-medium z-10"
    >
      <UIcon name="i-lucide-arrow-left" class="text-sm" />
      All Layers
    </NuxtLink>

    <div class="text-center z-10 px-4">
      <h1
        class="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-black text-highlighted mb-6 uppercase tracking-tight"
      >
        {{ name }}
      </h1>
      <p class="text-xl text-muted mb-10 max-w-2xl mx-auto">{{ description }}</p>
      <slot />
    </div>

    <div class="absolute bottom-8 left-1/2 -translate-x-1/2 text-highlighted/40 animate-bounce">
      <UIcon name="i-lucide-chevron-down" class="text-3xl" />
    </div>
  </section>
</template>
