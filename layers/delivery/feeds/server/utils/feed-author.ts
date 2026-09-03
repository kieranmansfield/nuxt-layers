type FeedSourceAuthor = {
  name?: string | undefined
}

type FeedSourceItem = {
  author?: FeedSourceAuthor | string | undefined
  authors?: FeedSourceAuthor[] | undefined
}

export function resolveFeedAuthor(item: FeedSourceItem): string | undefined {
  const firstAuthor = item.authors?.[0]
  if (typeof firstAuthor?.name === 'string' && firstAuthor.name.length > 0) {
    return firstAuthor.name
  }

  if (typeof item.author === 'string' && item.author.length > 0) {
    return item.author
  }

  if (item.author && typeof item.author === 'object' && typeof item.author.name === 'string') {
    return item.author.name
  }

  return undefined
}

export function resolveFeedDate(item: {
  date?: string | number | Date | undefined
  createdAt?: string | number | Date | undefined
}): Date {
  return new Date(item.date ?? item.createdAt ?? Date.now())
}
