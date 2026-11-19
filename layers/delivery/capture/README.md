# capture layer

Screenshots and scroll videos of your sites, framed in browser windows and phones by
[Monkr](https://github.com/blaineam/Monkr). Built for portfolio work: point it at a list of sites
and it writes ready-to-use mockups.

It has two halves:

- **`kmcom-capture`** — a CLI (Node + Playwright) that works on **any** site, Nuxt or not.
- **The Nuxt layer** — an optional client plugin for sites built on these layers. Under browser
  automation it marks `<html data-capture>` and sets `data-capture-ready="true"` once the loading
  screen has gone and fonts are in, so the CLI captures at exactly the right moment instead of
  guessing.

## What you get

For every page × device × theme:

| File                                   | What                                                                 |
| -------------------------------------- | -------------------------------------------------------------------- |
| `<page>-desktop[-<theme>].png`         | Viewport at 3x (4320×2700) in a light/dark browser window with the real URL |
| `<page>-mobile[-<theme>].png`          | Viewport at 3x in an iPhone 17 Pro (silver for light, deep blue for dark) |
| `sections/<name>-01.png …`             | `--sections n`: the page scrolled one viewport at a time, framed     |
| `full/<name>.png`                      | `--full`: the whole page at 2x in a tall browser window (desktop)    |
| `raw/…`                                | The unframed originals of all of the above                           |
| `video/<name>.webm`                    | Smooth-scroll walkthrough at 2x/60fps, composited into the frame     |

The theme suffix is only added when a site has more than one theme. Framed PNGs have a
transparent background, trimmed to the device, so they sit on any page colour. Videos can't be
transparent, so they sit on `video.background`.

## Usage

Add `@playwright/test` (or `playwright`) to the project's devDependencies, then:

```bash
kmcom-capture                       # screenshots + videos for every site in capture.config.mjs
kmcom-capture shots --site athru-group
kmcom-capture video --themes dark
kmcom-capture pages --pages auto    # list what would be captured
kmcom-capture shots --url https://example.com --pages auto --full --sections 4
kmcom-capture --help
```

`--pages auto` reads the site's `sitemap.xml` (or sitemap index), and if there isn't one, follows
same-origin links from the home page (`crawlDepth`, `maxPages`, `exclude`, `pathDepth`).

## capture.config.mjs

```js
import { defineCaptureConfig, sitesFromContent } from 'kmcom-nuxt-layers/capture'

export default defineCaptureConfig({
  outDir: 'public/images/captures',
  // one site per content entry with a `link` URL; the file name is the site name
  sites: sitesFromContent('content/portfolio'),
  shots: { sections: 3 },
})
```

The default export can also be a function, handed the same helpers, so the config needs no
import from this package:

```js
export default async ({ sitesFromContent }) => ({
  sites: await sitesFromContent('content/portfolio'),
})
```

Every setting can be set globally or per site (`{ name, url, ...overrides }`), and command-line
flags override both. Defaults, in `cli/lib/config.mjs`:

| Setting          | Default                                   | Notes                                          |
| ---------------- | ----------------------------------------- | ---------------------------------------------- |
| `themes`         | `['light', 'dark']`                       | `['dark']` for a single-theme site             |
| `pages`          | `['/']`                                   | paths, or `'auto'`                             |
| `maxPages`       | `12`                                      | cap for `'auto'`                               |
| `pathDepth`      | unlimited                                 | `1` = home and top-level pages only, no sub-pages |
| `settleMs`       | `2500`                                    | extra wait for entrance animations             |
| `devices`        | `desktop` 1440×900, `mobile` 402×874      | `frame`: `'browser'`, any Monkr device id, or `false`; `color`: per theme or a string |
| `frame`          | `{ background: 'transparent', padding: 0, shadow: false }` | background: colour or CSS gradient |
| `shots`          | `{ scale: 3, frame: true, raw: true, full: false, fullScale: 2, sections: 0 }` | |
| `video`          | `{ pages: ['/'], scale: 2, fps: 60, format: 'webm', frame: true }` | `pages: 'all'` films every captured page; `format: 'mp4'` needs ffmpeg with libx264 |
| `monkr`          | `{ dir, ref }`                            | use your own Monkr checkout, or pin another commit |

Monkr's device list (ids and colours) is in its
[`src/lib/stores/devices.svelte.ts`](https://github.com/blaineam/Monkr/blob/main/src/lib/stores/devices.svelte.ts),
e.g. `iphone-17-pro-max`, `pixel-7-pro`, `ipad-pro-m5-11`, `macbook-pro-16`.

## How Monkr is used

Monkr is a SvelteKit app, not an npm package. On first run the CLI fetches it at a pinned commit
(`MONKR_REF` in `cli/lib/monkr.mjs`) into `~/.cache/kmcom-capture/`, sparsely — only the frame art
for the devices you use — then installs and builds it (~30 s, once). It serves that build locally
and drives Monkr's `/headless` route, so framed screenshots are pixel-identical to Monkr's own
Export button. Set `MONKR_DIR` to use your own clone.

Two things are adjusted inside Monkr's page: its browser frame's placeholder address is replaced
with the captured URL, and screenshots are top-aligned (its browser content area is a little
shorter than a 16:10 screenshot, and the top of a page matters more than the bottom).

Videos are composited, not re-rendered: Monkr renders the frame twice, over a black and a white
screen, and the difference is exactly the screen's coverage (rounded corners and antialiasing
included). Each captured video frame is then drawn through that mask, which is far cheaper than
re-rendering every frame through Monkr.

ffmpeg comes from `FFMPEG`, then `ffmpeg` on `PATH`, then Playwright's bundled copy (VP8 only).

## Nuxt layer

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  extends: ['kmcom-nuxt-layers/layers/capture'],
})
```

```ts
// app.config.ts
export default defineAppConfig({
  captureLayer: {
    hide: ['.chat-widget'], // hidden while capturing
  },
})
```

Style anything else with `html[data-capture] …`. Add `?capture` to a URL to preview capture mode
in a normal browser.
