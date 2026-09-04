import { describe, expect, it } from 'vitest'

import { styleToTailwindClasses } from './styleToTailwindClasses'

describe('styleToTailwindClasses', () => {
  it('converts a camelCase property into a kebab-case arbitrary-property class', () => {
    expect(styleToTailwindClasses({ background: 'red' })).toEqual(['[background:red]'])
    expect(styleToTailwindClasses({ gridTemplateColumns: 'repeat(12, 1fr)' })).toEqual([
      '[grid-template-columns:repeat(12,_1fr)]',
    ])
  })

  it('escapes spaces in the value with underscores', () => {
    expect(styleToTailwindClasses({ boxShadow: '0 1px 2px rgba(0,0,0,.1)' })).toEqual([
      '[box-shadow:0_1px_2px_rgba(0,0,0,.1)]',
    ])
  })

  it('skips undefined, null, and empty-string values', () => {
    expect(
      styleToTailwindClasses({ width: undefined, height: null as unknown as undefined, color: '' })
    ).toEqual([])
  })

  it('preserves declaration order across multiple properties', () => {
    expect(styleToTailwindClasses({ display: 'flex', width: '80px' })).toEqual([
      '[display:flex]',
      '[width:80px]',
    ])
  })
})
