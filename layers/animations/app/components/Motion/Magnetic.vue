<script setup lang="ts">
  const {
    strength = 0.3,
    radius = 100,
    damping = 30,
    stiffness = 300,
  } = defineProps<{
    strength?: number
    radius?: number
    damping?: number
    stiffness?: number
  }>()

  const el = ref<HTMLElement | null>(null)
  const { isActive } = useMagneticElement(el, { strength, radius, damping, stiffness })
</script>

<template>
  <div ref="el" class="will-change-transform">
    <slot :is-active />
  </div>
</template>
