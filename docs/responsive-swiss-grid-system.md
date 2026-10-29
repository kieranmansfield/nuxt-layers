# Responsive Swiss Grid System for the Web

## Purpose

This document defines a web-native adaptation of Josef Müller-Brockmann's grid methodology from _Grid Systems in Graphic Design_.

The goal is **not** to reproduce a fixed 12-column print grid. Instead, the system treats the browser viewport as a responsive canvas and derives a two-dimensional grid from that canvas.

The core idea is:

> **The grid is a function of the canvas.**

The system provides:

- A viewport-oriented canvas
- Responsive logical margins
- A configurable two-dimensional grid
- Independent inline and block grid density
- Named grid lines
- Nested `subgrid` participation
- Container query units for local grid geometry
- Viewport units for canvas-level geometry
- Fluid spacing
- Semantic, coordinate-based placement
- A clear separation between page structure and component layout

---

# 1. Design Philosophy

Müller-Brockmann's grids are best understood as **coordinate systems**, not simply collections of columns.

A grid establishes:

- vertical divisions
- horizontal divisions
- margins
- gutters
- modules
- alignment points
- repeatable relationships

The web introduces a major difference from print:

> The canvas is not fixed.

A printed page might always be a particular physical size. A web canvas may be:

- 390 × 844px
- 768 × 1024px
- 1440 × 900px
- 1920 × 1080px
- 2560 × 1440px
- or an arbitrarily sized browser window

Therefore the grid should adapt to the canvas rather than forcing the canvas into a fixed grid.

---

# 2. System Model

The system has four conceptual layers:

```text
VIEWPORT
    ↓
CANVAS
    ↓
MASTER GRID
    ↓
SECTIONS / CONTENT
```

More precisely:

```text
┌───────────────────────────────────────────┐
│                 VIEWPORT                  │
│                                           │
│     responsive outer margins              │
│                                           │
│   ┌───────────────────────────────────┐   │
│   │              CANVAS               │   │
│   │                                   │   │
│   │   ┌───────────────────────────┐   │   │
│   │   │        MASTER GRID        │   │   │
│   │   │                           │   │   │
│   │   │    ┌───────────────┐      │   │   │
│   │   │    │    SECTION    │      │   │   │
│   │   │    │   subgrid     │      │   │   │
│   │   │    └───────────────┘      │   │   │
│   │   │                           │   │   │
│   │   └───────────────────────────┘   │   │
│   │                                   │   │
│   └───────────────────────────────────┘   │
│                                           │
└───────────────────────────────────────────┘
```

---

# 3. Coordinate Systems

The system deliberately uses different CSS units for different conceptual responsibilities.

## 3.1 Viewport units

Use logical viewport units for the **canvas**:

```css
vi
vb
```

Where:

- `vi` = 1% of the viewport's inline dimension
- `vb` = 1% of the viewport's block dimension

These are appropriate for:

- outer margins
- full-viewport sections
- canvas dimensions
- viewport-relative spacing

Example:

```css
.canvas {
  padding-inline: clamp(1rem, 5vi, 8rem);
}
```

---

## 3.2 Container query units

Use container units for **grid-local geometry**:

```css
cqi
cqb
```

Where:

- `cqi` = 1% of the query container's inline dimension
- `cqb` = 1% of the query container's block dimension

This allows the grid to reason about its own available dimensions rather than assuming it always occupies the viewport.

Example:

```css
.canvas {
  container-type: size;
}

.grid {
  --gutter-inline: 1cqi;
  --gutter-block: 1cqb;
}
```

---

# 4. The Canvas

The canvas is the foundational layout container.

It represents the available design surface.

A basic implementation:

```css
.canvas {
  container-type: size;

  padding-inline: clamp(1rem, 5vi, 8rem);
  min-block-size: 100vb;
}
```

The canvas therefore provides:

1. A responsive viewport-relative boundary
2. A container-query context
3. A consistent place to establish the master grid

A dedicated `.canvas` element is preferable to relying directly on `body` as the query container because it provides a predictable, explicit layout boundary.

---

# 5. Responsive Margins

Margins should be considered part of the grid system rather than arbitrary component styling.

Use logical properties:

```css
padding-inline
padding-block
margin-inline
margin-block
```

Avoid relying on physical properties such as:

