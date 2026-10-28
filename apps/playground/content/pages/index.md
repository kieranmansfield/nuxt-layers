---
title: Welcome to the Content Layer
description: A demo of the content layer with markdown rendering, collections, and prose theming.
---

# Welcome to the Content Layer

This page demonstrates the **content layer** built on top of `@nuxt/content` v3. It supports typed collections, composables for data fetching, and prose theming via `app.config.ts`.

## Features

::tabs
  :::tabs-item{icon="i-lucide-pen-line" label="Blog"}
  Full-featured blog with authors, tags, drafts, and surround navigation.
  
  ```ts
  const { data: posts } = await useBlogPosts({
    excludeDrafts: true,
    limit: 5,
  })
  ```
  :::

  :::tabs-item{icon="i-lucide-briefcase" label="Portfolio"}
  Showcase projects with client info, tags, and featured filtering.
  
  ```ts
  const { data: projects } = await usePortfolioProjects({
    featured: true,
  })
  ```
  :::

  :::tabs-item{icon="i-lucide-images" label="Gallery"}
  Image collections with lightbox viewing and metadata.
  
  ```ts
  const { data: galleries } = await useGalleries()
  ```
  :::
::

## Content Types

::card-group
  :::card{icon="i-lucide-pen-line" title="Blog" to="/blog"}
  Articles and posts with authors, tags, and draft support.
  :::

  :::card{icon="i-lucide-briefcase" title="Portfolio" to="/portfolio"}
  Projects and work with client info and featured filtering.
  :::

  :::card{icon="i-lucide-images" title="Gallery" to="/gallery"}
  Photo collections with image metadata.
  :::
::

## Getting Started

::callout{color="primary" icon="i-lucide-rocket"}
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
