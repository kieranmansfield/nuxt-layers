<!-- eslint-disable vue/define-macros-order -->
<script lang="ts" setup>
import { usePicture } from '../../composables/picture'
import type { PictureProps } from '../../types/media'

const props = withDefaults(defineProps<PictureProps>(), {
  loading: 'lazy',
  decoding: 'async',
  format: 'webp',
  sizes: '100vw',
  fit: 'cover',
  fetchpriority: 'auto',
  quality: 80,
  class: '',
  imgClass: '',
})

const { sizesString, computedFormat } = usePicture(props)
</script>

<template>
  <NuxtPicture
    :src="props.src"
    :alt="props.alt"
    :width="props.width"
    :height="props.height"
    :sizes="sizesString"
    :format="computedFormat"
    :quality="props.quality"
    :fit="props.fit"
    :loading="props.loading"
    :fetchpriority="props.fetchpriority"
    :decoding="props.decoding"
    :provider="props.provider"
    :preset="props.preset"
    :densities="props.densities"
    :class="props.class"
    :img-attrs="{ class: props.imgClass }"
    v-bind="$attrs"
  />
</template>
