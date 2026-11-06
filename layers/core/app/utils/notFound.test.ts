import { describe, expect, it, vi } from 'vite-plus/test'

import { resolveNotFoundConfig } from './notFound'

describe('resolveNotFoundConfig', () => {
  it('falls back to the defaults with home and back buttons', () => {
    const resolved = resolveNotFoundConfig()
    expect(resolved.title).toBe('Page Not Found')
    expect(resolved.showPath).toBe(true)
    expect(resolved.actions.map((action) => action.label)).toEqual(['Go Home', 'Go Back'])
    expect(resolved.actions[0]).toMatchObject({ to: '/', color: 'primary', variant: 'solid' })
    expect(resolved.suggestions.links).toEqual([])
  })

  it('wires the back button to the handler', () => {
    const onBack = vi.fn()
    const back = resolveNotFoundConfig({ showHomeButton: false }, onBack).actions[0]
    expect(back?.label).toBe('Go Back')
    expect(back?.onClick).toBe(onBack)
  })

  it('honours overrides and hidden buttons', () => {
    const resolved = resolveNotFoundConfig({
      title: 'Lost',
      showPath: false,
      showBackButton: false,
      homeButtonLabel: 'Start over',
      homeButtonTo: '/start',
    })
    expect(resolved.title).toBe('Lost')
    expect(resolved.showPath).toBe(false)
    expect(resolved.actions).toHaveLength(1)
    expect(resolved.actions[0]).toMatchObject({ label: 'Start over', to: '/start' })
  })

  it('appends custom actions, styled neutral by default, with click as onClick', () => {
    const click = vi.fn()
    const resolved = resolveNotFoundConfig({
      showHomeButton: false,
      showBackButton: false,
      actions: [
        { label: 'Search', click },
        { label: 'Help', to: '/help', color: 'error' },
      ],
    })
    expect(resolved.actions[0]).toEqual({
      label: 'Search',
      color: 'neutral',
      variant: 'outline',
      onClick: click,
    })
    expect(resolved.actions[1]).toEqual({
      label: 'Help',
      to: '/help',
      color: 'error',
      variant: 'outline',
    })
  })

  it('only exposes suggestions when enabled', () => {
    const links = [{ label: 'Blog', to: '/blog' }]
    expect(resolveNotFoundConfig({ suggestions: { links } }).suggestions.links).toEqual([])
    expect(
      resolveNotFoundConfig({ suggestions: { enabled: true, links } }).suggestions.links
    ).toEqual(links)
  })
})
