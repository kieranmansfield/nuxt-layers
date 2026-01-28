# UI Layer Documentation

This document outlines the structure, purpose, and implementation instructions for the unified UI Layer. This layer is fully reusable across multiple projects and combines primitives, branding components, and advanced responsive features.

---

## 1. Layer Overview

The UI Layer provides a complete, typed design system encompassing typography, colors, media handling, responsive breakpoints, branding components, and utilities.

**Purpose:**

- Provide a consistent, typed design system
- Encapsulate typography, color, media, and UI primitives
- Include site branding components (masthead, site title)
- Define comprehensive responsive breakpoint system
- Enable easy extension and customization

**Structure:**

```
app/
├── components/
│   ├── Typography/
│   │   ├── index.vue           # Base Typography component
│   │   ├── Headline.vue        # h1-h6 with default heading styles
│   │   ├── CodeBlock.vue       # Preformatted code block
│   │   └── QuoteBlock.vue      # Semantic blockquote wrapper
│   ├── Links/
│   │   └── Named.vue           # <ULink> wrapper enforcing named routes
│   ├── Media/
│   │   └── Picture.vue         # <NuxtPicture> wrapper with responsive sizing
│   ├── Mast/
│   │   └── Main.vue            # Masthead component (UMain wrapper)
│   └── Site/
│       └── Title.vue           # Site title component with variants
├── composables/
│   ├── typography.ts           # useTypography composable
│   ├── color.ts                # useColor composable
│   └── picture.ts              # usePicture composable
├── types/
│   ├── typography.ts           # Typography axis types
│   ├── colors.ts               # Semantic, status, and base color types
│   ├── breakpoints.ts          # Responsive breakpoint definitions
│   └── media.ts                # Media/image types and ResponsiveSizes
└── utils/
    └── regex.ts                # Utility regex patterns
```

---

## 2. Components

### 2.1 Typography

**index.vue (Typography Base Component)**

- Props: `tag`, `weight`, `width`, `slant`, `leading`, `tracking`, `align`, `transform`
- Uses `useTypography` composable to generate class string
- Default tag: `p`
- Fully reactive to prop changes

**Headline.vue**

- Props: `level` (1-6), optional `color`
- Maps `level` → HTML `h1-h6` tag
- Uses `Typography` component with default heading styles (`weight-bold`, `leading-tight`, `tracking-tight`)
- Optional `color` prop uses `useColor` composable
- Ideal for semantic headings with consistent styling

**CodeBlock.vue**

- Semantic `<pre><code>` wrapper for code snippets
- Default `font-mono`, `overflow-x-auto`
- Optional `language` prop → `language-xxx` class for syntax highlighting (Prism/Shiki)
- Optional `color` prop uses `useColor(type='text')`
- Supports inline code and code blocks

**QuoteBlock.vue**

- Semantic `<blockquote>` wrapper
- Relies on `Typography` defaults
- `$attrs` forwards classes, IDs, ARIA attributes
- Optional `color` prop uses `useColor(type='text')`

### 2.2 Links

**Named.vue**

- Wrapper around `<ULink>` from Nuxt UI
- Enforces named routes rather than string paths (`to="/"`)
- Supports optional color via `useColor(type='text')`
- Type-safe route navigation

### 2.3 Media

**Picture.vue**

- Wrapper for `<NuxtPicture>` with responsive defaults
- Props: `src`, `alt`, `width`, `height`, `sizes`, `format`, `quality`, `loading`, `class`
- Uses `usePicture` composable for computed responsive sizing
- Supports multiple formats (avif, webp, jpg, png)
- Built-in lazy loading and priority hints

### 2.4 Branding

**Mast/Main.vue**

- Masthead/main content wrapper
- Wraps Nuxt UI `<UMain>` component
- Props: `umain` (ref for UMain element)
- Provides semantic `<main>` element with consistent styling

**Site/Title.vue**

- Site title component with variant support
- Props: `siteTitle`, `tag`, `titleVariant`
- Supports `split` variant for creative text splitting
- Renders as dynamic component (h1, h2, etc.)
- `$attrs` forwarding for flexibility

