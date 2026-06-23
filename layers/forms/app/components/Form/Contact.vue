<script setup lang="ts">
  import type { FormSubmitEvent } from '@nuxt/ui'

  import { contactSchema, type ContactData } from '../../utils/contact-schema'

  const emit = defineEmits<{
    submit: [data: ContactData]
  }>()

  const schema = contactSchema

  type FormState = ContactData

  const state = reactive({ name: '', email: '', message: '' })

  const toast = useToast()
  const isLoading = ref(false)

  async function onSubmit(event: FormSubmitEvent<FormState>) {
    isLoading.value = true
    try {
      await $fetch('/api/contact', { method: 'POST', body: event.data })
      toast.add({
        title: 'Message sent!',
        description: 'Thanks for reaching out.',
        color: 'success',
      })
      emit('submit', event.data)
    } catch {
      toast.add({
        title: 'Something went wrong',
        description: 'Please try again later.',
        color: 'error',
      })
    } finally {
      isLoading.value = false
    }
  }

  async function onError() {
    toast.add({
      title: 'Error',
      description: 'There was an error submitting the form.',
      color: 'error',
    })
  }
</script>

<template>
  <UForm :schema :state class="w-full space-y-4 lg:w-9/12" @submit="onSubmit" @error="onError">
    <FormField
      v-model="state.name"
      type="name"
      name="name"
      label="Name"
      required
      size="xl"
      class="w-full"
    />
    <FormField
      v-model="state.email"
      type="email"
      name="email"
      label="Email"
      required
      size="xl"
      class="w-full"
    />
    <FormField
      v-model="state.message"
      type="textarea"
      name="message"
      label="Message"
      required
      size="xl"
      class="w-full"
    />

    <UButton type="submit" size="xl" :loading="isLoading" :disabled="isLoading"> Submit </UButton>
  </UForm>
</template>
