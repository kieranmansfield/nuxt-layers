# Modern CSS Architecture Standard

## Nuxt 4 + Vue + Nuxt UI + Tailwind

**Status:** Proposed  
**Version:** 1.0

A modern, opinionated CSS architecture for Nuxt/Vue applications. Native CSS is the primary styling system; Nuxt UI provides accessible interactive primitives; Tailwind remains installed as a deliberately minimal utility layer.

---

## 1. Core Philosophy

> **Describe relationships, not coordinates.**

The system favours:

- Native CSS over framework abstractions
- Explicit cascade architecture
- Typed custom properties
- OKLCH colours
- Logical properties
- Intrinsic sizing
- Container queries
- Fluid values
- Grid and Flexbox according to their strengths
- Semantic design tokens
- Component CSS over long utility strings
- CSS before JavaScript
- Progressive enhancement
- Accessibility at the foundation

The goal is not to write less CSS. It is to make CSS more meaningful, predictable and composable.

---

# 2. Technology Responsibilities

```text
┌──────────────────────────────────────────────┐
│                   Nuxt App                   │
│  Application structure / routing / data      │
├──────────────────────────────────────────────┤
│                    Vue                       │
│  Components / composition / state            │
├──────────────────────────────────────────────┤
│                  Nuxt UI                     │
│  Accessible interactive primitives           │
├──────────────────────────────────────────────┤
│             Application CSS                  │
│  Design system / layout / components         │
├──────────────────────────────────────────────┤
│             Minimal Tailwind                 │
│  Utility escape hatch                        │
├──────────────────────────────────────────────┤
│                Native CSS                    │
│  Grid / Flex / CQ / @property / etc.         │
└──────────────────────────────────────────────┘
```

### Nuxt

Owns application structure, routing, data and behaviour.

### Vue

Owns component boundaries, APIs and reactive behaviour.

### Nuxt UI

Owns accessible interactive primitives such as buttons, inputs, dialogs, popovers, selects, forms and navigation.

### Application CSS

Owns the visual design language, layout, tokens, typography, responsive behaviour, themes and application-specific components.

### Tailwind

Provides only a small utility surface and remains an implementation detail.

> **Tailwind consumes the design system; it does not define the design system.**

---

# 3. Cascade Layers

Cascade layers are the foundation of the architecture.

```css
@layer reset, tokens, theme, base, layout, components, utilities, overrides;
```

## Layer responsibilities

| Layer        | Purpose                                     |
| ------------ | ------------------------------------------- |
| `reset`      | Browser normalisation                       |
| `tokens`     | Design tokens and `@property` registrations |
| `theme`      | Theme-specific values                       |
| `base`       | Global element/document styles              |
| `layout`     | Layout primitives and page structure        |
| `components` | Application components                      |
| `utilities`  | Small utilities and minimal Tailwind        |
| `overrides`  | Explicit exceptions                         |

### Rules

**MUST**

- Establish the layer order explicitly.
- Keep authored application CSS inside named layers.
- Keep layer responsibilities clear.

**SHOULD**

- Use nested layers only for meaningful cascade boundaries.
- Use layers instead of specificity escalation.

**MUST NOT**

- Depend on accidental source-order precedence.
- Scatter important styles outside the layer architecture.

---

# 4. Design Tokens

Design tokens form the vocabulary of the system.

Prefer semantic tokens:

```css
--color-surface
--color-text
--color-text-muted
--color-border
--color-accent

--space-xs
--space-sm
--space-md
--space-lg
--space-xl

--radius-sm
--radius-md
--radius-lg
```

Avoid implementation-oriented names:

```css
--blue-500
--gray-900
--padding-17
```

Semantic tokens allow themes and components to change independently of raw values.

---

# 5. Typed Custom Properties

Use `@property` for custom properties representing known CSS types.

```css
@property --color-accent {
  syntax: '<color>';
  inherits: true;
  initial-value: oklch(65% 0.2 250);
}

@property --space-md {
  syntax: '<length>';
  inherits: true;
  initial-value: 1rem;
}

@property --opacity {
  syntax: '<number>';
  inherits: false;
  initial-value: 1;
}
```

Then:

```css
:root {
  --color-accent: oklch(65% 0.2 250);
  --space-md: 1rem;
  --opacity: 1;
}
```

### Rule

> **Semantic custom properties MUST be typed whenever an appropriate CSS syntax exists.**

Benefits include validation, explicit intent, interpolation and improved animation behaviour.

