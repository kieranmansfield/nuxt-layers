# How matuzo.at's typography works

An analysis of [matuzo.at](https://matuzo.at) (Manuel Matuzović), written 20 Oct 2026. Everything below was read from the live site: computed styles at 375, 768, 1024, 1280 and 1920px, plus its stylesheets. The CSS in section 6 is my own reconstruction, not his code.

## 1. The idea in three lines

1. Every font size is `base × 1.26^step`. Each element only declares its own `step`.
2. Spacing uses the same trick with a different ratio: `space-base × 1.414^step`.
3. Line height shrinks as text grows, and paragraphs are capped at a comfortable measure.

Because 1.26 is the cube root of 2 and 1.414 is the square root of 2, both scales are slices of an octave. Three type steps double a size, and two space steps double a gap. That shared maths is a big part of why the page feels proportioned.

## 2. Measured values

| Width | Body | h1 | h2 | h3 | Chars/line (full lines) |
|---|---|---|---|---|---|
| 375px | 20px | 51px | 32px | 25px | ~35–39 |
| 768px | 24px | 75px | 38px | 30px | ~51–60 |
| 1024px | 24px | 85px | 38px | 30px | ~43–51 |
| 1280px | 24px | 97px | 38px | 30px | ~73–74 |
| 1920px | 24px | 97px | 38px | 30px | ~73–74 (page maxes out at 80rem) |

Other facts:

- Typeface is **Pangea**, self-hosted as three woff2 files (400, 500, 600). x-height ≈ 0.505 em, cap height ≈ 0.70 em (measured via canvas).
- Line height: body **1.7**, lists **1.5** (body minus 0.2), teaser text 1.6, h2/h3 **1.2**, h1 **0.95**.
- Contrast: body text ≈ 18.8:1 on white, links ≈ 6.6:1.
- `html` stays at 16px (the user's browser setting is respected), and content width is capped at **54rem**.

## 3. The mechanism

### 3.1 Font size from a step

Each element computes its size from two custom properties: a **base size** and a **step** (exponent). The formula is:

```
font-size = round( base × 1.26^step , 1px )
```

- Base is **1rem** on phones and **1.2rem** from 48rem (768px) up.
- Sizes are rounded to whole pixels with `round(…, 1px)`. All measured sizes were integers.
- The step is a custom property, so children inherit it. The *size* is recomputed from base and step rather than inherited as a size, so sizes never compound the way nested `em` values do. A `<strong>` inside a paragraph is the same size as the paragraph.

### 3.2 Steps by element

| Element | Step | Desktop size |
|---|---|---|
| Body text | 1 | 24px |
| h3 | 2 | 30px |
| h2 | 3 | 38px |
| h1 | 5 → 7 (fluid, see 3.3) | 97px at ≥1280px |
| Nav links, hgroup subtext | 0.5 | 22px |
| Post-list titles | 0.4 | 21px |
| Teaser text | 0.1 | 20px |
| Dates (`<time>`) | 0 | 19px |

Ratios on desktop: h1 ≈ 4× body, h2 ≈ 1.59× body, h3 = 1.26× body.

### 3.3 The fluid h1: turning a length into a number

Only the h1 changes size continuously between 768px and 1280px. Its step moves from 5 to 7 using a viewport-driven `clamp()` written in `rem`. The `tan(atan2(<length>, 1px))` trick converts that length into a plain unitless number, which `pow()` needs as an exponent.

That `clamp()` is `clamp(0.3125rem, 0.2636rem + 0.2174vw, 0.4375rem)`. At a 16px root, 0.3125rem is 5px and 0.4375rem is 7px, so the step runs from 5 to 7. The formula gives step ≈ 5.89 at 768px and ≈ 6.44 at 1024px, which reproduces the measured 75px and 85px. In print, the post heading is pinned to step 5.

### 3.4 Spacing

Spacing tokens come from `clamp(0.5rem, 0.3333rem + 0.8333vw, 1rem) × 1.414^n`, which is 16px at ≥1280px:

| Token | n | At 1280px |
|---|---|---|
| xs | −1 | 11.3px |
| s | 0 | 16px |
| m | 1 | 22.6px |
| l | 2 | 32px |
| xl | 3 | 45.2px |

I measured 22.6px paragraph and h2 bottom margins on the live site. h2 and h3 margins are defined as xl above and m (h2) or xs (h3) below.

### 3.5 Line height and measure

- Line height is unitless and falls as size rises: 1.7 → 1.5 → 1.2 → 0.95.
- Paragraphs, lists and blockquotes get `max-inline-size: 54rem`. The measure comes out near 73–74 characters per line at full width.
- Headings use `text-wrap: balance`, which is why the h1 breaks into even lines.
- The site's own small details: nav links are uppercase, weight 600, 1px letter-spacing; dates and list titles use 0.5px.

### 3.6 Where it lives

The scale mechanism is part of Oli, Matuzo's own no-class CSS framework (he presents it in his March 2026 Web Day Out talk "Breaking with habits"). It ships in a stylesheet named `hanni.min.css` in the site's third-party folder; Hanni is his web component library, and the `--oli-` and `--hni-` prefixes come from those two projects. The site's `settings.css` supplies the values (ratio 1.26, base sizes, h1 range, spacing tokens). Its breakpoint switch for the base size uses a container style query, not a media query.

## 4. Whitespace

Section 3.4 lists the spacing tokens. This section covers how they behave and where they are applied.

### 4.1 Fluid, not stepped

Type steps once at 768px (plus the fluid h1). Whitespace changes continuously. The spacing base is `clamp(0.5rem, 0.3333rem + 0.8333vw, 1rem)`: 8px at about 320px wide and below, 16px at 1280px and above, linear in between.

Calculated from the formulas, not measured (the one check I did make matches: paragraph margins of 22.6px at desktop and 11.3px at a narrow width):

| Width | Base (s) | xs | m | l | xl | Section margin (n = 4.5) |
|---|---|---|---|---|---|---|
| 375px | 8.5px | 6.0px | 12.0px | 16.9px | 23.9px | 40px |
| 768px | 11.7px | 8.3px | 16.6px | 23.5px | 33.2px | 56px |
| 1024px | 13.9px | 9.8px | 19.6px | 27.7px | 39.2px | 66px |
| 1280px+ | 16px | 11.3px | 22.6px | 32px | 45.2px | 76px |

### 4.2 Where the tokens are used (observed)

- Paragraph and h2 bottom margins use **m** (measured 22.6px at 1280px).
- Post-list item titles use **s** (measured 16px at 1280px).
- **h2** has xl above and m below, a 2:1 ratio. **h3** has xl above and xs below, a 4:1 ratio. A heading therefore sits much closer to the content it introduces than to what precedes it.
- Section breaks use a larger **4.5-step** margin (about 76px at 1280px).

### 4.3 What is not on the scale

Some dimensions are fixed `rem` values read from the framework's variables: page padding (4rem at wide widths; the text column is 343px wide in a 375px viewport, so phones get roughly 16px each side), the sidebar column (20rem), content width (54rem), page width (80rem) and list gaps (0.3rem). The scale governs the gaps between things. The page frame is built from fixed `rem` dimensions.

### 4.4 Relationship to the type scale

Both scales are octave-based, so sizes and gaps feel related. It is not a baseline grid, though. A 22.6px paragraph gap does not divide into a 40.8px line height. The rhythm comes from ratios, and nothing snaps to a fixed line unit.

### 4.5 Applying it

- Choose steps by relationship: xs or s inside a group, m between paragraphs and blocks, l or xl before headings, the section margin for major breaks.
- Use tokens for every `margin-block`, `padding` and `gap`, and avoid raw `px` values.
- Keep frame dimensions (columns, max widths) in `rem`.

### 4.6 Not verified

My attempt to tally every margin, padding and gap on the page against the tokens did not complete (the browser connection dropped). How consistently every component uses the tokens is therefore unconfirmed.

## 5. Why it reads so well

- **Large body text.** 24px on desktop, 20px on phones.
- **Leading that follows size.** Generous for paragraphs, tight for display type.
- **Few, related sizes.** Every size is a power of one ratio, so nothing feels arbitrary.
- **Even headings.** `text-wrap: balance` removes stray words.
- **High contrast, few weights.** Hierarchy comes mostly from size, not weight.

## 6. Reconstruction

Tested: the font-size part below reproduced all four rows of the table in section 2 (375, 768, 1024, 1280px) in the browser. The spacing tokens were checked by arithmetic against the site's measured margins but were not run as part of the snippet.

```css
:root {
  --type-scale: 1.26;   /* 2^(1/3): three steps double a size */
  --type-base: 1rem;    /* phones */
  --space-scale: 1.414; /* 2^(1/2): two steps double a gap */
  --space-base: clamp(0.5rem, 0.3333rem + 0.8333vw, 1rem);
  --measure: 54rem;

  /* h1 step runs 5 → 7. tan(atan2(length, 1px)) turns the length into a number. */
  --h1-step: tan(atan2(clamp(0.3125rem, 0.2636rem + 0.2174vw, 0.4375rem), 1px));

  --space-xs: calc(var(--space-base) * pow(var(--space-scale), -1));
  --space-m:  calc(var(--space-base) * pow(var(--space-scale), 1));
  --space-xl: calc(var(--space-base) * pow(var(--space-scale), 3));
}

@media (min-width: 48rem) {
  :root { --type-base: 1.2rem; }
}

/* Not on :root, so html keeps the user's 16px and rem stays meaningful. */
:where(body, body *) {
  font-size: round(calc(var(--type-base) * pow(var(--type-scale), var(--step, 0))), 1px);
}

body { --step: 1; line-height: 1.7; }
h1   { --step: var(--h1-step); line-height: 0.95; }
h2   { --step: 3; line-height: 1.2; margin-block: var(--space-xl) var(--space-m); }
h3   { --step: 2; line-height: 1.2; margin-block: var(--space-xl) var(--space-xs); }
h1, h2, h3 { font-weight: 600; text-wrap: balance; }

:is(ul, ol) { line-height: calc(1.7 - 0.2); }
p, ul, ol, blockquote { max-inline-size: var(--measure); margin-block: 0 var(--space-m); }

nav a { --step: 0.5; text-transform: uppercase; letter-spacing: 1px; font-weight: 600; }
```

### Tailwind v4 / Nuxt (untested)

```css
@theme {
  --text-step-0: round(calc(var(--type-base) * pow(var(--type-scale), 0)), 1px);
  --text-step-1: round(calc(var(--type-base) * pow(var(--type-scale), 1)), 1px);
  --text-step-1--line-height: 1.7;
  --text-step-2: round(calc(var(--type-base) * pow(var(--type-scale), 2)), 1px);
  --text-step-3: round(calc(var(--type-base) * pow(var(--type-scale), 3)), 1px);
  --text-step-3--line-height: 1.2;
}
```

- Keep `--type-base` and its media query on `:root`, as above.
- Add new `step-*` names instead of overriding `text-sm` and friends, so component libraries that use those utilities stay unchanged.

Spacing tokens (also untested), reusing the `--space-*` variables from the reconstruction above:

```css
@theme inline {
  --spacing-xs: var(--space-xs);
  --spacing-m:  var(--space-m);
  --spacing-xl: var(--space-xl);
}
```

## 7. Gotchas

- **Don't apply the font-size rule to `:root`.** Changing the root's size would change what every `rem` means.
- **The h1 step depends on `rem`.** My reading of the maths: if a user raises their browser base size, the h1 step also rises above 5–7, so the h1 grows faster than proportionally. I did not test this.
- **Browser support.** `pow()`, `atan2()`, `tan()` and `round()` are in all recent evergreen browsers, with `round()` the newest. Check support tables before shipping.
- **No `font-display`** is set on the site's fonts, so loading uses the browser default.

## 8. Relation to the Web Accessibility Cookbook

Chapter 5, recipe 5.3 ("Work with Units and Sizes") of the book covers the principles this site follows: `rem` over `px`, never shrinking running text below 16px, growing text on larger screens, line height of 1.5–2 for running text decreasing as size grows, and a line length of at most 60–80 characters. The book does not cover modular scales, `pow()`/`clamp()` type systems, `text-wrap: balance` or `text-size-adjust`.

### Whitespace hints in the book

White space is not a topic of its own in the book. These are the places it comes up:

- **Line height** (recipe 5.3): generous leading helps people track lines, and it should shrink as text grows. This is the closest the book gets to whitespace guidance.
- **Headings and white space** (Chapter 2): headings combined with white space create a clear hierarchy, illustrated with the Set Studio website.
- **Units for spacing** (recipe 5.3): relative units are recommended generally, but the book cites an argument that `px` can be better for margin and padding because growing spacing eats screen space. It leaves the decision to testing. This site's fluid `rem` tokens take the other side of that trade-off.
- **Padding in `em`** (recipe 5.3): a button's padding scales with its font size, the same idea as scaling space with type.
- **Target size and focus space** (Chapters 3, 6 and 7): WCAG 2.2's 24×24 CSS pixel minimum, padding to enlarge link targets, and `outline-offset` to leave a gap before the focus ring.
- **Proximity** (Chapter 9): instructions sit close to their label and input, and related controls are grouped with `fieldset`.

The book has no spacing scales, fluid spacing or vertical rhythm. It also never mentions WCAG 1.4.12 (Text Spacing), which requires layouts to survive users overriding line, paragraph, letter and word spacing. That is worth testing against fixed-height containers.
