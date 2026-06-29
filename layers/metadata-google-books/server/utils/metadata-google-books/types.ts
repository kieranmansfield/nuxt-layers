export type GoogleBooksVolumeInfo = {
  title: string
  subtitle?: string
  authors?: string[]
  publisher?: string
  publishedDate?: string
  description?: string
  industryIdentifiers?: Array<{ type: 'ISBN_10' | 'ISBN_13' | string; identifier: string }>
  pageCount?: number
  imageLinks?: { thumbnail?: string; smallThumbnail?: string }
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
