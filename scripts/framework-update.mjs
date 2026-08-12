#!/usr/bin/env node
import { readFileSync } from 'node:fs'
import { spawnSync } from 'node:child_process'
import { ROOT } from './lib/layers.mjs'

// nuxt is deliberately excluded from automated `--latest` updates: nuxt@4.5.0+ requires
// vite ^8.2.0, conflicting with this workspace's `overrides: { vite: '^7' }` pin (Vite 8
// is deliberately blocked — see pnpm-workspace.yaml), and nuxt@4.4.8 pulls in an unhead
// release whose dist/client.mjs fails to parse under Rollup (unrelated upstream bug),
// breaking playground/ui builds. Neither a catalog range cap nor a plain `overrides` pin
// reliably holds nuxt back across this monorepo's 34 workspace packages — `--latest`
// rewrites manifest fields directly for packages resolved through conflict-catalogs, and
// @nuxt/vite-builder can still float independently of the top-level `nuxt` pin. Bump nuxt
// manually and verify `pnpm typecheck && pnpm build` pass before raising this further.
const FRAMEWORK_PACKAGES = [
  '@nuxt/ui',
  '@nuxt/content',
  '@nuxt/image',
  '@nuxt/fonts',
  'vue',
  'vue-router',
  'tailwindcss',
  'pinia',
]

function run(label, cmd, args, opts = {}) {
  console.log(`\n▶ ${label}`)
  console.log(`  ${cmd} ${args.join(' ')}`)
  const result = spawnSync(cmd, args, { cwd: ROOT, stdio: 'inherit', ...opts })
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
console.log('  - nuxt: SKIPPED (held manually — see comment in scripts/framework-update.mjs)')

run('Update framework catalog entries', 'pnpm', ['update', ...detected, '--latest', '--recursive'])
run('Install', 'pnpm', ['install'])
run('Prepare Nuxt apps', 'pnpm', ['--filter', './apps/*', 'exec', 'nuxt', 'prepare'])
run('Typecheck', 'pnpm', ['run', 'typecheck'])
// Layers have no workspace-level dependency on apps (they're pulled in via `extends` in
// nuxt.config.ts, not package.json), so an unfiltered `turbo run build` builds all ~26
// layers standalone as well as the apps — heavy enough to OOM (exit 137) on this repo.
// Building the apps is the meaningful rebuildability check; each app's build already
// resolves and bundles its extended layers. Even scoped to apps-only, playground's build
// (Content + TresJS/shader/WebGPU + many bundled layers) still exceeds Node's default
// heap standalone, so raise it explicitly rather than relying on the environment's default.
run('Build (apps)', 'pnpm', ['turbo', 'run', 'build', '--filter', './apps/*', '--concurrency', '1'], {
  env: { ...process.env, NODE_OPTIONS: '--max-old-space-size=8192' },
})

console.log('\nFramework update complete. Review the diff before committing.')
