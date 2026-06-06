import type { FeatureValue } from '../types/routing'

export function useFeatureFlags() {
  const { config } = useRoutingConfig()
  const runtimeFlags = useState<Record<string, FeatureValue>>('routing:flags', () => ({}))

  function resolve(name: string): FeatureValue {
    return runtimeFlags.value[name] ?? config.features[name] ?? 'disabled'
  }

  return { resolve, runtimeFlags }
}
