import type { MaybeRefOrGetter } from 'vue'

import type { BlogQueryOptions } from '../types/content'

export function useBlogPosts(options: MaybeRefOrGetter<BlogQueryOptions> = {}) {
  return useCollectionItems('blog', () => {
    const { excludeDrafts = true, tags, limit } = toValue(options)
    return {
      tags,
      limit,
      sortKey: 'date',
      sortDirection: 'desc',
      filter: excludeDrafts ? (post) => !('draft' in post && post.draft) : undefined,
      filterKey: String(excludeDrafts),
    }
  })
}
