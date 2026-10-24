import { createError, defineEventHandler, getRequestHeader, getRequestIP, readBody } from 'h3'
import { sendContactEmail } from '#layers/mailer/server/utils/email'
import { mailerLayerHooks } from '#layers/mailer/server/utils/hooks'

import { contactSchema } from '../../shared/utils/contact-schema'

type RateLimitRecord = { count: number; resetAt: number }
// Per-instance memory: serverless instances each keep their own count. Move to useStorage()
// or the host's rate limiting if the limit must hold across instances.
const rateLimitStore = new Map<string, RateLimitRecord>()
const RATE_LIMIT_MAX = 5
const RATE_LIMIT_WINDOW_MS = 60_000

function checkRateLimit(ip: string): boolean {
  const now = Date.now()
  // Drop expired windows so the map doesn't grow with every IP ever seen
  for (const [key, entry] of rateLimitStore) if (now > entry.resetAt) rateLimitStore.delete(key)
  const record = rateLimitStore.get(ip)
  if (!record || now > record.resetAt) {
    rateLimitStore.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS })
    return true
  }
  if (record.count >= RATE_LIMIT_MAX) return false
  record.count++
  return true
}

export default defineEventHandler(async (event) => {
  // Netlify's client IP header can't be set by the client; X-Forwarded-For's first entry can
  const ip =
    getRequestHeader(event, 'x-nf-client-connection-ip') ??
    getRequestIP(event, { xForwardedFor: true }) ??
    'unknown'
  if (!checkRateLimit(ip)) {
    throw createError({
      status: 429,
      statusText: 'Too many requests. Please try again later.',
    })
  }

  const body = await readBody(event)
  const result = contactSchema.safeParse(body)

  if (!result.success) {
    throw createError({ status: 400, data: result.error.flatten().fieldErrors })
  }

  const data = result.data
  await mailerLayerHooks.callHook('contact:submitted', data)

  const emailResult = await sendContactEmail(data)

  if (emailResult.success) {
    await mailerLayerHooks.callHook('contact:sent', { ...data, messageId: emailResult.messageId })
    return { success: true }
  }

  await mailerLayerHooks.callHook('contact:failed', { ...data, error: emailResult.error })
  throw createError({
    status: 500,
    statusText: 'Failed to send message. Please try again later.',
  })
})
