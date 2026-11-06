import { describe, expect, it } from 'vite-plus/test'

import {
  checkRateLimit,
  RATE_LIMIT_MAX,
  RATE_LIMIT_WINDOW_MS,
  type RateLimitRecord,
  type RateLimitStorage,
} from './rate-limit'

function memoryStorage() {
  const map = new Map<string, RateLimitRecord>()
  const storage: RateLimitStorage = {
    getItem: async (key) => map.get(key) ?? null,
    setItem: async (key, value) => void map.set(key, value),
    removeItem: async (key) => void map.delete(key),
    getKeys: async () => [...map.keys()],
  }
  return { map, storage }
}

describe('checkRateLimit', () => {
  it('blocks past the limit, per IP, until the window resets', async () => {
    const { storage } = memoryStorage()
    const now = 1_000_000
    for (let i = 0; i < RATE_LIMIT_MAX; i++) {
      expect(await checkRateLimit(storage, 'a', now)).toBe(true)
    }
    expect(await checkRateLimit(storage, 'a', now)).toBe(false)
    expect(await checkRateLimit(storage, 'b', now)).toBe(true)
    expect(await checkRateLimit(storage, 'a', now + RATE_LIMIT_WINDOW_MS + 1)).toBe(true)
  })

  it('shares the count through storage, as separate instances would', async () => {
    const { storage } = memoryStorage()
    const now = 2_000_000
    await storage.setItem('c', { count: RATE_LIMIT_MAX, resetAt: now + RATE_LIMIT_WINDOW_MS })
    expect(await checkRateLimit(storage, 'c', now)).toBe(false)
  })

  it('prunes expired records', async () => {
    const { map, storage } = memoryStorage()
    const now = 10_000_000
    map.set('old', { count: 1, resetAt: now - 1 })
    await checkRateLimit(storage, 'new', now)
    expect([...map.keys()]).toEqual(['new'])
  })
})
