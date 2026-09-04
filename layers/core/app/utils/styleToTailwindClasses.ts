import type { CSSProperties } from 'vue'

/**
 * Converts a merged CSSProperties object into Tailwind v4 arbitrary-property
 * classes (`[property:value]`), one per declaration. Lets ElementTw reuse the
 * same style composables as Element instead of a second class-generation path.
 */
export function styleToTailwindClasses(style: Partial<CSSProperties>): string[] {
  return Object.entries(style)
    .filter(([, value]) => value !== undefined && value !== null && value !== '')
    .map(([property, value]) => {
      const kebabProperty = property.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`)
      const escapedValue = String(value).replace(/\s+/g, '_')
      return `[${kebabProperty}:${escapedValue}]`
    })
}
