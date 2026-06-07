import { z } from 'zod'
import { sendContactEmail } from '#layers/mailer/server/utils/email'
import { mailerLayerHooks } from '#layers/mailer/server/utils/hooks'

const contactSchema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters'),
  email: z.string().email('Please enter a valid email'),
  message: z.string().min(8, 'Message must be at least 8 characters'),
})

export default defineEventHandler(async (event) => {
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
