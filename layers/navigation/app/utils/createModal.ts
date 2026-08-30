import type { Component } from 'vue'

export type ModalController<P extends Record<string, unknown>> = {
  open: (props?: Partial<P>) => void
  close: () => void
  patch: (props: Partial<P>) => void
}

export type CreateModalOptions = {
  /** Called before the modal opens — e.g. lock body scroll. */
  onOpen?: () => void
  /** Called after the modal closes — e.g. unlock body scroll. */
  onClose?: () => void
}

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
 * Pass `onOpen`/`onClose` for side effects that must run around every open/close
 * (e.g. scroll-locking) without duplicating the overlay wiring at each call site.
 *
 * The modal component must accept `open: boolean` and emit `update:open` + `close`.
 * Extend BaseModal.vue as a starting point.
 */
export function createModal<P extends Record<string, unknown>>(
  component: Component,
  options: CreateModalOptions = {}
) {
  return createSharedComposable((): ModalController<P> => {
    if (import.meta.server) {
      return { open: () => {}, close: () => {}, patch: () => {} }
    }

    const overlay = useOverlay()
    // useOverlay is a Nuxt UI auto-import; not resolvable in standalone layer typecheck
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const modal = overlay.create(component as any)
    return {
      open: (props?: Partial<P>) => {
        options.onOpen?.()
        modal.open(props as never)
      },
      close: () => {
        modal.close()
        options.onClose?.()
      },
      patch: (props: Partial<P>) => modal.patch(props as never),
    }
  })
}
