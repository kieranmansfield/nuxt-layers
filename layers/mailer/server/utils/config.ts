interface MailerLayerConfig {
  resendApiKey: string
  emailFrom: string
  emailTo: string
}

export function useMailerConfig(): MailerLayerConfig {
  return (useRuntimeConfig() as unknown as { mailerLayer: MailerLayerConfig }).mailerLayer
}
