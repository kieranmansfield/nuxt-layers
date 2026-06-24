export default defineAppConfig({
  ui: {
    card: {
      variants: {
        variant: {
          outline: {
            root: 'bg-elevated ring ring-default divide-y divide-default',
          },
        },
      },
    },
  },
  site: {
    title: 'Nuxt Layers Playground',
    description: 'Demo and development playground for nuxt-layers.',
    url: 'https://nuxtlayers.netlify.app/',
    author: { name: 'Kieran Mansfield' },
  },
  feedsLayer: {
    feed: {
      limit: 30,
      collections: ['blog', 'portfolio', 'gallery'],
      defaultCollection: 'blog',
    },
  },
  mastNav: {
    scrollBehaviour: 'router',
    links: [
      { id: 'home', label: 'Home', to: { name: 'index' } },
      { id: 'core', label: 'Core', to: { name: 'core' } },
      { id: 'ui', label: 'UI', to: { name: 'ui' } },
      { id: 'layout', label: 'Layout', to: { name: 'layout' } },
      { id: 'motion', label: 'Motion', to: { name: 'motion' } },
      { id: 'shader', label: 'Shader', to: { name: 'shader' } },
      { id: 'theme', label: 'Theme', to: { name: 'theme' } },
      { id: 'forms', label: 'Forms', to: { name: 'forms' } },
      { id: 'content', label: 'Content', to: { name: 'content' } },
      { id: 'routing', label: 'Routing', to: { name: 'routing' } },
      { id: 'feeds', label: 'Feeds', to: { name: 'feeds' } },
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
