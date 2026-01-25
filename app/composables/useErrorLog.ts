/**
 * Error logging composable for tracking and reporting errors
 *
 * Features:
 * - Console logging in development
 * - Optional external service integration (Sentry, LogRocket, etc.)
 * - Type-safe error context
 * - Client-side only (no SSR logging to external services)
 * - Configurable via app.config
 *
 * @example
 * ```ts
 * const { logError } = useErrorLog()
 *
 * try {
 *   await riskyOperation()
 * } catch (error) {
 *   logError(error, { context: 'riskyOperation', userId: '123' })
 * }
 * ```
 */

export interface ErrorContext {
  /** Component name where error occurred */
  component?: string
  /** Additional context information */
  info?: string
  /** User ID (if available) */
  userId?: string
  /** Route path where error occurred */
  route?: string
  /** Custom metadata */
  [key: string]: unknown
}

export interface ErrorLogConfig {
  /** Enable console logging in development */
  logToConsole?: boolean
  /** Enable external error service logging */
  logToExternal?: boolean
  /** External error service URL */
  externalUrl?: string
  /** External error service token/key */
  externalToken?: string
}

export function useErrorLog() {
  const appConfig = useAppConfig()
  const route = useRoute()

  // Get error log configuration from app.config
  const config = computed(() => {
    const coreLayer = appConfig.coreLayer as { errors?: ErrorLogConfig } | undefined
    return {
      logToConsole: coreLayer?.errors?.logToConsole ?? true,
      logToExternal: coreLayer?.errors?.logToExternal ?? false,
      externalUrl: coreLayer?.errors?.externalUrl,
      externalToken: coreLayer?.errors?.externalToken,
    }
  })

  /**
   * Log an error with optional context
   */
  const logError = (error: unknown, context?: ErrorContext) => {
    // Normalize error to Error object
    const errorObj = error instanceof Error ? error : new Error(String(error))

    // Build full context
    const fullContext: ErrorContext = {
      route: route.path,
      timestamp: new Date().toISOString(),
      userAgent: import.meta.client ? navigator.userAgent : 'SSR',
      ...context,
    }

    // Console logging (development only by default)
    if (config.value.logToConsole && import.meta.dev) {
      // eslint-disable-next-line no-console
      console.group('🔴 Error Logged')
      // eslint-disable-next-line no-console
      console.error('Error:', errorObj)
      // eslint-disable-next-line no-console
      console.log('Context:', fullContext)
      // eslint-disable-next-line no-console
      console.groupEnd()
    }

    // External logging (client-side only, production)
    if (config.value.logToExternal && import.meta.client) {
      sendToExternalService(errorObj, fullContext)
    }
  }

  /**
   * Send error to external error tracking service
   */
  const sendToExternalService = async (error: Error, context: ErrorContext) => {
    const { externalUrl, externalToken } = config.value

    if (!externalUrl) {
      // eslint-disable-next-line no-console
      console.warn('Error logging enabled but no externalUrl configured')
      return
    }

    try {
      await $fetch(externalUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(externalToken ? { Authorization: `Bearer ${externalToken}` } : {}),
        },
        body: {
          error: {
            name: error.name,
            message: error.message,
            stack: error.stack,
          },
          context,
        },
      })
    } catch (loggingError) {
      // Don't let logging errors crash the app
      if (import.meta.dev) {
        // eslint-disable-next-line no-console
        console.error('Failed to send error to external service:', loggingError)
      }
    }
  }

  /**
   * Log a warning (non-critical error)
   */
  const logWarning = (message: string, context?: ErrorContext) => {
    if (config.value.logToConsole && import.meta.dev) {
      // eslint-disable-next-line no-console
      console.warn('⚠️  Warning:', message, context)
    }
  }

  /**
   * Log info (for debugging)
   */
  const logInfo = (message: string, data?: unknown) => {
    if (config.value.logToConsole && import.meta.dev) {
      // eslint-disable-next-line no-console
      console.log('ℹ️  Info:', message, data)
    }
  }

  return {
    logError,
    logWarning,
    logInfo,
    config: readonly(config),
  }
}
