export default defineAppConfig({
  mastNav: {
    scrollBehaviour: 'router',
    links: [
      { id: 'home', label: 'Home', to: { name: 'index' } },
      { id: 'ui', label: 'UI', to: { name: 'ui' } },
      { id: 'layout', label: 'Layout', to: { name: 'layout' } },
      { id: 'motion', label: 'Motion', to: { name: 'motion' } },
      { id: 'shader', label: 'Shader', to: { name: 'shader' } },
      { id: 'shader-pipeline', label: 'Pipeline', to: { name: 'shader-pipeline' } },
      { id: 'overlays', label: 'Overlays', to: { name: 'overlays' } },
    ],
  },
  coreLayer: {
    name: 'My amazing Nuxt layer (overwritten)',
    // Loading screen configuration (initial app load only)
    loading: {
      // Master toggle - set to false to disable completely
      enabled: false,
    },
    scrollGuard: {
      enabled: false,
    },
  },
})
