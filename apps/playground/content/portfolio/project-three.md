---
title: Dataview — Obsidian Plugin
description: Demo item for the project-stats cards — live GitHub and Obsidian plugin listing stats pulled from frontmatter.
image: https://picsum.photos/seed/portfolio3/800/400
tags:
  - development
  - obsidian
  - open-source
year: 2026
url: https://blacksmithgu.github.io/obsidian-dataview/
github: blacksmithgu/obsidian-dataview
obsidian: dataview
featured: false
---

# Dataview — Obsidian Plugin

This playground item shows the `project-stats` layer on a portfolio page. Two frontmatter fields drive it:

```yaml
github: blacksmithgu/obsidian-dataview # owner/name or a github.com URL
obsidian: dataview # community plugin id from obsidian.md/plugins?id=…
```

The cards below the content are fetched server-side, cached (GitHub for an hour, the Obsidian directory for six), and fall back to a plain link if either source is unavailable.
