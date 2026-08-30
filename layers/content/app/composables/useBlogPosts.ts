import type { BlogQueryOptions } from '../types/content'

export function useBlogPosts(options: BlogQueryOptions = {}) {
  const { excludeDrafts = true, tags, limit } = options

  return useCollectionItems('blog', {
    tags,
    limit,
    sortKey: 'date',
    sortDirection: 'desc',
    filter: excludeDrafts ? (post) => !('draft' in post && post.draft) : undefined,
  })
}
