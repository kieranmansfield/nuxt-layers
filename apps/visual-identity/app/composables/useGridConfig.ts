// Stub for the UI layer's Mast components — z-index config from the layout layer.
export function useGridConfig() {
  return {
    useZIndex: (_key: string): number => 100,
  }
}
