<script setup lang="ts">
  import type { PageCollections } from '@nuxt/content'
  import type { ContentSurroundLink } from '@nuxt/ui'

  const {
    collection,
    slug,
    notFoundMessage = 'Content not found',
    hideToc = false,
  } = defineProps<{
    collection: keyof PageCollections
    slug: string
    notFoundMessage?: string
    hideToc?: boolean
  }>()

  const { data: item, status } = await useCollectionItem(collection, slug)
  const { data: surround } = await useCollectionSurround(collection, slug)

  const surroundLinks = computed<ContentSurroundLink[] | undefined>(
    () => surround.value ?? undefined
  )

  // Optional props only bound when present (exactOptionalPropertyTypes rejects `undefined`)
  const headerProps = computed(() =>
    item.value?.description ? { description: item.value.description } : {}
  )
  const surroundProps = computed(() =>
    surroundLinks.value?.length ? { surround: surroundLinks.value } : {}
  )
  const tocProps = computed(() => {
    const links = item.value?.body?.toc?.links
    return links ? { links } : {}
  })
  const itemImage = computed(() => (item.value as { image?: string } | null)?.image)

  useSeoMeta({
    title: item.value?.title,
    description: item.value?.description,
    ogImage: itemImage,
  })
</script>

<template>
  <div>
    <USkeleton v-if="status === 'pending'" class="h-96 w-full" />
    <UAlert
      v-else-if="status === 'error'"
      color="error"
      variant="subtle"
      icon="lucide:circle-alert"
      title="This page couldn't be loaded. Try again shortly."
    />
    <UPage v-else-if="item">
      <UPageHeader :title="item.title" v-bind="headerProps">
        <template v-if="$slots.headline" #headline>
          <slot name="headline" :item />
        </template>
        <template v-if="$slots.links" #links>
          <slot name="links" :item />
        </template>
      </UPageHeader>

      <UPageBody>
        <slot name="before-content" :item />
        <ContentRenderer :value="item" />
        <slot name="after-content" :item />

        <USeparator class="my-8" />
        <NuxtContentSurround v-bind="surroundProps" />
      </UPageBody>

      <template v-if="!hideToc" #right>
        <NuxtContentToc v-bind="tocProps" />
      </template>
    </UPage>
    <div v-else class="text-muted py-12 text-center">{{ notFoundMessage }}</div>
  </div>
</template>
