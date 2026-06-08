type LoadStrategy = 'onNuxtReady' | 'idle' | 'manual'

type ScriptLoaderOptions = {
  src: string
  key?: string
  strategy?: LoadStrategy
  crossorigin?: 'anonymous' | 'use-credentials'
  integrity?: string
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
      trigger: strategy,
    }
  )

  return {
    load: () => script.load(),
    status: script.status,
    proxy: script.proxy,
  }
}
