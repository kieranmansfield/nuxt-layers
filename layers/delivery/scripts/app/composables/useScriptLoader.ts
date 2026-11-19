type LoadStrategy = 'onNuxtReady' | 'idle' | 'manual'

type ScriptLoaderOptions = {
  src: string
  key?: string
  strategy?: LoadStrategy
  crossorigin?: 'anonymous' | 'use-credentials'
  integrity?: string
}

function idleTrigger(): Promise<void> {
  return new Promise((resolve) => {
    if (!import.meta.client) return
    if ('requestIdleCallback' in window) {
      requestIdleCallback(() => resolve())
      return
    }
    setTimeout(resolve, 1)
  })
}

export function useScriptLoader(options: ScriptLoaderOptions) {
  const { src, key, strategy = 'onNuxtReady', crossorigin, integrity } = options

  const script = useScript(
    {
      src,
      key: key ?? src,
      crossorigin,
      integrity,
    },
    {
      trigger: strategy === 'idle' ? idleTrigger() : strategy,
    }
  )

  return {
    load: () => script.load(),
    status: script.status,
    proxy: script.proxy,
  }
}
