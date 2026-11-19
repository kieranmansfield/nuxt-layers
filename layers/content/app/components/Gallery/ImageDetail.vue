<script setup lang="ts">
  import type { GalleryCollectionItem } from '@nuxt/content'

  const { slug, index } = defineProps<{
    slug: string
    index: number
  }>()

  const { data: rawItem } = await useCollectionItem('gallery', slug)
  const item = computed(() => rawItem.value as GalleryCollectionItem | null)

  const image = computed(() => item.value?.images?.[index])
  const totalImages = computed(() => item.value?.images?.length ?? 0)
  const hasPrevious = computed(() => index > 0)
  const hasNext = computed(() => index < totalImages.value - 1)
</script>

<template>
  <div v-if="item && item.images && image">
    <UPageHeader
      :title="image.title || image.alt"
      v-bind="image.caption ? { description: image.caption } : {}"
    >
      <template #headline>
        <UBreadcrumb
          :items="[
            { label: 'Gallery', to: '/gallery' },
            { label: item.title, to: `/gallery/${slug}` },
            { label: `Image ${index + 1} of ${totalImages}` },
          ]"
        />
      </template>
    </UPageHeader>

    <UPageBody>
      <figure class="relative my-6">
        <!-- Ambient glow radiating from the image -->
        <div
          v-if="image.ambient"
          class="pointer-events-none absolute -inset-12 sm:-inset-20"
          aria-hidden="true"
        >
          <img
            :src="image.src"
            alt=""
            class="h-full w-full scale-x-200 object-cover opacity-40 bg-blend-luminosity mix-blend-darken blur-3xl saturate-300 dark:opacity-35 dark:mix-blend-lighten"
          />
          <!-- class="w-full h-full object-cover rounded-3xl blur-3xl opacity-80 dark:opacity-30 saturate-200 scale-110 bg-blend-overlay dark:mix-blend-color" -->
        </div>

        <img
          :src="image.src"
          :alt="image.alt"
          :width="image.width"
          :height="image.height"
          class="relative w-full rounded-lg drop-shadow-xl"
        />
        <figcaption
          v-if="image.caption"
          class="text-muted relative mt-3 text-center text-sm italic"
        >
          {{ image.caption }}
        </figcaption>
      </figure>

      <div class="mt-6 flex items-center justify-between">
        <UButton
          v-if="hasPrevious"
          :to="`/gallery/${slug}/${index - 1}`"
          variant="outline"
          icon="i-lucide-arrow-left"
        >
          Previous
        </UButton>
        <span v-else />

        <span class="text-muted text-sm"> {{ index + 1 }} / {{ totalImages }} </span>

        <UButton
          v-if="hasNext"
          :to="`/gallery/${slug}/${index + 1}`"
          variant="outline"
          trailing-icon="i-lucide-arrow-right"
        >
          Next
        </UButton>
        <span v-else />
      </div>
    </UPageBody>
  </div>
  <div v-else class="text-muted py-12 text-center">Image not found</div>
</template>
