// Unit tests run without Nitro, so `nitropack/runtime` can't load its virtual modules.
// Existing tests mock these helpers with vi.stubGlobal (the auto-import era), so forward
// each call to the global at call time instead of binding at import time.
const forward =
  (name: string) =>
  (...args: unknown[]) =>
    (globalThis as unknown as Record<string, (...a: unknown[]) => unknown>)[name]?.(...args)

export const useStorage = forward('useStorage')
export const useRuntimeConfig = forward('useRuntimeConfig')
export const useAppConfig = forward('useAppConfig')
export const useNitroApp = forward('useNitroApp')
export const defineNitroPlugin = forward('defineNitroPlugin')
