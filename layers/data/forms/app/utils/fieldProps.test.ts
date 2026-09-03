import { describe, expect, it } from 'vitest'

import type { FieldConfig } from '../types/fields'
import {
  buildBaseInputProps,
  buildFormFieldProps,
  buildNumberInputProps,
  buildTextInputProps,
} from './fieldProps'

describe('buildFormFieldProps', () => {
  it('includes only required keys when optional args are undefined', () => {
    const props = buildFormFieldProps({ name: 'email', required: true, size: 'md' })

    expect(props).toEqual({ name: 'email', required: true, size: 'md' })
    expect(props).not.toHaveProperty('label')
    expect(props).not.toHaveProperty('class')
  })

  it('renames className to class when provided', () => {
    const props = buildFormFieldProps({
      name: 'email',
      required: true,
      size: 'md',
      className: 'my-class',
    })

    expect(props).toHaveProperty('class', 'my-class')
    expect(props).not.toHaveProperty('className')
  })

  it('includes label when provided', () => {
    const props = buildFormFieldProps({
      name: 'email',
      required: false,
      size: 'sm',
      label: 'Email address',
    })

    expect(props).toEqual({ name: 'email', required: false, size: 'sm', label: 'Email address' })
  })
})

describe('buildBaseInputProps', () => {
  it('omits placeholder and leadingIcon when undefined', () => {
    const props = buildBaseInputProps({ size: 'md' })

    expect(props).toEqual({ size: 'md' })
    expect(props).not.toHaveProperty('placeholder')
    expect(props).not.toHaveProperty('leadingIcon')
  })

  it('renames icon to leadingIcon when provided', () => {
    const props = buildBaseInputProps({ size: 'md', icon: 'i-lucide-mail' })

    expect(props).toHaveProperty('leadingIcon', 'i-lucide-mail')
    expect(props).not.toHaveProperty('icon')
  })

  it('includes placeholder when provided', () => {
    const props = buildBaseInputProps({ size: 'md', placeholder: 'you@example.com' })

    expect(props).toEqual({ size: 'md', placeholder: 'you@example.com' })
  })
})

describe('buildTextInputProps', () => {
  const baseConfig: FieldConfig = {
    inputType: 'text',
    validation: {} as FieldConfig['validation'],
  }

  it('omits inputmode, autocomplete, placeholder, leadingIcon when undefined', () => {
    const props = buildTextInputProps({ config: baseConfig, size: 'md' })

    expect(props).toEqual({ type: 'text', size: 'md' })
    expect(props).not.toHaveProperty('inputmode')
    expect(props).not.toHaveProperty('autocomplete')
    expect(props).not.toHaveProperty('placeholder')
    expect(props).not.toHaveProperty('leadingIcon')
  })

  it('includes inputmode and autocomplete from config when set', () => {
    const config: FieldConfig = {
      inputType: 'email',
      inputMode: 'email',
      autocomplete: 'email',
      validation: {} as FieldConfig['validation'],
    }

    const props = buildTextInputProps({ config, size: 'lg' })

    expect(props).toEqual({
      type: 'email',
      size: 'lg',
      inputmode: 'email',
      autocomplete: 'email',
    })
  })

  it('renames icon to leadingIcon and includes placeholder when provided', () => {
    const props = buildTextInputProps({
      config: baseConfig,
      size: 'md',
      placeholder: 'Name',
      icon: 'i-lucide-user',
    })

    expect(props).toEqual({
      type: 'text',
      size: 'md',
      placeholder: 'Name',
      leadingIcon: 'i-lucide-user',
    })
  })
})

describe('buildNumberInputProps', () => {
  it('omits placeholder, leadingIcon, formatOptions when undefined', () => {
    const props = buildNumberInputProps({ size: 'md' })

    expect(props).toEqual({ size: 'md' })
    expect(props).not.toHaveProperty('placeholder')
    expect(props).not.toHaveProperty('leadingIcon')
    expect(props).not.toHaveProperty('formatOptions')
  })

  it('includes formatOptions when provided', () => {
    const formatOptions: Intl.NumberFormatOptions = { style: 'currency', currency: 'USD' }
    const props = buildNumberInputProps({ size: 'md', formatOptions })

    expect(props).toEqual({ size: 'md', formatOptions })
  })

  it('renames icon to leadingIcon when provided', () => {
    const props = buildNumberInputProps({ size: 'md', icon: 'i-lucide-hash' })

    expect(props).toHaveProperty('leadingIcon', 'i-lucide-hash')
    expect(props).not.toHaveProperty('icon')
  })
})
