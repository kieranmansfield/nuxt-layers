import type { ComputedRef, CSSProperties, MaybeRefOrGetter } from 'vue'
import { toValue } from 'vue'

import type { BlobBlur, BlobConfig } from '../types/accent'
import { resolveUiColorToken } from '../utils/colorTokens'

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

export function useAccentBlob(config: MaybeRefOrGetter<BlobConfig>): {
  style: ComputedRef<CSSProperties>
} {
  const style = computed((): CSSProperties => {
    const resolved = toValue(config)
    const size = resolved.size ?? '40rem'
    const opacity = (resolved.opacity ?? 25) / 100
    const blurPx = resolveBlurPx(resolved.blur)

    return {
      position: 'absolute',
      left: `${resolved.x}%`,
      top: `${resolved.y}%`,
      transform: 'translate(-50%, -50%)',
      width: size,
      height: size,
      backgroundColor: resolveUiColorToken(resolved),
      opacity,
      borderRadius: '9999px',
      filter: blurPx > 0 ? `blur(${blurPx}px)` : undefined,
      pointerEvents: 'none',
    }
  })

  return { style }
}
