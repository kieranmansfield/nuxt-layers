export type GithubRelease = {
  tag: string
  name?: string
  url: string
  publishedAt?: string
}

export type GithubRepoStats = {
  /** `owner/name` as GitHub reports it (canonical casing, follows renames) */
  fullName: string
  owner: string
  name: string
  description?: string
  url: string
  homepage?: string
  stars: number
  forks: number
  watchers: number
  /** GitHub counts open pull requests as issues here */
  openIssues: number
  /** Sum of release asset downloads across the latest 100 releases */
  downloads: number
  releases: number
  latestRelease?: GithubRelease
  language?: string
  /** SPDX id, e.g. `MIT` */
  license?: string
  topics: string[]
  archived: boolean
  createdAt: string
  pushedAt?: string
  fetchedAt: string
}

export type ObsidianPluginStats = {
  id: string
  name: string
  author: string
  description: string
  /** `owner/name` of the plugin's GitHub repo */
  repo: string
  repoUrl: string
  /** Public listing on obsidian.md */
  listingUrl: string
  /** Opens the plugin in the Obsidian app's community plugin browser */
  installUrl: string
  downloads: number
  latestVersion?: string
  latestVersionDownloads?: number
  updatedAt?: string
  minAppVersion?: string
  authorUrl?: string
  fundingUrl?: string
  isDesktopOnly?: boolean
  fetchedAt: string
}
