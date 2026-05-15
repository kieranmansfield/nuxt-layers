<script setup lang="ts">
  const { contentLayer } = useAppConfig()
  if (contentLayer?.sections?.blog === false) {
    throw createError({ statusCode: 404, statusMessage: 'Not Found' })
  }

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
