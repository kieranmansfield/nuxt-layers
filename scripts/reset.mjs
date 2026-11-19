#!/usr/bin/env node
import { spawnSync } from 'node:child_process'

const withLockfile = process.argv.includes('--lockfile')

function run(cmd, args) {
  console.log(`\n> ${cmd} ${args.join(' ')}`)
  // SHARP_IGNORE_GLOBAL_LIBVIPS: a Homebrew `vips` makes sharp skip its prebuilt binary and
  // try a source build, which fails the install
  const env = { ...process.env, SHARP_IGNORE_GLOBAL_LIBVIPS: '1' }
  const result = spawnSync(cmd, args, { stdio: 'inherit', env })
  if (result.status !== 0) {
    process.exit(result.status ?? 1)
  }
}

const rmTargets = ['node_modules', '.nuxt', '.output', '.data', 'dist', '.turbo']

console.log(`Resetting workspace${withLockfile ? ' (including lockfile)' : ''}...`)

// --include-workspace-root: without it, pnpm -r skips the root package and its node_modules survives
run('pnpm', ['-r', '--include-workspace-root', 'exec', 'rm', '-rf', ...rmTargets])
if (withLockfile) run('rm', ['-f', 'pnpm-lock.yaml'])

run('pnpm', ['store', 'prune'])
run('pnpm', ['install'])

console.log('\nReset complete.')
