---
title: Draft Post - Work in Progress
description: This post is marked as a draft and should be excluded from default listings.
date: '2026-02-01'
image: https://picsum.photos/seed/blog3/800/400
authors:
  - name: Jane Doe
    avatar: https://i.pravatar.cc/150?u=jane
tags:
  - draft-example
  - testing
badge: Draft
draft: true
readingTime: 2
---

# Draft Post

This post is marked as `draft: true` in its frontmatter. It demonstrates the draft filtering feature.

## How Draft Filtering Works

By default, `useBlogPosts()` excludes drafts:

```ts
// Drafts excluded by default
const { data: posts } = await useBlogPosts()

// Explicitly include drafts
const { data: allPosts } = await useBlogPosts({ excludeDrafts: false })
```

You should only see this post if you specifically opt in to showing drafts.
