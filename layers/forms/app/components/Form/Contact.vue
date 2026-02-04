<script setup lang="ts">
import type { FormSubmitEvent } from '@nuxt/ui'
import { z } from 'zod'
import { fieldConfigs } from '../../config/fields'

const emit = defineEmits<{
  submit: [data: FormState]
}>()

const schema = z.object({
  name: fieldConfigs.name.validation.pipe(z.string().min(3, 'Name must be at least 3 characters')),
  email: fieldConfigs.email.validation,
  message: fieldConfigs.textarea.validation.pipe(
    z.string().min(8, 'Message must be at least 8 characters')
  ),
})

type FormState = z.infer<typeof schema>

const state = reactive<Partial<FormState>>({
  name: undefined,
  email: undefined,
  message: undefined,
})

const toast = useToast()

async function onSubmit(event: FormSubmitEvent<FormState>) {
  toast.add({
    title: 'Success',
    description: 'The form has been submitted.',
    color: 'success',
  })
  emit('submit', event.data)
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

    <UButton type="submit" size="xl"> Submit </UButton>
  </UForm>
</template>
