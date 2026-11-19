export type NotFoundConfig = {
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
