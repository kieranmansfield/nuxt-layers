import { afterEach, describe, expect, it, vi } from 'vite-plus/test'

import { readServerAppConfig } from './app-config'

vi.mock('nitropack/runtime', () => ({ useAppConfig: () => ({ from: 'nitro' }) }))

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('readServerAppConfig', () => {
  it("returns Nuxt's merged app config when Nitro auto-imports provide useAppConfig", () => {
    vi.stubGlobal('useAppConfig', () => ({ site: { title: 'Site' } }))

    expect(readServerAppConfig()).toEqual({ site: { title: 'Site' } })
  })

  it("falls back to Nitro's own app config without auto-imports (Nuxt 5's default)", () => {
    expect(readServerAppConfig()).toEqual({ from: 'nitro' })
  })
})
