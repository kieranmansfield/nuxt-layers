<script lang="ts" setup>
import { usePicture } from '../../composables/picture'
import type { PictureProps } from '../../types/media'

const {
  src,
  alt,
  width,
  height,
  sizes = '100vw',
  format = 'webp',
  quality = 80,
  fit = 'cover',
  loading = 'lazy',
  fetchpriority = 'auto',
  decoding = 'async',
  provider,
  preset,
  densities,
  class: wrapperClass = '',
  imgClass = '',
} = defineProps<PictureProps>()

const { sizesString, computedFormat } = usePicture(
  () => sizes,
  () => format
)
</script>

<template>
  <NuxtPicture
    :src
    :alt
    :width
    :height
    :sizes="sizesString"
    :format="computedFormat"
    :quality
    :fit
    :loading
    :fetchpriority
    :decoding
    :provider
    :preset
    :densities
    :class="wrapperClass"
    :img-attrs="{ class: imgClass }"
    v-bind="$attrs"
  />
</template>
