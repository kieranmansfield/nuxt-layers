# Claude Layered UI Starter Template Documentation

This document outlines the structure, purpose, and implementation instructions for all layers in the `ui-primitives-layer` and the broader Nuxt Starter Template project. It is intended as a comprehensive reference for maintaining and extending the system.

---

## 1. Layer Overview

### 1.1 UI Primitives Layer

The `ui-primitives-layer` contains the foundational components, types, and composables for all UI elements. This layer is fully reusable across multiple projects.

**Purpose:**

- Provide a consistent, typed design system.
- Encapsulate typography, color, media, and basic UI primitives.
- Enable easy extension and theming.

**Structure:**

```
ui-primitives-layer/
├── components/
│   ├── Typography/
│   │   ├── index.vue           # Base Typography component
│   │   ├── Headline.vue        # Wrapper for h1-h6 with default heading styles
│   │   ├── CodeBlock.vue       # Preformatted code block with font-mono and optional language
│   │   └── QuoteBlock.vue      # Semantic blockquote wrapper
│   ├── Links/
│   │   └── Named.vue           # <ULink> wrapper enforcing named routes
│   └── Media/
│       └── Picture.vue         # <NuxtPicture> wrapper for images with webp/jpg fallback
├── composables/
│   ├── useTypography.ts        # Normalizes typography axes (weight, slant, width, leading, tracking, align, transform)
│   ├── color.ts (useColor)     # Generic color composable mapping UiColors to Tailwind/Nuxt UI classes
│   ├── useTextColor.ts         # Optional thin wrapper around useColor(type='text')
│   └── usePicture.ts           # Returns computed props for <NuxtPicture>
└── types/
    ├── typography.ts          # Typography axis types and props
    └── colors.ts               # Semantic, status, custom, and base colors + ColorUsage type
```

### 1.2 Other Potential Layers (for future expansion)

- **Grid / Layout Layer**
  - Handles containers, breakpoints, spacing, grid systems.
  - Will define: `--container-*`, `--breakpoint-*`, `--spacing-*` variables.

- **Feature Layer**
  - Encapsulates domain-specific components such as `PortfolioItem`, `BlogPostCard`, `GalleryItem`.
  - Can leverage primitives for styling and typography.

- **Theme Layer**
  - Optionally manage light/dark themes.
  - Could map `UiColors` dynamically to CSS variables.

---

## 2. Components

### 2.1 Typography

**index.vue (Typography Base Component)**

- Props: `tag`, `weight`, `width`, `slant`, `leading`, `tracking`, `align`, `transform`.
- Uses `useTypography` to generate class string.
- Default tag: `p`

**Headline.vue**

- Props: `level` (1-6), optional `color`.
- Maps `level` → HTML `h1-h6` tag.
- Uses `Typography` component with default heading styles (`weight-bold`, `leading-tight`, `tracking-tight`).
- Optional `color` prop uses `useColor` composable.

**CodeBlock.vue**

- Semantic `<pre><code>` wrapper.
- Default `font-mono`, `overflow-x-auto`.
- Optional `language` prop → `language-xxx` class for Prism syntax highlighting.
- Optional `color` prop uses `useColor(type='text')`.

**QuoteBlock.vue**

- Semantic `<blockquote>` wrapper.
- Relies on `Typography` defaults.
- `$attrs` forwards any classes or IDs.
- Optional `color` prop uses `useColor(type='text')` if desired.

### 2.2 Links

**Named.vue**

- Wrapper around `<ULink>` from Nuxt UI.
- Enforces named routes rather than `to="/"` strings.
- Supports optional color via `useColor(type='text')`.

### 2.3 Media

**Picture.vue**

- Wrapper for `<NuxtPicture>`.
- Accepts `src`, `alt`, `width`, `height`, `sizes`, `priority`, `class`.
- Optionally uses `usePicture` composable for computed props and responsive defaults.

---

## 3. Composables

### 3.1 Typography

**useTypography.ts**

- Accepts typography axes: `weight`, `width`, `slant`, `leading`, `tracking`, `align`, `transform`.
- Computes Tailwind/Nuxt UI classes.
- Handles numeric and string values (`FontWeightNumber`, `FontLeadingNumber`).

### 3.2 Color

**color.ts / useColor**

- Accepts: `color: UiColors`, `type: ColorUsage ('text' | 'bg' | 'border')`
- Returns computed Tailwind/Nuxt UI class string: `${type}-${colorName}`.
- Fully reactive.
- Can be extended to `useTextColor`, `useBgColor`, `useBorderColor`.

### 3.3 Picture

**usePicture.ts**

- Computes props for `<NuxtPicture>`: responsive sizes, fallback format, priority, optional classes.

---

## 4. Types

### 4.1 Typography Types (`typography.ts`)

```ts
export type FontWeightNumber = 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900
export type FontWeight = 'font-thin' | ... | number
export type FontWidth = 'normal' | 'condensed' | 'expanded'
export type FontSlant = 'normal' | 'italic' | 'oblique'
export type FontLeading = 'leading-none' | ... | number
export type FontTracking = 'tracking-tighter' | ... | number
export type TextAlign = 'left' | 'center' | 'right' | 'justify'
export type TextTransform = 'none' | 'uppercase' | 'lowercase' | 'capitalize'
```

### 4.2 Color Types (`colors.ts`)

```ts
export type ColorUsage = 'text' | 'bg' | 'border'
export type UiSemanticColor = 'dimmed' | 'muted' | 'toned' | 'default' | 'highlighted' | 'inverted'
export type UiStatusColor = 'info' | 'success' | 'warning' | 'error'
export type UiDefaultNuxtUiColors = 'primary' | 'neutral'
export type UiCustomColors = 'secondary' | 'accent'
export type UiBaseColor = 'black' | 'white'
export type UiColors = UiSemanticColor | UiStatusColor | UiDefaultNuxtUiColors | UiCustomColors | UiBaseColor
```

---

## 5. Development / Maintenance Guidelines

- All primitives should rely on composables (`useTypography`, `useColor`, `usePicture`) instead of duplicating logic.
- Use `$attrs` for forwarding classes, IDs, ARIA attributes, etc.
- Defaults should be sensible — only expose props if users will realistically override them.
- Centralize semantic mappings — e.g., color → class mapping lives in `useColor`.
- Extend in feature layers, not in primitives — e.g., gallery or portfolio-specific components can wrap these primitives.
- Consistency — always use `UiColors` and `ColorUsage` for new components.
- Testing — verify classes computed by `useTypography` and `useColor` produce the correct Tailwind class strings.

---

## 6. Next Steps

- Integrate `color` prop into `Headline.vue`, `Text.vue`, `QuoteBlock.vue`, and `CodeBlock.vue`.
- Implement optional background (`bgColor`) and border (`borderColor`) props for primitives.
- Finish remaining primitives: `Named.vue` links and `Picture.vue` fully responsive wrapper.
- Add documentation/examples for all primitives.
- Optionally implement theming (dark/light mode) and dynamic colors based on Nuxt config.

---

This document serves as the single source of truth for the primitives layer and provides clear guidance for extending and maintaining the UI system.
