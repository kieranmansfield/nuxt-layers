import type { ButtonProps } from '@nuxt/ui'

import type { NotFoundConfig } from '../types/notFound'

type NotFoundAction = NonNullable<NotFoundConfig['actions']>[number]

function toButtonProps({ click, ...action }: NotFoundAction): ButtonProps {
  return {
    color: 'neutral',
    variant: 'outline',
    ...action,
    ...(click ? { onClick: click } : {}),
  }
}

/** The 404 page's built-in actions followed by any custom ones from `coreLayer.notFound`. */
// fallow-ignore-next-line complexity
export function resolveNotFoundActions(config: NotFoundConfig, onBack: () => void): ButtonProps[] {
  const actions: ButtonProps[] = []

  if (config.showHomeButton !== false) {
    actions.push({
      label: config.homeButtonLabel || 'Go Home',
      to: config.homeButtonTo || '/',
      icon: 'i-lucide-home',
      color: 'primary',
      variant: 'solid',
    })
  }

  if (config.showBackButton !== false) {
    actions.push({
      label: config.backButtonLabel || 'Go Back',
      icon: 'i-lucide-arrow-left',
      color: 'neutral',
      variant: 'outline',
      onClick: onBack,
    })
  }

  return [...actions, ...(config.actions ?? []).map(toButtonProps)]
}

/** Fills `coreLayer.notFound` with the 404 page's defaults. */
// fallow-ignore-next-line complexity
export function resolveNotFoundConfig(config: NotFoundConfig = {}, onBack: () => void = () => {}) {
  const suggestions = config.suggestions ?? {}

  return {
    icon: config.icon || 'i-lucide-file-question',
    title: config.title || 'Page Not Found',
    description:
      config.description || "The page you're looking for doesn't exist or has been moved.",
    showPath: config.showPath !== false,
    actions: resolveNotFoundActions(config, onBack),
    suggestions: {
      title: suggestions.title || 'You might be looking for:',
      links: suggestions.enabled ? (suggestions.links ?? []) : [],
    },
  }
}
