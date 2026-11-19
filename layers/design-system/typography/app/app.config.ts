import { TYPE_STEP_CLASSES } from './composables/typography'

// Nuxt UI prose (Nuxt Content) on the modular scale. Nuxt UI pins prose headings to
// text-4xl/2xl/xl/lg and p/li to leading-7 with no size, so with a 20/24px body the copy sat
// at or above h2/h3 size on a cramped 28px line. Headings take their step instead (h1 one step
// above h2, not the display step — content pages already show a page-header title); copy keeps
// inheriting the body step, with the body's 1.7 leading.
export default defineAppConfig({
  ui: {
    // tailwind-merge reads unknown text-* classes as a text colour, so a step class would drop
    // a component's colour class and keep its text-{size}. Register them as font sizes.
    tv: {
      twMergeConfig: {
        extend: { classGroups: { 'font-size': Object.values(TYPE_STEP_CLASSES) } },
      },
    },
    prose: {
      h1: { slots: { base: 'text-step-4' } },
      h2: { slots: { base: 'text-step-3' } },
      h3: { slots: { base: 'text-step-2' } },
      h4: { slots: { base: 'text-step-1' } },
      p: { base: 'leading-[1.7]' },
      li: { base: 'leading-[1.7]' },
    },
  },
})
