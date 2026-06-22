import type { BlogQueryOptions } from '../types/content'

export function useBlogPosts(options: BlogQueryOptions = {}) {
  const { excludeDrafts = true, tags, limit } = options

  const key = `blog-posts:${excludeDrafts}:${(tags ?? []).slice().sort().join(',')}:${limit ?? ''}`
  return useContentData(key, async () => {
    let posts = (await queryCollection('blog').all()).sort((a, b) =>
      (b.date ?? '').localeCompare(a.date ?? '')
    )

    if (excludeDrafts) {
      posts = posts.filter((post) => !post.draft)
    }

    if (tags?.length) {
      posts = posts.filter((post) => post.tags?.some((tag: string) => tags.includes(tag)))
    }

    if (limit) {
      posts = posts.slice(0, limit)
    }

    return posts
  })
}
