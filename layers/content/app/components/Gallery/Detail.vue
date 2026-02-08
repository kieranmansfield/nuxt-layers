<script setup lang="ts">
const { slug } = defineProps<{
  slug: string
}>()

const lightboxOpen = ref(false)
const lightboxIndex = ref(0)
const lightboxImages = ref<{ src: string; alt: string; width?: number; height?: number }[]>([])

function openLightbox(images: { src: string; alt: string; width?: number; height?: number }[], index: number) {
  lightboxImages.value = images
  lightboxIndex.value = index
  lightboxOpen.value = true
}
</script>

<template>
  <NuxtContentDetail collection="gallery" :slug not-found-message="Gallery not found">
    <template #headline="{ item }">
      <div class="flex flex-wrap items-center gap-2">
        <span v-if="item.images?.length" class="text-sm text-muted">
          {{ item.images.length }} image{{ item.images.length === 1 ? '' : 's' }}
        </span>
        <UBadge v-for="tag in item.tags" :key="tag" color="neutral" variant="subtle" size="xs">
          {{ tag }}
        </UBadge>
      </div>
    </template>

    <template #after-content="{ item }">
      <template v-if="item.images?.length">
        <USeparator class="my-8" />
        <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div
            v-for="(img, idx) in item.images"
            :key="img.src"
            class="overflow-hidden rounded-lg group relative"
          >
            <NuxtLink
              :to="`/gallery/${slug}/${idx}`"
              class="block relative overflow-hidden"
            >
              <img
                :src="img.src"
                :alt="img.alt"
                class="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div class="absolute inset-0 bg-primary/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <span class="text-white font-semibold text-sm text-center px-3">
                  {{ img.title || img.alt }}
                </span>
              </div>
            </NuxtLink>
            <button
              class="absolute top-2 right-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/50 hover:bg-black/70 text-white rounded-full p-1.5 cursor-pointer"
              @click.stop="openLightbox(item.images, idx)"
            >
              <UIcon name="i-lucide-expand" class="size-4" />
            </button>
            <div v-if="img.caption" class="p-2">
              <p class="text-xs text-muted line-clamp-1">
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
