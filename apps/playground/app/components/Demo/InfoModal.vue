<script setup lang="ts">
const {
  open = false,
  title = 'Information',
  body = '',
  icon = 'lucide:info',
} = defineProps<{
  open?: boolean
  title?: string
  body?: string
  icon?: string
}>()

const emit = defineEmits<{
  'update:open': [value: boolean]
  'close': []
}>()
</script>

<template>
  <BaseModal :open="open" :title="title" size="md" @update:open="emit('update:open', $event)" @close="emit('close')">
    <div class="flex gap-4">
      <div class="bg-(--ui-color-info-100) dark:bg-(--ui-color-info-900)/30 flex size-10 shrink-0 items-center justify-center rounded-full">
        <UIcon :name="icon" class="text-(--ui-color-info-500) size-5" />
      </div>
      <div class="space-y-2">
        <p class="text-(--ui-text) text-sm leading-relaxed">
          {{ body }}
        </p>
        <slot />
      </div>
    </div>
    <template #footer="{ dismiss }">
      <UButton @click="dismiss">
        Got it
      </UButton>
    </template>
  </BaseModal>
</template>
