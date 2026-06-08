import 'nitropack'

declare module 'nitropack' {
  interface NitroRuntimeConfig {
    mailerLayer?: {
      resendApiKey: string
      emailFrom: string
      emailTo: string
    }
  }
}
