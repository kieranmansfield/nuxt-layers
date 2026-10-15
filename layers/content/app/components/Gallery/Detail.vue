<script setup lang="ts">
  import type { GalleryCollectionItem } from '@nuxt/content'

  const { slug } = defineProps<{
    slug: string
  }>()

  const lightboxOpen = ref(false)
  const lightboxIndex = ref(0)
  const lightboxImages = ref<{ src: string; alt: string; width?: number; height?: number }[]>([])

  const asGallery = (item: unknown) => item as GalleryCollectionItem

  function openLightbox(
    images: { src: string; alt: string; width?: number; height?: number }[],
    index: number
  ) {
    lightboxImages.value = images
    lightboxIndex.value = index
    lightboxOpen.value = true
  }
</script>

<template>
  <NuxtContentDetail collection="gallery" :slug not-found-message="Gallery not found">
    <template #headline="{ item }">
      <div class="flex flex-wrap items-center gap-2">
        <span v-if="asGallery(item).images?.length" class="text-muted text-sm">
          {{ asGallery(item).images!.length }} image{{
            asGallery(item).images!.length === 1 ? '' : 's'
          }}
        </span>
        <UBadge
          v-for="tag in asGallery(item).tags"
          :key="tag"
          color="neutral"
          variant="subtle"
          size="xs"
        >
          {{ tag }}
        </UBadge>
      </div>
    </template>

    <template #after-content="{ item }">
      <template v-if="asGallery(item).images?.length">
        <USeparator class="my-8" />
        <div class="gallery-grid gap-4">
          <div
            v-for="(img, idx) in asGallery(item).images"
            :key="img.src"
            class="group relative overflow-hidden rounded-lg"
          >
            <NuxtLink :to="`/gallery/${slug}/${idx}`" class="relative block overflow-hidden">
              <img
                :src="img.src"
                :alt="img.alt"
                class="h-48 w-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div
                class="bg-primary/60 absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100"
              >
                <span class="px-3 text-center text-sm font-semibold text-white">
                  {{ img.title || img.alt }}
                </span>
              </div>
            </NuxtLink>
            <button
              class="absolute top-2 right-2 z-10 cursor-pointer rounded-full bg-black/50 p-1.5 text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100 hover:bg-black/70"
              @click.stop="() => openLightbox(asGallery(item).images!, idx)"
            >
              <UIcon name="i-lucide-expand" class="size-4" />
            </button>
            <div v-if="img.caption" class="p-2">
              <p class="text-muted line-clamp-1 text-xs">
                {{ img.caption }}
              </p>
            </div>
          </div>
        </div>
      </template>

      <GalleryLightbox
        v-model:open="lightboxOpen"
        :images="lightboxImages"
        :initial-index="lightboxIndex"
      />
    </template>
  </NuxtContentDetail>
</template>

<style scoped>
  .gallery-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(14rem, 1fr));
  }
</style>
