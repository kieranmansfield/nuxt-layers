import type { Ref } from 'vue'

type FetchedStats<T> = {
  data: Ref<T | null | undefined>
  status: Ref<string>
}

/**
 * The stats a parent passed in, otherwise fetched ones.
 *
 * ponytail: decided once at setup. Toggling `passed` after mount won't start or stop the fetch.
 */
export function usePassedOrFetchedStats<T>(
  passed: () => T | undefined,
  fetch: () => FetchedStats<T>
) {
  const fetched = passed() ? undefined : fetch()
  return {
    stats: computed(() => passed() ?? fetched?.data.value),
    status: computed(() => fetched?.status.value ?? 'success'),
  }
}
