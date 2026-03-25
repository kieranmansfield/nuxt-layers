import { createSharedComposable } from '@vueuse/core'
import MastNavModal from '../components/Mast/NavModal.vue'

function _useMastNav() {
  if (import.meta.server) return { open: () => {}, close: () => {} }

  const overlay = useOverlay()
  const modal = overlay.create(MastNavModal)

  function open() {
    try { useSmoothScroll().lockScrolling() }
    catch {}
    modal.open()
  }

  function close() {
    modal.close()
    try { useSmoothScroll().unlockScrolling() }
    catch {}
  }

  return { open, close }
}

export const useMastNav = createSharedComposable(_useMastNav)
