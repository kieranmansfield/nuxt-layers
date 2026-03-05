---
title: Welcome to the Content Layer
description: A demo of the content layer with markdown rendering, collections, and prose theming.
---

# Welcome to the Content Layer

This page demonstrates the **content layer** built on top of `@nuxt/content` v3. It supports typed collections, composables for data fetching, and prose theming via `app.config.ts`.

## Features

::tabs

:::tabs-item{label="Blog" icon="i-lucide-pen-line"}

Full-featured blog with authors, tags, drafts, and surround navigation.

```ts
const { data: posts } = await useBlogPosts({
  excludeDrafts: true,
  limit: 5,
})
```

:::

:::tabs-item{label="Portfolio" icon="i-lucide-briefcase"}

Showcase projects with client info, tags, and featured filtering.

```ts
const { data: projects } = await usePortfolioProjects({
  featured: true,
})
```

:::

:::tabs-item{label="Gallery" icon="i-lucide-images"}

Image collections with lightbox viewing and metadata.

```ts
const { data: galleries } = await useGalleries()
```

:::

::

## Content Types

::card-group

::card
---
title: Blog
icon: i-lucide-pen-line
to: /blog
---
Articles and posts with authors, tags, and draft support.
::

::card
---
title: Portfolio
icon: i-lucide-briefcase
to: /portfolio
---
Projects and work with client info and featured filtering.
::

::card
---
title: Gallery
icon: i-lucide-images
to: /gallery
---
Photo collections with image metadata.
::

::

## Getting Started

::callout{icon="i-lucide-rocket" color="primary"}
Navigate to the sections above to explore each content type rendered with Nuxt UI components.
::

::steps

### Add the content layer

Extend your Nuxt app with the content layer.

```ts [nuxt.config.ts]
export default defineNuxtConfig({
  extends: ['./layers/content'],
})
```

### Create your content

Add markdown files to `content/blog/`, `content/portfolio/`, or `content/gallery/`.

### Use the composables

Fetch content with the provided composables in your Vue components.

```ts
const { data: posts } = await useBlogPosts({ excludeDrafts: true })
```

::

## Installation

::code-group

```bash [pnpm]
pnpm add content
```

```bash [npm]
npm install content
```

```bash [yarn]
yarn add content
```

::
