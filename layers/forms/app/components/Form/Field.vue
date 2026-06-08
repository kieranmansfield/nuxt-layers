<!-- eslint-disable vue/require-default-prop -->
<script setup lang="ts">
  import { fieldConfigs, type FieldType } from '../../config/fields'
  import type { FieldSize } from '../../types/fields'

  const {
    type = 'text',
    name,
    label,
    required = false,
    size = 'md',
    placeholder,
    icon,
    class: className,
  } = defineProps<{
    /** Field type determines validation, icon, and input behavior */
    type?: FieldType
    /** Field name for form binding */
    name: string
    /** Label text displayed above the field */
    label?: string
    /** Whether the field is required */
    required?: boolean
    /** Field size (xs, sm, md, lg, xl) */
    size?: FieldSize
    /** Override default placeholder */
    placeholder?: string
    /** Override default icon */
    icon?: string
    /** Additional CSS classes */
    class?: string
  }>()

  const model = defineModel<string | number>()

  const config = computed(() => fieldConfigs[type])

  const resolvedPlaceholder = computed(() => placeholder ?? config.value.placeholder)
  const resolvedIcon = computed(() => icon ?? config.value.icon)

  const isTextarea = computed(() => config.value.component === 'UTextarea')
  const isNumber = computed(() => config.value.component === 'UInputNumber')

  const formFieldProps = computed(() => ({
    name,
    required,
    size,
    ...(label !== undefined && { label }),
    ...(className !== undefined && { class: className }),
  }))

  const baseInputProps = computed(() => ({
    size,
    ...(resolvedPlaceholder.value !== undefined && { placeholder: resolvedPlaceholder.value }),
    ...(resolvedIcon.value !== undefined && { leadingIcon: resolvedIcon.value }),
  }))

  const numberInputProps = computed(() => ({
    size,
    ...(resolvedPlaceholder.value !== undefined && { placeholder: resolvedPlaceholder.value }),
    ...(resolvedIcon.value !== undefined && { leadingIcon: resolvedIcon.value }),
    ...(currencyOptions.value !== undefined && { formatOptions: currencyOptions.value }),
  }))

  const textInputProps = computed(() => ({
    type: config.value.inputType,
    size,
    ...(config.value.inputMode !== undefined && { inputmode: config.value.inputMode }),
    ...(config.value.autocomplete !== undefined && { autocomplete: config.value.autocomplete }),
    ...(resolvedPlaceholder.value !== undefined && { placeholder: resolvedPlaceholder.value }),
    ...(resolvedIcon.value !== undefined && { leadingIcon: resolvedIcon.value }),
  }))

  const currencyOptions = computed((): Intl.NumberFormatOptions | undefined => {
    if (config.value.format === 'currency') {
      return {
        style: 'currency' as const,
        currency: 'USD',
      }
    }
    return undefined
  })
</script>

<template>
  <UFormField v-bind="formFieldProps">
    <UTextarea v-if="isTextarea" v-model="model as string" autoresize v-bind="baseInputProps" />

    <UInputNumber v-else-if="isNumber" v-model="model as number" v-bind="numberInputProps" />

    <UInput v-else v-model="model as string" v-bind="textInputProps" />
  </UFormField>
</template>
