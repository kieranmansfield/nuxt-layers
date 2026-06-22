import { useMailerConfig } from '#layers/mailer/server/utils/config'

export default defineEventHandler(() => {
  const { resendApiKey } = useMailerConfig()

  return {
    configured: Boolean(resendApiKey),
  }
})
