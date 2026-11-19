export type RateLimitRecord = { count: number; resetAt: number }

/** The part of a Nitro storage instance the limiter needs. */
export type RateLimitStorage = {
  getItem: (key: string) => Promise<unknown>
  setItem: (key: string, value: RateLimitRecord) => Promise<void>
  removeItem: (key: string) => Promise<void>
  getKeys: () => Promise<string[]>
}

export const RATE_LIMIT_MAX = 5
export const RATE_LIMIT_WINDOW_MS = 60_000

// Per-instance throttle for pruning, holding no request data, so nothing can leak between requests
// eslint-disable-next-line no-restricted-syntax
let nextPruneAt = 0

// At most once per window, because listing keys is slow on remote drivers
async function pruneExpired(storage: RateLimitStorage, now: number) {
  if (now < nextPruneAt) return
  nextPruneAt = now + RATE_LIMIT_WINDOW_MS
  for (const key of await storage.getKeys()) {
    const record = (await storage.getItem(key)) as RateLimitRecord | null
    if (!record || now > record.resetAt) await storage.removeItem(key)
  }
}

/**
 * Counts a request from `ip` and returns whether it's allowed.
 *
 * The limit holds across instances once the app points the `rate-limit` storage mount at a shared
 * driver. The default `memory` mount counts per instance.
 *
 * ponytail: read-then-write, so concurrent requests can undercount by a few. Use the host's rate
 * limiting if the limit must be exact.
 */
export async function checkRateLimit(storage: RateLimitStorage, ip: string, now = Date.now()) {
  await pruneExpired(storage, now)
  const record = (await storage.getItem(ip)) as RateLimitRecord | null
  if (!record || now > record.resetAt) {
    await storage.setItem(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS })
    return true
  }
  if (record.count >= RATE_LIMIT_MAX) return false
  await storage.setItem(ip, { ...record, count: record.count + 1 })
  return true
}
