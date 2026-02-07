export default defineAppConfig({
  ui: {
    prose: {
      h1: {
        base: 'text-4xl font-bold tracking-tight text-highlighted',
      },
      h2: {
        base: 'text-2xl font-semibold tracking-tight text-highlighted',
      },
      h3: {
        base: 'text-xl font-semibold tracking-tight text-highlighted',
      },
      h4: {
        base: 'text-lg font-semibold text-highlighted',
      },
      p: {
        base: 'text-base leading-relaxed text-muted',
      },
      a: {
        base: 'text-primary underline underline-offset-4 hover:text-primary/80',
      },
      blockquote: {
        base: 'border-l-4 border-primary/30 pl-4 italic text-muted',
      },
      code: {
        base: 'bg-gray-100 dark:bg-gray-800 rounded px-1.5 py-0.5 text-sm font-mono',
      },
      pre: {
        base: 'bg-gray-900 dark:bg-gray-950 rounded-lg p-4 overflow-x-auto',
      },
    },
  },
})
