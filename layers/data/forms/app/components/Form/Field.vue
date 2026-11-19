<script setup lang="ts">
  import { fieldConfigs, type FieldType } from '../../config/fields'
  import type { FieldSize } from '../../types/fields'
  import {
    buildBaseInputProps,
    buildFormFieldProps,
    buildNumberInputProps,
    buildTextInputProps,
  } from '../../utils/fieldProps'

  const {
    type = 'text',
    name,
    label = undefined,
    required = false,
    size = 'md',
    placeholder = undefined,
    icon = undefined,
    class: className = undefined,
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

  const currencyOptions = computed((): Intl.NumberFormatOptions | undefined => {
    if (config.value.format === 'currency') {
      return {
        style: 'currency' as const,
        currency: 'USD',
      }
    }
    return undefined
  })

  const formFieldProps = computed(() =>
    buildFormFieldProps({
      name,
      required,
      size,
      label,
      className,
    })
  )

  const baseInputProps = computed(() =>
    buildBaseInputProps({
      size,
      placeholder: resolvedPlaceholder.value,
      icon: resolvedIcon.value,
    })
  )

  const numberInputProps = computed(() =>
    buildNumberInputProps({
      size,
      placeholder: resolvedPlaceholder.value,
      icon: resolvedIcon.value,
      formatOptions: currencyOptions.value,
    })
  )

  const textInputProps = computed(() =>
    buildTextInputProps({
      config: config.value,
      size,
      placeholder: resolvedPlaceholder.value,
      icon: resolvedIcon.value,
    })
  )
</script>

<template>
  <UFormField v-bind="formFieldProps">
    <UTextarea v-if="isTextarea" v-model="model as string" autoresize v-bind="baseInputProps" />

    <UInputNumber v-else-if="isNumber" v-model="model as number" v-bind="numberInputProps" />

    <UInput v-else v-model="model as string" v-bind="textInputProps" />
  </UFormField>
</template>
