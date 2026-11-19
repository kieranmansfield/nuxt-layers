import { defineEventHandler } from 'h3'
import { useMailerConfig } from '#layers/mailer/server/utils/config'

export default defineEventHandler(() => {
  const { resendApiKey, emailFrom, emailTo } = useMailerConfig()

  // Addresses are dev-only: emailTo is the private inbox every submission lands in
  if (!import.meta.dev) return { configured: Boolean(resendApiKey) }

  return {
    configured: Boolean(resendApiKey),
    emailFrom,
    emailTo,
  }
})
