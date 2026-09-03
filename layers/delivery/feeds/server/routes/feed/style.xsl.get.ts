export default defineEventHandler((event) => {
  setHeader(event, 'Content-Type', 'text/xsl; charset=utf-8')
  setHeader(event, 'Cache-Control', 'public, max-age=3600')

  // Single stylesheet handles both RSS 2.0 and Atom 1.0.
  // The root-level <xsl:apply-templates/> dispatches to whichever
  // format-specific template matches the document's root element.
  return `<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0"
  xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
  xmlns:atom="http://www.w3.org/2005/Atom"
  xmlns:dc="http://purl.org/dc/elements/1.1/">

  <xsl:output method="html" encoding="UTF-8" indent="yes"/>

  <xsl:template match="/">
    <xsl:apply-templates/>
  </xsl:template>

  <!-- ─── RSS 2.0 ───────────────────────────────────────────────────────── -->

  <xsl:template match="rss">
    <html lang="en">
      <head>
        <meta charset="UTF-8"/>
        <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
        <title>
          <xsl:value-of select="channel/title"/>
          <xsl:text> · RSS Feed</xsl:text>
        </title>
        <link rel="stylesheet" type="text/css" href="/feed/style.css"/>
      </head>
      <body>
        <div class="feed-container">
          <header class="feed-header">
            <span class="feed-eyebrow">
              <svg viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                <path d="M2.5 3a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5H3a.5.5 0 0 1-.5-.5V3Z"/>
                <path d="M4 8a6 6 0 0 1 6 6H8.5A4.5 4.5 0 0 0 4 9.5V8Z"/>
                <path d="M4 5a9 9 0 0 1 9 9h-1.5A7.5 7.5 0 0 0 4 6.5V5Z"/>
                <circle cx="3.5" cy="13.5" r="1.5"/>
              </svg>
              RSS
            </span>
            <h1 class="feed-title">
              <a href="{channel/link}">
                <xsl:value-of select="channel/title"/>
              </a>
            </h1>
            <xsl:if test="channel/description">
              <p class="feed-description">
                <xsl:value-of select="channel/description"/>
              </p>
            </xsl:if>
            <div class="feed-header-actions">
              <div class="feed-meta">
                <span>
                  <xsl:value-of select="count(channel/item)"/>
                  <xsl:text> items</xsl:text>
                </span>
                <a class="feed-meta-link" href="{channel/link}">Visit site &#x2192;</a>
              </div>
              <a class="feed-subscribe" id="feed-subscribe-btn" href="#">
                <svg viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                  <path d="M2.5 3a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5H3a.5.5 0 0 1-.5-.5V3Z"/>
                  <path d="M4 8a6 6 0 0 1 6 6H8.5A4.5 4.5 0 0 0 4 9.5V8Z"/>
                  <path d="M4 5a9 9 0 0 1 9 9h-1.5A7.5 7.5 0 0 0 4 6.5V5Z"/>
                  <circle cx="3.5" cy="13.5" r="1.5"/>
                </svg>
                Subscribe
              </a>
            </div>
          </header>
          <main>
            <ul class="feed-items">
              <xsl:for-each select="channel/item">
                <li class="feed-item">
                  <article>
                    <h2 class="feed-item-title">
                      <a href="{link}">
                        <xsl:value-of select="title"/>
                      </a>
                    </h2>
                    <div class="feed-item-meta">
                      <xsl:if test="pubDate">
                        <time><xsl:value-of select="pubDate"/></time>
                      </xsl:if>
                      <xsl:if test="dc:creator">
                        <span class="feed-item-separator">&#xB7;</span>
                        <span><xsl:value-of select="dc:creator"/></span>
                      </xsl:if>
                    </div>
                    <xsl:if test="description">
                      <p class="feed-item-description">
                        <xsl:value-of select="description"/>
                      </p>
                    </xsl:if>
                    <xsl:if test="category">
                      <div class="feed-tags">
                        <xsl:for-each select="category">
                          <span class="feed-tag">
                            <xsl:value-of select="."/>
                          </span>
                        </xsl:for-each>
                      </div>
                    </xsl:if>
                  </article>
                </li>
              </xsl:for-each>
            </ul>
          </main>
        </div>
        <script>
          <xsl:text>(function(){var a=document.getElementById('feed-subscribe-btn');if(a)a.href='feed:'+window.location.href;})();</xsl:text>
        </script>
      </body>
    </html>
  </xsl:template>

  <!-- ─── Atom 1.0 ──────────────────────────────────────────────────────── -->

  <xsl:template match="atom:feed">
    <html lang="en">
      <head>
        <meta charset="UTF-8"/>
        <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
        <title>
          <xsl:value-of select="atom:title"/>
          <xsl:text> · Atom Feed</xsl:text>
        </title>
        <link rel="stylesheet" type="text/css" href="/feed/style.css"/>
      </head>
      <body>
        <div class="feed-container">
          <header class="feed-header">
            <span class="feed-eyebrow">
              <svg viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                <circle cx="8" cy="8" r="2"/>
                <path d="M8 1a7 7 0 1 0 0 14A7 7 0 0 0 8 1zm0 1.5a5.5 5.5 0 1 1 0 11 5.5 5.5 0 0 1 0-11z"/>
                <path d="M8 4.5a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7zm0 1.5a2 2 0 1 1 0 4 2 2 0 0 1 0-4z"/>
              </svg>
              Atom
            </span>
            <h1 class="feed-title">
              <a href="{atom:link[not(@rel)]/@href}">
                <xsl:value-of select="atom:title"/>
              </a>
            </h1>
            <div class="feed-header-actions">
              <div class="feed-meta">
                <span>
                  <xsl:value-of select="count(atom:entry)"/>
                  <xsl:text> items</xsl:text>
                </span>
                <a class="feed-meta-link" href="{atom:link[not(@rel)]/@href}">Visit site &#x2192;</a>
              </div>
              <a class="feed-subscribe" id="feed-subscribe-btn" href="#">
                <svg viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                  <path d="M2.5 3a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5H3a.5.5 0 0 1-.5-.5V3Z"/>
                  <path d="M4 8a6 6 0 0 1 6 6H8.5A4.5 4.5 0 0 0 4 9.5V8Z"/>
                  <path d="M4 5a9 9 0 0 1 9 9h-1.5A7.5 7.5 0 0 0 4 6.5V5Z"/>
                  <circle cx="3.5" cy="13.5" r="1.5"/>
                </svg>
                Subscribe
              </a>
            </div>
          </header>
          <main>
            <ul class="feed-items">
              <xsl:for-each select="atom:entry">
                <li class="feed-item">
                  <article>
                    <h2 class="feed-item-title">
                      <a href="{atom:link/@href}">
                        <xsl:value-of select="atom:title"/>
                      </a>
                    </h2>
                    <div class="feed-item-meta">
                      <xsl:if test="atom:updated">
                        <time><xsl:value-of select="atom:updated"/></time>
                      </xsl:if>
                      <xsl:if test="atom:author/atom:name">
                        <span class="feed-item-separator">&#xB7;</span>
                        <span><xsl:value-of select="atom:author/atom:name"/></span>
                      </xsl:if>
                    </div>
                    <xsl:if test="atom:summary">
                      <p class="feed-item-description">
                        <xsl:value-of select="atom:summary"/>
                      </p>
                    </xsl:if>
                  </article>
                </li>
              </xsl:for-each>
            </ul>
          </main>
        </div>
        <script>
          <xsl:text>(function(){var a=document.getElementById('feed-subscribe-btn');if(a)a.href='feed:'+window.location.href;})();</xsl:text>
        </script>
      </body>
    </html>
  </xsl:template>

</xsl:stylesheet>`
})
