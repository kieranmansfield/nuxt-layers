import { afterEach, beforeEach, describe, expect, it, vi } from 'vite-plus/test'

import { runTween, tweenUniform } from './tween'

// Manual rAF: each step() fires the queued frame callbacks at the given timestamp (ms)
const queue: FrameRequestCallback[] = []
function step(now: number) {
  const frames = queue.splice(0)
  for (const cb of frames) cb(now)
}

beforeEach(() => {
  queue.length = 0
  vi.stubGlobal('requestAnimationFrame', (cb: FrameRequestCallback) => queue.push(cb))
})
afterEach(() => vi.unstubAllGlobals())

describe('runTween', () => {
  it('eases 0→1 over the duration, then completes once', async () => {
    const frames: number[] = []
    const onComplete = vi.fn()
    const handle = runTween(
      1,
      (t) => t,
      (t) => frames.push(t),
      onComplete
    )

    step(1000) // start
    step(1500)
    expect(onComplete).not.toHaveBeenCalled()
    step(2500) // past the end clamps to 1
    expect(frames).toEqual([0, 0.5, 1])
    expect(onComplete).toHaveBeenCalledTimes(1)
    expect(queue).toHaveLength(0)
    await handle.promise
  })

  it('stops on cancel without completing, and resolves the promise', async () => {
    const onFrame = vi.fn()
    const onComplete = vi.fn()
    const handle = runTween(1, undefined, onFrame, onComplete)

    step(0)
    handle.cancel()
    step(2000)
    expect(onFrame).toHaveBeenCalledTimes(1)
    expect(onComplete).not.toHaveBeenCalled()
    await handle.promise
  })

  it('defaults to smoothstep easing', () => {
    const frames: number[] = []
    runTween(1, undefined, (t) => frames.push(t))
    step(0)
    step(250)
    expect(frames[1]).toBeCloseTo(0.15625) // smoothstep(0.25)
  })
})

describe('tweenUniform', () => {
  it('writes the interpolated value to the uniform', () => {
    const node = { value: 0 }
    tweenUniform(node, 10, 20, 1, (t) => t)
    step(0)
    step(500)
    expect(node.value).toBe(15)
  })
})
