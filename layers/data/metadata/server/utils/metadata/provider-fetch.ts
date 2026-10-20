import { MetadataProviderError } from './errors'

/** `$fetch` that reports any failure as a MetadataProviderError for `provider`. */
export async function providerFetch<T>(
  provider: string,
  url: string,
  opts?: { query?: Record<string, unknown>; headers?: Record<string, string>; timeout?: number }
): Promise<T> {
  try {
    return (await $fetch(url, opts)) as T
  } catch (err) {
    throw new MetadataProviderError(provider, `API error: ${String(err)}`, err)
  }
}
