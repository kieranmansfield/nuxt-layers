<script setup lang="ts">
/**
 * PageHeader - Standard page header component
 *
 * Displays a centered page title and optional description with consistent spacing.
 * Used by PageContainer for visible page headers.
 *
 * @prop {string} title - Page title (displays as h1)
 * @prop {string} description - Optional page description
 *
 * @example
 * <LayoutPageHeader
 *   title="About Us"
 *   description="Learn about our company and mission"
 * />
 */

interface Props {
  title: string
  description?: string
  back?: string
}

defineProps<Props>()
</script>

<template>
  <div :class="back ? 'flex items-center gap-4 py-6' : 'py-10 text-center'">
    <!-- Sub-page: back button + title -->
    <template v-if="back">
      <UButton :to="back" variant="ghost" icon="i-lucide-arrow-left" />
      <div>
        <h1 class="text-3xl font-bold text-highlighted">{{ title }}</h1>
        <p v-if="description" class="text-muted">{{ description }}</p>
      </div>
    </template>

    <!-- Centered page header (homepage, section intros) -->
    <template v-else>
      <h1 class="text-4xl font-bold text-highlighted">{{ title }}</h1>
      <p v-if="description" class="mt-3 text-lg text-muted">{{ description }}</p>
    </template>
  </div>
</template>
