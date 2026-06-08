<script setup lang="ts">
  const { contentLayer } = useAppConfig()
  if (contentLayer?.sections?.gallery === false) {
    throw createError({ statusCode: 404, statusMessage: 'Not Found' })
  }

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
