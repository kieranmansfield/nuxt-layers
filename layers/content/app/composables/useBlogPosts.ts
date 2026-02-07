import type { BlogQueryOptions } from '../types/content'

export function useBlogPosts(options: BlogQueryOptions = {}) {
  const { excludeDrafts = true, tags, limit } = options

  return useAsyncData('blog-posts', async () => {
    let posts = await queryCollection('blog').order('date', 'DESC').all()

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
