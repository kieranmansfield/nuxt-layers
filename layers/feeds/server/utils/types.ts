export type FeedItem = {
  title: string
  description?: string | undefined
  link: string
  id: string
  date: Date
  author?: string | undefined
  tags?: string[] | undefined
}

export type FeedConfig = {
  title: string
  description: string
  siteUrl: string
  author?:
    | {
        name: string
        email?: string | undefined
        link?: string | undefined
      }
    | undefined
  image?: string | undefined
  favicon?: string | undefined
  copyright?: string | undefined
  limit?: number | undefined
}
