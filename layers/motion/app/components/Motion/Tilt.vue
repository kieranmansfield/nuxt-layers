<script setup lang="ts">
const {
  maxTilt = 15,
  perspective = 800,
  damping = 40,
  stiffness = 250,
} = defineProps<{
  maxTilt?: number
  perspective?: number
  damping?: number
  stiffness?: number
}>()

const el = ref<HTMLElement | null>(null)
useTiltEffect(el, { maxTilt, perspective, damping, stiffness })
</script>

<template>
  <div ref="el" class="will-change-transform" style="transform-style: preserve-3d">
    <slot />
  </div>
</template>