String-like values that genuinely have no useful CSS type may remain unregistered.

---

# 6. Colour System

OKLCH is the canonical authored colour space.

Use:

```css
color: oklch(95% 0.01 250);
background: oklch(15% 0.02 250);
border-color: oklch(70% 0.12 250);
```

Avoid authored:

```css
#ffffff
rgb(255 255 255)
hsl(210 50% 50%)
```

unless required for interoperability.

Allowed contextual values include:

```css
currentColor
transparent
inherit
initial
unset
```

## Colour derivation

Prefer modern colour operations:

```css
color-mix(
  in oklch,
  var(--color-accent),
  white 20%
)
```

rather than creating unnecessary derived tokens.

---

# 7. Logical Properties

Logical properties are the default.

Prefer:

```css
margin-inline
margin-block

padding-inline
padding-block

inset-inline
inset-block

inline-size
block-size

min-inline-size
max-inline-size
```

over:

```css
margin-left
margin-right
padding-left
padding-right
width
height
top
right
```

### Rule

> **Physical properties MUST only be used where a physical coordinate is genuinely required.**

This makes components more portable across writing modes and directions.

---

# 8. Units

Use the unit that represents the dependency of the value.

| Dependency                | Preferred unit         |
| ------------------------- | ---------------------- |
| Root typography           | `rem`                  |
| Text-relative sizing      | `em`                   |
| Container-relative sizing | `cqi`, `cqw`           |
| Viewport composition      | `vw`, `vh`, `vi`, `vb` |
| Fixed design geometry     | `rem`                  |
| Grid distribution         | `fr`                   |
| Relative sizing           | `%`                    |
| Fluid values              | `clamp()`              |
| Calculated values         | `calc()`               |
| Bounds                    | `min()` / `max()`      |

Do not convert everything to a single unit.

Ask:

> **What should this value respond to?**

---

# 9. Fluid Design

Prefer fluid values over breakpoint-driven scaling.

```css
font-size: clamp(1rem, 2cqi, 1.5rem);
```

```css
padding-inline: clamp(var(--space-md), 4cqi, var(--space-xl));
```

Avoid unnecessary breakpoint staircases:

```css
padding-inline: 1rem;

@media (min-width: 768px) {
  padding-inline: 2rem;
}

@media (min-width: 1200px) {
  padding-inline: 3rem;
}
```

Breakpoints should primarily describe **structural changes**, not simple changes in scale.

---

# 10. Intrinsic Sizing

Prefer intrinsic CSS behaviour.

Useful primitives include:

```css
min-content
max-content
fit-content()
minmax()
auto-fit
auto-fill
```

Example:

```css
.card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 20rem), 1fr));
}
```

Intrinsic layout should be preferred when it eliminates unnecessary responsive rules.

---

# 11. Container Queries

Components should respond to their available space rather than the viewport where possible.

```css
.component {
  container-type: inline-size;
}
```

```css
@container (inline-size > 40rem) {
  .component {
    ...
  }
}
```

### Principle

> **Components should be portable. Their layout should depend on their container rather than the page containing them.**

Use media queries when the condition genuinely concerns the viewport or environment.

Good examples:

```css
@media (prefers-reduced-motion: reduce) @media (hover: hover) @media (pointer: coarse);
```

---

# 12. Grid and Flexbox

Use Grid for two-dimensional relationships:

```css
.layout {
  display: grid;
  grid-template-columns:
    [full-start]
    minmax(0, 1fr)
    [content-start]
    minmax(0, 70rem)
    [content-end]
    minmax(0, 1fr)
    [full-end];
}
```

Use Flexbox for one-dimensional relationships:

```css
.actions {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
}
```

> **Choose the layout model based on the relationship being expressed, not habit.**

---

# 13. Spacing and `gap`

Use `gap` when spacing belongs to the parent layout context.

Prefer:

```css
.stack {
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
}
```

over:

```css
.stack > * + * {
  margin-block-start: var(--space-md);
}
```

Margins remain appropriate when describing an element's external relationship with surrounding content.

---

# 14. Layout Primitives

A small set of semantic layout primitives may be useful:

```text
container
stack
cluster
grid
sidebar
split
center
cover
```

Example:

```css
@layer layout {
  .stack {
    display: flex;
    flex-direction: column;
    gap: var(--stack-gap, var(--space-md));
  }

  .cluster {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: var(--cluster-gap, var(--space-md));
  }
}
```

These abstractions are intentionally higher-level than atomic utility classes.

