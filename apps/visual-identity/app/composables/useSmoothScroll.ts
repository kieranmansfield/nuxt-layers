// Stub for the UI layer's Mast components — smooth-scroll from the routing layer.
export function useSmoothScroll() {
  return {
    scrollTo: (): void => {},
    lockScrolling: (): void => {},
    unlockScrolling: (): void => {},
  }
}
