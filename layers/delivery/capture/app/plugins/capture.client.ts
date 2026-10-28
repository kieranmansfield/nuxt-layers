// plugins/capture.client.ts

/**
 * Capture mode: cooperates with this layer's `kmcom-capture` CLI.
 *
 * Under browser automation (`navigator.webdriver`) or with `?capture` in the URL it:
 * 1. Marks `<html data-capture>`, so app CSS can hide anything that shouldn't be in a shot
 * 2. Hides the `captureLayer.hide` selectors
 * 3. Sets `<html data-capture-ready="true">` once the app is mounted, the loading screen has
 *    gone and fonts have loaded: the CLI waits for that instead of guessing
 *
 * Configuration via app.config.ts:
 * - Set `captureLayer.enabled: false` to disable
 */
export default defineNuxtPlugin({
  name: 'capture:mode',
  setup(nuxtApp) {
    const { enabled = true, hide = [] } = useAppConfig().captureLayer ?? {}
    const requested = new URLSearchParams(window.location.search).has('capture')
    if (!enabled || !(navigator.webdriver || requested)) return

    const html = document.documentElement
    html.dataset.capture = ''
    if (hide.length) {
      const style = document.createElement('style')
      style.textContent = `${hide.join(',')}{display:none!important}`
      document.head.append(style)
    }

    const { screen } = useLoading()
    // Not awaited: app:mounted handlers run serially, so waiting here would hold up other layers
    nuxtApp.hook('app:mounted', () => {
      const revealed = new Promise<void>((resolve) => {
        const stop = watch(
          screen,
          (state) => {
            if (state !== 'hidden') return
            resolve()
            queueMicrotask(() => stop())
          },
          { immediate: true }
        )
      })
      void Promise.all([revealed, document.fonts?.ready]).then(() => {
        html.dataset.captureReady = 'true'
      })
    })
  },
})
