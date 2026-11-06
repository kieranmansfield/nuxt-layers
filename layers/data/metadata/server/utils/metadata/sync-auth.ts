import { createHash, timingSafeEqual } from 'node:crypto'

const digest = (value: string) => createHash('sha256').update(value).digest()

/**
 * Whether a sync request may spend provider quota. `Authorization: Bearer <secret>` must match the
 * configured secret. With no secret configured, sync is open in dev and closed in production.
 */
export function isSyncAuthorized(
  authorization: string | undefined,
  secret: string | undefined,
  dev: boolean
): boolean {
  if (!secret) return dev
  // Hashed first so both sides are the same length, which timingSafeEqual requires
  return timingSafeEqual(digest(authorization ?? ''), digest(`Bearer ${secret}`))
}
