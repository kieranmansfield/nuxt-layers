type ExternalFetchOptions = {
  query?: Record<string, unknown>
  headers?: Record<string, string>
  timeout?: number
  parseResponse?: (text: string) => unknown
}

type ExternalFetch = (url: string, opts?: ExternalFetchOptions) => Promise<unknown>

/**
 * `$fetch` for third-party URLs. Nitro types `$fetch` against this app's own server routes,
 * which rejects an absolute external URL, so call it through a plain signature instead.
 */
export async function externalFetch<T>(url: string, opts?: ExternalFetchOptions): Promise<T> {
  const dynamicFetch = $fetch as unknown as ExternalFetch
  return (await dynamicFetch(url, opts)) as T
}
