<script setup lang="ts">
useSeoMeta({
  title: 'Theme Layer Demo',
  description: 'Demonstrating the Theme layer color system, palettes, and design tokens',
})
</script>

<template>
  <div class="min-h-screen">
    <UContainer class="py-8">
      <div class="space-y-12">
        <!-- Header -->
        <div class="flex items-center gap-4">
          <UButton to="/" variant="ghost" icon="i-lucide-arrow-left" />
          <div>
            <h1 class="text-3xl font-bold text-highlighted">Theme Layer</h1>
            <p class="text-muted">Theme system, color palettes, and design tokens</p>
          </div>
        </div>
      </div>

      <!-- Grid System Section -->
      <section class="space-y-8">
        <div>
          <h2 class="text-2xl font-bold mb-2">Swiss Grid System</h2>
          <div>
            <ThemePickerMenuButton />
          </div>
        </div>
      </section>

      <!-- Section Components -->
      <section class="space-y-8">
        <div>
          <h2 class="text-2xl font-bold mb-2">Section Components</h2>
          <p class="text-gray-500">Pre-configured layouts for common page patterns</p>
        </div>
      </section>
    </UContainer>
  </div>
</template>