---

# 15. Components

Components are the primary application-level styling abstraction.

Prefer:

```html
<article class="card"></article>
```

over constructing a component from a long utility string.

Example:

```css
@layer components {
  .card {
    display: grid;
    gap: var(--space-md);

    border: 1px solid var(--color-border);
    border-radius: var(--radius-lg);

    background: var(--color-surface);
    padding: var(--space-lg);
    color: var(--color-text);
  }
}
```

Components consume the shared design tokens.

---

# 16. Component State

State should be explicit.

Prefer:

```html
<div class="card" data-state="error"></div>
```

over:

```html
<div class="card card-active card-error card-loading"></div>
```

Then:

```css
.card[data-state='error'] {
  border-color: var(--color-error);
}
```

Data attributes are particularly useful when state is meaningful to both CSS and application logic.

---

# 17. Specificity

Keep specificity low and predictable.

Useful tools:

```css
:where(.card) {
  ...
}
```

```css
:is(.card, .panel) {
  ...
}
```

Avoid:

- IDs for styling
- Deep selector nesting
- Specificity escalation
- Selector chains dependent on DOM depth
- `!important` as a normal mechanism

> **Use cascade layers to control priority instead of specificity wars.**

---

# 18. `!important`

`!important` should not be a normal styling mechanism.

When priority is wrong:

1. Fix the layer.
2. Fix component ownership.
3. Fix the selector.
4. Use an explicit override layer.

Exceptional uses may be permitted for accessibility or third-party integration.

---

# 19. Motion

Motion should be tokenised.

```css
@property --duration-fast {
  syntax: '<time>';
  inherits: false;
  initial-value: 150ms;
}

@property --ease-standard {
  syntax: '<easing-function>';
  inherits: false;
  initial-value: ease;
}
```

Then:

```css
transition:
  transform var(--duration-fast) var(--ease-standard),
  opacity var(--duration-fast) var(--ease-standard);
```

Never use:

```css
transition: all 200ms ease;
```

Transitions should name the properties that actually animate.

---

# 20. Accessibility

Accessibility is part of the foundation.

The architecture should account for:

- Keyboard navigation
- Visible focus
- Reduced motion
- Forced colours
- Contrast
- Input modality
- Text scaling
- Touch targets
- Writing direction

Example:

```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

Interactive accessibility should primarily be handled by the component system rather than recreated through CSS.

---

# 21. Progressive Enhancement

Use modern CSS directly where appropriate.

Use `@supports` for features that genuinely need a fallback:

```css
@supports (interpolate-size: allow-keywords) {
  .accordion {
    interpolate-size: allow-keywords;
  }
}
```

Avoid unnecessary legacy browser workarounds.

---

# 22. CSS Before JavaScript

Before using JavaScript for presentation or layout, consider native CSS capabilities:

```text
Grid
Flexbox
Container Queries
:has()
:is()
:where()
attr()
calc()
min()
max()
clamp()
color-mix()
relative colours
Anchor Positioning
Scroll-driven Animations
View Transitions
Popover
Dialog
Details/Summary
```

> **JavaScript should provide behaviour, not compensate for missing CSS knowledge.**

---

# 23. Tailwind's Role

Tailwind remains installed because it is useful to Nuxt UI and provides a convenient utility escape hatch.

However:

> **Tailwind is an implementation detail, not the application's design system.**

Avoid:

```html
<div class="flex flex-col gap-6 px-4 md:px-8 lg:px-12 max-w-7xl mx-auto"></div>
```

Prefer:

```html
<div class="page-container"></div>
```

with:

```css
@layer layout {
  .page-container {
    margin-inline: auto;
    inline-size: min(calc(100% - 2 * var(--page-gutter)), var(--content-max));
  }
}
```

---

# 24. Tailwind Utilities

Tailwind is appropriate for genuinely generic, small utilities.

Examples:

```html
<div class="sr-only">
  <div class="hidden">
    <div class="truncate"></div>
  </div>
</div>
```

Potentially:

```html
<div class="flex"></div>
```

when there is no meaningful semantic component abstraction.

Tailwind should not be used as the default method for implementing:

- Design tokens
- Core component styling
- Page architecture
- Complex responsive behaviour
- Themes
- Typography systems
- Component variants

---

# 25. Tailwind and Cascade Layers

Conceptually, Tailwind belongs inside the utility layer:

```text
@layer reset
@layer tokens
@layer theme
@layer base
@layer layout
@layer components
@layer utilities
    ├── Application utilities
    └── Tailwind utilities
