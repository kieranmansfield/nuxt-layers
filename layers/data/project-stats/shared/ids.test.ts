import { describe, expect, it } from 'vite-plus/test'

import { isObsidianPluginId, parseGithubRepo } from './ids'

describe('parseGithubRepo', () => {
  it.each([
    ['nuxt/nuxt', 'nuxt/nuxt'],
    ['  nuxt/ui  ', 'nuxt/ui'],
    ['https://github.com/nuxt/nuxt', 'nuxt/nuxt'],
    ['github.com/nuxt/nuxt/', 'nuxt/nuxt'],
    ['https://www.github.com/nuxt/nuxt.git', 'nuxt/nuxt'],
    ['https://github.com/nuxt/nuxt/tree/main/docs', 'nuxt/nuxt'],
    ['https://github.com/vuejs/core?tab=readme', 'vuejs/core'],
    ['my-org/my.repo_name', 'my-org/my.repo_name'],
  ])('%s → %s', (input, expected) => {
    expect(parseGithubRepo(input)).toBe(expected)
  })

  it.each(['', 'nuxt', 'https://gitlab.com/a/b', '../etc/passwd', 'nuxt/..', 'a/b c'])(
    'rejects %j',
    (input) => {
      expect(parseGithubRepo(input)).toBeNull()
    }
  )
})

describe('isObsidianPluginId', () => {
  it('accepts listing ids', () => {
    expect(isObsidianPluginId('dataview')).toBe(true)
    expect(isObsidianPluginId('obsidian-git')).toBe(true)
    expect(isObsidianPluginId('table-editor-obsidian')).toBe(true)
  })

  it('rejects paths and empty input', () => {
    expect(isObsidianPluginId('')).toBe(false)
    expect(isObsidianPluginId('a/b')).toBe(false)
    expect(isObsidianPluginId('-flag')).toBe(false)
  })
})
