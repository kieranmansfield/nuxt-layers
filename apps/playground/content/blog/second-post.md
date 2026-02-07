---
title: Building with Nuxt Layers
description: How the layers architecture enables scalable Vue applications.
date: '2026-01-20'
image: https://picsum.photos/seed/blog2/800/400
authors:
  - name: John Smith
    avatar: https://i.pravatar.cc/150?u=john
tags:
  - architecture
  - nuxt
draft: false
readingTime: 5
---

# Building with Nuxt Layers

Nuxt layers provide a powerful way to organize and share code across projects.

## Why Layers?

Each layer is an independent, composable package:

- **Core** — Foundation utilities and detection
- **UI** — Typography, colors, and media components
- **Content** — Collections, composables, and rendering
- **Layout** — Grid systems and page structure

### Layer Dependencies

Layers can depend on each other. The content layer extends core for base utilities while using UI components for rendering.

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  extends: ['../core'],
  modules: ['@nuxt/ui', '@nuxt/content'],
})
```

## Composable Pattern

All data fetching is wrapped in thin composables:

```ts
export function useBlogPosts(options = {}) {
  return useAsyncData('blog-posts', async () => {
    let posts = await queryCollection('blog').order('date', 'DESC').all()
    // ...filtering logic
    return posts
  })
}
```

This keeps components clean and focused on presentation.
