#!/usr/bin/env node
import { spawnSync } from 'node:child_process'
import { readFileSync } from 'node:fs'

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

run('Bump version', 'npm', ['version', level, '--no-git-tag-version'])

const pkg = JSON.parse(readFileSync(new URL('../package.json', import.meta.url), 'utf8'))
const version = `v${pkg.version}`

run('Commit', 'git', ['add', 'package.json'])
run('Commit', 'git', ['commit', '-m', `chore(release): ${version}`])
run('Tag', 'git', ['tag', version])

// `--follow-tags` only pushes annotated tags; `git tag <name>` above makes a lightweight
// one, so push the tag explicitly alongside the branch.
run('Push', 'git', ['push', 'origin', 'main', version])

const gh = sh('which', ['gh'])
if (gh.status !== 0) {
  console.log(
    `\nPushed. GitHub CLI ("gh") not found — create the release manually so npm-publish.yml fires:\n  gh release create ${version} --generate-notes`
  )
  process.exit(0)
}

run('Create GitHub release', 'gh', ['release', 'create', version, '--generate-notes'])

console.log(`\nRelease ${version} complete.`)
