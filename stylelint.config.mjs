/** @type {import('stylelint').Config} */
export default {
  extends: [
    'stylelint-config-standard',
    'stylelint-config-tailwindcss',
    'stylelint-config-recommended-vue',
  ],

  plugins: ['stylelint-no-unsupported-browser-features'],

  overrides: [
    {
      files: ['**/*.vue', '**/*.html'],
      customSyntax: 'postcss-html',
    },
    {
      files: ['**/*.css'],
      customSyntax: 'postcss',
    },
    {
      // postcss-html parses inline `style="..."` attributes as bare declarations, which
      // this rule reports as "outside a rule" — a false positive for template attributes.
      files: ['**/*.vue', '**/*.html'],
      rules: { 'no-invalid-position-declaration': null },
    },
    {
      // Accessibility/preference overrides that must beat Tailwind utilities and inline
      // styles (reduced motion, reduced transparency, hidden accent blobs). They cannot be
      // expressed through app.config.ts, and an inline style can only be overridden by
      // !important — so the rule is intentionally off for these two files only.
      files: [
        'layers/design-system/theming/app/assets/css/theme.css',
        'layers/design-system/visual/app/assets/css/visual.css',
      ],
      rules: { 'declaration-no-important': null },
    },
    {
      files: ['**/tokens.css', '**/design-tokens.css', '**/_tokens.css'],
      rules: {
        'color-no-hex': null,
        'function-disallowed-list': [],
      },
    },
  ],

  rules: {
    'color-function-notation': 'modern',
    'alpha-value-notation': 'number',
    'media-feature-range-notation': 'context',
    'hue-degree-notation': 'angle',

    'selector-class-pattern': [
      '^([a-z][a-zA-Z0-9]*|[a-z]+(-[a-z0-9]+)*)$',
      {
        message:
          'Expected class selector to be camelCase (e.g., "redBorder") or kebab-case (e.g., "red-border")',
      },
    ],

    'color-no-hex': true,
    'function-disallowed-list': ['rgb', 'rgba', 'lab', 'lch'],
    'color-named': ['never', { ignore: ['inside-function'] }],

    'max-nesting-depth': [3, { ignoreAtRules: ['media', 'supports', 'include'] }],
    'selector-max-compound-selectors': 4,
    'selector-no-qualifying-type': [true, { ignore: ['attribute', 'class'] }],
    'no-descending-specificity': null,
    'selector-max-id': 0,

    'declaration-block-no-duplicate-properties': [
      true,
      {
        ignore: [
          'consecutive-duplicates-with-different-values',
          'consecutive-duplicates-with-same-prefixless-values',
        ],
      },
    ],
    'declaration-block-no-duplicate-custom-properties': true,
    'declaration-no-important': [true, { severity: 'warning' }],

    'font-family-no-duplicate-names': true,
    'no-duplicate-selectors': true,
    'no-empty-source': null,

    'comment-empty-line-before': [
      'always',
      {
        except: ['first-nested'],
        ignore: ['after-comment', 'stylelint-commands'],
      },
    ],

    'at-rule-no-deprecated': true,
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
          'source',
          'plugin',
          'variant',
        ],
      },
    ],

    'plugin/no-unsupported-browser-features': [
      true,
      {
        severity: 'warning',
        ignore: [
          // `ui-*` families and `text-decoration-skip-ink` are progressive enhancements that
          // always sit behind fallbacks in this repo, so partial support is intentional.
          'extended-system-fonts',
          'text-decoration',
          'css-variables',
          'css-cascade-layers',
          'css-nesting',
          'subgrid',
          'css-grid',
          'viewport-unit-variants',
        ],
      },
    ],

    'custom-property-pattern': null,

    // Unquoted font names (SFMono-Regular, Menlo, Consolas) are family names, not keywords.
    'value-keyword-case': ['lower', { ignoreProperties: ['font-family', 'font', '/^--.*font/'] }],

    // Tailwind v4 entry files declare `@layer a, b;` and `@custom-variant` before `@import`;
    // Tailwind's compiler accepts that, plain-CSS validity rules don't know its at-rules.
    'no-invalid-position-at-import-rule': [
      true,
      { ignoreAtRules: ['layer', 'config', 'custom-variant', 'source', 'plugin'] },
    ],
    // Declarations nested in `@supports`/`@media` inside Tailwind's `@utility`/`@variant`
    // are valid but look "outside a rule" to stylelint.
    'no-invalid-position-declaration': [
      true,
      { ignoreAtRules: ['utility', 'variant', 'custom-variant'] },
    ],
  },

  ignoreFiles: [
    '**/node_modules/**',
    '**/.nuxt/**',
    '**/.output/**',
    '**/.netlify/**',
    '**/.turbo/**',
    '**/.data/**',
    '**/.playground/**',
    '**/dist/**',
    '**/coverage/**',
  ],
}
