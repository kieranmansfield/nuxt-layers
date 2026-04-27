import { defineAppConfig } from 'nuxt/app'

export default defineAppConfig({
  mastNav: {
    links: [],
    scrollBehaviour: 'router',
  },
  uiLayer: {
    gradients: {
      brand: { shape: 'linear', direction: 'to-br', from: { color: 'primary', shade: 500 }, to: { color: 'secondary', shade: 600 } },
      subtle: { shape: 'linear', direction: 'to-b', from: { color: 'primary', shade: 100, opacity: 50 }, to: { color: 'transparent' } },
      hero: { shape: 'radial', from: { color: 'primary', shade: 400, opacity: 40 }, to: { color: 'transparent' } },
    },
    accentScenes: {
      hero: {
        blobs: [
          { x: 20, y: 30, size: '50rem', blur: '3xl', opacity: 25, color: 'primary', shade: 400 },
          { x: 80, y: 70, size: '40rem', blur: '3xl', opacity: 20, color: 'secondary', shade: 500 },
        ],
      },
      corner: {
        blobs: [
          { x: 100, y: 0, size: '35rem', blur: '2xl', opacity: 30, color: 'primary', shade: 500 },
        ],
      },
      scattered: {
        blobs: [
          { x: 15, y: 20, size: '30rem', blur: 'xl', opacity: 20, color: 'primary', shade: 400 },
          { x: 85, y: 30, size: '25rem', blur: 'xl', opacity: 15, color: 'secondary', shade: 400 },
          { x: 50, y: 80, size: '35rem', blur: '2xl', opacity: 18, color: 'info', shade: 400 },
        ],
      },
      minimal: {
        blobs: [
          { x: 50, y: 50, size: '60rem', blur: '3xl', opacity: 10, color: 'primary', shade: 500 },
        ],
      },
    },
  },
})
