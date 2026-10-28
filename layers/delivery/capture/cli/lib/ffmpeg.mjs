// Find an ffmpeg and pick an encoder it actually has.
import { spawnSync } from 'node:child_process'
import { existsSync, readdirSync } from 'node:fs'
import { homedir, platform } from 'node:os'
import { join } from 'node:path'

const BUNDLED = { darwin: 'ffmpeg-mac', linux: 'ffmpeg-linux', win32: 'ffmpeg-win64.exe' }

// Playwright ships a minimal ffmpeg (VP8 only) next to its browsers.
function playwrightFfmpeg() {
  const roots = [
    process.env.PLAYWRIGHT_BROWSERS_PATH,
    join(homedir(), 'Library', 'Caches', 'ms-playwright'),
    join(homedir(), '.cache', 'ms-playwright'),
    process.env.LOCALAPPDATA && join(process.env.LOCALAPPDATA, 'ms-playwright'),
  ].filter(Boolean)
  for (const root of roots) {
    if (!existsSync(root)) continue
    for (const d of readdirSync(root).filter((d) => d.startsWith('ffmpeg-'))) {
      const bin = join(root, d, BUNDLED[platform()] ?? 'ffmpeg')
      if (existsSync(bin)) return bin
    }
  }
  return null
}

const works = (bin) => spawnSync(bin, ['-version'], { stdio: 'ignore' }).status === 0

/** { bin, encoders } for FFMPEG, then ffmpeg on PATH, then Playwright's bundled one. */
export function findFfmpeg() {
  for (const bin of [process.env.FFMPEG, 'ffmpeg', playwrightFfmpeg()].filter(Boolean)) {
    if (!works(bin)) continue
    const list = spawnSync(bin, ['-hide_banner', '-encoders'], { encoding: 'utf8' }).stdout ?? ''
    return { bin, encoders: new Set([...list.matchAll(/^\s*V\S*\s+(\S+)/gm)].map((m) => m[1])) }
  }
  throw new Error(
    'No ffmpeg found: install one (brew install ffmpeg) or set FFMPEG=/path/to/ffmpeg'
  )
}

/** ffmpeg output args for format ('webm' | 'mp4') at bitrate, falling back to VP8 webm. */
export function encoderArgs({ encoders }, format, bitrate, fps) {
  if (format === 'mp4' && encoders.has('libx264')) {
    return {
      ext: 'mp4',
      args: [
        '-c:v',
        'libx264',
        '-preset',
        'slow',
        '-crf',
        '14',
        '-pix_fmt',
        'yuv420p',
        '-movflags',
        '+faststart',
      ],
    }
  }
  if (format === 'mp4') console.warn('  ! this ffmpeg has no libx264; writing webm instead')
  return {
    ext: 'webm',
    args: [
      '-c:v',
      'libvpx',
      '-b:v',
      bitrate,
      '-crf',
      '4',
      '-deadline',
      'good',
      '-cpu-used',
      '4',
      '-threads',
      '8',
      '-g',
      String(fps * 2),
      '-auto-alt-ref',
      '0',
      '-pix_fmt',
      'yuv420p',
    ],
  }
}
