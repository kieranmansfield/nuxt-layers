import { readdirSync, readFileSync, statSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vite-plus/test'

// Nitro skips auto-imports for files under node_modules, which is where every consumer
// loads these layers from. Server files must import h3 / nitropack helpers explicitly.
const HELPERS = {
  h3: [
    'createError',
    'defineEventHandler',
    'getHeader',
    'getQuery',
    'getRequestURL',
    'getRouterParam',
    'readBody',
    'sendRedirect',
    'setHeader',
    'setResponseHeader',
    'setResponseStatus',
  ],
  nitropack: ['defineNitroPlugin', 'useAppConfig', 'useNitroApp', 'useRuntimeConfig', 'useStorage'],
}

function walk(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    if (name === 'node_modules' || name === '.nuxt') return []
    const path = join(dir, name)
    if (statSync(path).isDirectory()) return walk(path)
    return path.includes('/server/') && path.endsWith('.ts') && !path.endsWith('.test.ts')
      ? [path]
      : []
  })
}

describe('layer server files', () => {
  it('import h3 / nitropack helpers explicitly', () => {
    const missing: string[] = []
    for (const file of walk('layers')) {
      const src = readFileSync(file, 'utf8')
      const code = src
        .replace(/^import[\s\S]*?from .*$/gm, '')
        .replace(/\/\/.*|\/\*[\s\S]*?\*\//g, '')
      for (const [pkg, names] of Object.entries(HELPERS)) {
        for (const name of names) {
          const used = new RegExp(`(?<![\\w.])${name}\\s*[(<]|typeof ${name}\\b`).test(code)
          const imported = new RegExp(`import\\s*\\{[^}]*\\b${name}\\b[^}]*\\}\\s*from`).test(src)
          if (used && !imported) missing.push(`${file}: ${name} (from ${pkg})`)
        }
      }
    }
    expect(missing).toEqual([])
  })
})
