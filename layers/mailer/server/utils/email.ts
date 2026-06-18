import { Resend } from 'resend'

import type { ContactEmailData } from '#layers/mailer/shared/contact'

type MailerTransport = {
  from: string
  to: string
}

function resolveMailerTransport() {
  const { resendApiKey, emailFrom, emailTo } = useMailerConfig()
  if (!resendApiKey) return null

  return {
    apiKey: resendApiKey,
    from: emailFrom ?? '',
    to: emailTo ?? '',
  } satisfies MailerTransport & { apiKey: string }
}

function buildContactEmailPayload(data: ContactEmailData, transport: MailerTransport) {
  return {
    from: transport.from,
    to: transport.to,
    replyTo: data.email,
    subject: `Contact form submission from ${data.name}`,
    text: `Name: ${data.name}\nEmail: ${data.email}\n\nMessage:\n${data.message}`,
  }
}

export async function sendContactEmail(data: ContactEmailData) {
  const transport = resolveMailerTransport()
  if (!transport) {
    console.warn('[mailer] NUXT_MAILER_LAYER_RESEND_API_KEY not set — email skipped')
    return { success: false as const, error: 'No API key configured' }
  }

  const resend = new Resend(transport.apiKey)
  const { data: result, error } = await resend.emails.send(buildContactEmailPayload(data, transport))

  if (error) return { success: false as const, error }
  return { success: true as const, messageId: result?.id ?? '' }
}
