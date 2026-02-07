/** @type {import("prettier").Config} */
module.exports = {
  semi: false,
  singleQuote: true,
  trailingComma: 'es5',
  printWidth: 100,
  tabWidth: 2,

  plugins: [
    'prettier-plugin-tailwindcss',
    'prettier-plugin-tailwind-styled-components',
    'prettier-plugin-organize-attributes',
    'prettier-plugin-css-order',
    '@ianvs/prettier-plugin-sort-imports',
    'prettier-plugin-glsl',
  ],
  // tailwindConfig: './tailwind.config.js',
  ignorePath: '.prettierignore',
}
