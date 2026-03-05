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

::card-group

::card
---
title: Core
icon: i-lucide-box
---
Foundation utilities and device detection.
::

::card
---
title: UI
icon: i-lucide-palette
---
Typography, colors, and media components.
::

::card
---
title: Content
icon: i-lucide-file-text
---
Collections, composables, and rendering.
::

::card
---
title: Layout
icon: i-lucide-layout
---
Grid systems and page structure.
::

::

### Layer Dependencies

::note
Layers can depend on each other. The content layer extends core for base utilities while using UI components for rendering.
::

::code-group

```ts [Content Layer]
// layers/content/nuxt.config.ts
export default defineNuxtConfig({
  extends: ['../core'],
  modules: ['@nuxt/ui', '@nuxt/content'],
})
```

```ts [App Config]
// nuxt.config.ts
export default defineNuxtConfig({
  extends: ['./layers/core', './layers/content'],
})
```

::

## Composable Pattern

::tip
All data fetching is wrapped in thin composables to keep components clean and focused on presentation.
::

```ts
export function useBlogPosts(options = {}) {
  return useAsyncData('blog-posts', async () => {
    let posts = await queryCollection('blog').order('date', 'DESC').all()
    // ...filtering logic
    return posts
  })
}
```
