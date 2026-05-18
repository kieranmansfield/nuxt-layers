# MarqueeText

An infinite text marquee driven by scroll velocity. Multiple rows alternate direction automatically — even-indexed rows scroll right, odd-indexed rows scroll left. Scroll speed bends the marquee through spring physics.

## Basic usage

```vue
<MotionMarqueeText
  :texts="['MARQUEE ✦', 'TEXT ✦']"
/>
```

Two rows, alternating directions, reacting to scroll velocity with the default spring physics.

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `texts` | `string[]` | `[]` | One entry per row. Each string is the repeating phrase. |
| `velocity` | `number` | `100` | Base scroll speed in pixels per second. |
| `damping` | `number` | `50` | How quickly the velocity effect bleeds off (higher = longer tail). |
| `stiffness` | `number` | `400` | How quickly the velocity effect kicks in (higher = snappier). |
| `velocityMapping` | `{ input: [number, number], output: [number, number] }` | `{ input: [0, 1000], output: [0, 5] }` | Maps scroll velocity (input range) to a speed multiplier (output range). |
| `pauseOnHover` | `boolean` | `false` | Freeze the marquee when the cursor is over it. |
| `className` | `string` | `''` | Extra classes applied to each repeated text span. |
| `parallaxClassName` | `string` | `''` | Extra classes on the per-row wrapper div. |
| `scrollerClassName` | `string` | `''` | Extra classes on the scrolling track div. |
| `parallaxStyle` | `Record<string, string \| number>` | `{}` | Inline styles for the per-row wrapper. |
| `scrollerStyle` | `Record<string, string \| number>` | `{}` | Inline styles for the scrolling track. |

## Variants

### Slow and deliberate

```vue
<MotionMarqueeText
  :texts="['SLOW ✦', 'DRIFT ✦']"
  :velocity="40"
  :damping="80"
  :stiffness="150"
/>
```

### Snappy, high velocity sensitivity

```vue
<MotionMarqueeText
  :texts="['FAST ✦', 'SNAP ✦']"
  :velocity="120"
  :damping="20"
  :stiffness="800"
  :velocity-mapping="{ input: [0, 300], output: [0, 10] }"
/>
```

A tight input range means even gentle scrolling triggers a strong speed burst.

### Pause on hover

```vue
<MotionMarqueeText
  :texts="['HOVER TO PAUSE ✦', 'MOVE AWAY TO RESUME ✦']"
  :pause-on-hover="true"
/>
```

### Custom colours

Override the default `text-primary-500` colour by passing a class through `className`:

```vue
<MotionMarqueeText
  :texts="['BRAND ✦']"
  class-name="!text-white"
  scroller-class-name="!text-white"
/>
```

## How it works

The component is built on two composables:

- **`useMarqueeVelocity`** — reads scroll velocity from `useSmoothScroll`, applies spring smoothing (damping + stiffness), and range-maps the result to a speed multiplier via `velocityMapping`. Runs on the GSAP ticker.
- **`useMarqueeCopies`** — measures each row's text width and calculates how many copies are needed to fill the viewport. Recalculates on resize.

Each row's position (`baseX`) is updated every frame. The `wrap()` function maps `baseX` into a seamless `translateX` range so the text loops without a jump.
