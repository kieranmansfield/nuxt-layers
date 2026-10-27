import type { Author } from '#layers/core/app/types/site'

export type ContentAuthor = {
  avatar?: string
} & Author

export type ContentLayerConfig = {
  name?: string
  sections?: {
    blog?: boolean
    portfolio?: boolean
    gallery?: boolean
  }
}

export type GalleryImage = {
  src: string
  alt: string
  width?: number
  height?: number
  caption?: string
  title?: string
  ambient?: boolean
}

export type PortfolioColor = {
  name: string
  value: string
  usage?: string
}

export type PortfolioFont = {
  name: string
  weights?: string[]
  usage?: string
}

/**
 * One technology in a project's stack. `icon` (any Iconify name, e.g. `i-logos-vue`) and `color`
 * (brand hex) fall back to the built-in table in `utils/portfolioStack.ts` when omitted.
 */
export type PortfolioStackItem = {
  name: string
  icon?: string
  color?: string
  /** Makes the card a link (docs, repo, …) */
  url?: string
}

/** Frontmatter accepts a bare name (`- Vue`) or the full object */
export type PortfolioStackEntry = string | PortfolioStackItem

export type BaseContent = {
  title: string
  description?: string
  image?: string
  tags?: string[]
  date?: string
  draft?: boolean
}

export type ContentPage = {} & BaseContent

export type BlogPost = {
  date: string
  authors: ContentAuthor[]
  tags: string[]
  badge?: string
  draft: boolean
  readingTime?: number
} & BaseContent

export type PortfolioItem = {
  tags: string[]
  client?: string
  year?: number
  /** External project URL */
  url?: string
  featured: boolean
  colors: PortfolioColor[]
  typography: PortfolioFont[]
  stack: PortfolioStackEntry[]
} & BaseContent

export type GalleryItem = {
  images: GalleryImage[]
  tags: string[]
} & BaseContent

export type ContentQueryOptions = {
  limit?: number
}

export type BlogQueryOptions = {
  excludeDrafts?: boolean
  tags?: string[]
} & ContentQueryOptions

export type PortfolioQueryOptions = {
  featured?: boolean
  tags?: string[]
} & ContentQueryOptions

export type GalleryQueryOptions = {
  tags?: string[]
} & ContentQueryOptions
