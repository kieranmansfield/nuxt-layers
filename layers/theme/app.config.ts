export default defineAppConfig({
  themeLayer: {},
})

declare module '@nuxt/schema' {
  interface AppConfigInput {
    themeLayer?: {
      /** Available accent color names (Tailwind palette names) */
      accents?: string[]
      /** Default accent color */
      defaultAccent?: string
    }
  }
}
