<!-- eslint-disable vue/require-default-prop -->
<script setup lang="ts">
// @ts-nocheck
const {
  collection,
  slug,
  notFoundMessage = 'Content not found',
  hideToc = false,
} = defineProps<{
  collection: string
  slug: string
  notFoundMessage?: string
  hideToc?: boolean
}>()

const { data: item, status } = await useCollectionItem(collection, slug)
const { data: surround } = await useCollectionSurround(collection, slug)

const itemImage = computed(
  () => (item.value as { image?: string } | null)?.image
)

useSeoMeta({
  title: item.value?.title,
  description: item.value?.description,
  ogImage: itemImage,
})
</script>

<template>
  <div>
    <USkeleton v-if="status === 'pending'" class="h-96 w-full" />
    <UPage v-else-if="item">
      <UPageHeader :title="item.title" v-bind="item.description ? { description: item.description } : {}">
        <template v-if="$slots.headline" #headline>
          <slot name="headline" :item="item" />
        </template>
        <template v-if="$slots.links" #links>
          <slot name="links" :item="item" />
        </template>
      </UPageHeader>

      <UPageBody>
        <slot name="before-content" :item="item" />
        <ContentRenderer :value="item" />
        <slot name="after-content" :item="item" />

        <USeparator class="my-8" />
        <NuxtContentSurround :surround="surround as any" />
      </UPageBody>

      <template v-if="!hideToc" #right>
        <NuxtContentToc v-bind="item.body?.toc?.links ? { links: item.body.toc.links } : {}" />
      </template>
    </UPage>
    <div v-else class="text-muted text-center py-12">{{ notFoundMessage }}</div>
  </div>
</template>
