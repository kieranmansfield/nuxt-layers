import { spawnSync } from 'node:child_process'

import { ROOT } from './layers.mjs'

/**
 * Returns `run(label, cmd, args)`: runs a step from ROOT with inherited stdio and exits the
 * process (appending `abortNote` to the error) if it fails. `echo` also prints the command.
 */
export function createRunner(abortNote, { echo = false } = {}) {
  return function run(label, cmd, args) {
    console.log(`\n▶ ${label}`)
    if (echo) console.log(`  ${cmd} ${args.join(' ')}`)
    const result = spawnSync(cmd, args, { cwd: ROOT, stdio: 'inherit' })
    if (result.status !== 0) {
      console.error(`\n✗ ${label} failed. ${abortNote}`)
      process.exit(result.status ?? 1)
    }
    console.log(`✓ ${label}`)
  }
}

/** Runs a command from ROOT and captures its output as utf8. */
export function sh(cmd, args) {
  return spawnSync(cmd, args, { cwd: ROOT, encoding: 'utf8' })
}
