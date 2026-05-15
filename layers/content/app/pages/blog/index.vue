<script setup lang="ts">
  useSeoMeta({
    title: 'Blog',
    description: 'Latest articles and updates',
  })
</script>

<template>
  <LayoutSection>
    <LayoutGridItem>
      <UPageHeader title="Blog" description="Latest articles and updates" />
      <UPageBody>
        <BlogList />
      </UPageBody>
    </LayoutGridItem>
  </LayoutSection>
</template>
