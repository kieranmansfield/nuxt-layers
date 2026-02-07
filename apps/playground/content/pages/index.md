---
title: Welcome to the Content Layer
description: A demo of the content layer with markdown rendering, collections, and prose theming.
---

# Welcome to the Content Layer

This page demonstrates the **content layer** built on top of `@nuxt/content` v3. It supports typed collections, composables for data fetching, and prose theming via `app.config.ts`.

## Features

- **Blog** — Full-featured blog with authors, tags, drafts, and surround navigation
- **Portfolio** — Showcase projects with client info, tags, and featured filtering
- **Gallery** — Image collections with lightbox viewing

## Getting Started

Navigate to the sections below to explore each content type rendered with Nuxt UI components.

> This is a blockquote demonstrating prose theming.

### Code Example

```ts
const { data: posts } = await useBlogPosts({ excludeDrafts: true, limit: 5 })
```
