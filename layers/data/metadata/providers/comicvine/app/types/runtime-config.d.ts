declare module "@nuxt/schema" {
  interface RuntimeConfig {
    metadataComicvine: {
      apiKey: string;
      baseUrl: string;
      cacheTtl: number;
    };
  }
}
