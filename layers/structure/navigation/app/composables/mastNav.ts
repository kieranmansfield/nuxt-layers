import MastNavModal from '../components/Mast/NavModal.vue'
import { createModal } from '../utils/createModal'

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
