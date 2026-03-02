export default defineEventHandler(() => {
  const config = useRuntimeConfig()
  const { resendApiKey, emailFrom, emailTo } = config.formsLayer ?? {}

  return {
    configured: !!resendApiKey,
    emailFrom: emailFrom || null,
    emailTo: emailTo || null,
  }
})
