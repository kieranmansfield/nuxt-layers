import { z } from 'zod'
import type { FieldConfig, FieldType } from '../types/fields'

/**
 * Field configuration registry
 * Defines default behavior, validation, and UI props for each field type
 */
export const fieldConfigs: Record<FieldType, FieldConfig> = {
  text: {
    inputType: 'text',
    inputMode: 'text',
    autocomplete: 'off',
    validation: z.string(),
  },

  name: {
    icon: 'i-lucide-user',
    inputType: 'text',
    inputMode: 'text',
    autocomplete: 'name',
    placeholder: 'John Doe',
    validation: z.string().min(1, 'Name is required'),
  },

  email: {
    icon: 'i-lucide-mail',
    inputType: 'email',
    inputMode: 'email',
    autocomplete: 'email',
    placeholder: 'you@example.com',
    validation: z.string().email('Please enter a valid email'),
  },

  phone: {
    icon: 'i-lucide-phone',
    inputType: 'tel',
    inputMode: 'tel',
    autocomplete: 'tel',
    placeholder: '+1 (555) 000-0000',
    validation: z.string().regex(/^\+?[\d\s\-()]+$/, 'Please enter a valid phone number'),
  },

  password: {
    icon: 'i-lucide-lock',
    inputType: 'password',
    autocomplete: 'current-password',
    validation: z.string().min(8, 'Password must be at least 8 characters'),
  },

  url: {
    icon: 'i-lucide-link',
    inputType: 'url',
    inputMode: 'url',
    autocomplete: 'url',
    placeholder: 'https://example.com',
    validation: z.string().url('Please enter a valid URL'),
  },

  textarea: {
    inputType: 'text',
    inputMode: 'text',
    autocomplete: 'off',
    validation: z.string(),
    component: 'UTextarea',
  },

  number: {
    icon: 'i-lucide-hash',
    inputType: 'number',
    inputMode: 'numeric',
    validation: z.number(),
    component: 'UInputNumber',
  },

  date: {
    icon: 'i-lucide-calendar',
    inputType: 'date',
    validation: z.string(),
  },

  time: {
    icon: 'i-lucide-clock',
    inputType: 'time',
    validation: z.string(),
  },

  search: {
    icon: 'i-lucide-search',
    inputType: 'search',
    inputMode: 'search',
    autocomplete: 'off',
    placeholder: 'Search...',
    validation: z.string(),
  },

  currency: {
    icon: 'i-lucide-dollar-sign',
    inputType: 'text',
    inputMode: 'decimal',
    validation: z.number().positive('Amount must be positive'),
    component: 'UInputNumber',
    format: 'currency',
  },
} as const
