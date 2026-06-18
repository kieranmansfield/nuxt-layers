export type BrowserInfo = {
  name: string
  version: string
  engine: string
  os: string
}

type BrowserRule = {
  match: (ua: string) => boolean
  name: BrowserInfo['name']
  engine: BrowserInfo['engine']
  version: (ua: string) => string
}

type OsRule = {
  match: (ua: string) => boolean
  os: BrowserInfo['os']
}

const OS_RULES: OsRule[] = [
  { match: (ua) => ua.includes('Android'), os: 'android' },
  { match: (ua) => ua.includes('iOS') || ua.includes('iPhone') || ua.includes('iPad'), os: 'ios' },
  { match: (ua) => ua.includes('Win'), os: 'windows' },
  { match: (ua) => ua.includes('Mac'), os: 'macos' },
  { match: (ua) => ua.includes('Linux'), os: 'linux' },
]

const BROWSER_RULES: BrowserRule[] = [
  {
    match: (ua) => ua.includes('Edg/'),
    name: 'edge',
    engine: 'blink',
    version: (ua) => ua.match(/Edg\/([\d.]+)/)?.[1] ?? '0',
  },
  {
    match: (ua) => ua.includes('Chrome/') && !ua.includes('Edg'),
    name: 'chrome',
    engine: 'blink',
    version: (ua) => ua.match(/Chrome\/([\d.]+)/)?.[1] ?? '0',
  },
  {
    match: (ua) => ua.includes('Safari/') && !ua.includes('Chrome'),
    name: 'safari',
    engine: 'webkit',
    version: (ua) => ua.match(/Version\/([\d.]+)/)?.[1] ?? '0',
  },
  {
    match: (ua) => ua.includes('Firefox/'),
    name: 'firefox',
    engine: 'gecko',
    version: (ua) => ua.match(/Firefox\/([\d.]+)/)?.[1] ?? '0',
  },
  {
    match: (ua) => ua.includes('Opera/') || ua.includes('OPR/'),
    name: 'opera',
    engine: 'blink',
    version: (ua) => ua.match(/(?:Opera|OPR)\/([\d.]+)/)?.[1] ?? '0',
  },
]

function detectOs(ua: string): BrowserInfo['os'] {
  return OS_RULES.find((rule) => rule.match(ua))?.os ?? 'unknown'
}

function detectBrowser(ua: string): Pick<BrowserInfo, 'name' | 'version' | 'engine'> {
  const rule = BROWSER_RULES.find((candidate) => candidate.match(ua))
  if (!rule) return { name: 'unknown', version: '0', engine: 'unknown' }
  return {
    name: rule.name,
    version: rule.version(ua),
    engine: rule.engine,
  }
}

export function parseBrowserInfo(userAgent?: string | null): BrowserInfo {
  if (!import.meta.client) {
    return {
      name: 'unknown',
      version: '0',
      engine: 'unknown',
      os: 'unknown',
    }
  }

  const ua = userAgent ?? navigator.userAgent
  return {
    ...detectBrowser(ua),
    os: detectOs(ua),
  }
}

export function getBrowserVersionParts(version: string) {
  const [major = '0', minor = '0'] = version.split('.')
  return {
    major: Number.parseInt(major, 10) || 0,
    minor: Number.parseInt(minor, 10) || 0,
  }
}

// fallow-ignore-next-line complexity
export function isBrowserAtLeast(version: string, minVersion: string): boolean {
  const current = getBrowserVersionParts(version)
  const [minMajor = '', minMinor = '0'] = minVersion.split('.')

  if (!minMajor) return false

  const required = {
    major: Number.parseInt(minMajor, 10) || 0,
    minor: Number.parseInt(minMinor, 10) || 0,
  }

  if (current.major > required.major) return true
  if (current.major < required.major) return false
  return current.minor >= required.minor
}
