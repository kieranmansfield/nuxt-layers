declare module '@nuxt/schema' {
  interface AppConfigInput {
    coreLayer?: {
      /** Project name */
      name?: string

      /** 404 Not Found page configuration */
      notFound?: {
        icon?: string
        title?: string
        description?: string
        showPath?: boolean
        showHomeButton?: boolean
        homeButtonLabel?: string
        homeButtonTo?: string
        showBackButton?: boolean
        backButtonLabel?: string
        actions?: Array<{
          label: string
          to?: string
          icon?: string
          color?: 'primary' | 'neutral' | 'error' | 'success'
          variant?: 'solid' | 'outline' | 'ghost' | 'soft'
          click?: () => void
        }>
        suggestions?: {
          enabled?: boolean
          title?: string
          links?: Array<{ label: string; to: string; icon?: string }>
        }
      }

      loading?: {
        enabled?: boolean
        minDuration?: number
        maxDuration?: number
        background?: string
        textColor?: string
        zIndex?: number
      }

      errors?: {
        logToConsole?: boolean
        logToExternal?: boolean
        externalUrl?: string
        externalToken?: string
      }

      scrollGuard?: {
        enabled?: boolean
        excludeSelectors?: string[]
        strict?: boolean
        transitionDuration?: number
        resizeDebounce?: number
        debug?: boolean
      }
    }
  }
}
