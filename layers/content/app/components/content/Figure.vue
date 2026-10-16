<script setup lang="ts">
  const {
    src,
    alt = '',
    caption = undefined,
    width = undefined,
    height = undefined,
  } = defineProps<{
    src: string
    alt?: string
    caption?: string
    width?: number
    height?: number
  }>()
</script>

<template>
  <figure class="my-6">
    <img :src :alt :width :height class="w-full rounded-lg" />
    <figcaption v-if="caption" class="text-muted mt-2 text-center text-sm italic">
      {{ caption }}
    </figcaption>
  </figure>
</template>