```css
padding-left
padding-right
margin-left
margin-right
```

unless there is a specific reason to do so.

Example:

```css
.canvas {
  padding-inline: clamp(1rem, 5vi, 8rem);

  padding-block-start: clamp(2rem, 8vb, 10rem);
}
```

The result is a responsive version of the traditional print margin.

---

# 6. Two-Dimensional Grid Density

The master grid is defined by two independent variables:

```css
.canvas {
  --grid-density-inline: 12;
  --grid-density-block: 8;
}
```

These variables represent:

- `--grid-density-inline`: number of vertical divisions
- `--grid-density-block`: number of horizontal divisions

This is deliberately **not** called `--grid-columns`.

The grid is fundamentally two-dimensional.

For example:

```css
--grid-density-inline: 12;
--grid-density-block: 8;
```

creates a:

```text
12 × 8
```

modular field.

---

# 7. Grid Mathematics

The dimensions of a module are derived from the available canvas.

Conceptually:

```text
module width =
available inline space / inline density

module height =
available block space / block density
```

For a 12 × 8 grid, the browser determines the resulting track dimensions from the available space, density and gutters.

The grid therefore does not need a fixed physical cell size.

The cell size emerges from:

```text
canvas dimensions
+ margins
+ gutters
+ grid density
```

This is the fundamental responsive adaptation.

---

# 8. Master Grid

A master grid can be established using CSS Grid.

Example:

```css
.canvas {
  --grid-density-inline: 12;
  --grid-density-block: 8;

  --grid-gutter-inline: 1cqi;
  --grid-gutter-block: 1cqb;

  display: grid;

  grid-template-rows:
    [canvas-top content-top]
    repeat(var(--grid-density-block), [row-start] minmax(0, 1fr) [row-end])
    [content-bottom canvas-bottom];

  grid-template-columns:
    [canvas-start content-start]
    repeat(var(--grid-density-inline), [column-start] minmax(0, 1fr) [column-end])
    [content-end canvas-end];

  column-gap: var(--grid-gutter-inline);
  row-gap: var(--grid-gutter-block);

  container-type: size;
}
```

This establishes the fundamental coordinate system.

---

# 9. Named Grid Lines

Named lines are an important part of the system.

They allow layout to describe **relationships and positions** rather than arbitrary dimensions.

For example:

```css
grid-column: content-start / column-end;
```

or:

```css
grid-row: content-top / row-end;
```

Named lines can also be used with explicit indices:

```css
grid-column: column-start 2 / column-end 7;
```

```css
grid-row: row-start 2 / row-end 5;
```

This provides a coordinate language for the design.

---

# 10. Why Named Lines Matter

Without named lines:

```css
.hero {
  grid-column: 2 / 8;
}
```

The numbers are relatively opaque.

With named lines:

```css
.hero {
  grid-column: column-start 2 / column-end 8;
}
```

the intent is clearer.

Semantic boundary names can also be established:

```css
[canvas-start content-start]
...
[content-end canvas-end]
```

This makes the grid's coordinate system explicit.

---

# 11. Master Grid vs Component Grid

The system should not force every component to participate in the master grid.

Instead, use a hierarchy:

```text
Canvas
│
├── Master Grid
│
├── Section ── subgrid
│   ├── Content
│   └── Content
│
├── Section ── subgrid
│   ├── Content
│   └── Content
│
└── Section ── subgrid
    ├── Content
    └── Content
```

The master grid establishes the page coordinate system.

Sections that require alignment with that system participate through `subgrid`.

Components that do not need that alignment can use normal Grid or Flexbox internally.

---

# 12. Subgrid

`subgrid` allows a nested grid to inherit the tracks of its parent.

Example:

```css
.hero {
  display: grid;
  grid-template-rows: subgrid;

  grid-template-columns: subgrid;
  grid-row: row-start 1 / row-end 5;
  grid-column: column-start 1 / column-end 8;
}
```

The hero is therefore not creating a second approximation of the master grid.

It is participating in the same coordinate system.

Conceptually:

```text
MASTER GRID

┌───┬───┬───┬───┬───┬───┐
│   │   │   │   │   │   │
│ ┌───────────────┐     │
│ │               │     │
│ │     HERO      │     │
│ │               │     │
│ └───────────────┘     │
│   │   │   │   │   │   │
└───┴───┴───┴───┴───┴───┘
```

