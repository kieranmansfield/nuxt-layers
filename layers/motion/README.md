# Motion Layer

A Nuxt layer for adding smooth animations and transitions to your application.

## Features

- Predefined CSS transition and animation classes
- Vue composables for motion detection and control
- Ready-to-use Vue components for common motion patterns
- Client-side plugin for global motion utilities

## Installation

The motion layer is automatically included when you run the playground with all layers:

```bash
PLAYGROUND_LAYERS=core,ui,layout,motion pnpm dev
```

## Usage

### CSS Classes

The motion layer provides several CSS classes for common animations:

- `transition-default` - Default transition for all properties
- `transition-fade` - Fade transition
- `transition-slide` - Slide transition
- `animate-fade-in` - Fade in animation
- `animate-fade-out` - Fade out animation
- `animate-slide-in-up` - Slide in from bottom animation
- And more...

### Composables

#### `useMotion`

Provides utilities for detecting element states and triggering animations:

```vue
<script setup>
const { isHovered, isVisible, triggerHoverAnimation } = useMotion()
</script>
```

#### `useTransition`

Manages CSS transition classes:

```vue
<script setup>
const { transitionClasses, addTransition } = useTransition()
addTransition('transition-fade')
</script>
```

#### `useAnimation`

Manages CSS animation classes:

```vue
<script setup>
const { addAnimation } = useAnimation()
addAnimation('animate-fade-in')
</script>
```

### Components

#### `<MotionTransition>`

A wrapper component for applying transitions to content:

```vue
<MotionTransition name="fade">
  <div>Content with fade transition</div>
</MotionTransition>
```

#### `<MotionStaggered>`

Applies staggered animations to child elements:

```vue
<MotionStaggered animation="fadeIn" :stagger-delay="100">
  <div>Item 1</div>
  <div>Item 2</div>
  <div>Item 3</div>
</MotionStaggered>
```

### Plugin

The motion layer includes a global plugin that provides utilities through `$motion`:

```vue
<script setup>
// Trigger animation on element
const onClick = (event) => {
  $motion.animateElement(event.target, 'animate-fade-in')
}
</script>
```

## Customization

You can customize the motion layer by modifying the CSS in `app/assets/css/main.css` or by extending the components and composables in your own application.