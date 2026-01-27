/** @type {import("prettier").Config} */
module.exports = {
  semi: false,
  singleQuote: true,
  trailingComma: 'es5',
  printWidth: 100,
  tabWidth: 2,
  // plugins: ['prettier-plugin-tailwindcss'],
  // tailwindConfig: './tailwind.config.js',
  ignorePath: '.prettierignore',

  // tailwindAttributes: ['class', 'ui'],
  // tailwindFunctions: ['tw'],

  // tailwindcss: {
  //   classRegex: [
  //     // Match :ui object
  //     /:ui\s*=\s*{([^}]*)}/g,
  //     // Inside each key, match classes
  //     /(\w+)\s*:\s*['"`]([^'"`]+)['"`]/g,
  //   ],
  // },
}
