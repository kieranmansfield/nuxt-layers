import { MetadataProviderError } from './errors'

/** `$fetch` that reports any failure as a MetadataProviderError for `provider`. */
type ProviderFetchOptions = {
  query?: Record<string, unknown>
  headers?: Record<string, string>
  timeout?: number
}

type ProviderFetch = (url: string, opts?: ProviderFetchOptions) => Promise<unknown>

export async function providerFetch<T>(
  provider: string,
  url: string,
  opts?: ProviderFetchOptions
): Promise<T> {
  try {
    const dynamicFetch = $fetch as unknown as ProviderFetch
    return (await dynamicFetch(url, opts)) as T
  } catch (err) {
    throw new MetadataProviderError(provider, `API error: ${String(err)}`, err)
  }
}
