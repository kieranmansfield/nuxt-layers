import { describe, expect, it } from 'vitest'

import type { GridPreset, TrackConfig, TrackSegment } from './tracks'

describe('track types', () => {
  it('accepts a minimal equal-width segment', () => {
    const segment: TrackSegment = { size: 1 }
    expect(segment.size).toBe(1)
  })

  it('accepts a segment with named lines', () => {
    const segment: TrackSegment = {
      size: 2,
      lineStart: 'feature-start',
      lineEnd: ['feature-end', 'aside-start'],
    }
    expect(segment.lineEnd).toEqual(['feature-end', 'aside-start'])
  })

  it('accepts a TrackConfig with optional minTrackWidth', () => {
    const config: TrackConfig = {
      columns: [{ size: 1 }, { size: 2 }],
      minTrackWidth: '20rem',
    }
    expect(config.columns).toHaveLength(2)
  })

  it('a GridPreset is a named TrackConfig', () => {
    const preset: GridPreset = { name: 'swiss', columns: [{ size: 1 }] }
    expect(preset.name).toBe('swiss')
  })
})
