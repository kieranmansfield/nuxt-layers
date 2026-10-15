<script setup lang="ts">
  /**
   * ErrorBoundary component - Catches errors in child components
   *
   * Wraps NuxtErrorBoundary with consistent styling and error logging.
   * Prevents errors in one component from crashing the entire page.
   *
   * @example
   * ```vue
   * <ErrorBoundary>
   *   <RiskyComponent />
   * </ErrorBoundary>
   * ```
   *
   * @example With custom error UI
   * ```vue
   * <ErrorBoundary>
   *   <RiskyComponent />
   *
   *   <template #error="{ error, clearError }">
   *     <div>Custom error: {{ error.message }}</div>
   *     <button @click="clearError">Retry</button>
   *   </template>
   * </ErrorBoundary>
   * ```
   */

  interface Props {
    /** Show error details in development mode */
    showDetails?: boolean
    /** Custom error message */
    message?: string
    /** Component name for logging context */
    componentName?: string
  }

  const {
    showDetails = true,
    message = 'Something went wrong in this section.',
    componentName = 'Unknown',
  } = defineProps<Props>()

  const { logError } = useErrorLog()

  // Handle error
  const handleError = (error: unknown) => {
    // Log error with context
    logError(error, {
      component: componentName,
      info: 'Error caught by ErrorBoundary',
    })
  }
</script>

<template>
  <NuxtErrorBoundary @error="handleError">
    <!-- Default slot: content to protect -->
    <slot />

    <!-- Error slot: custom error UI or default -->
    <template #error="{ error, clearError }">
      <slot name="error" :error :clear-error>
        <!-- Default error UI -->
        <div class="border-error bg-error/10 rounded-lg border p-4">
          <div class="flex items-start gap-3">
            <!-- Error icon -->
            <span
              class="iconify i-lucide:alert-circle text-error mt-0.5 shrink-0"
              aria-hidden="true"
            />

            <!-- Error content -->
            <div class="flex-1 space-y-2">
              <!-- Error message -->
              <p class="text-error text-sm font-medium">
                {{ message }}
              </p>

              <!-- Error details (dev only) -->
              <details v-if="showDetails && import.meta.dev" class="text-xs">
                <summary class="text-muted cursor-pointer">Show error details</summary>
                <pre class="bg-elevated mt-2 overflow-x-auto rounded p-2">{{ error }}</pre>
              </details>

              <!-- Retry button -->
              <div>
                <UButton
                  label="Try Again"
                  icon="i-lucide-refresh-cw"
                  size="xs"
                  color="error"
                  variant="soft"
                  @click="clearError"
                />
              </div>
            </div>
          </div>
        </div>
      </slot>
    </template>
  </NuxtErrorBoundary>
</template>
