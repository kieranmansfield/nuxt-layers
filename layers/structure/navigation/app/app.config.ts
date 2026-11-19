import type { SiteConfig } from '#layers/core/app/types/site'

import type { MastNavLink, MastNavTrigger, MastNavUi, SiteLogoConfig } from './types/nav'

export default defineAppConfig({
  site: {
    title: '',
    subtitle: '',
    description: '',
  } satisfies SiteConfig,
  mastNav: {
    links: [] as MastNavLink[],
    scrollBehaviour: 'router' as 'smooth-scroll' | 'router',
    // UButton props for <MastNav>; attrs on the component win
    trigger: {
      icon: 'lucide:menu',
      color: 'neutral',
      variant: 'ghost',
      size: 'xl',
    } as MastNavTrigger,
    ui: {
      content: 'bg-default text-default',
      close: 'absolute top-4 right-4',
      nav: 'flex flex-col items-center gap-2',
      // Weight keys off aria-current so active and inactive never carry two font-* classes
      link: 'cursor-pointer border-0 bg-transparent px-4 py-3 text-3xl tracking-widest uppercase transition-all font-light aria-[current=page]:font-normal',
      linkActive: '',
    } satisfies MastNavUi,
  },
  siteLogo: {
    stacked: true,
    ui: { root: 'font-display leading-none tracking-tight', word: '' },
    sizes: {
      sm: 'text-step-1',
      md: 'text-step-4',
      lg: 'text-step-6',
      display: 'text-step-display',
    },
  } satisfies SiteLogoConfig,
})

declare module '@nuxt/schema' {
  interface AppConfigInput {
    // `site` is already typed by core's own AppConfigInput augmentation — no need to redeclare it.
    mastNav?: {
      links?: MastNavLink[]
      scrollBehaviour?: 'smooth-scroll' | 'router'
      trigger?: MastNavTrigger
      ui?: Partial<MastNavUi>
    }
    siteLogo?: {
      stacked?: boolean
      ui?: Partial<SiteLogoConfig['ui']>
      /** Merged per key, so a site can retune one size without restating the others. */
      sizes?: Partial<SiteLogoConfig['sizes']>
    }
  }
}
