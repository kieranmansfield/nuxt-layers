#!/usr/bin/env node
import { listLayers, isWellFormedLayer } from './lib/layers.mjs'

console.log('Available Layers')
let bad = 0
for (const name of listLayers()) {
  const ok = isWellFormedLayer(name)
  if (!ok) bad++
  console.log(`${ok ? '✓' : '✗'} ${name}`)
}

if (bad > 0) {
  console.log(`\n${bad} layer(s) missing nuxt.config.ts or package.json.`)
  process.exit(1)
}
