export interface ContentAuthor {
  name: string
  avatar?: string
  url?: string
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
  weights: string[]
  usage?: string
}

export interface ContentPage {
  title: string
  description?: string
  image?: string
}

export interface BlogPost {
  title: string
  description?: string
  date: string
  image?: string
  authors: ContentAuthor[]
  tags: string[]
  badge?: string
  draft: boolean
  readingTime?: number
}

export interface PortfolioItem {
  title: string
  description?: string
  image?: string
  tags: string[]
  client?: string
  year?: number
  url?: string
  featured: boolean
  colors: PortfolioColor[]
  typography: PortfolioFont[]
}

export interface GalleryItem {
  title: string
  description?: string
  images: GalleryImage[]
  tags: string[]
  date?: string
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
