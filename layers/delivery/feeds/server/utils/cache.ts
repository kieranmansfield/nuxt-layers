import { setHeader, type H3Event } from 'h3'
import { createHash } from 'node:crypto'

export function setFeedCacheHeaders(event: H3Event, content: string): void {
  const etag = `"${createHash('md5').update(content).digest('hex')}"`
  setHeader(event, 'ETag', etag)
  setHeader(event, 'Cache-Control', 'public, max-age=300, s-maxage=3600')
}
