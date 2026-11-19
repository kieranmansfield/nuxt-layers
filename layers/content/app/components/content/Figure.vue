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
    <!-- eslint-disable-next-line vue/v-bind-style -- vue-doctor 0.0.4 a11y-img-no-alt misses the `:alt` shorthand -->
    <img :src :alt="alt" :width :height loading="lazy" decoding="async" class="w-full rounded-lg" />
    <figcaption v-if="caption" class="text-muted mt-2 text-center text-sm italic">
      {{ caption }}
    </figcaption>
  </figure>
</template>
