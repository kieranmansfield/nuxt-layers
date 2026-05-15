import {} from 'nitropack'

declare module 'nitropack' {
  interface NitroRuntimeConfig {
    formsLayer?: {
      resendApiKey: string
      emailFrom: string
      emailTo: string
    }
  }
}
