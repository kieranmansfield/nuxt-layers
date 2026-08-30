import { buildAccentCSS } from '../utils/accent-css'
import { buildThemeInitScript } from '../utils/fouc-config'

const accentCSS = buildAccentCSS()

export default defineNitroPlugin((nitroApp) => {
  nitroApp.hooks.hook('render:html', (html, { event }) => {
    const config = useRuntimeConfig(event)
    const initScript = buildThemeInitScript(config.public.themeDefaultAccent || 'blue')
    html.head.unshift(
      `<style id="theme-accent-css">${accentCSS}</style><script>${initScript}</script>`
    )
  })
})
