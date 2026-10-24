import { z } from 'zod'

export const contactSchema = z.object({
  // Real names can be one or two letters (Li, Ng), so only require one
  name: z.string().trim().min(1, 'Please enter your name'),
  email: z.string().email('Please enter a valid email'),
  message: z.string().min(8, 'Message must be at least 8 characters'),
})

export type ContactData = z.infer<typeof contactSchema>
