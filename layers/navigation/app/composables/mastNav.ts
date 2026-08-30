import { createModal } from '../utils/createModal'
import MastNavModal from '../components/Mast/NavModal.vue'

export const useMastNav = createModal(MastNavModal, {
  onOpen: () => {
    try {
      useSmoothScroll().lockScrolling()
    } catch {}
  },
  onClose: () => {
    try {
      useSmoothScroll().unlockScrolling()
    } catch {}
  },
})
