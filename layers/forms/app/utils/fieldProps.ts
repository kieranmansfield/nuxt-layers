import type { FieldConfig } from '../types/fields'
import type { FieldSize } from '../types/fields'

export function buildFormFieldProps(args: {
  name: string
  required: boolean
  size: FieldSize
  label?: string | undefined
  className?: string | undefined
}) {
  const { name, required, size, label, className } = args
  return {
    name,
    required,
    size,
    ...(label !== undefined && { label }),
    ...(className !== undefined && { class: className }),
  }
}

export function buildBaseInputProps(args: {
  size: FieldSize
  placeholder?: string | undefined
  icon?: string | undefined
}) {
  const { size, placeholder, icon } = args
  return {
    size,
    ...(placeholder !== undefined && { placeholder }),
    ...(icon !== undefined && { leadingIcon: icon }),
  }
}

// fallow-ignore-next-line complexity
export function buildTextInputProps(args: {
  config: FieldConfig
  size: FieldSize
  placeholder?: string | undefined
  icon?: string | undefined
}) {
  const { config, size, placeholder, icon } = args
  return {
    type: config.inputType,
    size,
    ...(config.inputMode !== undefined && { inputmode: config.inputMode }),
    ...(config.autocomplete !== undefined && { autocomplete: config.autocomplete }),
    ...(placeholder !== undefined && { placeholder }),
    ...(icon !== undefined && { leadingIcon: icon }),
  }
}

export function buildNumberInputProps(args: {
  size: FieldSize
  placeholder?: string | undefined
  icon?: string | undefined
  formatOptions?: Intl.NumberFormatOptions | undefined
}) {
  const { size, placeholder, icon, formatOptions } = args
  return {
    size,
    ...(placeholder !== undefined && { placeholder }),
    ...(icon !== undefined && { leadingIcon: icon }),
    ...(formatOptions !== undefined && { formatOptions }),
  }
}
