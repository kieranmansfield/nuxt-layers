import { z } from '@nuxt/content'

export const schema = z.object({ title: z.string() })
export const hasDef = !!schema.def
export const hasUnderscoreDef = !!schema._def
