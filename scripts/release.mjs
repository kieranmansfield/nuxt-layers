#!/usr/bin/env node
import { readFileSync } from 'node:fs'

import { createRunner, sh } from './lib/run.mjs'

const level = process.argv[2]
if (!['patch', 'minor', 'major'].includes(level)) {
  console.error('Usage: node scripts/release.mjs <patch|minor|major>')
  process.exit(1)
}

const run = createRunner('Release aborted — nothing pushed.')

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
