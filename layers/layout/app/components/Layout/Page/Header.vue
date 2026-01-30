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
}

defineProps<Props>()
</script>

<template>
  <div class="prose-rhythm text-center">
    <h1 class="text-5xl font-bold">{{ title }}</h1>
    <p v-if="description" class="text-xl text-gray-600 dark:text-gray-400">
      {{ description }}
    </p>
  </div>
</template>
