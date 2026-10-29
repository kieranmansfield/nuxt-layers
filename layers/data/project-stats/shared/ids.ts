// Owners are alphanumeric + hyphen; repo names can't be `.` or `..`
const REPO = /^[a-z\d-]+\/(?!\.\.?$)[\w.-]+$/i

/**
 * Accepts `owner/name` or a github.com URL (with or without `.git`, trailing path or slash)
 * and returns the `owner/name` slug, or `null` when it isn't a repo reference.
 */
export function parseGithubRepo(input: string): string | null {
  const slug = input
    .trim()
    .replace(/^(?:https?:\/\/)?(?:www\.)?github\.com\//i, '')
    .replace(/[?#].*$/, '')
    .split('/')
    .slice(0, 2)
    .join('/')
    .replace(/\.git$/i, '')
  return REPO.test(slug) ? slug : null
}

/** Obsidian community plugin ids: lowercase-ish, no slashes. */
export function isObsidianPluginId(input: string): boolean {
  return /^[a-z0-9][\w.-]*$/i.test(input)
}
