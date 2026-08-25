import { describe, expect, it } from 'vitest'

import { getFieldValidation, useFormSchema } from '../../layers/forms/app/composables/useFormSchema'

describe('useFormSchema', () => {
  it('builds a schema that validates the selected field types', () => {
    const schema = useFormSchema({
      name: 'name',
      email: 'email',
      website: 'url',
      budget: 'currency',
    })

    expect(
      schema.safeParse({
        name: 'Ada Lovelace',
        email: 'ada@example.com',
        website: 'https://example.com',
        budget: 42,
      }).success
    ).toBe(true)

    const invalid = schema.safeParse({
      name: '',
      email: 'not-an-email',
      website: 'example',
      budget: -2,
    })

    expect(invalid.success).toBe(false)

    if (!invalid.success) {
      expect(invalid.error.issues.map((issue) => issue.path.join('.'))).toEqual([
        'name',
        'email',
        'website',
        'budget',
      ])
    }
  })

  it('returns the field validator for a single field type', () => {
    const phoneValidation = getFieldValidation('phone')

    expect(phoneValidation.safeParse('+1 (555) 000-0000').success).toBe(true)
    expect(phoneValidation.safeParse('abc').success).toBe(false)
  })
})
