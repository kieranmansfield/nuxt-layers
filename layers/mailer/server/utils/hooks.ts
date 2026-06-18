import { createHooks } from 'hookable'
import type { MailerLayerHooks } from '#layers/mailer/shared/contact'

export const mailerLayerHooks = createHooks<MailerLayerHooks>()
