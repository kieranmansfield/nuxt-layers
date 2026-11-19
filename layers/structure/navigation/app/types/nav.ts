export type MastNavLink = {
  id: string
  label: string
  to:
    | string
    | {
        name: string
        params?: Record<string, string | number>
        query?: Record<string, string | number>
      }
  /** Skip the link without passing a custom `links` prop. */
  hidden?: boolean
}

/**
 * UButton props for the MastNav trigger. Plain strings: Nuxt UI's ButtonProps is derived from the
 * resolved app config, so using it inside app.config.ts would be a type cycle.
 */
export type MastNavTrigger = {
  label?: string
  icon?: string
  trailingIcon?: string
  color?: string
  variant?: string
  size?: string
  square?: boolean
  class?: string
}

/** Class strings for MastNavModal's parts. Merged per key over app.config; strings replace. */
export type MastNavUi = {
  content: string
  close: string
  nav: string
  link: string
  linkActive: string
}

export type SiteLogoSize = 'sm' | 'md' | 'lg' | 'display'

export type SiteLogoConfig = {
  stacked: boolean
  ui: { root: string; word: string }
  sizes: Record<SiteLogoSize, string>
}
