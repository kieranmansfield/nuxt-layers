import { neon } from '@neondatabase/serverless'

export function useSql() {
  const { databaseLayer } = useRuntimeConfig()
  if (!databaseLayer?.url) throw createError('Database URL not configured')
  return neon(databaseLayer.url)
}
