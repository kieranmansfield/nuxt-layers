import { formatHex, oklch, parse } from 'culori'
import type { BrandColour, ContrastLevel, ThemeVariant } from './useBrandState'
import { generateScale } from './useTailwindScale'
import type { ScaleEntry } from './useTailwindScale'

// ── Helpers ──────────────────────────────────────────────────────────────────

function colourCssName(colour: { role: string; name: string }): string {
  return colour.role === 'custom'
    ? colour.name.toLowerCase().replace(/\s+/g, '-')
    : colour.role
}

function downloadText(content: string, filename: string, mimeType = 'text/plain') {
  const blob = new Blob([content], { type: mimeType })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

// Shift the lightness of a scale for high/low contrast variants
function contrastScale(entries: ScaleEntry[], contrast: ContrastLevel): ScaleEntry[] {
  if (contrast === 'standard') return entries

  return entries.map((entry) => {
    const parsed = parse(entry.hex)
    if (!parsed) return entry
    const base = oklch(parsed)
    if (!base) return entry

    const l = base.l
    // Push extremes further apart, boost chroma
    const newL = l > 0.5 ? Math.min(0.99, l + (l - 0.5) * 0.35) : Math.max(0.01, l - (0.5 - l) * 0.35)
    const newC = Math.min((base.c ?? 0) * 1.25, 0.42)

    return {
      ...entry,
      hex: formatHex({ ...base, l: newL, c: newC }) ?? entry.hex,
      oklchStr: `oklch(${(newL * 100).toFixed(1)}% ${newC.toFixed(3)} ${(base.h ?? 0).toFixed(1)})`,
    }
  })
}

// Resolve which colour to use for a theme role.
// Mappings can hold: null (auto), a brand-colour UUID, or a custom hex string starting with '#'.
function resolveThemeColour(
  role: keyof ThemeVariant['colourMappings'],
  theme: ThemeVariant,
  colours: BrandColour[],
): BrandColour | undefined {
  const mapping = theme.colourMappings[role]
  if (!mapping) return colours.find((c) => c.role === role)
  if (mapping.startsWith('#')) {
    // Synthetic colour for a custom hex value
    return { id: `_custom_${role}`, name: role, hex: mapping, role: role as BrandColour['role'], harmonyType: null }
  }
  return colours.find((c) => c.id === mapping)
}

// ── CSS generation helpers ────────────────────────────────────────────────────

function colourBlock(
  colours: BrandColour[],
  contrast: ContrastLevel,
  format: 'hex' | 'oklch',
): string[] {
  const lines: string[] = []
  for (const colour of colours) {
    const name = colourCssName(colour)
    const scale = contrastScale(generateScale(colour.hex), contrast)
    for (const entry of scale) {
      lines.push(`  --color-${name}-${entry.step}: ${format === 'oklch' ? entry.oklchStr : entry.hex};`)
    }
  }
  return lines
}

function fontBlock(state: { typography: Array<{ role: string; family: string }> }): string[] {
  return state.typography.map((f) => `  --font-${f.role}: '${f.family}', sans-serif;`)
}

// ── useExport ────────────────────────────────────────────────────────────────

export function useExport() {
  const { state } = useBrandState()

  function generateCssVars(): string {
    const { schemes, contrastLevels } = state.value.themeMode
    const lines: string[] = []

    // :root — default theme, standard contrast, light values
    lines.push(':root {')
    lines.push(...colourBlock(state.value.colours, 'standard', 'hex'))
    lines.push('')
    lines.push(...fontBlock(state.value))
    lines.push('}', '')

    // Scheme overrides
    for (const scheme of schemes) {
      if (scheme === 'dark') {
        lines.push('[data-scheme="dark"] {')
        lines.push(`  color-scheme: dark;`)
        lines.push('}', '')
      }
    }

    // Contrast overrides
    for (const contrast of contrastLevels) {
      if (contrast === 'standard') continue
      lines.push(`[data-contrast="${contrast}"] {`)
      lines.push(...colourBlock(state.value.colours, contrast, 'hex'))
      lines.push('}', '')
    }

    // Additional theme variants
    for (const theme of state.value.themes.filter((t) => !t.isDefault)) {
      const slug = theme.name.toLowerCase().replace(/\s+/g, '-')
      const themeColours = (['primary', 'secondary', 'accent', 'neutral'] as const)
        .map((role) => resolveThemeColour(role, theme, state.value.colours))
        .filter(Boolean) as BrandColour[]

      if (themeColours.length) {
        lines.push(`[data-theme="${slug}"] {`)
        lines.push(...colourBlock(themeColours, 'standard', 'hex'))
        lines.push('}', '')
      }
    }

    return lines.join('\n').trimEnd()
  }

  function generateTailwindV4(): string {
    const { contrastLevels } = state.value.themeMode
    const lines: string[] = ['@import "tailwindcss";', '', '@theme {']

    // Base colour scale
    lines.push(...colourBlock(state.value.colours, 'standard', 'oklch'))
    lines.push('')
    lines.push(...fontBlock(state.value))
    lines.push('}', '')

    // Contrast variant utilities
    for (const contrast of contrastLevels) {
      if (contrast === 'standard') continue
      lines.push(`/* ${contrast} contrast */`)
      lines.push(`@layer utilities {`)
      lines.push(`  [data-contrast="${contrast}"] {`)
      for (const colour of state.value.colours) {
        const name = colourCssName(colour)
        const scale = contrastScale(generateScale(colour.hex), contrast)
        for (const entry of scale) {
          lines.push(`    --color-${name}-${entry.step}: ${entry.oklchStr};`)
        }
      }
      lines.push('  }')
      lines.push('}', '')
    }

    // Theme variant utilities
    for (const theme of state.value.themes.filter((t) => !t.isDefault)) {
      const slug = theme.name.toLowerCase().replace(/\s+/g, '-')
      const themeColours = (['primary', 'secondary', 'accent', 'neutral'] as const)
        .map((role) => resolveThemeColour(role, theme, state.value.colours))
        .filter(Boolean) as BrandColour[]

      if (themeColours.length) {
        lines.push(`/* theme: ${theme.name} */`)
        lines.push(`@layer utilities {`)
        lines.push(`  [data-theme="${slug}"] {`)
        lines.push(...colourBlock(themeColours, 'standard', 'oklch').map((l) => '  ' + l))
        lines.push('  }')
        lines.push('}', '')
      }
    }

    return lines.join('\n').trimEnd()
  }

  function generateJson(): string {
    return JSON.stringify(state.value, null, 2)
  }

  function exportCssVars() {
    downloadText(generateCssVars(), 'brand-variables.css', 'text/css')
  }

  function exportTailwindV4() {
    downloadText(generateTailwindV4(), 'brand-theme.css', 'text/css')
  }

  function exportJson() {
    downloadText(generateJson(), 'brand-config.json', 'application/json')
  }

  async function copyToClipboard(text: string) {
    await navigator.clipboard.writeText(text)
  }

  return {
    generateCssVars,
    generateTailwindV4,
    generateJson,
    exportCssVars,
    exportTailwindV4,
    exportJson,
    copyToClipboard,
  }
}