---

## 3. Composables

### 3.1 useTypography (typography.ts)

- Accepts typography axes: `weight`, `width`, `slant`, `leading`, `tracking`, `align`, `transform`
- Computes Tailwind/Nuxt UI classes from semantic props
- Handles both numeric and string values (`FontWeightNumber`, `FontLeadingNumber`)
- Returns computed class string for reactive styling
- Used by Typography, Headline, and text components

### 3.2 useColor (color.ts)

- Accepts: `color: UiColors`, `type: ColorUsage ('text' | 'bg' | 'border')`
- Returns computed Tailwind/Nuxt UI class string: `${type}-${colorName}`
- Fully reactive to prop changes
- Supports semantic colors (dimmed, muted, highlighted), status colors (info, success, warning, error), and base colors
- Can be extended to `useTextColor`, `useBgColor`, `useBorderColor` for specific use cases

### 3.3 usePicture (picture.ts)

- Computes props for `<NuxtPicture>` component
- Generates responsive `sizes` attribute from `ResponsiveSizes` object
- Handles format string computation (avif, webp, jpg fallbacks)
- Provides sensible defaults for lazy loading, quality, and optimization
- Returns `UsePictureReturn` with computed values

---

## 4. Types

### 4.1 Typography Types (`typography.ts`)

Defines all typography-related type constraints:

```ts
export type FontWeightNumber = 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900
export type FontWeight = 'font-thin' | 'font-extralight' | 'font-light' | 'font-normal' | 'font-medium' | 'font-semibold' | 'font-bold' | 'font-extrabold' | 'font-black' | FontWeightNumber
export type FontWidth = 'normal' | 'condensed' | 'expanded'
export type FontSlant = 'normal' | 'italic' | 'oblique'
export type FontLeading = 'leading-none' | 'leading-tight' | 'leading-snug' | 'leading-normal' | 'leading-relaxed' | 'leading-loose' | number
export type FontTracking = 'tracking-tighter' | 'tracking-tight' | 'tracking-normal' | 'tracking-wide' | 'tracking-wider' | 'tracking-widest' | number
export type TextAlign = 'left' | 'center' | 'right' | 'justify'
export type TextTransform = 'none' | 'uppercase' | 'lowercase' | 'capitalize'
```

### 4.2 Color Types (`colors.ts`)

Defines semantic, status, and base color system:

```ts
export type ColorUsage = 'text' | 'bg' | 'border'
export type UiSemanticColor = 'dimmed' | 'muted' | 'toned' | 'default' | 'highlighted' | 'inverted'
export type UiStatusColor = 'info' | 'success' | 'warning' | 'error'
export type UiDefaultNuxtUiColors = 'primary' | 'neutral'
export type UiCustomColors = 'secondary' | 'accent'
export type UiBaseColor = 'black' | 'white'
export type UiColors = UiSemanticColor | UiStatusColor | UiDefaultNuxtUiColors | UiCustomColors | UiBaseColor
```

### 4.3 Breakpoint Types (`breakpoints.ts`)

Comprehensive responsive breakpoint system supporting multiple paradigms:

**Tailwind Breakpoints:**
```ts
export type ResponsiveBreakpoint = 'sm' | 'md' | 'lg' | 'xl' | '2xl'
export const BREAKPOINT_VALUES = { sm: 640, md: 768, lg: 1024, xl: 1280, '2xl': 1536 }
```

**Device Breakpoints:**
```ts
export type DeviceBreakpoint = 'mobile' | 'tablet' | 'desktop' | 'wide'
export const DEVICE_BREAKPOINT_VALUES = { mobile: 0, tablet: 640, desktop: 1024, wide: 1920 }
```

**Phone Breakpoints:**
```ts
export type PhoneBreakpoint = 'phone-sm' | 'phone-md' | 'phone-lg'
export const PHONE_BREAKPOINT_VALUES = { 'phone-sm': 320, 'phone-md': 375, 'phone-lg': 428 }
```

