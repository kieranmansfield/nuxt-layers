import { buildCssVariablesExport, buildTailwindV4Export } from '../utils/exportWriters'

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
    return buildCssVariablesExport(state.value)
  }

  function generateTailwindV4(): string {
    return buildTailwindV4Export(state.value)
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
