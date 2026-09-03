// fallow-ignore-file unused-file

export type ContactEmailData = {
  name: string
  email: string
  message: string
}

export type ContactSubmittedPayload = ContactEmailData

export type ContactSentPayload = {
  messageId: string
} & ContactSubmittedPayload

export type ContactFailedPayload = {
  error: unknown
} & ContactSubmittedPayload

export type MailerLayerHooks = {
  'contact:submitted': (payload: ContactSubmittedPayload) => void
  'contact:sent': (payload: ContactSentPayload) => void
  'contact:failed': (payload: ContactFailedPayload) => void
}
