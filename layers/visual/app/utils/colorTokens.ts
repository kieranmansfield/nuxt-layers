type ResolvableColorToken = {
  color?: string | undefined
  shade?: number | undefined
  opacity?: number | undefined
  customColor?: string | undefined
}

// fallow-ignore-next-line complexity
export function resolveUiColorToken(token: ResolvableColorToken): string {
  const { color = 'primary', shade = 500, opacity, customColor } = token

  if (color === 'custom') return customColor ?? 'transparent'
  if (color === 'transparent') return 'transparent'
  if (color === 'white') {
    return opacity !== undefined ? `rgb(255 255 255 / ${opacity / 100})` : '#ffffff'
  }
  if (color === 'black') {
    return opacity !== undefined ? `rgb(0 0 0 / ${opacity / 100})` : '#000000'
  }

  const value = `var(--ui-color-${color}-${shade})`
  return opacity !== undefined ? `color-mix(in srgb, ${value} ${opacity}%, transparent)` : value
}
