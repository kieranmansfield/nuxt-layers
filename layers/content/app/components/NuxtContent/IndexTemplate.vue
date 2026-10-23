<script setup lang="ts">
  /**
   * Content index skeleton — a page header over a list. Props and slots only: fetching, meta
   * and the section guard belong to the *Page component that fills it.
   */
  const { title, description = undefined } = defineProps<{
    title: string
    description?: string
  }>()
</script>

<template>
  <LayoutSection>
    <LayoutGridItem>
      <UPageHeader :title v-bind="description ? { description } : {}" />
      <UPageBody>
        <slot />
      </UPageBody>
    </LayoutGridItem>
  </LayoutSection>
</template>
