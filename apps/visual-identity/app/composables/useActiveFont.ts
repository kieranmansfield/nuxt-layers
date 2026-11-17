/** Selected font role tab shared by the typography pages (axes + scale). */
export function useActiveFont() {
  const { state } = useBrandState()

  const activeFont = ref(state.value.typography[0]?.id ?? 'heading')

  const currentFont = computed(
    () => state.value.typography.find((f) => f.id === activeFont.value) ?? state.value.typography[0]
  )

  const fontTabs = computed(() =>
    state.value.typography.map((f) => ({ label: f.role, value: f.id }))
  )

  return { activeFont, currentFont, fontTabs }
}
