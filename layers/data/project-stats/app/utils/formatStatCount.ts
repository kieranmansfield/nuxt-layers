const compact = new Intl.NumberFormat('en', { notation: 'compact', maximumFractionDigits: 1 })
const exact = new Intl.NumberFormat('en')

/** `12345` → `12.3K`; fixed `en` locale so server and client render the same string. */
export function formatStatCount(value: number): string {
  return compact.format(value)
}

/** `12345` → `12,345`, for a title/tooltip next to the compact figure. */
export function formatStatCountExact(value: number): string {
  return exact.format(value)
}
