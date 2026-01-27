<script setup lang="ts">
interface LoadingConfig {
  enabled?: boolean
  minDuration?: number
  maxDuration?: number
  background?: string
  textColor?: string
  zIndex?: number
}

const { isLoading, progress } = useLoading()
const config = useAppConfig()

// Debug logs
// console.log('[LoadingScreen] Component created!')
// console.log('[LoadingScreen] Initial - isLoading:', isLoading.value, 'progress:', progress.value)

// Type-safe access to loading config
const loadingConfig = computed(() => {
  const coreLayer = config.coreLayer as { loading?: LoadingConfig }
  return coreLayer?.loading || {}
})

const minDuration = computed(() => loadingConfig.value?.minDuration || 500)
const background = computed(() => loadingConfig.value?.background || '#0a0a0a')
const textColor = computed(() => loadingConfig.value?.textColor || '#ffffff')
const zIndex = computed(() => loadingConfig.value?.zIndex || 10000)

// Rounded progress for display
const displayProgress = computed(() => Math.round(progress.value))

// Control visibility
const visible = ref(true)
const hasFinished = ref(false)

// Watch for loading completion
watch(
  [isLoading, progress],
  ([loading, prog]) => {
    console.log(
      '[LoadingScreen] Watch fired - isLoading:',
      loading,
      'progress:',
      prog,
      'visible:',
      visible.value
    )

    if (!loading && prog >= 100 && !hasFinished.value) {
      hasFinished.value = true
      console.log('[LoadingScreen] Loading finished! Will hide after', minDuration.value, 'ms')

      setTimeout(() => {
        console.log('[LoadingScreen] Hiding now')
        visible.value = false
      }, minDuration.value)
    }
  },
  { immediate: true }
)
</script>

<template>
  <Transition name="fade">
    <div
      v-if="visible"
      id="loading-screen"
      :style="{
        backgroundColor: background,
        zIndex: zIndex,
      }"
    >
      <div class="loading-container">
        <div class="loading-progress" :style="{ color: textColor }">
          {{ displayProgress }}
        </div>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 2s cubic-bezier(0.4, 0, 0.2, 1);
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

#loading-screen {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.loading-container {
  display: grid;
  width: 100%;
  height: 100vh;
  container-type: size;
}

.loading-progress {
  place-self: center;
  text-align: center;
  font-family:
    system-ui,
    -apple-system,
    BlinkMacSystemFont,
    'Segoe UI',
    Roboto,
    'Helvetica Neue',
    Arial,
    sans-serif;
  font-size: clamp(3rem, 35cqw + 1rem, 18rem);
  font-weight: 900;
  font-stretch: ultra-expanded;
  text-shadow: 0 0 20px rgba(0, 0, 0, 0.3);
}

@media (min-width: 768px) {
  .loading-progress {
    place-self: end start;
    padding: 2rem;
  }
}
</style>
