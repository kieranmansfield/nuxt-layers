import { existsSync, readdirSync, readFileSync } from 'node:fs'
import { dirname, join, relative, resolve } from 'node:path'
import { describe, expect, it } from 'vitest'

// Guards the layer dependency graph: a layer's `extends` is the only place dependencies are
// declared. Covers `#layers/<name>` alias imports and auto-imported component tags in .vue
// templates — auto-imported composables from an undeclared layer are NOT detected here.

const root = resolve(import.meta.dirname, '../..')
const skip = (p: string) => p.includes('node_modules') || p.includes('.nuxt')

function walk(dir: string): string[] {
  return readdirSync(dir, { recursive: true, encoding: 'utf8' })
    .map((f) => join(dir, f))
    .filter((f) => !skip(f))
}

const configs = walk(join(root, 'layers')).filter((f) => f.endsWith('/nuxt.config.ts'))

interface Layer {
  dir: string
  alias: string
  extends: string[]
}

const layers = new Map<string, Layer>()
for (const file of configs) {
  const src = readFileSync(file, 'utf8')
  const dir = dirname(file)
  const alias = src.match(/'#layers\/([a-z-]+)':\s*import\.meta\.dirname/)?.[1] ?? ''
  const ext = src.match(/extends:\s*([^\]]*\])/)?.[1] ?? ''
  const paths = [...ext.matchAll(/'([^']+)'/g)].map((m) => resolve(dir, m[1]!))
  layers.set(dir, { dir, alias, extends: paths })
}

function closure(dir: string, seen = new Set<string>()): Set<string> {
  if (seen.has(dir)) return seen
  seen.add(dir)
  for (const dep of layers.get(dir)?.extends ?? []) closure(dep, seen)
  return seen
}

// Nuxt's default component naming: path segments under components/ PascalCased, `index`
// dropped, and a file name that already starts with its directory prefix not repeated.
const pascal = (s: string) => s.replace(/(^|[-_])(\w)/g, (_, __, c: string) => c.toUpperCase())
function componentName(rel: string): string {
  const parts = rel
    .replace(/(\.client|\.server)?\.vue$/, '')
    .split('/')
    .map(pascal)
  const file = parts.pop()!
  const prefix = parts.join('')
  if (/^index$/i.test(file)) return prefix
  return file.startsWith(prefix) ? file : prefix + file
}

const ownersByComponent = new Map<string, Set<string>>()
for (const layer of layers.values()) {
  const base = join(layer.dir, 'app/components')
  if (!existsSync(base)) continue
  for (const file of walk(base).filter((f) => f.endsWith('.vue'))) {
    const name = componentName(relative(base, file))
    ownersByComponent.set(name, (ownersByComponent.get(name) ?? new Set()).add(layer.dir))
  }
}

const dirByAlias = new Map([...layers.values()].filter((l) => l.alias).map((l) => [l.alias, l.dir]))

describe('layer extends', () => {
  it.each([...layers.values()])('$dir only imports layers it extends', (layer) => {
    const allowed = closure(layer.dir)
    const bad: string[] = []
    for (const sub of ['app', 'server', 'shared']) {
      const base = join(layer.dir, sub)
      if (!existsSync(base)) continue
      for (const file of walk(base).filter((f) => /\.(ts|vue)$/.test(f))) {
        const src = readFileSync(file, 'utf8')
        for (const m of src.matchAll(/from\s+'#layers\/([a-z-]+)/g)) {
          const target = dirByAlias.get(m[1]!)
          if (!target || !allowed.has(target))
            bad.push(`${relative(root, file)} -> #layers/${m[1]}`)
        }
      }
    }
    expect(bad).toEqual([])
  })

  it.each([...layers.values()])('$dir only renders components from layers it extends', (layer) => {
    const allowed = closure(layer.dir)
    const bad: string[] = []
    const base = join(layer.dir, 'app')
    if (!existsSync(base)) return
    for (const file of walk(base).filter((f) => f.endsWith('.vue'))) {
      // Only the <template> block: script and style text can look like tags
      const src = readFileSync(file, 'utf8')
      const start = src.indexOf('<template')
      const template = start === -1 ? '' : src.slice(start, src.lastIndexOf('</template>'))
      for (const [, tag] of template.matchAll(
        /<([A-Z][A-Za-z0-9]*|[a-z]+(?:-[a-z0-9]+)+)[\s/>]/g
      )) {
        const name = pascal(tag!).replace(/^Lazy(?=[A-Z])/, '')
        const owners = ownersByComponent.get(name)
        if (owners && ![...owners].some((o) => allowed.has(o)))
          bad.push(`${relative(root, file)} -> <${name}>`)
      }
    }
    expect([...new Set(bad)]).toEqual([])
  })

  it('every extends path resolves to a layer', () => {
    for (const layer of layers.values()) {
      for (const dep of layer.extends) expect(layers.has(dep), `${layer.dir} -> ${dep}`).toBe(true)
    }
  })

  it('every playground LAYER_PATHS entry exists', () => {
    const src = readFileSync(join(root, 'apps/playground/nuxt.config.ts'), 'utf8')
    const block = src.match(/LAYER_PATHS[^{]*\{([^}]*)\}/)![1]!
    const paths = [...block.matchAll(/:\s*'([^']+)'/g)].map((m) => m[1]!)
    expect(paths.length).toBeGreaterThan(0)
    for (const p of paths) expect(layers.has(resolve(root, 'apps/playground', p)), p).toBe(true)
  })

  it('every package.json export points at an existing layer config', () => {
    const pkg = JSON.parse(readFileSync(join(root, 'package.json'), 'utf8'))
    for (const target of Object.values<string>(pkg.exports)) {
      expect(existsSync(join(root, target)), target).toBe(true)
    }
  })

  it('every layer is exported from package.json', () => {
    const pkg = JSON.parse(readFileSync(join(root, 'package.json'), 'utf8'))
    const exported = new Set(
      Object.values<string>(pkg.exports).map((t) => resolve(root, dirname(t)))
    )
    const missing = [...layers.keys()].filter((d) => !exported.has(d)).map((d) => relative(root, d))
    expect(missing).toEqual([])
  })
})
