import { existsSync, readdirSync } from 'node:fs'
import { join } from 'node:path'

const ROOT = new URL('../../', import.meta.url).pathname

export function listLayers() {
  const layersDir = join(ROOT, 'layers')
  return readdirSync(layersDir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort()
}

export function isWellFormedLayer(name) {
  const dir = join(ROOT, 'layers', name)
  return existsSync(join(dir, 'nuxt.config.ts')) && existsSync(join(dir, 'package.json'))
}

export function listApps() {
  const appsDir = join(ROOT, 'apps')
  return readdirSync(appsDir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort()
}

export { ROOT }
