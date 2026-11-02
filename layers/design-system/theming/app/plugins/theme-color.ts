type ThemeColorConfig = { enabled: boolean; cssVar: string; light: string; dark: string }

// Keeps <meta name="theme-color"> on the page background. Opt-in: since Safari 26 the tag only
// tints installed web apps (Safari now samples the page itself), so it matters for PWAs and Chrome
// on Android. Two tags, one per colour scheme: Safari reads a tag without `media` as light-only.
// The server can't read CSS, so it ships the configured colour per scheme (right for a 'system'
// preference before JS); the client then gives both tags the live value, so an explicit
// light/dark choice wins over the OS one.
export default defineNuxtPlugin({
  name: 'theme:theme-color',
  setup(nuxtApp) {
    const config = useAppConfig().themeLayer?.themeColor as ThemeColorConfig | undefined
    if (!config?.enabled) return
    const { cssVar, light, dark } = config

    const override = useThemeColorOverride()
    // Core's boot screen covers the page from first paint; match it until its exit uncovers the
    // page (top-first, so the page colour is right from the exit's start)
    const { screen } = useLoading()
    const loadingBg = resolveLoadingConfig(useAppConfig().coreLayer).background
    // Client-only: null through SSR and hydration, so both render the per-scheme fallbacks
    const bg = ref<string | null>(null)
    const live = () => override.value ?? (screen.value === 'visible' ? loadingBg : bg.value)

    // No `key`: unhead already allows several theme-color metas, and a key stops the client
    // adopting the server-rendered pair, leaving them behind as stale duplicates
    useHead({
      meta: [
        {
          name: 'theme-color',
          media: '(prefers-color-scheme: light)',
          content: computed(() => live() ?? light),
        },
        {
          name: 'theme-color',
          media: '(prefers-color-scheme: dark)',
          content: computed(() => live() ?? dark),
        },
      ],
    })

    // Mounted, so the stylesheets are in even in dev
    nuxtApp.hook('app:mounted', () => {
      const root = document.documentElement
      // Normalises any CSS colour (Tailwind v4 tokens are oklch()) to rgb()
      const ctx = document.createElement('canvas').getContext('2d', { willReadFrequently: true })
      if (!ctx) return
      let raw = ''

      // Reads the variable, not the computed background-color, which can be mid-transition
      const sync = () => {
        const next = getComputedStyle(root).getPropertyValue(cssVar).trim()
        if (!next || next === raw) return
        raw = next
        ctx.clearRect(0, 0, 1, 1)
        // An unparseable value leaves this transparent, so it's skipped below
        ctx.fillStyle = 'transparent'
        ctx.fillStyle = next
        ctx.fillRect(0, 0, 1, 1)
        const [r, g, b, a] = ctx.getImageData(0, 0, 1, 1).data
        if (a) bg.value = `rgb(${r}, ${g}, ${b})`
      }

      sync()
      // Colour mode (and an OS switch under 'system') lands as a class on <html>; any attribute
      // counts, so the data-theme-* preferences and app-level themes are picked up too
      new MutationObserver(sync).observe(root, { attributes: true })
    })
  },
})
