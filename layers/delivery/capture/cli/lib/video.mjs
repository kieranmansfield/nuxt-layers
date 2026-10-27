// Smooth-scroll walkthrough videos, optionally framed by Monkr.
//
// Why not Playwright's recordVideo: it is 1x, 25fps, realtime-VP8 at ~1Mbps. Instead we pull JPEG
// frames straight from Chrome's screencast (CDP), resample them to a constant frame rate, and
// encode at a high bitrate. Capture starts only after the page has settled, so the loading phase
// is never in the clip. Framing composites each captured frame into the device/browser frame
// before encoding.
import { spawn } from 'node:child_process'
import { once } from 'node:events'
import { mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { encoderArgs } from './ffmpeg.mjs'
import { openPage, scrollPos } from './page.mjs'
import { eachCapture, frameFor } from './shots.mjs'

const TICK_MS = 16
const END_HOLD_MS = 1500
const MIN_FILM_MS = 5000 // short pages barely scroll: hold so the clip is still watchable

/** Record one scroll-through. Returns { dir, frames: [{ t, file }], t0, tEnd }. */
async function record(ctx, page, device, scale, opts) {
  const dir = await mkdtemp(join(tmpdir(), 'capture-frames-'))
  const frames = []
  const cdp = await ctx.newCDPSession(page)
  cdp.on('Page.screencastFrame', async ({ data, metadata, sessionId }) => {
    const file = join(dir, `${frames.length}.jpg`)
    frames.push({ t: metadata.timestamp, file })
    await writeFile(file, Buffer.from(data, 'base64'))
    await cdp.send('Page.screencastFrameAck', { sessionId }).catch(() => {}) // ack after write = backpressure
  })
  // The screencast only emits when pixels change, so seed the timeline with a real first frame.
  const t0 = Date.now() / 1000
  const first = join(dir, 'first.jpg')
  await writeFile(first, await page.screenshot({ type: 'jpeg', quality: 95 }))
  frames.push({ t: t0, file: first })
  await cdp.send('Page.startScreencast', {
    format: 'jpeg',
    quality: 95,
    maxWidth: device.viewport.width * scale,
    maxHeight: device.viewport.height * scale,
    everyNthFrame: 1,
  })

  // Real wheel input so the site's smooth-scroll lib handles easing, like a user.
  await page.mouse.move(device.viewport.width / 2, device.viewport.height / 2)
  const [, max0] = await scrollPos(page)
  const speed = Math.min(opts.maxSpeed, Math.max(opts.minSpeed, max0 / opts.targetScrollSec))
  let lastY = -1
  let last = Date.now()
  for (;;) {
    await page.waitForTimeout(TICK_MS)
    const now = Date.now()
    await page.mouse.wheel(0, (speed * (now - last)) / 1000)
    last = now
    const [y, max] = await scrollPos(page)
    if (y >= max - 1 && y === lastY) break
    lastY = y
  }
  await page.waitForTimeout(Math.max(END_HOLD_MS, MIN_FILM_MS - (Date.now() / 1000 - t0) * 1000))
  const tEnd = Date.now() / 1000
  await cdp.send('Page.stopScreencast')
  await page.waitForTimeout(400) // let in-flight frame writes land
  return { dir, frames, t0, tEnd }
}

/** Resample to constant fps (hold the latest frame at each tick) and pipe to ffmpeg. */
async function encode(ffmpeg, { frames, t0, tEnd }, out, args, fps) {
  const enc = spawn(
    ffmpeg.bin,
    [
      '-v',
      'error',
      '-y',
      '-f',
      'image2pipe',
      '-framerate',
      String(fps),
      '-c:v',
      'mjpeg',
      '-i',
      'pipe:0',
      ...args,
      out,
    ],
    { stdio: ['pipe', 'inherit', 'inherit'] }
  )
  const done = once(enc, 'close')
  let i = 0
  let buf = await readFile(frames[0].file)
  const total = Math.floor((tEnd - t0) * fps)
  for (let k = 0; k < total; k++) {
    const t = t0 + k / fps
    let moved = false
    while (i + 1 < frames.length && frames[i + 1].t <= t) {
      i++
      moved = true
    }
    if (moved) buf = await readFile(frames[i].file)
    if (!enc.stdin.write(buf)) await once(enc.stdin, 'drain')
  }
  enc.stdin.end()
  const [code] = await done
  if (code !== 0) throw new Error(`ffmpeg exited ${code} for ${out}`)
  return total
}

/** Film each video page x device x theme for a site. `monkr` is null when framing is off. */
export async function captureVideos(
  browser,
  monkr,
  ffmpeg,
  site,
  routes,
  { log = console.log } = {}
) {
  const { video } = site
  const out = join(site.outDir, site.name, 'video')
  await mkdir(out, { recursive: true })
  return eachCapture(site, routes, log, async ({ url, device, theme, name }) => {
    const { ctx, page } = await openPage(browser, url, {
      device,
      theme,
      scale: video.scale,
      settleMs: site.settleMs,
    })
    const take = await record(ctx, page, device, video.scale, video)
    await ctx.close()

    const frame = video.frame && monkr ? frameFor(device, theme) : null
    if (frame) {
      const background =
        typeof video.background === 'object' ? video.background[theme] : video.background
      const c = await monkr.compositor({
        ...frame,
        width: device.viewport.width * video.scale,
        height: device.viewport.height * video.scale,
        url,
        style: { ...site.frame, background: background ?? '#000' },
      })
      // only frames that were actually captured; the resampler reuses them
      for (const f of take.frames)
        await writeFile(f.file, await c.composite(await readFile(f.file)))
    }

    const { ext, args } = encoderArgs(ffmpeg, video.format, device.bitrate ?? '8M', video.fps)
    const file = join(out, `${name}.${ext}`)
    const total = await encode(ffmpeg, take, file, args, video.fps)
    await rm(take.dir, { recursive: true })
    const rate = (take.frames.length / (take.tEnd - take.t0)).toFixed(0)
    log(
      `  ✓ video/${name}.${ext}: ${total} frames @${video.fps}fps from ${take.frames.length} captured (${rate}/s)`
    )
  })
}
