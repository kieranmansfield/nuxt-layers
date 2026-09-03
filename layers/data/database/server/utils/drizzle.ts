import { drizzle } from 'drizzle-orm/neon-http'

export function useDrizzle<TSchema extends Record<string, unknown>>(schema: TSchema) {
  return drizzle(useSql(), { schema })
}
