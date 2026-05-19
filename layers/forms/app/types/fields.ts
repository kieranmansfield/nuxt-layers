import type { ZodTypeAny } from 'zod'

/**
 * HTML input modes for mobile keyboard optimization
 */
export type InputMode = 'text' | 'email' | 'tel' | 'url' | 'numeric' | 'decimal' | 'search'

/**
 * Nuxt UI component types for field rendering
 */
export type FieldComponent = 'UInput' | 'UTextarea' | 'UInputNumber'

/**
 * Format types for special field rendering (e.g., currency)
 */
export type FieldFormat = 'currency'

/**
 * Configuration for a field type
 */
export interface FieldConfig {
  /** Icon to display in the input (Lucide icon class) */
  icon?: string
  /** HTML input type attribute */
  inputType: string
  /** Input mode for mobile keyboards */
  inputMode?: InputMode
  /** Autocomplete attribute value */
  autocomplete?: string
  /** Placeholder text */
  placeholder?: string
  /** Zod validation schema */
  validation: ZodTypeAny
  /** Nuxt UI component to use for rendering */
  component?: FieldComponent
  /** Special formatting to apply */
  format?: FieldFormat
}

/**
 * Form field sizes matching Nuxt UI size scale
 */
export type FieldSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl'
