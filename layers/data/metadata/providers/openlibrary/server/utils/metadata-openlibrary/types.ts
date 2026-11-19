export type OpenLibrarySearchDoc = {
  key: string
  title: string
  subtitle?: string
  author_name?: string[]
  author_key?: string[]
  publisher?: string[]
  first_publish_year?: number
  isbn?: string[]
  cover_i?: number
  number_of_pages_median?: number
  language?: string[]
}

export type OpenLibrarySearchResponse = {
  numFound: number
  docs: OpenLibrarySearchDoc[]
}

export type OpenLibraryWork = {
  key: string
  title: string
  subtitle?: string
  description?: { value: string } | string
  authors?: Array<{ author: { key: string }; type: { key: string } }>
  first_publish_date?: string
  covers?: number[]
  subjects?: string[]
}

export type OpenLibraryEdition = {
  key: string
  title: string
  subtitle?: string
  publishers?: string[]
  publish_date?: string
  isbn_13?: string[]
  isbn_10?: string[]
  covers?: number[]
  works?: Array<{ key: string }>
  number_of_pages?: number
}

export type OpenLibraryAuthor = {
  key: string
  name: string
  personal_name?: string
}
