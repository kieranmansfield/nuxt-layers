import type { FeedConfig, FeedItem } from '../types'

function escapeXml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

export function toAtom(items: FeedItem[], config: FeedConfig): string {
  const updated = (items[0]?.date ?? new Date()).toISOString()

  const entries = items
    .map(
      (item) => `
  <entry>
    <title>${escapeXml(item.title)}</title>
    <id>${escapeXml(`${config.siteUrl}${item.id}`)}</id>
    <link href="${escapeXml(`${config.siteUrl}${item.link}`)}" />
    <updated>${item.date.toISOString()}</updated>
    ${item.description ? `<summary>${escapeXml(item.description)}</summary>` : ''}
    ${item.author ? `<author><name>${escapeXml(item.author)}</name></author>` : ''}
  </entry>`
    )
    .join('')

  return `<?xml version="1.0" encoding="utf-8"?>
<?xml-stylesheet type="text/xsl" href="/feed/style.xsl"?>
<feed xmlns="http://www.w3.org/2005/Atom">
  <title>${escapeXml(config.title)}</title>
  <id>${escapeXml(config.siteUrl)}</id>
  <link href="${escapeXml(config.siteUrl)}" />
  <link rel="self" href="${escapeXml(`${config.siteUrl}/feed/atom`)}" />
  <updated>${updated}</updated>
  ${config.author ? `<author><name>${escapeXml(config.author.name)}</name></author>` : ''}
${entries}
</feed>`
}
