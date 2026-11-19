<script setup lang="ts">
  const { name, description } = defineProps<{
    name: string
    description: string
  }>()
</script>

<template>
  <section
    class="relative flex min-h-[80vh] items-center justify-center overflow-hidden bg-[var(--demo-hero-bg)] pt-16 pb-8"
  >
    <div class="demo-hero-bg absolute inset-0">
      <slot name="background" />
    </div>
    <div
      class="demo-hero-accent from-primary pointer-events-none absolute inset-0 bg-linear-to-b via-transparent to-transparent"
    />
    <div
      class="demo-hero-shadow pointer-events-none absolute right-0 bottom-0 left-0 h-12 bg-linear-to-t from-[var(--ui-bg)] to-transparent opacity-50"
    />

    <NuxtLink
      to="/"
      class="text-muted hover:text-highlighted absolute top-6 left-6 z-10 flex items-center gap-2 text-sm font-medium transition-colors"
    >
      <UIcon name="i-lucide-arrow-left" class="text-sm" />
      All Layers
    </NuxtLink>

    <div class="z-10 px-4 text-center">
      <h1
        class="text-highlighted mb-6 text-5xl font-black tracking-tight uppercase sm:text-7xl md:text-8xl lg:text-9xl"
      >
        {{ name }}
      </h1>
      <p class="text-muted mx-auto mb-10 max-w-2xl text-xl">{{ description }}</p>
      <slot />
    </div>

    <div class="text-highlighted/40 absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
      <UIcon name="i-lucide-chevron-down" class="text-3xl" />
    </div>
  </section>
</template>
