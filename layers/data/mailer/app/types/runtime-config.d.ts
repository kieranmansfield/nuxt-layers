declare module "@nuxt/schema" {
  interface RuntimeConfig {
    mailerLayer?: {
      resendApiKey: string;
      emailFrom: string;
      emailTo: string;
    };
  }
}
