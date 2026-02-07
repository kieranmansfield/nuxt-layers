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
          <button
            v-for="(img, idx) in item.images"
            :key="img.src"
            class="overflow-hidden rounded-lg cursor-pointer hover:opacity-80 transition-opacity"
            @click="openLightbox(item.images, idx)"
          >
            <img
              :src="img.src"
              :alt="img.alt"
              class="w-full h-48 object-cover"
            />
          </button>
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
