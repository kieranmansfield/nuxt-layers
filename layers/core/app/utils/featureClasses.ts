import type { FeatureDetection } from '#layers/core/app/types/detection'

const PREFIXES = ['supports-', 'no-', 'has-'] as const

const SUPPORT_CLASS_MAP: Array<[keyof FeatureDetection, string, string]> = [
  ['grid', 'supports-grid', 'no-grid'],
  ['subgrid', 'supports-subgrid', 'no-subgrid'],
  ['containerQueries', 'supports-container-queries', 'no-container-queries'],
  ['has', 'supports-has', 'no-has'],
  ['aspectRatio', 'supports-aspect-ratio', 'no-aspect-ratio'],
  ['backdropFilter', 'supports-backdrop-filter', 'no-backdrop-filter'],
]

const EXTRA_CLASS_MAP: Array<[keyof FeatureDetection, string]> = [
  ['intersectionObserver', 'has-intersection-observer'],
  ['resizeObserver', 'has-resize-observer'],
  ['serviceWorker', 'has-service-worker'],
  ['webGL', 'has-webgl'],
  ['webp', 'supports-webp'],
  ['avif', 'supports-avif'],
]

export function getFeatureClassNames(features: FeatureDetection): string[] {
  const classes = SUPPORT_CLASS_MAP.map(([key, supportedClass, unsupportedClass]) =>
    features[key] ? supportedClass : unsupportedClass
  )

  classes.push(
    ...EXTRA_CLASS_MAP.flatMap(([key, className]) => (features[key] ? [className] : []))
  )

  return classes
}

export function removeFeatureClasses(classList: DOMTokenList) {
  const classNames = Array.from(classList).filter((cls) =>
    PREFIXES.some((prefix) => cls.startsWith(prefix))
  )
  classList.remove(...classNames)
}
