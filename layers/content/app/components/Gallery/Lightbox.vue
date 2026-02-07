<script setup lang="ts">
import type { GalleryImage } from '../../types/content'

const { images = [], initialIndex = 0 } = defineProps<{
  images?: GalleryImage[]
  initialIndex?: number
}>()

const open = defineModel<boolean>('open', { default: false })

const currentIndex = ref(initialIndex)

watch(
  () => initialIndex,
  (value) => {
    currentIndex.value = value
  }
)

const currentImage = computed(() => images[currentIndex.value])
const hasPrevious = computed(() => currentIndex.value > 0)
const hasNext = computed(() => currentIndex.value < images.length - 1)

function previous() {
  if (hasPrevious.value) currentIndex.value--
}

function next() {
  if (hasNext.value) currentIndex.value++
}

function onKeydown(event: KeyboardEvent) {
  if (event.key === 'ArrowLeft') previous()
  else if (event.key === 'ArrowRight') next()
}

onMounted(() => {
  globalThis.addEventListener('keydown', onKeydown)
})

onUnmounted(() => {
  globalThis.removeEventListener('keydown', onKeydown)
})
</script>

<template>
  <UModal
    v-model:open="open"
    fullscreen
    :ui="{ content: 'bg-black/95 flex items-center justify-center' }"
  >
    <template #content>
      <div class="relative w-full h-full flex items-center justify-center p-4">
        <!-- Close -->
        <UButton
          icon="i-lucide-x"
          color="neutral"
          variant="ghost"
          class="absolute top-4 right-4 text-white"
          @click="open = false"
        />

        <!-- Prev -->
        <UButton
          v-if="hasPrevious"
          icon="i-lucide-chevron-left"
          color="neutral"
          variant="ghost"
          class="absolute left-4 text-white"
          size="xl"
          @click="previous"
        />

        <!-- Image -->
        <img
          v-if="currentImage"
          :src="currentImage.src"
          :alt="currentImage.alt"
          :width="currentImage.width"
          :height="currentImage.height"
          class="max-w-full max-h-full object-contain"
        />

        <!-- Next -->
        <UButton
          v-if="hasNext"
          icon="i-lucide-chevron-right"
          color="neutral"
          variant="ghost"
          class="absolute right-4 text-white"
          size="xl"
          @click="next"
        />

        <!-- Counter -->
        <div class="absolute bottom-4 left-1/2 -translate-x-1/2 text-white text-sm">
          {{ currentIndex + 1 }} / {{ images.length }}
        </div>
      </div>
    </template>
  </UModal>
</template>
