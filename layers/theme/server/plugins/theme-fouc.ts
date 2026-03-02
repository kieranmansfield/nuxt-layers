import twColors from 'tailwindcss/colors'
import type { DefaultColors } from 'tailwindcss/types/generated/colors'

/**
 * Nitro render hook — prevents FOUC for all theme preferences by injecting:
 *
 * 1. A `<style>` tag with CSS rules mapping each `[data-theme-colour='X']` to
 *    the correct `--ui-color-primary-*`, `--ui-color-secondary-*`, and
 *    `--ui-color-info-*` values. Each accent selects a coordinated three-colour
 *    palette so primary, secondary, and accent (info) all change together.
 *
 * 2. A blocking `<script>` that reads localStorage and restores all
 *    `data-theme-*` attributes on `<html>` before first paint:
 *    - `data-theme-colour` from `theme-colour`
 *    - `data-theme-contrast` from `theme-contrast`
 *    - `data-theme-motion` from `theme-motion`
 *    - `data-theme-transparency` from `theme-transparency`
 *
 * Color mode (`data-theme-mode`) is handled by Nuxt Color Mode's own
 * cookie/localStorage restore mechanism.
 */

const ACCENTS = [
  'red', 'orange', 'amber', 'yellow', 'lime', 'green', 'emerald',
  'teal', 'cyan', 'sky', 'blue', 'indigo', 'violet', 'purple',
  'fuchsia', 'pink', 'rose',
] as const

type AccentName = typeof ACCENTS[number]

const SHADES = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950] as const

/**
 * Coordinated three-colour palettes. Each accent colour selects a
 * secondary and info (accent) colour that sit in the same temperature
 * zone and feel cohesive together.
 *
 *   primary  = the user-selected accent
 *   secondary = a related colour in the same hue family
 *   info      = a third complementary accent
 */
const ACCENT_PALETTES: Record<AccentName, { secondary: AccentName, info: AccentName }> = {
  red:     { secondary: 'rose',    info: 'orange' },
  orange:  { secondary: 'amber',   info: 'red' },
  amber:   { secondary: 'orange',  info: 'yellow' },
  yellow:  { secondary: 'lime',    info: 'amber' },
  lime:    { secondary: 'green',   info: 'yellow' },
  green:   { secondary: 'teal',    info: 'emerald' },
  emerald: { secondary: 'green',   info: 'teal' },
  teal:    { secondary: 'cyan',    info: 'emerald' },
  cyan:    { secondary: 'sky',     info: 'teal' },
  sky:     { secondary: 'blue',    info: 'cyan' },
  blue:    { secondary: 'indigo',  info: 'sky' },
  indigo:  { secondary: 'violet',  info: 'blue' },
  violet:  { secondary: 'purple',  info: 'indigo' },
  purple:  { secondary: 'fuchsia', info: 'violet' },
  fuchsia: { secondary: 'pink',    info: 'purple' },
  pink:    { secondary: 'rose',    info: 'fuchsia' },
  rose:    { secondary: 'pink',    info: 'red' },
}

function getShades(name: AccentName): Record<number, string> | null {
  const p = (twColors as DefaultColors)[name]
  return !p || typeof p === 'string' ? null : p as Record<number, string>
}

// Pre-compute all CSS rules at startup (once)
function buildAccentCSS(): string {
  let css = ''
  for (const accent of ACCENTS) {
    const primary = getShades(accent)
    if (!primary) continue

    const { secondary: secName, info: infoName } = ACCENT_PALETTES[accent]
    const secondary = getShades(secName)
    const info = getShades(infoName)

    let vars = ''
    for (const s of SHADES) {
      vars += `--ui-color-primary-${s}:${primary[s]};`
    }
    if (secondary) {
      for (const s of SHADES) {
        vars += `--ui-color-secondary-${s}:${secondary[s]};`
      }
    }
    if (info) {
      for (const s of SHADES) {
        vars += `--ui-color-info-${s}:${info[s]};`
      }
    }

    css += `[data-theme-colour="${accent}"]{${vars}}`
  }
  return css
}

const accentCSS = buildAccentCSS()

// Blocking init script — restores data-* attributes from localStorage before first paint.
// Written as a self-invoking function to avoid polluting the global scope.
// JSON.parse handles the quoted string that useLocalStorage writes.
const initScript = `(function(){
  try{
    var h=document.documentElement;
    var c=localStorage.getItem('theme-colour');
    if(c){h.setAttribute('data-theme-colour',JSON.parse(c))}
    var ct=localStorage.getItem('theme-contrast');
    if(ct){var cv=JSON.parse(ct);h.setAttribute('data-theme-contrast',cv==='on'?'high':'standard')}
    var m=localStorage.getItem('theme-motion');
    if(m){var mv=JSON.parse(m);h.setAttribute('data-theme-motion',mv==='on'?'reduced':'full')}
    var t=localStorage.getItem('theme-transparency');
    if(t){var tv=JSON.parse(t);h.setAttribute('data-theme-transparency',tv==='on'?'reduced':'full')}
  }catch(e){}
})()`.replace(/\n\s*/g, '')

export default defineNitroPlugin((nitroApp) => {
  nitroApp.hooks.hook('render:html', (html) => {
    html.head.unshift(
      `<style id="theme-accent-css">${accentCSS}</style>`
      + `<script>${initScript}</script>`,
    )
  })
})
