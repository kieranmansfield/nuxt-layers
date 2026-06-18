import { buildAccentCSS } from '../utils/accent-css'

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
 *    - `data-theme-colour` from `theme-colour` (defaults to 'blue')
 *    - `data-theme-contrast` from `theme-contrast`
 *    - `data-theme-motion` from `theme-motion`
 *    - `data-theme-transparency` from `theme-transparency`
 *    - `data-theme-mode` from `theme-mode` (raw string, not JSON — set by Nuxt Color Mode)
 *
 * Our script runs before CSS link tags (via head.unshift), so setting data-theme-mode
 * here prevents the dark-mode FOUC that would otherwise occur when Nuxt Color Mode's
 * script runs after stylesheets have downloaded. Nuxt Color Mode's script will then
 * set the same value again — this is idempotent and safe.
 */

const accentCSS = buildAccentCSS()

// Blocking init script — restores data-* attributes from localStorage before first paint.
// Written as a self-invoking function to avoid polluting the global scope.
// JSON.parse handles the quoted string that useLocalStorage writes.
// Note: theme-mode is stored as a raw string by Nuxt Color Mode (no JSON.stringify).
const initScript = `(function(){
  try{
    var h=document.documentElement;
    var c=localStorage.getItem('theme-colour');
    h.setAttribute('data-theme-colour',c?JSON.parse(c):'blue');
    var ct=localStorage.getItem('theme-contrast');
    var ctv=ct?JSON.parse(ct):'system';
    if(ctv==='on'){h.setAttribute('data-theme-contrast','high')}
    else if(ctv==='off'){h.setAttribute('data-theme-contrast','standard')}
    else{h.setAttribute('data-theme-contrast',(window.matchMedia&&window.matchMedia('(prefers-contrast:more)').matches)?'high':'standard')}
    var m=localStorage.getItem('theme-motion');
    var mv=m?JSON.parse(m):'system';
    if(mv==='on'){h.setAttribute('data-theme-motion','reduced')}
    else if(mv==='off'){h.setAttribute('data-theme-motion','full')}
    else{h.setAttribute('data-theme-motion',(window.matchMedia&&window.matchMedia('(prefers-reduced-motion:reduce)').matches)?'reduced':'full')}
    var t=localStorage.getItem('theme-transparency');
    var tv=t?JSON.parse(t):'system';
    if(tv==='on'){h.setAttribute('data-theme-transparency','reduced')}
    else if(tv==='off'){h.setAttribute('data-theme-transparency','full')}
    else{h.setAttribute('data-theme-transparency',(window.matchMedia&&window.matchMedia('(prefers-reduced-transparency:reduce)').matches)?'reduced':'full')}
    var dm=localStorage.getItem('theme-mode');
    var dmv=dm||'system';
    if(dmv==='dark'){h.setAttribute('data-theme-mode','dark')}
    else if(dmv==='light'){h.setAttribute('data-theme-mode','light')}
    else{h.setAttribute('data-theme-mode',(window.matchMedia&&window.matchMedia('(prefers-color-scheme:dark)').matches)?'dark':'light')}
  }catch(e){}
})()`.replace(/\n\s*/g, '')

export default defineNitroPlugin((nitroApp) => {
  nitroApp.hooks.hook('render:html', (html) => {
    html.head.unshift(
      `<style id="theme-accent-css">${accentCSS}</style><script>${initScript}</script>`
    )
  })
})
