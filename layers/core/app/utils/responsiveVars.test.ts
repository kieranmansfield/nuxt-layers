import { describe, expect, it } from 'vite-plus/test'

import { responsiveVars } from './responsiveVars'

describe('responsiveVars', () => {
  it('sets only the base variable for a bare value', () => {
    expect(responsiveVars('snap-span', 4)).toEqual({ '--snap-span': '4' })
  })

  it('sets one variable per breakpoint given', () => {
    expect(responsiveVars('snap-span', { default: 12, md: 6, xl: 3 })).toEqual({
      '--snap-span': '12',
      '--snap-span-md': '6',
      '--snap-span-xl': '3',
    })
  })

  it('sets nothing when the value is undefined', () => {
    expect(responsiveVars('snap-span', undefined)).toEqual({})
  })
})
