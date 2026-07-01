export type GoogleBooksVolumeInfo = {
  title: string
  subtitle?: string
  authors?: string[]
  publisher?: string
  publishedDate?: string
  description?: string
  industryIdentifiers?: Array<{ type: 'ISBN_10' | 'ISBN_13' | string; identifier: string }>
  pageCount?: number
  imageLinks?: {
    smallThumbnail?: string
    thumbnail?: string
    small?: string
    medium?: string
    large?: string
    extraLarge?: string
  }
  categories?: string[]
  previewLink?: string
  infoLink?: string
  canonicalVolumeLink?: string
}

export type GoogleBooksVolume = {
  id: string
  selfLink: string
  volumeInfo: GoogleBooksVolumeInfo
}

export type GoogleBooksSearchResponse = {
  totalItems: number
  items?: GoogleBooksVolume[]
}
