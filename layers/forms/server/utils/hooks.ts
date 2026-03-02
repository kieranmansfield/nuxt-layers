import { createHooks } from 'hookable'

export interface ContactSubmittedPayload {
  name: string
  email: string
  message: string
}

export interface ContactSentPayload extends ContactSubmittedPayload {
  messageId: string
}

export interface ContactFailedPayload extends ContactSubmittedPayload {
  error: unknown
}

export interface FormsLayerHooks {
  'contact:submitted': (payload: ContactSubmittedPayload) => void
  'contact:sent': (payload: ContactSentPayload) => void
  'contact:failed': (payload: ContactFailedPayload) => void
}

export const formsLayerHooks = createHooks<FormsLayerHooks>()
