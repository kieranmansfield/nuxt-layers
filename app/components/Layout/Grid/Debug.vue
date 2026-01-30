<script setup lang="ts">
/**
 * GridDebug - Visual grid overlay
 *
 * Displays a semi-transparent overlay showing grid columns.
 * Toggle visibility with Ctrl+G (Windows/Linux) or Cmd+G (Mac).
 * Automatically adapts to responsive grid density (6/12/18 columns).
 *
 * @prop {string} gap - Gap between columns (default: clamp(0.75rem, 1.5vw, 1.5rem))
 * @prop {string} color - Column overlay color (default: rgba(255, 0, 0, 0.1))
 *
 * @example
 * <GridDebug color="rgba(0, 100, 255, 0.15)" />
 */

interface Props {
  gap?: string
  color?: string
}

const { gap = 'clamp(0.75rem, 1.5vw, 1.5rem)', color = 'rgba(255, 0, 0, 0.1)' } =
  defineProps<Props>()

const visible = ref(false)

const toggle = () => {
  visible.value = !visible.value
}

const handleKeydown = (event: KeyboardEvent) => {
  if ((event.ctrlKey || event.metaKey) && event.key === 'g') {
    event.preventDefault()
    toggle()
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown)
})

// Use CSS variables to match the responsive grid
const style = computed(() => ({
  display: 'grid',
  gridTemplateColumns: 'repeat(var(--grid-cols, 6), 1fr)',
  gap,
  paddingInline: 'var(--grid-padding, clamp(1rem, 2.5vw, 2rem))',
  pointerEvents: 'none' as const,
  '--grid-cols': '6',
}))

defineExpose({ toggle })
</script>

<template>
  <Teleport to="body">
    <div v-if="visible" :style class="grid-debug z-9999 fixed inset-0" aria-hidden="true">
      <div v-for="i in 18" :key="i" :style="{ backgroundColor: color }" class="h-full" />
    </div>
  </Teleport>
</template>

<style scoped>
/* Match responsive breakpoints from mastmain */
@media (width >= 48rem) {
  .grid-debug {
    --grid-cols: 12;
  }
}

@media (width >= 80rem) {
  .grid-debug {
    --grid-cols: 18;
  }
}
</style>
