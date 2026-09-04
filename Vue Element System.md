# **Vue Element System**

## **Overview**

The goal is to create a small, composable **design-language system for Vue** that makes component markup more readable and expressive than large utility-class strings.

Rather than replacing CSS or creating another Tailwind-like compiler, the system provides a **shared vocabulary of layout, spacing, sizing, surface, and interaction properties** that can be used consistently across a family of Vue components.

The central primitive is called **`Element`**.

```vue
<Element as="section" grid cols="12" gap="6" p="8 12" bg="surface" color="foreground">
  ...
</Element>
```

The intention is that the markup reads like a description of the composition rather than a collection of implementation-specific CSS classes.

---

# **Core Principles**

## **1. Component-level, not global CSS compilation**

This is **not** intended to be a replacement for Tailwind’s compiler.

We do not want:

```html
<div class="a8f32c b17e91 c91d20"></div>
```

or any other generated/random class names.

The system should remain understandable in the Vue component architecture.

CSS remains normal CSS.

The attributes form a consistent API shared between components.

---

## **2. Small vocabulary**

The system should deliberately expose only a subset of CSS.

Not every CSS property needs to become an attribute.

The goal is to establish a small design vocabulary such as:

```vue
grid cols="12" gap="6" p="8 12" span="8" bg="surface" color="foreground"
```

rather than exposing every possible CSS property.

The vocabulary should be:

- short
- predictable
- strongly typed
- composable
- design-system oriented
- easy to scan in templates

---

# **`Element`**

`Element` is the fundamental polymorphic primitive.

Its purpose is to provide the shared design-language API while allowing the caller to determine what the resulting element actually is.

### **Native HTML**

```vue
<Element as="section" grid cols="12" gap="6">
  ...
</Element>
```

renders as a `<section>`.

```vue
<Element as="article">
```

renders as an `<article>`.

The `as` property separates **composition** from **semantics**.

`Element` controls how something is composed; `as` controls what it actually is.

---

# **Rendering Other Vue Components**

`Element` should also be able to render arbitrary Vue components.

For example:

```vue
<Element :as="MyCardHome" span="8" p="6" bg="surface" />
```

or Nuxt UI components:

```vue
<Element :as="UButton" p="3 5">
  Continue
</Element>
```

Conceptually, this is implemented using Vue’s dynamic component mechanism:

```vue
<component :is="as">
  <slot />
</component>
```

`Element` therefore acts as a **polymorphic adapter** rather than being restricted to HTML elements.

---

# **Shared Property Groups**

The system should be internally divided into property groups.

These groups are architectural units rather than namespaces that need to appear in the markup.

For example:

```text
Element
│
├── Layout
├── Grid
├── Spacing
├── Sizing
├── Surface
└── Interaction
```

The markup remains flat:

```vue
<Element grid cols="12" gap="6" p="8" bg="surface" />
```

The grouping exists internally so that components can opt into specific capabilities.

---

# **Layout**

Responsible for the fundamental layout mode of an element.

Potential vocabulary:

```vue
block flex grid hidden
```

Potential higher-level primitives may eventually be considered, such as:

```vue
stack cluster
```

but these should only be introduced where they provide meaningful design-level abstractions.

---

# **Grid**

Grid is a first-class property group.

Potential API:

```vue
grid cols="12" rows="8" span="8" start="3" end="11"
```

Example:

```vue
<Element
  grid
  cols="12"
  gap="6"
>
  <Element span="8">
    Main content
  </Element>

  <Element span="4">
    Sidebar
  </Element>
</Element>
```

This is particularly useful for the project’s Swiss/grid-oriented design system.

CSS Grid and subgrid should remain the underlying standards-based implementation.

---

# **Spacing**

Spacing uses short, predictable attributes and logical CSS properties.

Examples:

```vue
p="8" p="8 12" px="12" py="8" m="auto" mx="auto" my="6" gap="6"
```

The system should favour logical properties such as:

```css
padding-inline
padding-block
margin-inline
margin-block
```

rather than physical properties such as `padding-left` and `margin-right`.

