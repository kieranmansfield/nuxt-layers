export default {
  coreLayer: {
    // 404 Page defaults (all optional)
    notFound: {
      // Visual
      icon: 'i-lucide-file-question',
      title: 'Page Not Found',
      description: "The page you're looking for doesn't exist or has been moved.",
      showPath: true,

      // Actions
      showHomeButton: true,
      homeButtonLabel: 'Go Home',
      homeButtonTo: '/',
      showBackButton: true,
      backButtonLabel: 'Go Back',

      // Custom actions (empty by default)
      actions: [],

      // Suggestions (disabled by default)
      suggestions: {
        enabled: false,
        title: 'You might be looking for:',
        links: [],
      },
    },

    // Loading screen configuration (initial app load only)
    loading: {
      // Master toggle - set to false to disable completely
      enabled: true,
      // Minimum time to display loading screen (prevents flash)
      minDuration: 3000, // Temporarily increased for testing
      // Maximum time for simulated progress
      maxDuration: 3000,
      // Background color
      background: '#0a0a0a',
      // Progress text color
      textColor: '#ffffff',
      // Stack order
      zIndex: 10000,
    },

    // Error handling configuration
    errors: {
      // Console logging (enabled in development by default)
      logToConsole: true,
      // External error service logging (disabled by default)
      logToExternal: false,
      // External error service URL (e.g., Sentry, LogRocket)
      externalUrl: '',
      // External error service token/key
      externalToken: '',
    },

    // Horizontal scroll guard configuration
    scrollGuard: {
      // Master toggle - set to false to disable completely
      enabled: false,
      // CSS selectors for elements allowed to overflow intentionally
      excludeSelectors: ['.carousel', '.overflow-intent'],
      // Enable automatic clamping of overflowing elements
      strict: true,
      // Duration (ms) for element width clamp animations
      transitionDuration: 200,
      // Debounce delay (ms) for resize re-scans
      resizeDebounce: 150,
      // Temporarily highlight overflowing elements with a red outline
      debug: false,
    },
  },
}