The internal hero content can align directly with the master grid.

---

# 13. Subgrid Principle

Use `subgrid` at **structural boundaries**, not indiscriminately.

Good candidates:

- hero sections
- editorial sections
- major page sections
- complex compositions
- navigation regions
- layouts where typography must align with unrelated content

Less appropriate:

- small buttons
- simple cards
- isolated controls
- components whose layout is entirely self-contained

The principle is:

> Use the master grid for composition; use local layout systems for components.

---

# 14. Responsive Density

Grid density can change between broad layout regimes.

For example:

```css
.canvas {
  --grid-density-inline: 6;
  --grid-density-block: 8;
}

@media (min-width: 48rem) {
  .canvas {
    --grid-density-inline: 8;
    --grid-density-block: 8;
  }
}

@media (min-width: 64rem) {
  .canvas {
    --grid-density-inline: 12;
    --grid-density-block: 8;
  }
}

@media (min-width: 90rem) {
  .canvas {
    --grid-density-inline: 16;
    --grid-density-block: 10;
  }
}
```

The important distinction is:

> Breakpoints determine the **grid regime**; fluid CSS determines the dimensions within that regime.

This avoids continuously changing the number of columns for trivial viewport changes.

---

# 15. Density Is More Important Than Column Count

The fundamental configuration should be:

```css
--grid-density-inline
--grid-density-block
```

rather than:

```css
--grid-columns
```

The number of columns is only one consequence of the grid's structure.

A two-dimensional density model better reflects modular grid construction.

---

# 16. Fluid Gutters

Gutters should also derive from the canvas.

Example:

```css
.canvas {
  --grid-gutter-inline: clamp(0.5rem, 1cqi, 2rem);

  --grid-gutter-block: clamp(0.5rem, 1cqb, 2rem);
}
```

Then:

```css
.grid {
  column-gap: var(--grid-gutter-inline);
  row-gap: var(--grid-gutter-block);
}
```

This means gutters scale with the available grid field.

---

# 17. Grid Density vs Automatic Fitting

There are two related but different concepts.

## Explicit density

```css
--grid-density-inline: 12;
```

This gives deliberate art direction.

Use this for a Müller-Brockmann-inspired master grid where the designer intentionally chooses the modular structure.

## Automatic fitting

CSS Grid can also determine how many tracks fit:

```css
grid-template-columns: repeat(auto-fit, minmax(var(--module), 1fr));
```

This is useful for fluid component grids.

However, automatic fitting makes named coordinates less predictable because the number of tracks changes continuously.

Therefore:

> Use explicit density for the master grid and `auto-fit` where automatic component-level adaptation is desirable.

---

# 18. Recommended Architecture

A practical architecture is:

```text
                    VIEWPORT
                       │
                       ▼
              ┌────────────────┐
              │     CANVAS      │
              │                │
              │ vi / vb        │
              │ margins        │
              └───────┬────────┘
                      │
                      ▼
              ┌────────────────┐
              │   MASTER GRID  │
              │                │
              │ cqi / cqb      │
              │ density        │
              │ gutters        │
              │ named lines    │
              └───────┬────────┘
                      │
            ┌─────────┼─────────┐
            ▼         ▼         ▼
         Section   Section   Section
         subgrid   subgrid   subgrid
            │         │         │
            ▼         ▼         ▼
        Components Components Components
```

---

# 19. Suggested CSS Foundation

A starting implementation:

```css
@layer grid {
  .canvas {
    --grid-density-inline: 12;
    --grid-density-block: 8;

    --grid-gutter-inline: clamp(0.5rem, 1cqi, 2rem);

    --grid-gutter-block: clamp(0.5rem, 1cqb, 2rem);

    display: grid;

    grid-template-rows:
      [canvas-top content-top]
      repeat(var(--grid-density-block), [row-start] minmax(0, 1fr) [row-end])
      [content-bottom canvas-bottom];

    grid-template-columns:
      [canvas-start content-start]
      repeat(var(--grid-density-inline), [column-start] minmax(0, 1fr) [column-end])
      [content-end canvas-end];

    column-gap: var(--grid-gutter-inline);
    row-gap: var(--grid-gutter-block);

    container-type: size;

    padding-inline: clamp(1rem, 5vi, 8rem);

    min-block-size: 100vb;
  }
}
```

