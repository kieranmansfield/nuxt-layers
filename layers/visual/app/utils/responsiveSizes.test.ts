import { describe, expect, it } from 'vitest'

import type { ResponsiveSizes } from '../types/media'
import { buildResponsiveSizesQueries } from './responsiveSizes'

describe('buildResponsiveSizesQueries', () => {
  it('returns only the default query when no breakpoints are set', () => {
    const sizes: ResponsiveSizes = { default: '100vw' }
    expect(buildResponsiveSizesQueries(sizes)).toEqual(['100vw'])
  })

  it('always places the default query last', () => {
    const sizes: ResponsiveSizes = { default: '100vw', md: '50vw' }
    const queries = buildResponsiveSizesQueries(sizes)
    expect(queries.at(-1)).toBe('100vw')
  })

  it('sorts tailwind breakpoints from largest to smallest min-width', () => {
    const sizes: ResponsiveSizes = {
      default: '100vw',
      sm: '90vw',
      lg: '50vw',
      '2xl': '25vw',
    }

    expect(buildResponsiveSizesQueries(sizes)).toEqual([
      '(min-width: 1536px) 25vw',
      '(min-width: 1024px) 50vw',
      '(min-width: 640px) 90vw',
      '100vw',
    ])
  })

  it('mixes device, phone, and tablet breakpoints sorted by pixel value', () => {
    const sizes: ResponsiveSizes = {
      default: '100vw',
      wide: '20vw',
      desktop: '40vw',
      'phone-md': '95vw',
    }

    expect(buildResponsiveSizesQueries(sizes)).toEqual([
      '(min-width: 1920px) 20vw',
      '(min-width: 1024px) 40vw',
      '(min-width: 375px) 95vw',
      '100vw',
    ])
  })

  it('prepends landscape before portrait, both before breakpoints', () => {
    const sizes: ResponsiveSizes = {
      default: '100vw',
      landscape: '80vw',
      portrait: '90vw',
      md: '50vw',
    }

    expect(buildResponsiveSizesQueries(sizes)).toEqual([
      '(orientation: landscape) 80vw',
      '(orientation: portrait) 90vw',
      '(min-width: 768px) 50vw',
      '100vw',
    ])
  })

  it('omits orientation queries when not provided', () => {
    const sizes: ResponsiveSizes = { default: '100vw' }
    const queries = buildResponsiveSizesQueries(sizes)
    expect(queries.some((q) => q.includes('orientation'))).toBe(false)
  })
})
