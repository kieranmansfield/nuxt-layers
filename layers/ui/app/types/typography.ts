// ui/types/typography.ts

/* ======================================================
   Typography Tags
   - Supported HTML tags for typography components
   ====================================================== */

export type TypographyTag =
  | 'h1'
  | 'h2'
  | 'h3'
  | 'h4'
  | 'h5'
  | 'h6'
  | 'p'
  | 'span'
  | 'li'
  | 'pre'
  | 'code'
  | 'blockquote'

/* ======================================================
   Font Weight
   - Supports Tailwind utilities
   - Supports numeric variable-axis overrides (wght)
   ====================================================== */

export type FontWeightNumber = 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900

export type FontWeight =
  | 'font-thin'
  | 'font-extralight'
  | 'font-light'
  | 'font-normal'
  | 'font-medium'
  | 'font-semibold'
  | 'font-bold'
  | 'font-extrabold'
  | 'font-black'
  | FontWeightNumber

/* ======================================================
   Font Size
   - Supports Tailwind utilities
   ====================================================== */

export type FontSize =
  | 'xs'
  | 'sm'
  | 'base'
  | 'lg'
  | 'xl'
  | '2xl'
  | '3xl'
  | '4xl'
  | '5xl'
  | '6xl'
  | '7xl'
  | '8xl'
  | '9xl'
  | number

/* ======================================================
   Font Width
   - Semantic abstraction over wdth axis
   ====================================================== */

export type FontWidth = 'condensed' | 'normal' | 'expanded' | number // variable wdth axis override

/* ======================================================
   Font Slant
   - slnt / ital axis abstraction
   ====================================================== */

export type FontSlant = 'normal' | 'italic' | 'oblique' | number // variable slnt axis override

/* ======================================================
   Line Height (Leading)
   ====================================================== */

export type FontLeadingNumber = 0.9 | 1 | 1.1 | 1.2 | 1.25 | 1.3 | 1.4 | 1.5 | 1.6 | 1.75 | 2

export type FontLeading =
  | 'leading-none'
  | 'leading-tight'
  | 'leading-snug'
  | 'leading-normal'
  | 'leading-relaxed'
  | 'leading-loose'
  | FontLeadingNumber

/* ======================================================
   Letter Spacing (Tracking)
   ====================================================== */

export type FontTrackingNumber = -0.05 | -0.025 | 0 | 0.025 | 0.05 | 0.075 | 0.1

export type FontTracking =
  | 'tracking-tighter'
  | 'tracking-tight'
  | 'tracking-normal'
  | 'tracking-wide'
  | 'tracking-wider'
  | 'tracking-widest'
  | FontTrackingNumber

/* ======================================================
   Text Layout
   ====================================================== */

export type TextAlign = 'left' | 'center' | 'right' | 'justify'

export type TextTransform = 'none' | 'uppercase' | 'lowercase' | 'capitalize'

/* ======================================================
   Base Typography Props
   - Used by Text / Heading / Prose components
   ====================================================== */

export interface TypographyProps {
  as?: keyof HTMLElementTagNameMap
  weight?: FontWeight
  size?: FontSize
  width?: FontWidth
  slant?: FontSlant
  leading?: FontLeading
  tracking?: FontTracking
  align?: TextAlign
  transform?: TextTransform
}
