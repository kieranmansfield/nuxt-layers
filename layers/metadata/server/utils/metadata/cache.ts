import type { MetadataCacheRecord } from '#layers/metadata/shared/types'

// Cache keys: metadata:{provider}:{resourceType}:{providerId}
//             metadata-search:{provider}:{mediaType}:{queryHash}

export function makeCacheKey(...parts: string[]): string {
  return parts.join(':')
}

export async function getCacheRecord(key: string): Promise<MetadataCacheRecord | null> {
  const storage = useStorage('metadata')
  return (await storage.getItem<MetadataCacheRecord>(key)) ?? null
}

export async function setCacheRecord(
  key: string,
  record: MetadataCacheRecord,
  ttl?: number
): Promise<void> {
  const storage = useStorage('metadata')
  await storage.setItem(key, record, ttl ? { ttl } : undefined)
}

export async function getSearchCache<T>(key: string): Promise<T | null> {
  const storage = useStorage('metadata')
  return (await storage.getItem<T>(key)) ?? null
}

export async function setSearchCache<T>(key: string, value: T, ttl = 3600): Promise<void> {
  const storage = useStorage('metadata')
  await storage.setItem(key, value, { ttl })
}

export function hashQuery(query: string): string {
  let h = 0
  for (let i = 0; i < query.length; i++) {
    h = (Math.imul(31, h) + query.charCodeAt(i)) | 0
  }
  return Math.abs(h).toString(36)
}
