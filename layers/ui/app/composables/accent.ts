import type { CSSProperties, ComputedRef } from 'vue'
import type { BlobConfig, BlobBlur } from '../types/accent'

const BLUR_PX_MAP: Record<string, number> = {
  none: 0,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  '2xl': 40,
  '3xl': 64,
}

function resolveBlurPx(blur: BlobBlur = '3xl'): number {
  if (typeof blur === 'number') return blur
  return BLUR_PX_MAP[blur] ?? 64
}

function resolveColor(config: BlobConfig): string {
  const { color = 'primary', shade = 500, customColor } = config
  if (color === 'custom') return customColor ?? 'transparent'
  if (color === 'white') return '#ffffff'
  if (color === 'black') return '#000000'
  return `var(--ui-color-${color}-${shade})`
}

export function useAccentBlob(config: BlobConfig): {
  style: ComputedRef<CSSProperties>
} {
  const style = computed((): CSSProperties => {
    const size = config.size ?? '40rem'
    const opacity = (config.opacity ?? 25) / 100
    const blurPx = resolveBlurPx(config.blur)

    return {
      position: 'absolute',
      left: `${config.x}%`,
      top: `${config.y}%`,
      transform: 'translate(-50%, -50%)',
      width: size,
      height: size,
      backgroundColor: resolveColor(config),
      opacity,
      borderRadius: '9999px',
      filter: blurPx > 0 ? `blur(${blurPx}px)` : undefined,
      pointerEvents: 'none',
    }
  })

  return { style }
}
