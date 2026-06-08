export type Author = {
  name: string
  email?: string
  /** URL of the author's profile or homepage */
  link?: string
}

/**
 * Shared site metadata. Set this in your app's `app.config.ts` under the `site` key.
 * Consumed by the feeds layer for feed channel metadata and available to any other
 * layer that needs canonical site information.
 *
 * @example
 * ```ts
 * // app/app.config.ts
 * export default defineAppConfig({
 *   site: {
 *     title: 'Kieran Mansfield',
 *     description: 'Creative Full-Stack Web Developer based in London, UK.',
 *     url: 'https://example.com',
 *     author: { name: 'Kieran Mansfield', email: 'hi@example.com' },
 *   },
 * })
 * ```
 */
export type SiteConfig = {
  /** Display name of the site */
  title?: string
  /** Tagline or secondary title */
  subtitle?: string
  /** Short description used in feed channels and meta tags */
  description?: string
  /** Canonical origin URL — no trailing slash (e.g. "https://example.com") */
  url?: string
  /** Default author for feed items and structured data */
  author?: Author
  /** Absolute URL of the site's OG/social image */
  image?: string
  /** Path to the favicon (default: "/favicon.ico") */
  favicon?: string
  /** Copyright string — auto-generated from author.name + year if omitted */
  copyright?: string
}
