// eslint-disable-next-line no-restricted-imports -- the fallback below is the one place it belongs
import { useAppConfig as useNitroAppConfig } from 'nitropack/runtime'

/**
 * The app's merged app.config, read on the server.
 *
 * Nuxt hands Nitro its merged `useAppConfig` as an auto-import, so this leaves `useAppConfig`
 * unimported on purpose. With `experimental.nitroAutoImports: false` (Nuxt 5's default) nothing
 * is injected and Nuxt can't evaluate app.config.ts in Nitro at all - importing `nuxt/server`
 * there crashes the server - so fall back to Nitro's own app config, which is empty.
 */
export function readServerAppConfig(): Record<string, unknown> {
  // `typeof` doesn't throw for an identifier that was never injected
  return typeof useAppConfig === 'function'
    ? (useAppConfig() as Record<string, unknown>)
    : (useNitroAppConfig() as Record<string, unknown>)
}
