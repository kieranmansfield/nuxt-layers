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

// Track column count in JS so v-for renders the correct number of divs.
// Mirrors the same breakpoints as mastmain (48rem = 768px, 80rem = 1280px).
const cols = ref(6)

const updateCols = () => {
  if (window.matchMedia('(min-width: 80rem)').matches) cols.value = 18
  else if (window.matchMedia('(min-width: 48rem)').matches) cols.value = 12
  else cols.value = 6
}

onMounted(() => {
  updateCols()
  window.addEventListener('resize', updateCols)
  window.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  window.removeEventListener('resize', updateCols)
  window.removeEventListener('keydown', handleKeydown)
})

// Do NOT set --grid-cols here as an inline style — that would override the
// CSS media queries in <style scoped> below. Let CSS own the variable.
const style = computed(() => ({
  display: 'grid',
  gridTemplateColumns: `repeat(${cols.value}, 1fr)`,
  gap,
  paddingInline: 'clamp(1rem, 2.5vw, 2rem)',
  pointerEvents: 'none' as const,
}))

defineExpose({ toggle })
</script>

<template>
  <Teleport to="body">
    <div v-if="visible" :style class="grid-debug z-9999 fixed inset-0" aria-hidden="true">
      <div v-for="i in cols" :key="i" :style="{ backgroundColor: color }" class="h-full" />
    </div>
  </Teleport>
</template>

