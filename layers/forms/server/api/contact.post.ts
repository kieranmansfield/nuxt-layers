import { sendContactEmail } from '#layers/mailer/server/utils/email'
import { mailerLayerHooks } from '#layers/mailer/server/utils/hooks'
import { z } from 'zod'

const contactSchema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters'),
  email: z.string().email('Please enter a valid email'),
  message: z.string().min(8, 'Message must be at least 8 characters'),
})

type RateLimitRecord = { count: number; resetAt: number }
const rateLimitStore = new Map<string, RateLimitRecord>()
const RATE_LIMIT_MAX = 5
const RATE_LIMIT_WINDOW_MS = 60_000

function checkRateLimit(ip: string): boolean {
  const now = Date.now()
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
  const ip = getRequestIP(event, { xForwardedFor: true }) ?? 'unknown'
  if (!checkRateLimit(ip)) {
    throw createError({ statusCode: 429, statusMessage: 'Too many requests. Please try again later.' })
  }

  const body = await readBody(event)
  const result = contactSchema.safeParse(body)

  if (!result.success) {
    throw createError({ statusCode: 400, data: result.error.flatten().fieldErrors })
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
    statusCode: 500,
    statusMessage: 'Failed to send message. Please try again later.',
  })
})
