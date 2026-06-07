import { useMailerConfig } from '#layers/mailer/server/utils/config'

export default defineEventHandler(() => {
  const { resendApiKey, emailFrom, emailTo } = useMailerConfig()

  return {
    configured: !!resendApiKey,
    emailFrom: emailFrom || null,
    emailTo: emailTo || null,
  }
})
