<script setup lang="ts">
const {
  open = false,
  onSubmit,
} = defineProps<{
  open?: boolean
  onSubmit?: (data: { name: string; email: string; message: string }) => void
}>()

const emit = defineEmits<{
  'update:open': [value: boolean]
  'close': []
}>()

const name = ref('')
const email = ref('')
const message = ref('')
const loading = ref(false)

function dismiss() {
  emit('update:open', false)
  emit('close')
}

async function submit() {
  if (!name.value || !email.value) return
  loading.value = true
  await new Promise(r => setTimeout(r, 800))
  onSubmit?.({ name: name.value, email: email.value, message: message.value })
  loading.value = false
  name.value = ''
  email.value = ''
  message.value = ''
  dismiss()
}
</script>

<template>
  <BaseModal :open="open" title="Send a message" description="We'll get back to you within 24 hours." size="md" @update:open="emit('update:open', $event)" @close="emit('close')">
    <div class="space-y-4">
      <UFormField label="Name" required>
        <UInput v-model="name" placeholder="Your name" class="w-full" />
      </UFormField>
      <UFormField label="Email" required>
        <UInput v-model="email" type="email" placeholder="you@example.com" class="w-full" />
      </UFormField>
      <UFormField label="Message">
        <UTextarea v-model="message" placeholder="What's on your mind?" :rows="4" class="w-full" />
      </UFormField>
    </div>
    <template #footer="{ dismiss: d }">
      <UButton variant="ghost" color="neutral" :disabled="loading" @click="d">
        Cancel
      </UButton>
      <UButton :loading="loading" :disabled="!name || !email" @click="submit">
        Send message
      </UButton>
    </template>
  </BaseModal>
</template>
