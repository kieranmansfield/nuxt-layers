import { createHooks } from 'hookable'

export type ContactSubmittedPayload = {
  name: string
  email: string
  message: string
}

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

export const mailerLayerHooks = createHooks<MailerLayerHooks>()
