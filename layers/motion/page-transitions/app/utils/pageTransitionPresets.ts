import type { PageTransitionContext, PageTransitionPreset } from '../types'

/** Leaving page stays on screen, pinned where it was, so the entering page can sit under it. */
function pin(el: HTMLElement, { gsap }: PageTransitionContext) {
  const r = el.getBoundingClientRect()
  gsap.set(el, { position: 'fixed', top: r.top, left: r.left, width: r.width, margin: 0 })
}

/** Grid of overlay cells that scale (or fade) in on leave and back out on enter. */
function cover(o: {
  cols: number
  rows: number
  axis: 'x' | 'y' | 'opacity'
  from?: 'start' | 'center' | 'edges' | 'random'
}): PageTransitionPreset {
  const prop = o.axis === 'x' ? 'scaleX' : o.axis === 'y' ? 'scaleY' : 'opacity'
  const stagger = (ctx: PageTransitionContext) => ({
    amount: ctx.duration * 0.6,
    from: o.from ?? 'start',
    grid: o.cols > 1 && o.rows > 1 ? [o.rows, o.cols] : undefined,
  })
  return {
    duration: 450,
    leave(_el, ctx) {
      const cells = ctx.overlay.fill(o.cols, o.rows)
      ctx.gsap.set(cells, { [prop]: 0, transformOrigin: o.axis === 'x' ? '0% 50%' : '50% 100%' })
      return ctx.gsap.to(cells, {
        [prop]: 1,
        duration: ctx.duration * 0.6,
        ease: 'power3.inOut',
        stagger: stagger(ctx),
      })
    },
    enter(_el, ctx) {
      const cells = ctx.overlay.cells()
      ctx.gsap.set(cells, { transformOrigin: o.axis === 'x' ? '100% 50%' : '50% 0%' })
      return ctx.gsap.to(cells, {
        [prop]: 0,
        duration: ctx.duration * 0.6,
        ease: 'power3.inOut',
        stagger: stagger(ctx),
      })
    },
  }
}

/**
 * Built-in presets, keyed by the name used in app.config, route meta, `[data-transition]` and
 * `setTransition()`. Register your own with `registerPageTransitionPreset()`.
 */
export const pageTransitionPresets: Record<string, PageTransitionPreset> = {
  // Vue CSS-class presets (page-transitions.css)
  fade: { css: true },
  slide: { css: true },
  default: { css: true },

  // GSAP presets
  crossfade: {
    mode: 'default',
    leave(el, ctx) {
      pin(el, ctx)
      return ctx.gsap.to(el, { opacity: 0, duration: ctx.duration, ease: 'power1.inOut' })
    },
    enter: (el, ctx) =>
      ctx.gsap.from(el, { opacity: 0, duration: ctx.duration, ease: 'power1.inOut' }),
  },
  'slide-x': {
    leave: (el, { gsap, duration, direction }) =>
      gsap.to(el, {
        x: direction === 'back' ? 48 : -48,
        opacity: 0,
        duration,
        ease: 'power2.in',
      }),
    enter: (el, { gsap, duration, direction }) =>
      gsap.from(el, {
        x: direction === 'back' ? -48 : 48,
        opacity: 0,
        duration,
        ease: 'power2.out',
      }),
  },
  wipe: cover({ cols: 1, rows: 1, axis: 'x' }),
  shutter: cover({ cols: 1, rows: 5, axis: 'x' }),
  columns: cover({ cols: 6, rows: 1, axis: 'y' }),
  pixelate: { ...cover({ cols: 12, rows: 8, axis: 'opacity', from: 'random' }), duration: 600 },
  curved: {
    duration: 650,
    leave(_el, ctx) {
      const [cell] = ctx.overlay.fill(1, 1)
      return ctx.gsap.fromTo(
        cell!,
        { yPercent: 100, borderRadius: '50% 50% 0 0 / 100% 100% 0 0' },
        { yPercent: 0, borderRadius: '0%', duration: ctx.duration, ease: 'power3.inOut' }
      )
    },
    enter(_el, ctx) {
      const [cell] = ctx.overlay.cells()
      return ctx.gsap.fromTo(
        cell!,
        { yPercent: 0, borderRadius: '0%' },
        {
          yPercent: -100,
          borderRadius: '0 0 50% 50% / 0 0 100% 100%',
          duration: ctx.duration,
          ease: 'power3.inOut',
        }
      )
    },
  },
  // Elements carrying the same data-flip-id on both pages morph between their two positions.
  morph: {
    mode: 'default',
    duration: 700,
    leave(el, ctx) {
      ctx.store.state = ctx.Flip.getState(el.querySelectorAll('[data-flip-id]'))
      pin(el, ctx)
      el.querySelectorAll<HTMLElement>('[data-flip-id]').forEach(
        (n) => (n.style.visibility = 'hidden')
      )
      return ctx.gsap.to(el, { opacity: 0, duration: ctx.duration * 0.5, ease: 'power1.out' })
    },
    enter(el, ctx) {
      const tl = ctx.gsap.timeline()
      tl.from(el, { opacity: 0, duration: ctx.duration * 0.6, ease: 'power1.inOut' }, 0)
      const state = ctx.store.state as ReturnType<typeof ctx.Flip.getState> | undefined
      const targets = el.querySelectorAll('[data-flip-id]')
      if (state && targets.length) {
        tl.add(
          ctx.Flip.from(state, {
            targets,
            duration: ctx.duration,
            ease: 'power3.inOut',
            absolute: true,
            scale: true,
          }),
          0
        )
      }
      return tl
    },
  },
}

export function registerPageTransitionPreset(name: string, preset: PageTransitionPreset) {
  pageTransitionPresets[name] = preset
}
