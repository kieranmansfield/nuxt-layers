export class MetadataProviderError extends Error {
  constructor(
    public readonly provider: string,
    message: string,
    public override readonly cause?: unknown
  ) {
    super(`[metadata:${provider}] ${message}`)
    this.name = 'MetadataProviderError'
  }
}

export class MetadataNotFoundError extends Error {
  constructor(provider: string, id: string) {
    super(`[metadata:${provider}] Not found: ${id}`)
    this.name = 'MetadataNotFoundError'
  }
}

export class MetadataRateLimitError extends Error {
  constructor(provider: string) {
    super(`[metadata:${provider}] Rate limit exceeded`)
    this.name = 'MetadataRateLimitError'
  }
}