@layer overrides
```

The exact Nuxt/Tailwind integration should use the currently supported framework mechanism rather than relying on undocumented implementation details.

The architectural requirement is:

> **Tailwind must not silently become an unstructured cascade outside the application's layer model.**

---

# 26. Nuxt UI Integration

Nuxt UI should provide accessible interactive primitives.

Use it for components such as:

```text
Button
Input
Select
Combobox
Dialog
Popover
Dropdown
Tooltip
Command Palette
Form
Navigation
Date/Time controls
```

Nuxt UI provides important behaviour beyond appearance:

- Accessibility
- Keyboard handling
- Focus management
- ARIA
- Interaction state
- Vue integration

Do not unnecessarily rebuild these primitives.

---

# 27. Nuxt UI and Application CSS

Nuxt UI and application CSS should share the same design language.

```text
                Design Tokens
                     │
          ┌──────────┴──────────┐
          │                     │
      Nuxt UI              Application CSS
          │                     │
          └──────────┬──────────┘
                     │
                 Tailwind
```

The design tokens are the canonical source of truth.

Nuxt UI consumes the relevant theme values.

Application components consume the same values.

---

# 28. Do Not Fight Nuxt UI

Do not attempt to rewrite every generated Nuxt UI class.

Instead:

- Configure Nuxt UI's theme where appropriate.
- Share semantic tokens.
- Use component variants.
- Wrap Nuxt UI components when an application-specific API is valuable.
- Override styles only where necessary.
- Avoid depending on generated internal class names.

The application should depend on the **Nuxt UI component API**, not its implementation details.

---

# 29. Application Component Facade

For important application primitives, wrappers can provide a stable application API.

Example:

```vue
<AppButton />
```

may internally use:

```vue
<UButton />
```

This allows the application to define its own semantics and defaults while Nuxt UI supplies the underlying accessible behaviour.

Wrappers should only exist when they provide meaningful value.

---

# 30. Token Flow

The intended flow is:

```text
Token Definition
       │
       ├── CSS custom property
       │
       ├── @property registration
       │
       ├── Theme value
       │
       ├── Nuxt UI theme
       │
       └── Application components
```

Avoid duplicating the same semantic concept across:

```text
Nuxt UI token
Tailwind token
Application token
Component token
```

There should be one canonical semantic value.

---

# 31. Suggested File Structure

```text
app/
├── assets/
│   └── css/
│       ├── index.css
│       │
│       ├── reset/
│       │   └── index.css
│       │
│       ├── tokens/
│       │   ├── colors.css
│       │   ├── typography.css
│       │   ├── spacing.css
│       │   ├── radii.css
│       │   ├── shadows.css
│       │   ├── motion.css
│       │   └── index.css
│       │
│       ├── theme/
│       │   ├── light.css
│       │   ├── dark.css
│       │   └── index.css
│       │
│       ├── base/
│       │   ├── document.css
│       │   ├── typography.css
│       │   ├── forms.css
│       │   └── accessibility.css
│       │
│       ├── layout/
│       │   ├── container.css
│       │   ├── stack.css
│       │   ├── cluster.css
│       │   ├── grid.css
│       │   └── page.css
│       │
│       ├── components/
│       │   ├── button.css
│       │   ├── card.css
│       │   ├── navigation.css
│       │   └── ...
│       │
│       ├── utilities/
│       │   └── index.css
│       │
│       └── overrides/
│           └── index.css
│
├── components/
│   ├── AppButton.vue
│   ├── AppCard.vue
│   └── ...
│
└── ...
```

---

# 32. Primary Stylesheet

The architecture is declared once:

```css
@layer reset, tokens, theme, base, layout, components, utilities, overrides;
```

The primary stylesheet then loads the system's layers.

The exact Tailwind/Nuxt integration should follow the currently supported mechanism, but the intended cascade remains:

```text
reset
  ↓
tokens
  ↓
theme
  ↓
base
  ↓
layout
  ↓
components
  ↓
utilities
  ↓
