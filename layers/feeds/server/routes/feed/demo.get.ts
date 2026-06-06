import type { SiteConfig } from '#layers/core/app/types/site'

const RSS_ICON = `<svg viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <path d="M2.5 3a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5H3a.5.5 0 0 1-.5-.5V3Z"/>
        <path d="M4 8a6 6 0 0 1 6 6H8.5A4.5 4.5 0 0 0 4 9.5V8Z"/>
        <path d="M4 5a9 9 0 0 1 9 9h-1.5A7.5 7.5 0 0 0 4 6.5V5Z"/>
        <circle cx="3.5" cy="13.5" r="1.5"/>
      </svg>`

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

function formatDate(date: Date): string {
  return date.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

export default defineEventHandler(async (event) => {
  const appConfig = useAppConfig()
  const site: SiteConfig = (appConfig as { site?: SiteConfig }).site ?? {}
  const feedConfig = (appConfig as { feedsLayer?: { feed?: { defaultCollection?: string } } }).feedsLayer?.feed ?? {}
  const defaultCollection = feedConfig.defaultCollection ?? 'blog'

  const requestUrl = getRequestURL(event)
  const origin = `${requestUrl.protocol}//${requestUrl.host}`
  const subscribeUrl = `feed:${origin}/feed/${defaultCollection}/rss`

  const { items, config } = await buildFeed(event, defaultCollection)

  const itemsHtml = items.map((item) => `
    <li class="feed-item">
      <article>
        <h2 class="feed-item-title">
          <a href="${escapeHtml(config.siteUrl + item.link)}">${escapeHtml(item.title)}</a>
        </h2>
        <div class="feed-item-meta">
          <time>${formatDate(item.date)}</time>
          ${item.author ? `<span class="feed-item-separator">·</span><span>${escapeHtml(item.author)}</span>` : ''}
        </div>
        ${item.description ? `<p class="feed-item-description">${escapeHtml(item.description)}</p>` : ''}
        ${item.tags?.length ? `
        <div class="feed-tags">
          ${item.tags.map((t) => `<span class="feed-tag">${escapeHtml(t)}</span>`).join('')}
        </div>` : ''}
      </article>
    </li>`).join('')

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(config.title)} · Feed Preview</title>
  <link rel="stylesheet" href="/feed/style.css">
</head>
<body>
  <div class="feed-container">
    <header class="feed-header">
      <span class="feed-eyebrow">
        ${RSS_ICON}
        RSS
      </span>
      <h1 class="feed-title">
        <a href="${escapeHtml(config.siteUrl)}">${escapeHtml(config.title)}</a>
      </h1>
      ${config.description ? `<p class="feed-description">${escapeHtml(config.description)}</p>` : ''}
      <div class="feed-header-actions">
        <div class="feed-meta">
          <span>${items.length} items</span>
          <a class="feed-meta-link" href="${escapeHtml(config.siteUrl)}">Visit site &rarr;</a>
        </div>
        <a class="feed-subscribe" href="${escapeHtml(subscribeUrl)}">
          ${RSS_ICON}
          Subscribe
        </a>
      </div>
    </header>
    <main>
      <ul class="feed-items">
        ${itemsHtml}
      </ul>
    </main>
  </div>
</body>
</html>`

  setHeader(event, 'Content-Type', 'text/html; charset=utf-8')
  setHeader(event, 'Cache-Control', 'public, max-age=300, s-maxage=3600')
  return html
})
