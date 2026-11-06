import type { FieldType } from '../config/fields'
import { createFormSchema } from '../utils/formSchema'

/** @deprecated Not a composable: use `createFormSchema`. Remove in the next major. */
export function useFormSchema<T extends Record<string, FieldType>>(fields: T) {
  return createFormSchema(fields)
}
