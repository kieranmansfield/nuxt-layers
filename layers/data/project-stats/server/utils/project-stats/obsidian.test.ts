import { describe, expect, it } from 'vite-plus/test'

import { latestStatsVersion, normaliseObsidianPlugin, type ObsidianListingEntry } from './obsidian'

const entry: ObsidianListingEntry = {
  id: 'dataview',
  name: 'Dataview',
  author: 'blacksmithgu',
  description: 'Run advanced queries over your vault.',
  repo: 'blacksmithgu/obsidian-dataview',
}

const stats = {
  downloads: 5209569,
  updated: 1744053450000,
  '0.1.0': 10,
  '0.5.9': 200,
  '0.5.10': 300,
  '0.5.70': 4000,
}

describe('latestStatsVersion', () => {
  it('compares versions numerically, not as strings', () => {
    expect(latestStatsVersion(stats)).toBe('0.5.70')
  })

  it('ignores the totals keys', () => {
    expect(latestStatsVersion({ downloads: 1, updated: 2 })).toBeUndefined()
  })
})

describe('normaliseObsidianPlugin', () => {
  it('builds listing, install and repo links', () => {
    const plugin = normaliseObsidianPlugin(entry, stats, null)
    expect(plugin).toMatchObject({
      id: 'dataview',
      listingUrl: 'https://obsidian.md/plugins?id=dataview',
      installUrl: 'obsidian://show-plugin?id=dataview',
      repoUrl: 'https://github.com/blacksmithgu/obsidian-dataview',
      downloads: 5209569,
      updatedAt: new Date(1744053450000).toISOString(),
    })
  })

  it('takes the version from the stats when the manifest is missing', () => {
    const plugin = normaliseObsidianPlugin(entry, stats, null)
    expect(plugin.latestVersion).toBe('0.5.70')
    expect(plugin.latestVersionDownloads).toBe(4000)
  })

  it('prefers manifest details when available', () => {
    const plugin = normaliseObsidianPlugin(entry, stats, {
      version: '0.5.10',
      minAppVersion: '0.13.11',
      authorUrl: 'https://github.com/blacksmithgu',
      fundingUrl: { 'Buy me a coffee': 'https://example.com/coffee' },
      isDesktopOnly: false,
    })
    expect(plugin).toMatchObject({
      latestVersion: '0.5.10',
      latestVersionDownloads: 300,
      minAppVersion: '0.13.11',
      authorUrl: 'https://github.com/blacksmithgu',
      fundingUrl: 'https://example.com/coffee',
      isDesktopOnly: false,
    })
  })

  it('handles a listed plugin with no stats yet', () => {
    const plugin = normaliseObsidianPlugin(entry, undefined, null)
    expect(plugin.downloads).toBe(0)
    expect(plugin).not.toHaveProperty('latestVersion')
    expect(plugin).not.toHaveProperty('updatedAt')
  })
})
