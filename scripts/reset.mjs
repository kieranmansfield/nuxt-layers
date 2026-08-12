#!/usr/bin/env node
import { spawnSync } from 'node:child_process'

const withLockfile = process.argv.includes('--lockfile')

function run(cmd, args) {
  console.log(`\n> ${cmd} ${args.join(' ')}`)
  const result = spawnSync(cmd, args, { stdio: 'inherit' })
  if (result.status !== 0) {
    process.exit(result.status ?? 1)
  }
}

const rmTargets = ['node_modules', '.nuxt', '.output', '.data']
if (withLockfile) rmTargets.push('pnpm-lock.yaml')

console.log(`Resetting workspace${withLockfile ? ' (including lockfile)' : ''}...`)

run('pnpm', ['-r', 'exec', 'rm', '-rf', ...rmTargets.filter((t) => t !== 'pnpm-lock.yaml')])
if (withLockfile) run('rm', ['-f', 'pnpm-lock.yaml'])

run('pnpm', ['store', 'prune'])
run('pnpm', ['install'])

console.log('\nReset complete.')
