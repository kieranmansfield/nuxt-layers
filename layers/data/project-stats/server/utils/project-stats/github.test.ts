import { describe, expect, it } from 'vite-plus/test'

import { type GithubApiRelease, type GithubApiRepo, normaliseGithubRepo } from './github'

const repo: GithubApiRepo = {
  full_name: 'kieranmansfield/nuxt-layers',
  name: 'nuxt-layers',
  owner: { login: 'kieranmansfield' },
  description: 'Composable Nuxt layers',
  html_url: 'https://github.com/kieranmansfield/nuxt-layers',
  homepage: '',
  stargazers_count: 42,
  forks_count: 7,
  subscribers_count: 3,
  open_issues_count: 5,
  language: 'TypeScript',
  license: { spdx_id: 'ISC' },
  topics: ['nuxt', 'layers'],
  archived: false,
  created_at: '2024-01-01T00:00:00Z',
  pushed_at: '2026-10-27T00:00:00Z',
}

const release = (tag: string, downloads: number[], extra: Partial<GithubApiRelease> = {}) => ({
  tag_name: tag,
  name: null,
  html_url: `https://github.com/kieranmansfield/nuxt-layers/releases/tag/${tag}`,
  published_at: '2026-10-01T00:00:00Z',
  draft: false,
  prerelease: false,
  assets: downloads.map((download_count) => ({ download_count })),
  ...extra,
})

describe('normaliseGithubRepo', () => {
  it('maps the repo counters', () => {
    const stats = normaliseGithubRepo(repo, [], 'now')
    expect(stats).toMatchObject({
      fullName: 'kieranmansfield/nuxt-layers',
      owner: 'kieranmansfield',
      stars: 42,
      forks: 7,
      watchers: 3,
      openIssues: 5,
      downloads: 0,
      releases: 0,
      language: 'TypeScript',
      license: 'ISC',
      topics: ['nuxt', 'layers'],
      fetchedAt: 'now',
    })
  })

  it('omits empty optional fields rather than setting them undefined', () => {
    const stats = normaliseGithubRepo(
      { ...repo, description: null, language: null, license: { spdx_id: 'NOASSERTION' } },
      []
    )
    expect(stats).not.toHaveProperty('description')
    expect(stats).not.toHaveProperty('homepage')
    expect(stats).not.toHaveProperty('language')
    expect(stats).not.toHaveProperty('license')
    expect(stats).not.toHaveProperty('latestRelease')
  })

  it('sums release asset downloads, ignoring drafts', () => {
    const stats = normaliseGithubRepo(repo, [
      release('v2.0.0', [100, 50]),
      release('v1.0.0', [25]),
      release('v3.0.0', [1000], { draft: true }),
    ])
    expect(stats.downloads).toBe(175)
    expect(stats.releases).toBe(2)
  })

  it('picks the newest stable release over a newer prerelease', () => {
    const stats = normaliseGithubRepo(repo, [
      release('v2.0.0-beta.1', [], { prerelease: true }),
      release('v1.5.0', [], { name: 'Autumn' }),
    ])
    expect(stats.latestRelease).toEqual({
      tag: 'v1.5.0',
      name: 'Autumn',
      url: 'https://github.com/kieranmansfield/nuxt-layers/releases/tag/v1.5.0',
      publishedAt: '2026-10-01T00:00:00Z',
    })
  })

  it('falls back to a prerelease when there is no stable release', () => {
    const stats = normaliseGithubRepo(repo, [release('v0.1.0-alpha', [], { prerelease: true })])
    expect(stats.latestRelease?.tag).toBe('v0.1.0-alpha')
  })
})
