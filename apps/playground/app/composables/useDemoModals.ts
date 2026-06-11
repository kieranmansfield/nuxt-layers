import ConfirmModal from '../components/Demo/ConfirmModal.vue'
import FormModal from '../components/Demo/FormModal.vue'
import InfoModal from '../components/Demo/InfoModal.vue'

export const useConfirmModal = createModal(ConfirmModal)
export const useInfoModal = createModal(InfoModal)
export const useFormModal = createModal(FormModal)
