// Formatting is owned by oxfmt (the `fmt` block in each project's vite.config.ts). This file
// only mirrors those options for tools that still read a Prettier config, so they agree with
// oxfmt. Keep it in sync with vite.config.ts `fmt`, and keep it plugin-free: projects don't
// install Prettier plugins any more.
/** @type {import("prettier").Config} */
module.exports = {
  semi: false,
  singleQuote: true,
  trailingComma: 'es5',
  printWidth: 80,
  tabWidth: 2,
  endOfLine: 'lf',
}
