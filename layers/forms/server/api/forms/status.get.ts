export default defineEventHandler(() => {
  const { resendApiKey, emailFrom, emailTo } = useFormsConfig()

  return {
    configured: !!resendApiKey,
    emailFrom: emailFrom || null,
    emailTo: emailTo || null,
  }
})
