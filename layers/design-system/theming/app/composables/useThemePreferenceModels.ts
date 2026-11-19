import { computed } from 'vue'

export function useThemePreferenceModels() {
  const {
    contrastOverride,
    motionOverride,
    transparencyOverride,
    setContrastOverride,
    setMotionOverride,
    setTransparencyOverride,
    effectiveHighContrast,
    effectiveReducedMotion,
    effectiveReducedTransparency,
  } = useTheme()

  const contrastModel = computed({
    get: () => effectiveHighContrast.value,
    set: (value: boolean) => setContrastOverride(value ? 'on' : 'system'),
  })

  const motionModel = computed({
    get: () => effectiveReducedMotion.value,
    set: (value: boolean) => setMotionOverride(value ? 'on' : 'system'),
  })

  const transparencyModel = computed({
    get: () => effectiveReducedTransparency.value,
    set: (value: boolean) => setTransparencyOverride(value ? 'on' : 'system'),
  })

  return {
    contrastOverride,
    motionOverride,
    transparencyOverride,
    contrastModel,
    motionModel,
    transparencyModel,
  }
}
