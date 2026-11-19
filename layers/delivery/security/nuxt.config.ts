// https://nuxt-security.vercel.app
// nuxt-security defaults (strict CSP, COEP, rate limiter, XSS validator) are kept except where
// they break other layers in this repo. Consumers extend this config: Nuxt concatenates arrays
// across layers, so CSP sources can be added by the app but not removed — keep this list minimal.
export default defineNuxtConfig({
  $meta: {
    name: 'security',
  },

  extends: ['../../core'],

  modules: ['nuxt-security'],

  security: {
    headers: {
      // `credentialless` blocks cross-origin iframes (YouTube/Vimeo/baseline embeds). Only
      // needed for SharedArrayBuffer, which no layer uses.
      crossOriginEmbedderPolicy: false,
      // `no-referrer` breaks YouTube embeds (error 153) and referrer-gated APIs.
      referrerPolicy: 'strict-origin-when-cross-origin',
      contentSecurityPolicy: {
        // metadata/project-stats/content render remote covers and avatars.
        'img-src': ["'self'", 'data:', 'blob:', 'https:'],
        // @nuxt/content v3 runs SQLite as WASM in the browser for client-side queries.
        'script-src': [
          "'self'",
          'https:',
          "'unsafe-inline'",
          "'strict-dynamic'",
          "'nonce-{{nonce}}'",
          "'wasm-unsafe-eval'",
        ],
      },
      permissionsPolicy: {
        // `()` (and even `(self)`) blocks fullscreen inside YouTube embeds. Omit = browser default.
        fullscreen: false,
      },
    },
    // Buckets per IP per matching route RULE (with only `/**`, one site-wide bucket), in-memory
    // per server instance, keyed on spoofable X-Forwarded-For: 150 req/5 min 429s whole pages for
    // shared IPs. Enable per route in the app instead, e.g.
    // routeRules: { '/api/contact': { security: { rateLimiter: { tokensPerInterval: 5 } } } }
    rateLimiter: false,
    // Rejects any input `xss` would rewrite, so plain text like "x < y" or "I <3 it" 400s on
    // forms/search. Output is escaped by Vue and the nonce CSP covers injected scripts.
    xssValidator: false,
    // Default origin is devServer.url, unset at build time, so h3 falls back to `*` and every
    // route (metadata search included) becomes readable cross-origin. No handler = same-origin.
    corsHandler: false,
    // Default strips console.* and debugger from every consumer's production build.
    removeLoggers: false,
  },

  // Safari applies both to http://localhost: blank page + an HSTS pin that outlives the session.
  $development: {
    security: {
      headers: {
        strictTransportSecurity: false,
        contentSecurityPolicy: { 'upgrade-insecure-requests': false },
      },
    },
  },

  alias: {
    '#layers/security': import.meta.dirname,
  },

  compatibilityDate: '2026-10-27',

  typescript: {
    typeCheck: false,
    strict: true,
  },
})
