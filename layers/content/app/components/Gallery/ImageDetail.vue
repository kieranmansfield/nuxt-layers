<script setup lang="ts">
const { slug, index } = defineProps<{
  slug: string
  index: number
}>()

const { data: item } = await useCollectionItem('gallery', slug)

const image = computed(() => item.value?.images?.[index])
const totalImages = computed(() => item.value?.images?.length ?? 0)
const hasPrevious = computed(() => index > 0)
const hasNext = computed(() => index < totalImages.value - 1)

useSeoMeta({
  title: () => image.value?.title || image.value?.alt || `Image ${index + 1}`,
  description: () => image.value?.caption || item.value?.title,
  ogImage: () => image.value?.src,
})
</script>

<template>
  <div v-if="item && image">
    <UPageHeader :title="image.title || image.alt" :description="image.caption">
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
          class="absolute -inset-12 sm:-inset-20 pointer-events-none"
          aria-hidden="true"
        >
          <img
            :src="image.src"
            alt=""
            class="w-full h-full object-cover blur-3xl bg-blend-luminosity mix-blend-darken dark:mix-blend-lighten opacity-40 dark:opacity-35 saturate-300 scale-x-200"
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
          class="relative mt-3 text-center text-sm text-muted italic"
        >
          {{ image.caption }}
        </figcaption>
      </figure>

      <div class="flex items-center justify-between mt-6">
        <UButton
          v-if="hasPrevious"
          :to="`/gallery/${slug}/${index - 1}`"
          variant="outline"
          icon="i-lucide-arrow-left"
        >
          Previous
        </UButton>
        <span v-else />

        <span class="text-sm text-muted"> {{ index + 1 }} / {{ totalImages }} </span>

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
  <div v-else class="text-muted text-center py-12">Image not found</div>
</template>
