import { formatHex, oklch, parse } from 'culori'

import { generateScale } from '../composables/useTailwindScale'
import type { BrandColour, BrandState, ContrastLevel, ThemeVariant } from '../composables/useBrandState'
import type { ScaleEntry } from '../composables/useTailwindScale'

function colourCssName(colour: { role: string; name: string }): string {
  return colour.role === 'custom'
    ? colour.name.toLowerCase().replace(/\s+/g, '-')
    : colour.role
}

function contrastScale(entries: ScaleEntry[], contrast: ContrastLevel): ScaleEntry[] {
  if (contrast === 'standard') return entries

  // fallow-ignore-next-line complexity
  return entries.map((entry) => {
    const parsed = parse(entry.hex)
    if (!parsed) return entry
    const base = oklch(parsed)
    if (!base) return entry

    const l = base.l
    const newL = l > 0.5 ? Math.min(0.99, l + (l - 0.5) * 0.35) : Math.max(0.01, l - (0.5 - l) * 0.35)
    const newC = Math.min((base.c ?? 0) * 1.25, 0.42)

    return {
      ...entry,
      hex: formatHex({ ...base, l: newL, c: newC }) ?? entry.hex,
      oklchStr: `oklch(${(newL * 100).toFixed(1)}% ${newC.toFixed(3)} ${(base.h ?? 0).toFixed(1)})`,
    }
  })
}

function resolveThemeColour(
  role: keyof ThemeVariant['colourMappings'],
  theme: ThemeVariant,
  colours: BrandColour[]
): BrandColour | undefined {
  const mapping = theme.colourMappings[role]
  if (!mapping) return colours.find((c) => c.role === role)
  if (mapping.startsWith('#')) {
    return {
      id: `_custom_${role}`,
      name: role,
      hex: mapping,
      role: role as BrandColour['role'],
      harmonyType: null,
    }
  }
  return colours.find((c) => c.id === mapping)
}

function pushColourLines(
  lines: string[],
  colours: BrandColour[],
  contrast: ContrastLevel,
  format: 'hex' | 'oklch',
  indent = '  '
) {
  for (const colour of colours) {
    const name = colourCssName(colour)
    const scale = contrastScale(generateScale(colour.hex), contrast)
    for (const entry of scale) {
      lines.push(`${indent}--color-${name}-${entry.step}: ${format === 'oklch' ? entry.oklchStr : entry.hex};`)
    }
  }
}

function pushFontLines(lines: string[], typography: BrandState['typography'], indent = '  ') {
  for (const font of typography) {
    lines.push(`${indent}--font-${font.role}: '${font.family}', sans-serif;`)
  }
}

function resolveThemeColours(theme: ThemeVariant, colours: BrandColour[]) {
  return (['primary', 'secondary', 'accent', 'neutral'] as const)
    .map((role) => resolveThemeColour(role, theme, colours))
    .filter(Boolean) as BrandColour[]
}

// fallow-ignore-next-line complexity
export function buildCssVariablesExport(state: BrandState): string {
  const { schemes, contrastLevels } = state.themeMode
  const lines: string[] = []

  lines.push(':root {')
  pushColourLines(lines, state.colours, 'standard', 'hex')
  lines.push('')
  pushFontLines(lines, state.typography)
  lines.push('}', '')

  for (const scheme of schemes) {
    if (scheme === 'dark') {
      lines.push('[data-scheme="dark"] {')
      lines.push('  color-scheme: dark;')
      lines.push('}', '')
    }
  }

  for (const contrast of contrastLevels) {
    if (contrast === 'standard') continue
    lines.push(`[data-contrast="${contrast}"] {`)
    pushColourLines(lines, state.colours, contrast, 'hex')
    lines.push('}', '')
  }

  for (const theme of state.themes.filter((variant) => !variant.isDefault)) {
    const slug = theme.name.toLowerCase().replace(/\s+/g, '-')
    const themeColours = resolveThemeColours(theme, state.colours)
    if (!themeColours.length) continue

    lines.push(`[data-theme="${slug}"] {`)
    pushColourLines(lines, themeColours, 'standard', 'hex')
    lines.push('}', '')
  }

  return lines.join('\n').trimEnd()
}

// fallow-ignore-next-line complexity
export function buildTailwindV4Export(state: BrandState): string {
  const { contrastLevels } = state.themeMode
  const lines: string[] = ['@import "tailwindcss";', '', '@theme {']

  pushColourLines(lines, state.colours, 'standard', 'oklch')
  lines.push('')
  pushFontLines(lines, state.typography)
  lines.push('}', '')

  for (const contrast of contrastLevels) {
    if (contrast === 'standard') continue
    lines.push(`/* ${contrast} contrast */`)
    lines.push('@layer utilities {')
    lines.push(`  [data-contrast="${contrast}"] {`)
    pushColourLines(lines, state.colours, contrast, 'oklch', '    ')
    // fallow-ignore-next-line code-duplication
    lines.push('  }')
    lines.push('}', '')
  }

  for (const theme of state.themes.filter((variant) => !variant.isDefault)) {
    const slug = theme.name.toLowerCase().replace(/\s+/g, '-')
    const themeColours = resolveThemeColours(theme, state.colours)
    if (!themeColours.length) continue

    lines.push(`/* theme: ${theme.name} */`)
    lines.push('@layer utilities {')
    lines.push(`  [data-theme="${slug}"] {`)
    pushColourLines(lines, themeColours, 'standard', 'oklch', '    ')
    lines.push('  }')
    lines.push('}', '')
  }

  return lines.join('\n').trimEnd()
}
