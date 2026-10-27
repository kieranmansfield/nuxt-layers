declare module "@nuxt/schema" {
  interface RuntimeConfig {
    databaseLayer?: { url: string };
  }
}
