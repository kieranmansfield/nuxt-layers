#!/usr/bin/env node
import { existsSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import { spawnSync } from 'node:child_process'
import { listApps, ROOT } from './lib/layers.mjs'

const pkg = JSON.parse(readFileSync(join(ROOT, 'package.json'), 'utf8'))
let failed = false

function check(label, ok, detail) {
  console.log(`${ok ? '✓' : '✗'} ${label}${detail ? ` (${detail})` : ''}`)
  if (!ok) failed = true
}

function sh(cmd, args) {
  const result = spawnSync(cmd, args, { encoding: 'utf8' })
  return result.status === 0 ? result.stdout.trim() : null
}

console.log('Nuxt Layers Repo Doctor')
console.log('─'.repeat(28))

console.log('Runtime')
const nodeVersion = process.version
const requiredNode = pkg.engines?.node
const nodeMajor = Number(process.versions.node.split('.')[0])
check(`Node ${nodeVersion}`, !requiredNode || nodeMajor === 24, requiredNode)
const pnpmVersion = sh('pnpm', ['--version'])
check(`pnpm ${pnpmVersion ?? 'not found'}`, Boolean(pnpmVersion))

console.log('Project')
check('Lockfile present', existsSync(join(ROOT, 'pnpm-lock.yaml')))
check('node_modules installed', existsSync(join(ROOT, 'node_modules')))
for (const app of listApps()) {
  check(`apps/${app} has nuxt.config.ts`, existsSync(join(ROOT, 'apps', app, 'nuxt.config.ts')))
}

console.log('Tooling')
check('ESLint config', existsSync(join(ROOT, 'eslint.config.mjs')))
check('Stylelint config', existsSync(join(ROOT, 'stylelint.config.mjs')))
check('Prettier config', existsSync(join(ROOT, 'prettier.config.cjs')))
check('TypeScript config', existsSync(join(ROOT, 'tsconfig.typecheck.json')))

console.log('Git')
const inGitRepo = sh('git', ['rev-parse', '--is-inside-work-tree']) === 'true'
check('Git repository', inGitRepo)
if (inGitRepo) {
  const branch = sh('git', ['branch', '--show-current'])
  check(`On branch ${branch}`, Boolean(branch))
  const status = sh('git', ['status', '--porcelain'])
  check('Working tree clean', status === '')
}

console.log('─'.repeat(28))
console.log(failed ? 'Problems found.' : 'No problems found.')
process.exit(failed ? 1 : 0)
