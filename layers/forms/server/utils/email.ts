import { Resend } from 'resend'

export interface ContactEmailData {
  name: string
  email: string
  message: string
}

export async function sendContactEmail(data: ContactEmailData) {
  const config = useRuntimeConfig()
  const { resendApiKey, emailFrom, emailTo } = config.formsLayer ?? {}

  if (!resendApiKey) {
    console.warn('[forms] NUXT_FORMS_LAYER_RESEND_API_KEY not set — email skipped')
    return { success: false as const, error: 'No API key configured' }
  }

  const resend = new Resend(resendApiKey)
  const { data: result, error } = await resend.emails.send({
    from: emailFrom,
    to: emailTo,
    replyTo: data.email,
    subject: `Contact form submission from ${data.name}`,
    text: `Name: ${data.name}\nEmail: ${data.email}\n\nMessage:\n${data.message}`,
  })

  if (error) return { success: false as const, error }
  return { success: true as const, messageId: result?.id ?? '' }
}
