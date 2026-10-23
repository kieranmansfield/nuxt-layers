import { globSync, readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'

// docs/component-levels.md records each UI component's atomic level (folders are by domain,
// so nothing else does). This keeps the table and the component files in step.
const root = resolve(import.meta.dirname, '../..')
const doc = readFileSync(resolve(root, 'docs/component-levels.md'), 'utf8')
const rows = new Map(
  [...doc.matchAll(/^\|\s*`([^`]+\.vue)`\s*\|\s*([a-z]+)\s*\|$/gm)].map((m) => [m[1]!, m[2]!])
)
const files = globSync('layers/**/app/components/**/*.vue', {
  cwd: root,
  exclude: (f) => f.includes('node_modules') || f.startsWith('layers/render/shader'),
})

describe('component levels', () => {
  it('lists every component', () => {
    expect(files.filter((f) => !rows.has(f))).toEqual([])
  })

  it('has no rows for deleted components', () => {
    expect([...rows.keys()].filter((f) => !files.includes(f))).toEqual([])
  })

  it('uses only known levels', () => {
    const levels = ['atom', 'behaviour', 'molecule', 'organism', 'template', 'page']
    expect([...rows.values()].filter((l) => !levels.includes(l))).toEqual([])
  })
})
