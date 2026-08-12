#!/usr/bin/env node
import { spawnSync } from 'node:child_process'
import { readFileSync } from 'node:fs'
import { createInterface } from 'node:readline/promises'

import { ROOT } from './lib/layers.mjs'

const level = process.argv[2]
if (!['patch', 'minor', 'major'].includes(level)) {
  console.error('Usage: node scripts/release.mjs <patch|minor|major>')
  process.exit(1)
}

function run(label, cmd, args, opts = {}) {
  console.log(`\n▶ ${label}`)
  const result = spawnSync(cmd, args, { cwd: ROOT, stdio: 'inherit', ...opts })
  if (result.status !== 0) {
    console.error(`\n✗ ${label} failed. Release aborted — nothing pushed.`)
    process.exit(result.status ?? 1)
  }
  console.log(`✓ ${label}`)
}

function sh(cmd, args) {
  return spawnSync(cmd, args, { cwd: ROOT, encoding: 'utf8' })
}

async function confirm(question) {
  const rl = createInterface({ input: process.stdin, output: process.stdout })
  const answer = await rl.question(`${question} [y/N] `)
  rl.close()
  return answer.trim().toLowerCase() === 'y'
}

const branch = sh('git', ['branch', '--show-current']).stdout.trim()
if (branch !== 'main') {
  console.error(`✗ On branch "${branch}", expected "main". Release aborted.`)
  process.exit(1)
}

const status = sh('git', ['status', '--porcelain']).stdout.trim()
if (status !== '') {
  console.error('✗ Working tree is not clean. Commit or stash changes before releasing.')
  process.exit(1)
}

run('Check (lint + typecheck + format)', 'pnpm', ['run', 'check'])
run('Build', 'pnpm', ['run', 'build'])
run('Test', 'pnpm', ['run', 'test'])

run('Bump version', 'npm', ['version', level, '--no-git-tag-version'])

const pkg = JSON.parse(readFileSync(new URL('../package.json', import.meta.url), 'utf8'))
const version = `v${pkg.version}`

run('Commit', 'git', ['add', 'package.json'])
run('Commit', 'git', ['commit', '-m', `chore(release): ${version}`])
run('Tag', 'git', ['tag', version])

const proceed = await confirm(`\nPush commit and tag ${version} to origin/main?`)
if (!proceed) {
  console.log('Stopped before push. Commit and tag are local — push manually when ready.')
  process.exit(0)
}

run('Push', 'git', ['push', 'origin', 'main', '--follow-tags'])

const gh = sh('which', ['gh'])
if (gh.status !== 0) {
  console.log(
    `\nPushed. GitHub CLI ("gh") not found — create the release manually so npm-publish.yml fires:\n  gh release create ${version} --generate-notes`
  )
  process.exit(0)
}

const proceedRelease = await confirm(`Create GitHub release ${version} (triggers npm publish)?`)
if (!proceedRelease) {
  console.log(`Skipped. Run later: gh release create ${version} --generate-notes`)
  process.exit(0)
}

run('Create GitHub release', 'gh', ['release', 'create', version, '--generate-notes'])

console.log(`\nRelease ${version} complete.`)
