<script setup lang="ts">
  /**
   * BaseModal — overlay-compatible modal preset on UModal, which supplies the dialog role,
   * focus trap, Escape, portal and transitions. This adds a size scale and a footer slot that
   * receives `dismiss`.
   *
   * Example:
   *   // components/ConfirmModal.vue
   *   <BaseModal title="Are you sure?" @confirm="..." />
   *
   *   // composables/confirmModal.ts
   *   export const useConfirmModal = createModal(ConfirmModal)
   */
  const {
    open = false,
    title = undefined,
    description = undefined,
    size = 'md',
  } = defineProps<{
    open?: boolean
    title?: string
    description?: string
    size?: 'sm' | 'md' | 'lg' | 'xl' | 'full'
  }>()

  const emit = defineEmits<{
    'update:open': [value: boolean]
    close: []
  }>()

  const sizeClass = {
    sm: 'sm:max-w-sm',
    md: 'sm:max-w-md',
    lg: 'sm:max-w-lg',
    xl: 'sm:max-w-xl',
    full: '',
  } as const

  function dismiss() {
    emit('update:open', false)
    emit('close')
  }
</script>

<template>
  <UModal
    :open
    v-bind="{
      ...(title !== undefined && { title }),
      ...(description !== undefined && { description }),
    }"
    :fullscreen="size === 'full'"
    :ui="{
      overlay: 'z-(--z-modal)',
      content: `z-(--z-modal) ${sizeClass[size]}`,
      footer: 'justify-end gap-3',
    }"
    @update:open="(value) => !value && dismiss()"
  >
    <template v-if="$slots.header" #header>
      <slot name="header" />
    </template>
    <template v-if="$slots.default" #body>
      <slot />
    </template>
    <template v-if="$slots.footer" #footer>
      <slot name="footer" :dismiss />
    </template>
  </UModal>
</template>
