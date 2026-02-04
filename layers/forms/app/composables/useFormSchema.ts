import { z, type ZodObject, type ZodRawShape, type ZodTypeAny } from 'zod'
import { fieldConfigs } from '../config/fields'
import type { FieldType } from '../types/fields'

/**
 * Creates a Zod schema from a field type map
 *
 * @example
 * const schema = useFormSchema({
 *   email: 'email',
 *   name: 'name',
 *   message: 'textarea'
 * })
 * // Returns z.object({ email: z.string().email(), name: z.string().min(1), message: z.string() })
 */
export function useFormSchema<T extends Record<string, FieldType>>(
  fields: T
): ZodObject<{ [K in keyof T]: ZodTypeAny }> {
  const shape = Object.fromEntries(
    Object.entries(fields).map(([key, type]) => [key, fieldConfigs[type].validation])
  ) as ZodRawShape

  return z.object(shape) as ZodObject<{ [K in keyof T]: ZodTypeAny }>
}

/**
 * Gets the validation schema for a specific field type
 *
 * @example
 * const emailValidation = getFieldValidation('email')
 * // Returns z.string().email('Please enter a valid email')
 */
export function getFieldValidation(type: FieldType): ZodTypeAny {
  return fieldConfigs[type].validation
}
