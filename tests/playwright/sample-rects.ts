import type { Page } from '@playwright/test'

/**
 * Records `prop` of every element matching `selector` on each animation frame, in-page, from
 * now until the values have changed and then held still for 10 frames (or 10s pass). Start it
 * before triggering an animation: polling over CDP round-trips under parallel load can miss a
 * sub-second tween, and the trigger itself can land late (a click waits for smooth scroll to
 * settle). Counts frames, not ms, because a loaded dev page can stall a frame for over a second.
 * Survives client-side navigation.
 */
export function sampleRects(
  page: Page,
  selector: string,
  prop: 'width' | 'left'
): Promise<Set<number>> {
  return page
    .evaluate(
      ([s, p]) =>
        new Promise<number[]>((resolve) => {
          const read = () =>
            [...document.querySelectorAll(s)]
              .map((el) => Math.round(el.getBoundingClientRect()[p]))
              .join()
          const seen = new Set<string>()
          const deadline = performance.now() + 10_000
          let last = read()
          let still = 0
          const tick = () => {
            const now = read()
            seen.add(now)
            still = now === last ? still + 1 : 0
            last = now
            if (seen.size > 1 && still >= 10) return finish()
            if (performance.now() > deadline) return finish()
            requestAnimationFrame(tick)
          }
          const finish = () =>
            resolve([...seen].flatMap((v) => v.split(',').filter(Boolean).map(Number)))
          tick()
        }),
      [selector, prop] as const
    )
    .then((values) => new Set(values))
}
