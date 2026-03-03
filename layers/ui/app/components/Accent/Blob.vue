<script setup lang="ts">
import type { AccentBlobColor, BlobBlur } from '../../types/accent'

const props = withDefaults(defineProps<{
  x: number
  y: number
  size?: string
  blur?: BlobBlur
  opacity?: number
  color?: AccentBlobColor
  shade?: 50 | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900 | 950
  customColor?: string
}>(), {
  size: '40rem',
  blur: '3xl',
  opacity: 25,
  color: 'primary',
  shade: 500,
})

const { style } = useAccentBlob(props)
</script>

<template>
  <div class="accent-blob" :style="style" aria-hidden="true" />
</template>
