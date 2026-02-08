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

::tip
Use typed collections with Zod schemas for full type safety across your content.
::

::warning
Make sure your frontmatter matches the collection schema — mismatched fields will cause build errors.
::

## Getting Started

::steps

### Install the content layer

Add `content` to your layer extends array in `nuxt.config.ts`.

```ts [nuxt.config.ts]
export default defineNuxtConfig({
  extends: ['./layers/content'],
})
```

### Define your collections

Create a `content.config.ts` with Zod schemas for each content type.

```ts [content.config.ts]
import { defineCollection, defineContentConfig, z } from '@nuxt/content'

export default defineContentConfig({
  collections: {
    blog: defineCollection({
      type: 'page',
      source: 'blog/**/*.md',
      schema: z.object({
        title: z.string(),
        date: z.string(),
      }),
    }),
  },
})
```

### Start writing

Drop markdown files in your `content/` directory and they'll be automatically picked up.

::

### Code Snippet

Here's how to fetch blog posts:

::code-group

```ts [Composable]
const { data: posts } = await useBlogPosts({
  excludeDrafts: true,
  tags: ['announcement'],
  limit: 10,
})
```

```ts [Direct Query]
const { data: posts } = await useAsyncData('posts', () =>
  queryCollection('blog').order('date', 'DESC').all()
)
```

::

## Next Steps

::note
Check out the other content types — portfolio and gallery — to see the full content layer in action.
::

::card-group

::card
---
title: Portfolio
icon: i-lucide-briefcase
to: /portfolio
---
Showcase projects with client info, tags, and featured filtering.
::

::card
---
title: Gallery
icon: i-lucide-images
to: /gallery
---
Image collections with metadata and tagging.
::

::
