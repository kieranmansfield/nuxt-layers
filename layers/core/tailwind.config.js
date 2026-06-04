/** @type {import('tailwindcss').Config} */
module.exports = {
  // No content array — Tailwind 4's Vite plugin auto-discovers all processed files.
  // A content array here would restrict scanning to only these paths (v3 behaviour),
  // causing utilities from ui/layout/theme/etc layers to be absent from the initial CSS.

  safelist: [
    // Swiss Grid System - Responsive grid classes for BaseGridItem
    // Supports col-start-*, col-span-*, row-start-*, row-span-* with md: and lg: prefixes
    {
      pattern: /^(md|lg):(col|row)-(start|span)-[0-9]+$/,
    },
  ],

  theme: {
    extend: {},
  },
  plugins: [],
}
