import type {
  PageTransitionChoice,
  PageTransitionContext,
  PageTransitionDirection,
  PageTransitionPreset,
} from '../types'

export default defineNuxtPlugin({
  name: 'page-transitions:page-transitions',
  setup(nuxtApp) {
    const config = useAppConfig().pageTransitions
    const reduced = useReducedMotion()
    const { gsap, Flip } = useGsap()
    const current = useState('page-transition:current')
    const next = useState<PageTransitionChoice | null>('page-transition:next')
    const root = document.documentElement

    let direction: PageTransitionDirection = 'forward'
    useRouter().options.history.listen(
      (_to: unknown, _from: unknown, info: { direction: string }) => {
        direction = info.direction === 'back' ? 'back' : 'forward'
      }
    )

    // Barba-style triggers: <a data-transition="wipe" data-transition-duration="800">
    let link: PageTransitionChoice | null = null
    document.addEventListener(
      'click',
      (e) => {
        const el = (e.target as Element).closest<HTMLElement>('[data-transition]')
        const name = el?.dataset.transition
        const ms = el?.dataset.transitionDuration
        link = name ? { name, duration: ms ? Number(ms) : undefined } : null
        if (link) setTimeout(() => (link = null), 1000)
      },
      true
    )

    // Vue/Suspense run the LEAVE hooks captured when the old page was mounted, so every page
    // gets the same delegating hooks and the per-navigation choice lives in `plan`.
    type Plan = {
      preset: PageTransitionPreset
      name: string
      ms: number
      ctx: PageTransitionContext
    }
    let plan: Plan | null = null

    function build(choice: PageTransitionChoice, dir: PageTransitionDirection) {
      const preset = pageTransitionPresets[choice.name]
      if (!preset) {
        if (import.meta.dev) console.warn(`[page-transitions] unknown preset "${choice.name}"`)
        return false
      }
      const ms = choice.duration ?? preset.duration ?? config?.duration ?? 300
      current.value = { name: choice.name, duration: ms }
      root.style.setProperty('--page-transition-duration', `${ms}ms`)
      plan = {
        preset,
        name: choice.name,
        ms,
        ctx: {
          gsap,
          Flip,
          duration: ms / 1000,
          direction: dir,
          overlay: getPageOverlay(),
          store: {},
        },
      }
      return props(preset.mode ?? 'out-in')
    }

    // preset.css: play Vue's `<name>-{leave,enter}-{from,active,to}` classes by hand.
    function playClasses(el: Element, p: Plan, phase: 'leave' | 'enter') {
      const c = (s: string) => `${p.name}-${phase}-${s}`
      el.classList.add(c('from'), c('active'))
      return new Promise<void>((resolve) => {
        requestAnimationFrame(() =>
          requestAnimationFrame(() => {
            el.classList.replace(c('from'), c('to'))
            setTimeout(() => {
              el.classList.remove(c('to'), c('active'))
              resolve()
            }, p.ms)
          })
        )
      })
    }

    // Never let a stuck animation block the navigation.
    function run(phase: 'leave' | 'enter', el: Element, done: () => void) {
      const p = plan
      if (!p) return done()
      const timer = setTimeout(done, p.ms * 3 + 1000)
      const finish = () => (clearTimeout(timer), done())
      try {
        if (p.preset.css) return void playClasses(el, p, phase).then(finish)
        const anim = p.preset[phase]?.(el as HTMLElement, p.ctx)
        if (anim) return void anim.then(finish)
        finish()
      } catch (err) {
        console.error('[page-transitions]', err)
        finish()
      }
    }

    function cleanup() {
      root.classList.remove('is-page-transitioning')
      delete root.dataset.pageTransition
      clearPageOverlay()
    }

    function props(mode: 'out-in' | 'in-out' | 'default') {
      return {
        css: false,
        mode,
        onBeforeLeave: () => {
          if (!plan) return
          root.classList.add('is-page-transitioning')
          root.dataset.pageTransition = plan.name
        },
        onLeave: (el: Element, done: () => void) => run('leave', el, done),
        onEnter: (el: Element, done: () => void) => run('enter', el, done),
        onAfterEnter: (el: Element) => {
          gsap.set(el, { clearProps: 'all' })
          cleanup()
        },
        onLeaveCancelled: cleanup,
        onEnterCancelled: cleanup,
      }
    }

    addRouteMiddleware(
      'page-transition',
      (to, from) => {
        const dir = direction
        direction = 'forward'
        // A page's own definePageMeta({ pageTransition }) wins.
        if (to.meta.pageTransition !== undefined) return
        plan = null
        const override = next.value
        next.value = null
        if (reduced.value) {
          to.meta.pageTransition = false
          return
        }
        const choice = resolvePageTransition({
          override,
          link,
          meta: to.meta.pageTransitionPreset,
          rules: config?.rules,
          from: from.path,
          to: to.path,
          fallback: { name: config?.default ?? 'fade' },
        })
        link = null
        to.meta.pageTransition = choice.name === 'none' ? false : build(choice, dir)
      },
      { global: true }
    )

    nuxtApp.hook('app:mounted', () =>
      root.style.setProperty('--page-transition-duration', `${config?.duration ?? 300}ms`)
    )
  },
})