The value syntax should remain deliberately constrained and predictable.

---

# **Sizing**

Sizing provides common dimensional controls.

Potential vocabulary:

```vue
w="full" h="full" min-w="..." max-w="..." min-h="..." max-h="..." aspect="..."
```

Again, these should generally map to design tokens or controlled values rather than arbitrary CSS.

---

# **Surface**

Surface properties describe the visual container rather than typography.

Potential vocabulary:

```vue
bg="surface" color="foreground" border="subtle" radius="lg" shadow="sm"
```

Colours should integrate with the project’s semantic token system.

For example:

```vue
bg="surface" color="foreground"
```

should resolve to semantic design tokens rather than encouraging arbitrary colour values.

The broader colour system should continue to use OKLCH underneath.

---

# **Interaction**

A smaller property group can handle common interaction behaviour.

Potential examples:

```vue
cursor="pointer" select="none" pointer="none"
```

This group should remain deliberately small.

---

# **Typography**

Typography is intentionally **separate from the initial Element system**.

The first version should focus on:

- layout
- grid
- spacing
- sizing
- surface
- interaction

Typography can later have its own vocabulary and potentially its own primitives.

This prevents `Element` from becoming a giant abstraction covering every aspect of CSS.

---

# **Component Capabilities**

Not every component needs to support every property group.

Instead, components can opt into capabilities.

For example:

```text
Section
├── Layout
├── Grid
├── Spacing
├── Sizing
└── Surface

Card
├── Grid
├── Spacing
├── Sizing
└── Surface

Button
├── Spacing
├── Sizing
├── Surface
└── Interaction
```

This avoids creating one enormous universal component API.

---

# **TypeScript Architecture**

Property groups should have reusable TypeScript definitions.

For example:

```ts
type SpacingProps = {
  p?: Space
  px?: Space
  py?: Space
  m?: Space
  mx?: Space
  my?: Space
  gap?: Space
}

type GridProps = {
  grid?: boolean
  cols?: Columns
  rows?: Rows
  span?: Span
  start?: GridLine
  end?: GridLine
}
```

Components can then compose the capabilities they need:

```ts
type ElementProps = LayoutProps & GridProps & SpacingProps & SizingProps & SurfaceProps
```

while a more specialised component can expose a smaller subset.

The types should provide autocomplete and validation for the design vocabulary.

---

# **Semantic Components**

`Element` is not intended to replace semantic application components.

The hierarchy should instead look roughly like:

```text
Design Language
      │
      ↓
   Element
      │
      ├── Native HTML
      ├── Application components
      └── External component libraries
             │
             └── Nuxt UI
```

Application components such as:

```vue
<Card>
<Hero>
<Navigation>
<Button>
```

remain meaningful semantic components.

They can internally use `Element` and/or the same property-group system.

For example:

```vue
<Card span="4" p="6" bg="surface" />
```

can use the shared vocabulary without requiring every component to implement its own incompatible layout API.

---

# **Example**

A complete composition might look like:

```vue
<Element
  as="section"
  grid
  cols="12"
  gap="6"
  p="8 12"
  bg="surface"
  color="foreground"
>
  <Element span="12">
    ...
  </Element>

  <Element span="8">
    ...
  </Element>

  <Element span="4">
    ...
  </Element>
</Element>
```

The important thing is that the markup communicates the design directly:

12-column grid, 6-unit gap, 8/4 content split, with defined spacing and surface colours.

There is no large class string and no generated class-name noise.

---

# **What This System Is**

The system is best understood as:

**A small, strongly typed, composable design language shared across Vue components.**

It is not:

- a replacement for CSS
- a Tailwind clone
- a utility-class compiler
- a universal `Box` component containing every CSS property
- a system that generates opaque/random class names

The desired result is a consistent vocabulary that makes component composition **more readable, semantic, and predictable**.

```vue
<Element
  as="section"
  grid
  cols="12"
  gap="6"
  p="8 12"
>
```

The next design phase should define the actual **property groups, vocabulary, value grammar, TypeScript types, and boundaries** of the system before implementation begins.
