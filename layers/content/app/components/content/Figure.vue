<!-- eslint-disable vue/require-default-prop -->
<script setup lang="ts">
const {
  src,
  alt = '',
  caption,
  width,
  height,
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
    <img
      :src="src"
      :alt="alt"
      :width="width"
      :height="height"
      class="w-full rounded-lg"
    />
    <figcaption v-if="caption" class="mt-2 text-center text-sm text-muted italic">
      {{ caption }}
    </figcaption>
  </figure>
</template>
