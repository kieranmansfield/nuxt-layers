import { useMailerConfig } from '#layers/mailer/server/utils/config'

export default defineEventHandler(() => {
  const { resendApiKey, emailFrom, emailTo } = useMailerConfig()

  return {
    configured: Boolean(resendApiKey),
    emailFrom: emailFrom || null,
    emailTo: emailTo || null,
  }
})
