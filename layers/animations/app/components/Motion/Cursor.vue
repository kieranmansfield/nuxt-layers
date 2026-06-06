<script setup lang="ts">
  type CursorType = 'dot' | 'ring' | 'dot-ring' | 'glow'

  const {
    type = 'dot-ring',
    visible = true,
    dotSize = 8,
    ringSize = 36,
    glowSize = 80,
    smoothing = 0.15,
    dotSmoothing = 0.35,
    ringSmoothing = 0.1,
    glowSmoothing = 0.08,
    color = 'var(--ui-color-primary-500)',
    hideCursor = true,
  } = defineProps<{
    type?: CursorType
    visible?: boolean
    dotSize?: number
    ringSize?: number
    glowSize?: number
    smoothing?: number
    dotSmoothing?: number
    ringSmoothing?: number
    glowSmoothing?: number
    color?: string
    hideCursor?: boolean
  }>()

  // Primary follower: dot in 'dot'/'dot-ring', ring in 'ring', blob in 'glow'
  const primarySmoothing = computed(() => {
    if (type === 'glow') return glowSmoothing ?? smoothing
    if (type === 'ring') return ringSmoothing ?? smoothing
    return dotSmoothing ?? smoothing
  })

  // Secondary follower: lagging ring in 'dot-ring' only
  const secondarySmoothing = computed(() => ringSmoothing ?? smoothing * 0.4)

  const primary = useCursorFollower({ smoothing: primarySmoothing })
  const secondary = useCursorFollower({ smoothing: secondarySmoothing })

  onMounted(() => {
    if (hideCursor) document.documentElement.style.cursor = 'none'
  })

  onUnmounted(() => {
    document.documentElement.style.cursor = ''
  })
</script>

<template>
  <Teleport to="body">
    <div
      class="motion-cursor pointer-events-none fixed inset-0 z-9999 transition-opacity duration-300"
      :style="{ opacity: visible ? 1 : 0 }"
      aria-hidden="true"
    >
      <!-- dot — 'dot' and 'dot-ring' modes -->
      <div
        v-if="type === 'dot' || type === 'dot-ring'"
        class="absolute top-0 left-0 rounded-full will-change-transform"
        :style="{
          width: `${dotSize}px`,
          height: `${dotSize}px`,
          backgroundColor: color,
          transform: `translate(${primary.x.value - dotSize / 2}px, ${primary.y.value - dotSize / 2}px)`,
        }"
      />

      <!-- ring — primary in 'ring' mode, secondary (lagging) in 'dot-ring' -->
      <div
        v-if="type === 'ring' || type === 'dot-ring'"
        class="absolute top-0 left-0 rounded-full border-2 will-change-transform"
        :style="{
          width: `${ringSize}px`,
          height: `${ringSize}px`,
          borderColor: color,
          transform:
            type === 'dot-ring'
              ? `translate(${secondary.x.value - ringSize / 2}px, ${secondary.y.value - ringSize / 2}px)`
              : `translate(${primary.x.value - ringSize / 2}px, ${primary.y.value - ringSize / 2}px)`,
        }"
      />

      <!-- glow — large blurred blob -->
      <div
        v-if="type === 'glow'"
        class="absolute top-0 left-0 rounded-full will-change-transform"
        :style="{
          width: `${glowSize}px`,
          height: `${glowSize}px`,
          backgroundColor: color,
          opacity: 0.3,
          filter: 'blur(20px)',
          transform: `translate(${primary.x.value - glowSize / 2}px, ${primary.y.value - glowSize / 2}px)`,
        }"
      />
    </div>
  </Teleport>
</template>
