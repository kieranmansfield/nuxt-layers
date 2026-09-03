import type { MailerLayerHooks } from '#layers/mailer/shared/contact'
import { createHooks } from 'hookable'

export const mailerLayerHooks = createHooks<MailerLayerHooks>()
