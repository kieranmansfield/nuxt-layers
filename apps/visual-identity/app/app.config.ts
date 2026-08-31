export default defineAppConfig({
  ui: {
    colors: {
      primary: 'violet',
      neutral: 'zinc',
    },
    // Minimal Tabs override — unstyled strips Nuxt UI's default pill layout
    // entirely (list/trigger spacing, active indicator), used across 4 pages.
    tabs: {
      slots: {
        list: 'relative flex gap-1 p-1 bg-elevated rounded-lg',
        trigger:
          'relative z-10 px-3 py-1.5 text-sm font-medium rounded-md data-[state=inactive]:text-muted hover:data-[state=inactive]:text-default transition-colors',
        indicator:
          'absolute inset-y-1 left-0 -z-10 w-(--reka-tabs-indicator-size) translate-x-(--reka-tabs-indicator-position) rounded-md bg-default shadow-xs transition-[translate,width] duration-200 ease-out',
        content: 'pt-4',
      },
    },
  },
})
