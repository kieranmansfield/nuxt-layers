# Motion Layer

Pure orchestrator layer. It has no components or composables of its own — it just
`extends` the four real motion layers so an app can load one dependency instead of four:

```text
motion → scroll, animations, transitions, page-transitions
```

## Usage

```bash
PLAYGROUND_LAYERS=core,layout,motion pnpm dev
```

## Where the real API lives

| Layer              | Provides                                                                 |
| ------------------ | ------------------------------------------------------------------------ |
| `scroll`            | GSAP + Locomotive Scroll infra, `useGsap`, `useSmoothScroll`, `useSectionProgress`, `useScrollSteps`, `Motion/HorizontalScroll`, `Motion/Parallax`, `Motion/PinnedSection`, `Motion/ScrollLink`, `Motion/ScrollProgress`, `Motion/ScrollScene`, `Motion/ScrollStats`, `Motion/ScrollStep` |
| `animations`        | `Motion/Marquee`, `Motion/MarqueeText` (see `docs/MarqueeText.md`), `Motion/Cursor`, `Motion/Magnetic`, `Motion/Tilt`, `Motion/CountUp`, `Motion/TextReveal`, `Motion/Staggered`, `Motion/VelocityEffect` |
| `transitions`       | CSS transition/animation classes, `Motion/Transition`                    |
| `page-transitions`  | `usePageTransition()`, `app.config.pageTransitions` defaults             |

See each layer's own source for its composables and components — this layer doesn't
re-export or wrap them.
