export type FeedItem = {
  title: string
  description?: string
  link: string
  id: string
  date: Date
  author?: string
  tags?: string[]
}

export type FeedConfig = {
  title: string
  description: string
  siteUrl: string
  author?: {
    name: string
    email?: string
    link?: string
  }
  image?: string
  favicon?: string
  copyright?: string
  limit?: number
}
