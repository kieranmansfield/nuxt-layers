import { createError, defineEventHandler, getRequestHeader, getRequestIP, readBody } from 'h3'
import { useStorage } from 'nitropack/runtime'
import { sendContactEmail } from '#layers/mailer/server/utils/email'
import { mailerLayerHooks } from '#layers/mailer/server/utils/hooks'

import { contactSchema } from '../../shared/utils/contact-schema'
import { checkRateLimit, type RateLimitStorage } from '../utils/rate-limit'

export default defineEventHandler(async (event) => {
  // Netlify's client IP header can't be set by the client; X-Forwarded-For's first entry can
  const ip =
    getRequestHeader(event, 'x-nf-client-connection-ip') ??
    getRequestIP(event, { xForwardedFor: true }) ??
    'unknown'
  if (!(await checkRateLimit(useStorage('rate-limit') as RateLimitStorage, ip))) {
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
