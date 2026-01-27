export default defineAppConfig({
  coreLayer: {
    name: 'My amazing Nuxt layer (overwritten)',
    // Loading screen configuration (initial app load only)
    loading: {
      // Master toggle - set to false to disable completely
      enabled: false,
    },
  },
})
