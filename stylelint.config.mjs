/** @type {import('stylelint').Config} */
export default {
  // Base configs
  extends: [
    'stylelint-config-standard', // Standard CSS rules
    'stylelint-config-tailwindcss', // Tailwind directives support
    // Note: stylelint-config-prettier is deprecated for Stylelint 16+
    // Stylistic rules were removed from Stylelint, so no conflicts with Prettier
  ],

  // Plugins
  plugins: [
    'stylelint-prettier', // Enforce Prettier formatting through Stylelint
    'stylelint-no-unsupported-browser-features', // Warn about unsupported CSS
  ],

  // Allow linting inside <style> blocks in Vue files
  overrides: [
    {
      files: ['**/*.vue', '**/*.html'],
      customSyntax: 'postcss-html',
    },
    {
      files: ['**/*.css'],
      customSyntax: 'postcss',
    },
  ],

  rules: {
    // Prettier integration
    'prettier/prettier': true,

    // Core CSS rules
    'color-function-notation': 'modern',
    'alpha-value-notation': 'number',

    // Class selector pattern
    'selector-class-pattern': [
      '^([a-z][a-zA-Z0-9]*|[a-z]+(-[a-z0-9]+)*)$',
      {
        message:
          'Expected class selector to be camelCase (e.g., "redBorder") or kebab-case (e.g., "red-border")',
      },
    ],

    // Color enforcement
    'color-no-hex': true,
    'function-disallowed-list': ['rgb', 'rgba', 'lab', 'lch'],

    // Comments
    'comment-empty-line-before': [
      'always',
      {
        except: ['first-nested'],
        ignore: ['after-comment', 'stylelint-commands'],
      },
    ],

    // Deprecated / duplicate properties
    'at-rule-no-deprecated': true,
    'declaration-block-no-duplicate-custom-properties': true,
    'font-family-no-duplicate-names': true,
    'declaration-block-no-duplicate-properties': [
      true,
      {
        ignore: [
          'consecutive-duplicates-with-different-values',
          'consecutive-duplicates-with-same-prefixless-values',
        ],
      },
    ],

    // Browser compatibility
    'plugin/no-unsupported-browser-features': [
      true,
      {
        severity: 'warning',
        ignore: [
          'css-variables',
          'css-cascade-layers',
          'css-nesting',
          'subgrid',
          'css-grid',
          'viewport-unit-variants',
        ],
      },
    ],

    // Tailwind at-rule exceptions
    'at-rule-no-unknown': [
      true,
      {
        ignoreAtRules: [
          'tailwind',
          'apply',
          'variants',
          'responsive',
          'screen',
          'layer',
          'reference',
          'theme',
          'config',
          'utility',
          'custom-variant',
        ],
      },
    ],
  },

  ignoreFiles: ['node_modules/**', '.nuxt/**', '.output/**', '.playground/**'],
}
