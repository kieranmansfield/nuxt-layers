import twColors from 'tailwindcss/colors'
import type { DefaultColors } from 'tailwindcss/types/generated/colors'

/**
 * Nitro render hook — prevents accent color FOUC by injecting:
 *
 * 1. A `<style>` tag with CSS rules mapping each `[data-theme='X']` to
 *    the correct `--ui-color-primary-*` values (using real oklch values
 *    from tailwindcss/colors). CSS is render-blocking, so the correct
 *    colors are available before first paint.
 *
 * 2. A blocking `<script>` that reads localStorage and sets the
 *    `data-theme` attribute on `<html>`, activating the matching CSS rule.
 *
 * The `[data-theme]` selector (specificity 0-1-0) overrides Nuxt UI's
 * `:root` rules inside `@layer theme`, so the stored accent color wins
 * immediately — no flash.
 */

const ACCENTS = [
  'red', 'orange', 'amber', 'yellow', 'lime', 'green', 'emerald',
  'teal', 'cyan', 'sky', 'blue', 'indigo', 'violet', 'purple',
  'fuchsia', 'pink', 'rose',
] as const

const SHADES = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950] as const

// Pre-compute all CSS rules at startup (once)
function buildAccentCSS(): string {
  let css = ''
  for (const accent of ACCENTS) {
    const palette = (twColors as DefaultColors)[accent]
    if (!palette || typeof palette === 'string') continue
    const vars = SHADES
      .map((s) => `--ui-color-primary-${s}:${(palette as Record<number, string>)[s]}`)
      .join(';')
    css += `[data-theme="${accent}"]{${vars}}`
  }
  return css
}

const accentCSS = buildAccentCSS()

export default defineNitroPlugin((nitroApp) => {
  nitroApp.hooks.hook('render:html', (html) => {
    html.head.unshift(
      `<style id="theme-accent-css">${accentCSS}</style>`
      + `<script>(function(){try{var a=localStorage.getItem('theme-accent');if(a){document.documentElement.setAttribute('data-theme',JSON.parse(a))}}catch(e){}})()</script>`,
    )
  })
})
