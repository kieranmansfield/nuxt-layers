/**
 * Frontmatter type augmentation for the content collections.
 *
 * The runtime schemas live in `content.config.ts` but are intentionally NOT
 * passed to `defineCollection` (c12 initializes configs with jiti's
 * `moduleCache: false`, so zod validators never initialize — see the layer
 * docs). Nuxt Content therefore generates bare collection interfaces; this
 * file adds the frontmatter fields so they stay typed. Keep in sync with the
 * schemas in `content.config.ts`.
 */
import type { ContentAuthor, GalleryImage, PortfolioColor, PortfolioFont } from './content'

declare module '@nuxt/content' {
  interface ContentCollectionItem {
    image?: string
  }

  interface BlogCollectionItem {
    date?: string
    image?: string
    authors?: ContentAuthor[]
    tags?: string[]
    badge?: string
    draft?: boolean
    readingTime?: number
  }

  interface PortfolioCollectionItem {
    image?: string
    tags?: string[]
    client?: string
    year?: number
    url?: string
    featured?: boolean
    colors?: PortfolioColor[]
    typography?: PortfolioFont[]
  }

  interface GalleryCollectionItem {
    images?: GalleryImage[]
    tags?: string[]
    date?: string
  }
}

export {}
