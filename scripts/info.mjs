#!/usr/bin/env node
import { spawnSync } from 'node:child_process'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'

import { listLayers, ROOT } from './lib/layers.mjs'

const pkg = JSON.parse(readFileSync(join(ROOT, 'package.json'), 'utf8'))

function sh(cmd, args) {
  const result = spawnSync(cmd, args, { encoding: 'utf8' })
  return result.status === 0 ? result.stdout.trim() : 'unknown'
}

function frameworkVersion(name) {
  try {
    const pkgPath = join(ROOT, 'node_modules', name, 'package.json')
    return JSON.parse(readFileSync(pkgPath, 'utf8')).version
  } catch {
    return pkg.devDependencies?.[name] ?? pkg.peerDependencies?.[name] ?? 'not installed'
  }
}

console.log(`${pkg.name} v${pkg.version}`)
console.log('─'.repeat(28))
console.log(`Node:        ${process.version}`)
console.log(`pnpm:        ${sh('pnpm', ['--version'])}`)
console.log(`nuxt:        ${frameworkVersion('nuxt')}`)
console.log(`vue:         ${frameworkVersion('vue')}`)
console.log(`@nuxt/ui:    ${frameworkVersion('@nuxt/ui')}`)
console.log(`tailwindcss: ${frameworkVersion('tailwindcss')}`)
console.log(`Git branch:  ${sh('git', ['branch', '--show-current'])}`)
console.log(`Layers:      ${listLayers().length}`)
