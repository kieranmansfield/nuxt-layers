import { z } from 'zod'

export const contactSchema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters'),
  email: z.string().email('Please enter a valid email'),
  message: z.string().min(8, 'Message must be at least 8 characters'),
})

export type ContactData = z.infer<typeof contactSchema>