---

# 20. Example HTML

```html
<main class="canvas">
  <section class="hero">
    <h1>Swiss Grid</h1>
    <p>A responsive modular grid for the web.</p>
  </section>

  <section class="intro">
    <p>Content aligned to the master coordinate system.</p>
  </section>
</main>
```

---

# 21. Example Section

```css
.hero {
  display: grid;
  grid-template-rows: subgrid;

  grid-template-columns: subgrid;

  grid-row: row-start 1 / row-end 5;
  grid-column: column-start 1 / column-end 9;
}
```

Child content can then occupy the inherited tracks.

```css
.hero h1 {
  grid-row: row-start 1 / row-end 3;
  grid-column: column-start 1 / column-end 7;
}
```

This means the typography itself is positioned according to the master coordinate system.

---

# 22. Layout Vocabulary

The system should encourage developers and designers to think in terms of:

- canvas
- field
- margin
- gutter
- module
- density
- track
- line
- span
- coordinate
- section
- subgrid

Avoid making:

- `12-column`
- `desktop grid`
- `mobile grid`
- `component width`

the fundamental concepts.

The grid is a **system of relationships**.

---

# 23. Relationship to Flexbox

Flexbox remains appropriate for one-dimensional component layouts.

Use:

```text
Grid
    → page composition
    → modular layouts
    → two-dimensional alignment

Subgrid
    → inherited page alignment

Flexbox
    → component internals
    → navigation
    → buttons
    → small one-dimensional groups
```

The system is not intended to eliminate Flexbox.

It gives Grid responsibility for the **spatial composition** of the page.

---

# 24. Relationship to CSS Columns

CSS Multi-column Layout can be used where the content itself should flow through columns.

This is particularly useful for:

- editorial text
- long-form prose
- magazine-like layouts
- Swiss editorial compositions

For example:

```css
.article {
  column-gap: var(--grid-gutter-inline);
  columns: 3;
}
```

This should generally be considered a **content-flow mechanism**, rather than a replacement for the master Grid.

---

# 25. Responsive Rules

The system should follow these rules:

### Rule 1 — The viewport is the canvas

Use `vi` and `vb` for viewport-level geometry.

### Rule 2 — The canvas establishes the grid container

Use an explicit container element.

### Rule 3 — Grid density is two-dimensional

Use:

```css
--grid-density-inline
--grid-density-block
```

### Rule 4 — Cell dimensions are derived

Do not hard-code physical module dimensions unless deliberately art-directed.

### Rule 5 — Margins are part of the system

Use responsive logical padding.

### Rule 6 — Named lines describe coordinates

Prefer meaningful grid-line names where they improve composition.

### Rule 7 — Subgrid maintains alignment

Use `subgrid` for structural sections that need to remain aligned with the master grid.

### Rule 8 — Components remain autonomous where appropriate

Do not force every component into the master grid.

### Rule 9 — Breakpoints change grid regimes

Do not introduce breakpoints for every small layout change.

### Rule 10 — Fluidity happens within the grid regime

Use `clamp()`, container units, viewport units and flexible tracks to handle continuous variation.

---

# 26. Conceptual CSS Unit Strategy

The overall system can be summarised as:

```text
CANVAS
  vi / vb
       ↓
RESPONSIVE MARGINS
  vi / vb
       ↓
MASTER GRID
  cqi / cqb
       ↓
DENSITY
  inline × block
       ↓
NAMED LINES
  coordinate system
       ↓
SUBGRID
  inherited coordinates
       ↓
COMPONENTS
  Grid / Flexbox
```

This gives each unit and layout primitive a clear responsibility.

---

# 27. Design Goal

The ultimate goal is not:

> "Make a responsive 12-column grid."

The goal is:

> **Create a responsive coordinate system in which the relationships of a Swiss modular grid survive the transition from fixed print media to an infinitely variable web canvas.**

The browser supplies the fluid canvas.

CSS Grid supplies the two-dimensional coordinate system.

Named lines supply the vocabulary.

`subgrid` allows that vocabulary to propagate through structural sections.

Container units allow local geometry to respond to the available field.

Viewport units define the relationship between the design and the browser itself.

Together, these form a modern web-native interpretation of the Müller-Brockmann approach.