overrides
```

---

# 33. Example Component

```css
@layer components {
  @property --card-padding {
    syntax: '<length>';
    inherits: false;
    initial-value: 1rem;
  }

  .card {
    display: grid;
    gap: var(--space-md);

    transition:
      background-color var(--duration-fast) var(--ease-standard),
      border-color var(--duration-fast) var(--ease-standard);
    container-type: inline-size;

    border: 1px solid var(--color-border);
    border-radius: var(--radius-lg);

    background: var(--color-surface);
    padding: var(--card-padding);

    inline-size: 100%;
    color: var(--color-text);
  }

  @container (inline-size > 35rem) {
    .card {
      --card-padding: var(--space-lg);
      grid-template-columns: auto 1fr;
    }
  }

  .card[data-state='error'] {
    border-color: var(--color-error);
  }
}
```

This demonstrates:

- Cascade layers
- Typed properties
- Semantic tokens
- Logical sizing
- Grid
- Container queries
- Explicit state
- Explicit transitions
- Component-first responsiveness
- No dependency on Tailwind

---

# 34. Example Nuxt UI Wrapper

```vue
<script setup lang="ts">
  defineProps<{
    loading?: boolean
  }>()
</script>

<template>
  <UButton class="app-button" :loading="loading">
    <slot />
  </UButton>
</template>
```

Application styling remains semantic:

```css
@layer components {
  .app-button {
    border-radius: var(--radius-md);
    font-weight: var(--font-weight-medium);
  }
}
```

Nuxt UI continues to provide interaction and accessibility.

---

# 35. Rules Summary

## MUST

- Use named cascade layers.
- Establish explicit layer order.
- Keep authored application CSS inside layers.
- Use semantic custom properties.
- Type custom properties where an appropriate CSS syntax exists.
- Use OKLCH for authored colour literals.
- Prefer logical properties.
- Prefer intrinsic sizing.
- Use container queries for component-level responsiveness.
- Use semantic design tokens.
- Keep specificity predictable.
- Prefer CSS over JavaScript for styling/layout.
- Respect accessibility preferences.
- Keep Tailwind limited to utilities.
- Use Nuxt UI for accessible interactive primitives.

## SHOULD

- Prefer fluid values.
- Prefer `gap` for parent-owned spacing.
- Use Grid for two-dimensional layout.
- Use Flexbox for one-dimensional layout.
- Use semantic component classes.
- Use `:where()` to manage specificity.
- Use modern colour functions where useful.
- Use container units where container-relative scaling is appropriate.
- Tokenise motion.
- Use progressive enhancement.
- Wrap Nuxt UI components only when a stable application API is valuable.

## MAY

- Use nested cascade layers.
- Use small Tailwind utilities.
- Use media queries for viewport/environment conditions.
- Use physical properties where genuinely required.
- Use tightly scoped `!important` exceptions.
- Create application-specific layout primitives.

## MUST NOT

- Build the application primarily from long Tailwind utility strings.
- Use IDs for styling.
- Create specificity wars.
- Depend on unlayered application CSS.
- Use `transition: all`.
- Treat Tailwind's default palette as the canonical design-token system.
- Duplicate semantic tokens between Tailwind, Nuxt UI and application CSS.
- Depend on Nuxt UI's generated internal class names.
- Use JavaScript to solve layout problems CSS can solve.
- Create arbitrary tokens simply to hide magic numbers.

---

# 36. Final Mental Model

```text
                 ┌──────────────┐
                 │     Nuxt     │
                 │ Application  │
                 └──────┬───────┘
                        │
                 ┌──────▼───────┐
                 │     Vue      │
                 │  Components  │
                 └──────┬───────┘
                        │
          ┌─────────────┴─────────────┐
          │                           │
 ┌────────▼────────┐        ┌─────────▼────────┐
 │    Nuxt UI       │        │ Application CSS  │
 │                  │        │                  │
 │ Accessibility   │        │ Design system    │
 │ Interaction     │        │ Layout           │
 │ Primitives      │        │ Components       │
 └────────┬────────┘        │ Responsive CSS   │
          │                 └─────────┬────────┘
          │                           │
          └─────────────┬─────────────┘
                        │
                 ┌──────▼───────┐
                 │ Design Tokens│
                 │              │
                 │ @property    │
                 │ OKLCH        │
                 │ Spacing      │
                 │ Typography   │
                 │ Motion       │
                 └──────┬───────┘
                        │
                 ┌──────▼───────┐
                 │   Tailwind   │
                 │ Minimal      │
                 │ Utilities    │
                 └──────┬───────┘
                        │
                 ┌──────▼───────┐
                 │  Native CSS  │
                 └──────────────┘
```

## Final Principle

> **Use native CSS as the design system. Use Nuxt UI for accessible behaviour. Use Tailwind only where a utility genuinely improves the code.**

The architecture should make the correct approach the easy approach.
