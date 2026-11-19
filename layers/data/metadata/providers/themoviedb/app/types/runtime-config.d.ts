declare module '@nuxt/schema' {
  interface RuntimeConfig {
    metadataTmdb: {
      apiKey: string
      baseUrl: string
      imageBaseUrl: string
    }
  }
}
