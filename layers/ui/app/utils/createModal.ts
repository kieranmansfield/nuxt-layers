import type { Component } from 'vue'

/**
 * Factory that turns any overlay-compatible component into a shared modal composable.
 *
 * Usage:
 *   // composables/myModal.ts
 *   import MyModal from '../components/MyModal.vue'
 *   export const useMyModal = createModal(MyModal)
 *
 *   // anywhere in the app
 *   const { open, close, patch } = useMyModal()
 *   open({ title: 'Hello' })
 *
 * The returned composable is wrapped with createSharedComposable so overlay.create()
 * is only called once regardless of how many components call it.
 *
 * The modal component must accept `open: boolean` and emit `update:open` + `close`.
 * Extend BaseModal.vue as a starting point.
 */
export function createModal<P extends Record<string, unknown>>(component: Component) {
  return createSharedComposable(() => {
    if (import.meta.server) return { open: () => {}, close: () => {}, patch: () => {} }

    const overlay = useOverlay()
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const modal = overlay.create(component as any)
    return {
      open: (props?: Partial<P>) => modal.open(props as never),
      close: () => modal.close(),
      patch: (props: Partial<P>) => modal.patch(props as never),
    }
  })
}
