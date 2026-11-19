import { describe, expect, it } from 'vite-plus/test'

import { isSyncAuthorized } from './sync-auth'

describe('isSyncAuthorized', () => {
  it('requires the matching bearer token when a secret is set', () => {
    expect(isSyncAuthorized('Bearer s3cret', 's3cret', false)).toBe(true)
    expect(isSyncAuthorized('Bearer wrong', 's3cret', false)).toBe(false)
    expect(isSyncAuthorized('s3cret', 's3cret', false)).toBe(false)
    expect(isSyncAuthorized(undefined, 's3cret', true)).toBe(false)
  })

  it('with no secret, is open in dev and closed in production', () => {
    expect(isSyncAuthorized(undefined, '', true)).toBe(true)
    expect(isSyncAuthorized(undefined, '', false)).toBe(false)
    expect(isSyncAuthorized('Bearer ', undefined, false)).toBe(false)
  })
})
