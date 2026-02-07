---
title: Hello World
description: Our first blog post demonstrating the content layer's blog collection.
date: '2026-01-15'
image: https://picsum.photos/seed/blog1/800/400
authors:
  - name: Jane Doe
    avatar: https://i.pravatar.cc/150?u=jane
    url: https://github.com/janedoe
tags:
  - announcement
  - getting-started
badge: New
draft: false
readingTime: 3
---

# Hello World

Welcome to our first blog post. This demonstrates the full blog post rendering with all frontmatter fields.

## What's Included

The content layer provides everything you need:

1. **Typed collections** with Zod schemas
2. **Composables** for fetching and filtering
3. **Components** that delegate to Nuxt UI

### Code Snippet

Here's how to fetch blog posts:

```ts
const { data: posts } = await useBlogPosts({
  excludeDrafts: true,
  tags: ['announcement'],
  limit: 10,
})
```

## Next Steps

Check out the other content types — portfolio and gallery — to see the full content layer in action.

> The content layer is designed to be composable and extensible.
