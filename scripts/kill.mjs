#!/usr/bin/env node
import { spawnSync } from 'node:child_process'

spawnSync('pkill', ['-f', 'nuxt|vite|node.*dev'], { stdio: 'inherit' })
