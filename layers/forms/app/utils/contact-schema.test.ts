import { describe, expect, it } from 'vitest'

import { contactSchema } from './contact-schema'

describe('contactSchema', () => {
  it('fails when name is too short', () => {
    const result = contactSchema.safeParse({
      name: 'ab',
      email: 'valid@example.com',
      message: 'a long enough message',
    })

    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0]?.message).toBe('Name must be at least 3 characters')
    }
  })

  it('fails when email is invalid', () => {
    const result = contactSchema.safeParse({
      name: 'Kieran',
      email: 'not-an-email',
      message: 'a long enough message',
    })

    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0]?.message).toBe('Please enter a valid email')
    }
  })

  it('fails when message is too short', () => {
    const result = contactSchema.safeParse({
      name: 'Kieran',
      email: 'valid@example.com',
      message: 'short',
    })

    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0]?.message).toBe('Message must be at least 8 characters')
    }
  })

  it('passes with valid input', () => {
    const result = contactSchema.safeParse({
      name: 'Kieran',
      email: 'valid@example.com',
      message: 'a long enough message',
    })

    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data).toEqual({
        name: 'Kieran',
        email: 'valid@example.com',
        message: 'a long enough message',
      })
    }
  })

  it('returns a safeParse shape with success/data or success/error', () => {
    const passResult = contactSchema.safeParse({
      name: 'Kieran',
      email: 'valid@example.com',
      message: 'a long enough message',
    })
    expect(passResult).toHaveProperty('success')
    expect(passResult).toHaveProperty('data')

    const failResult = contactSchema.safeParse({ name: '', email: '', message: '' })
    expect(failResult).toHaveProperty('success')
    expect(failResult).toHaveProperty('error')
  })
})
