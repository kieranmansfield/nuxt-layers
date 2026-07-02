import { describe, expect, it } from 'vitest'

import type { FeatureDetection } from '../types/detection'
import { getFeatureClassNames } from './featureClasses'

function createFeatures(overrides: Partial<FeatureDetection> = {}): FeatureDetection {
  return {
    grid: false,
    subgrid: false,
    containerQueries: false,
    has: false,
    aspectRatio: false,
    logicalProperties: false,
    backdropFilter: false,
    intersectionObserver: false,
    resizeObserver: false,
    serviceWorker: false,
    webGL: false,
    darkMode: false,
    reducedMotion: false,
    highContrast: false,
    webp: false,
    avif: false,
    ...overrides,
  }
}

describe('getFeatureClassNames', () => {
  it('emits the "no-" variant for every unsupported CSS feature and no extras', () => {
    expect(getFeatureClassNames(createFeatures())).toEqual([
      'no-grid',
      'no-subgrid',
      'no-container-queries',
      'no-has',
      'no-aspect-ratio',
      'no-backdrop-filter',
    ])
  })

  it('emits the "supports-" variant for every supported CSS feature plus all extras', () => {
    expect(
      getFeatureClassNames(
        createFeatures({
          grid: true,
          subgrid: true,
          containerQueries: true,
          has: true,
          aspectRatio: true,
          backdropFilter: true,
          intersectionObserver: true,
          resizeObserver: true,
          serviceWorker: true,
          webGL: true,
          webp: true,
          avif: true,
        })
      )
    ).toEqual([
      'supports-grid',
      'supports-subgrid',
      'supports-container-queries',
      'supports-has',
      'supports-aspect-ratio',
      'supports-backdrop-filter',
      'has-intersection-observer',
      'has-resize-observer',
      'has-service-worker',
      'has-webgl',
      'supports-webp',
      'supports-avif',
    ])
  })

  it('only includes extra classes for the features that are truthy', () => {
    const classes = getFeatureClassNames(
      createFeatures({ intersectionObserver: true, avif: true })
    )

    expect(classes).toContain('has-intersection-observer')
    expect(classes).toContain('supports-avif')
    expect(classes).not.toContain('has-resize-observer')
    expect(classes).not.toContain('supports-webp')
  })

  it('mixes supported and unsupported CSS features independently', () => {
    const classes = getFeatureClassNames(createFeatures({ grid: true, has: true }))

    expect(classes).toEqual([
      'supports-grid',
      'no-subgrid',
      'no-container-queries',
      'supports-has',
      'no-aspect-ratio',
      'no-backdrop-filter',
    ])
  })

  it('ignores keys that are not part of either class map (e.g. darkMode)', () => {
    const classes = getFeatureClassNames(createFeatures({ darkMode: true, highContrast: true }))
    expect(classes.join(' ')).not.toContain('dark')
    expect(classes.join(' ')).not.toContain('contrast')
  })
})
