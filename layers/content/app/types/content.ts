import type { Author } from '#layers/core/app/types/site'

export interface ContentAuthor extends Author {
  avatar?: string
}

export interface GalleryImage {
  src: string
  alt: string
  width?: number
  height?: number
  caption?: string
  title?: string
  ambient?: boolean
}

export interface PortfolioColor {
  name: string
  value: string
  usage?: string
}

export interface PortfolioFont {
  name: string
  weights?: string[]
  usage?: string
}

export interface BaseContent {
  title: string
  description?: string
  image?: string
  tags?: string[]
  date?: string
  draft?: boolean
}

export interface ContentPage extends BaseContent {}

export interface BlogPost extends BaseContent {
  date: string
  authors: ContentAuthor[]
  tags: string[]
  badge?: string
  draft: boolean
  readingTime?: number
}

export interface PortfolioItem extends BaseContent {
  tags: string[]
  client?: string
  year?: number
  /** External project URL */
  url?: string
  featured: boolean
  colors: PortfolioColor[]
  typography: PortfolioFont[]
}

export interface GalleryItem extends BaseContent {
  images: GalleryImage[]
  tags: string[]
}

export interface ContentQueryOptions {
  limit?: number
}

export interface BlogQueryOptions extends ContentQueryOptions {
  excludeDrafts?: boolean
  tags?: string[]
}

export interface PortfolioQueryOptions extends ContentQueryOptions {
  featured?: boolean
  tags?: string[]
}

export interface GalleryQueryOptions extends ContentQueryOptions {
  tags?: string[]
}
