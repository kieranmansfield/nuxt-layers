import { usePreferredReducedMotion } from '@vueuse/core'

/**
 * True when motion should be reduced. Honours the ThemePicker override when the theming layer
 * is loaded — it keeps it in `useState('theme-motion')`, read here by key so scroll doesn't
 * depend on theming — and falls back to the OS `prefers-reduced-motion` setting.
 */
export function useReducedMotion() {
  const override = useState<'on' | 'off' | 'system'>('theme-motion', () => 'system')
  const system = usePreferredReducedMotion()
  return computed(
    () => override.value === 'on' || (override.value === 'system' && system.value === 'reduce')
  )
}
