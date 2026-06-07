<script setup lang="ts">
/**
 * BaseModal — overlay-compatible modal shell.
 *
 * Use this as a starting point for new modals:
 *   1. Copy or extend this component
 *   2. Add your props and content in the slots
 *   3. Register with createModal() in a composable
 *
 * Example:
 *   // components/ConfirmModal.vue
 *   <BaseModal title="Are you sure?" @confirm="..." />
 *
 *   // composables/confirmModal.ts
 *   export const useConfirmModal = createModal(ConfirmModal)
 */
const { open = false, title, description, size = 'md' } = defineProps<{
  open?: boolean
  title?: string
  description?: string
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full'
}>()

const emit = defineEmits<{
  'update:open': [value: boolean]
  'close': []
}>()

const sizeClass: Record<string, string> = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-xl',
  full: 'max-w-full',
}

function dismiss() {
  emit('update:open', false)
  emit('close')
}
</script>

<template>
  <Transition name="base-modal">
    <div
      v-if="open"
      class="fixed inset-0 z-50 flex items-center justify-center p-4"
      @click.self="dismiss"
    >
      <!-- Backdrop -->
      <div class="bg-(--ui-bg-muted) absolute inset-0 opacity-60" @click="dismiss" />

      <!-- Panel -->
      <div
        class="bg-(--ui-bg) ring-(--ui-border) relative w-full rounded-2xl shadow-xl ring-1"
        :class="sizeClass[size]"
      >
        <!-- Header -->
        <div v-if="title || $slots.header" class="border-(--ui-border) flex items-start justify-between border-b px-6 py-4">
          <slot name="header">
            <div>
              <p class="text-(--ui-text) text-base font-semibold">
                {{ title }}
              </p>
              <p v-if="description" class="text-(--ui-text-muted) mt-0.5 text-sm">
                {{ description }}
              </p>
            </div>
          </slot>
          <button
            class="text-(--ui-text-muted) hover:text-(--ui-text) ml-4 cursor-pointer border-0 bg-transparent p-1 transition-colors"
            aria-label="Close"
            @click="dismiss"
          >
            <UIcon name="lucide:x" class="size-5" />
          </button>
        </div>

        <!-- Body -->
        <div class="px-6 py-5">
          <slot />
        </div>

        <!-- Footer -->
        <div v-if="$slots.footer" class="border-(--ui-border) flex justify-end gap-3 border-t px-6 py-4">
          <slot name="footer" :dismiss="dismiss" />
        </div>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.base-modal-enter-active,
.base-modal-leave-active {
  transition: opacity 200ms ease;
}
.base-modal-enter-from,
.base-modal-leave-to {
  opacity: 0;
}
.base-modal-enter-active .bg-\(--ui-bg\),
.base-modal-leave-active .bg-\(--ui-bg\) {
  transition: opacity 200ms ease, transform 200ms ease;
}
.base-modal-enter-from .bg-\(--ui-bg\),
.base-modal-leave-to .bg-\(--ui-bg\) {
  opacity: 0;
  transform: scale(0.96) translateY(4px);
}
</style>
