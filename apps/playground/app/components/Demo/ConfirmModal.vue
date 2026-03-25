<script setup lang="ts">
const {
  open = false,
  title = 'Are you sure?',
  description = 'This action cannot be undone.',
  confirmLabel = 'Confirm',
  onConfirm,
} = defineProps<{
  open?: boolean
  title?: string
  description?: string
  confirmLabel?: string
  onConfirm?: () => void
}>()

const emit = defineEmits<{
  'update:open': [value: boolean]
  'close': []
}>()

function dismiss() {
  emit('update:open', false)
  emit('close')
}

function confirm() {
  onConfirm?.()
  dismiss()
}
</script>

<template>
  <BaseModal :open="open" :title="title" :description="description" size="sm" @update:open="emit('update:open', $event)" @close="emit('close')">
    <template #footer="{ dismiss: d }">
      <UButton variant="ghost" color="neutral" @click="d">
        Cancel
      </UButton>
      <UButton color="error" @click="confirm">
        {{ confirmLabel }}
      </UButton>
    </template>
  </BaseModal>
</template>
