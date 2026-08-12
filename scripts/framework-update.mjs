#!/usr/bin/env node
import { readFileSync } from 'node:fs'
import { spawnSync } from 'node:child_process'
import { ROOT } from './lib/layers.mjs'

const FRAMEWORK_PACKAGES = [
  'nuxt',
  '@nuxt/ui',
  '@nuxt/content',
  '@nuxt/image',
  '@nuxt/fonts',
  'vue',
  'vue-router',
  'tailwindcss',
  'pinia',
]

function run(label, cmd, args) {
  console.log(`\n▶ ${label}`)
  console.log(`  ${cmd} ${args.join(' ')}`)
  const result = spawnSync(cmd, args, { cwd: ROOT, stdio: 'inherit' })
  if (result.status !== 0) {
    console.error(`\n✗ ${label} failed. Stopping — project is not left half-updated.`)
    process.exit(result.status ?? 1)
  }
  console.log(`✓ ${label}`)
}

function sh(cmd, args) {
  return spawnSync(cmd, args, { cwd: ROOT, encoding: 'utf8' })
}

const status = sh('git', ['status', '--porcelain'])
if (status.stdout.trim() !== '') {
  console.error('✗ Working tree is not clean. Commit or stash changes before running framework:update.')
  process.exit(1)
}

const pkg = JSON.parse(readFileSync(new URL('../package.json', import.meta.url), 'utf8'))
const declared = new Set([
  ...Object.keys(pkg.devDependencies ?? {}),
  ...Object.keys(pkg.peerDependencies ?? {}),
])
const detected = FRAMEWORK_PACKAGES.filter((name) => declared.has(name))

if (detected.length === 0) {
  console.log('No known framework packages declared in root package.json. Nothing to update.')
  process.exit(0)
}

console.log('Framework packages to update (via pnpm catalog):')
for (const name of detected) console.log(`  - ${name}`)

run('Update framework catalog entries', 'pnpm', ['update', ...detected, '--latest', '--recursive'])
run('Install', 'pnpm', ['install'])
run('Prepare Nuxt apps', 'pnpm', ['--filter', './apps/*', 'exec', 'nuxt', 'prepare'])
run('Typecheck', 'pnpm', ['run', 'typecheck'])
run('Build', 'pnpm', ['run', 'build'])

console.log('\nFramework update complete. Review the diff before committing.')