**Tablet Breakpoints:**
```ts
export type TabletBreakpoint = 'tablet-sm' | 'tablet-md' | 'tablet-lg'
export const TABLET_BREAKPOINT_VALUES = { 'tablet-sm': 768, 'tablet-md': 834, 'tablet-lg': 1024 }
```

**Orientation:**
```ts
export type DeviceOrientation = 'portrait' | 'landscape'
```

**Combined:**
```ts
export type AllBreakpoints = ResponsiveBreakpoint | DeviceBreakpoint | PhoneBreakpoint | TabletBreakpoint | DeviceOrientation
```

### 4.4 Media Types (`media.ts`)

Types for Picture component and responsive image handling:

```ts
export type ImageFormat = 'avif' | 'webp' | 'jpg' | 'jpeg' | 'png' | 'gif' | 'svg'
export type ImageLoading = 'lazy' | 'eager'
export type ImageFit = 'cover' | 'contain' | 'fill' | 'inside' | 'outside'

export interface ResponsiveSizes {
  default: string
  // Supports all breakpoint types: sm, md, lg, mobile, tablet, phone-sm, etc.
  [key: string]: string
}

export interface PictureProps {
  src: string
  alt: string
  width?: number
  height?: number
  sizes?: string | ResponsiveSizes
  format?: string
  quality?: number
  loading?: ImageLoading
  // ... additional NuxtPicture props
}
```

---

## 5. Utils

### 5.1 regex.ts

Utility regex patterns for text manipulation and validation:

- String splitting patterns
- Text normalization utilities
- Used by components like `Site/Title.vue` for text splitting variants

---

## 6. Development / Maintenance Guidelines

### 6.1 Component Design Principles

- **Composable-first:** All components should rely on composables (`useTypography`, `useColor`, `usePicture`) instead of duplicating logic
- **Attrs forwarding:** Use `$attrs` for forwarding classes, IDs, ARIA attributes, and other HTML attributes
- **Sensible defaults:** Only expose props if users will realistically override them
- **Semantic mappings:** Centralize mappings (e.g., color → class lives in `useColor`, not in components)
- **Type safety:** Always use typed props (`UiColors`, `ColorUsage`, `FontWeight`, etc.)

### 6.2 Layer Responsibilities

- **UI Layer (this layer):**
  - Typography, colors, media components
  - Branding components (masthead, site title)
  - Breakpoint system and responsive utilities
  - No layout responsibilities (spacing, containers, grids)
  - No theming logic (belongs in Features layer)

- **Feature Layer (separate):**
  - Domain-specific components (portfolio items, blog cards, galleries)
  - Can consume UI layer components
  - Implements business logic and data handling
  - Manages theming and theme switching

- **Layout Layer (separate):**
  - Containers, spacing, grid systems
  - Breakpoint-based layout compositions
  - Page structure components

### 6.3 Extension Guidelines

- Extend in feature layers, not in UI layer
- Example: gallery or portfolio components should wrap UI primitives
- Maintain consistency: always use `UiColors` and `ColorUsage` for new components
- Verify computed classes match Tailwind/Nuxt UI conventions

### 6.4 Testing

- Verify classes computed by `useTypography` produce correct Tailwind class strings
- Verify `useColor` generates correct color classes for all `ColorUsage` types
- Test `usePicture` with different `ResponsiveSizes` configurations
- Ensure branding components handle edge cases (empty titles, missing refs)

---

## 7. Component Checklist

When creating or modifying UI layer components:

- [ ] Uses typed props from `/types` directory
- [ ] Relies on composables for class generation
- [ ] Forwards `$attrs` appropriately
- [ ] Includes JSDoc comments for complex props
- [ ] No hardcoded Tailwind classes (use composables)
- [ ] No layout/spacing logic (margins, padding, containers)
- [ ] No theme switching logic
- [ ] Accessible (proper semantic HTML, ARIA attributes)
- [ ] Responsive (uses breakpoint types where applicable)

---

This document serves as the single source of truth for the UI layer and provides clear guidance for extending and maintaining the design system.
