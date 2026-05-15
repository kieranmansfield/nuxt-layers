<script setup lang="ts">
  useSeoMeta({
    title: 'Gallery',
    description: 'Photo collections and visual work',
  })
</script>

<template>
  <LayoutSection>
    <LayoutGridItem>
      <UPageHeader title="Gallery" description="Photo collections and visual work" />
      <UPageBody>
        <GalleryGrid />
      </UPageBody>
    </LayoutGridItem>
  </LayoutSection>
</template>
