import twColors from 'tailwindcss/colors'
const ACCENTS = [
  'red',
  'orange',
  'amber',
  'yellow',
  'lime',
  'green',
  'emerald',
  'teal',
  'cyan',
  'sky',
  'blue',
  'indigo',
  'violet',
  'purple',
  'fuchsia',
  'pink',
  'rose',
]
const SHADES = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950]
export const ACCENT_PALETTES = {
  red: { secondary: 'rose', info: 'orange' },
  orange: { secondary: 'amber', info: 'red' },
  amber: { secondary: 'orange', info: 'yellow' },
  yellow: { secondary: 'lime', info: 'amber' },
  lime: { secondary: 'green', info: 'yellow' },
  green: { secondary: 'teal', info: 'emerald' },
  emerald: { secondary: 'green', info: 'teal' },
  teal: { secondary: 'cyan', info: 'emerald' },
  cyan: { secondary: 'sky', info: 'teal' },
  sky: { secondary: 'blue', info: 'cyan' },
  blue: { secondary: 'indigo', info: 'sky' },
  indigo: { secondary: 'violet', info: 'blue' },
  violet: { secondary: 'purple', info: 'indigo' },
  purple: { secondary: 'fuchsia', info: 'violet' },
  fuchsia: { secondary: 'pink', info: 'purple' },
  pink: { secondary: 'rose', info: 'fuchsia' },
  rose: { secondary: 'pink', info: 'red' },
}
function resolveAccentShades(name) {
  const palette = twColors[name]
  return !palette || typeof palette === 'string' ? null : palette
}
function buildColourVariables(prefix, colours) {
  return SHADES.map((shade) => `--ui-color-${prefix}-${shade}:${colours[shade]};`).join('')
}
function buildAccentRule(accent) {
  const primary = resolveAccentShades(accent)
  if (!primary) return ''
  const { secondary: secondaryName, info: infoName } = ACCENT_PALETTES[accent]
  const secondary = resolveAccentShades(secondaryName)
  const info = resolveAccentShades(infoName)
  let vars = buildColourVariables('primary', primary)
  if (secondary) vars += buildColourVariables('secondary', secondary)
  if (info) vars += buildColourVariables('info', info)
  return `html[data-theme-colour="${accent}"]{${vars}}`
}
export function buildAccentCSS() {
  return ACCENTS.map(buildAccentRule).join('')
}
