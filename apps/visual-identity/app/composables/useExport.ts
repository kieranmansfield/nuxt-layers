import { generateScale } from './useTailwindScale'

function colourCssName(colour: { role: string; name: string }): string {
  return colour.role === 'custom' ? colour.name.toLowerCase().replace(/\s+/g, '-') : colour.role
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

export function useExport() {
  const { state } = useBrandState()

  function generateCssVars(): string {
    const lines: string[] = [':root {']

    for (const colour of state.value.colours) {
      const name = colourCssName(colour)
      for (const entry of generateScale(colour.hex)) {
        lines.push(`  --color-${name}-${entry.step}: ${entry.hex};`)
      }
    }

    lines.push('')

    for (const font of state.value.typography) {
      lines.push(`  --font-${font.role}: '${font.family}', sans-serif;`)
    }

    lines.push('}')
    return lines.join('\n')
  }

  function generateTailwindV4(): string {
    const lines: string[] = ['@import "tailwindcss";', '', '@theme {']

    for (const colour of state.value.colours) {
      const name = colourCssName(colour)
      for (const entry of generateScale(colour.hex)) {
        lines.push(`  --color-${name}-${entry.step}: ${entry.oklchStr};`)
      }
    }

    lines.push('')

    for (const font of state.value.typography) {
      lines.push(`  --font-${font.role}: '${font.family}', sans-serif;`)
    }

    lines.push('}')
    return lines.join('\n')
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
