/**
 * Whether the `shaders` package can render here. It needs WebGPU, so this is false on the
 * server, during hydration, and in browsers without `navigator.gpu`.
 */
export function useEffectsSupport() {
  const supported = ref(false)

  onMounted(() => {
    supported.value = typeof navigator !== 'undefined' && 'gpu' in navigator
  })

  return { supported }
}
