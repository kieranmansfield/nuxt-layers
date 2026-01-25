// composables/useEnv.ts

/**
 * Type-safe environment variable access
 *
 * Provides typed access to Nuxt runtime config with proper
 * separation between public (client-accessible) and private
 * (server-only) values.
 *
 * @returns Runtime configuration object
 *
 * @example
 * ```typescript
 * const env = useEnv()
 * const apiUrl = env.public.apiUrl // Client-accessible
 * const secretKey = env.secretKey // Server-only
 * ```
 */
export function useEnv() {
  const config = useRuntimeConfig()

  return config
}
