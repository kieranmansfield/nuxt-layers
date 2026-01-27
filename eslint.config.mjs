import compat from 'eslint-plugin-compat'
import prettier from 'eslint-plugin-prettier'
import vue from 'eslint-plugin-vue'
import typescript from '@typescript-eslint/eslint-plugin'
import typescriptParser from '@typescript-eslint/parser'
// import withNuxt from './.nuxt/eslint.config.mjs'
import tailwindcss from 'eslint-plugin-tailwindcss'
import json from '@eslint/json'
import markdown from '@eslint/markdown'

import withNuxt from './.playground/.nuxt/eslint.config.mjs'

export default withNuxt(
  // Spread the Vue recommended config directly
  ...vue.configs['flat/recommended'],
  {
    languageOptions: {
      parser: vue.parser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        extraFileExtensions: ['.vue'],
        parser: {
          ts: typescriptParser,
          tsx: typescriptParser,
        },
      },
    },
    plugins: {
      vue,
      compat,
      prettier,
      '@typescript-eslint': typescript,
      tailwindcss,
    },
    settings: {
      browsers: ['Chrome >= 88', 'Firefox >= 85', 'Safari >= 14', 'Edge >= 88'],

      tailwindcss: {
        // Optional, default values: ["class", "className", "ngClass", "@apply"]
        attributes: ['class', '@apply'],

        // cssConfigPath: dirname(fileURLToPath(import.meta.url)) + "/styles/tailwind.css",
        cssConfigPath: '~/assets/css/main.css',
        // Functions/tagFunctions that will be parsed by the plugin.
        // Optional, default values: ["classnames", "clsx", "ctl", "cva", "tv", "tw"]
        functions: ['twClasses'],
      },
    },

    rules: {
      // Prettier
      'prettier/prettier': ['error'],

      // JavaScript/TypeScript
      semi: ['error', 'never'],
      quotes: ['error', 'single', { avoidEscape: true }],
      'no-console': ['warn'],
      'no-debugger': ['error'],
      'no-unused-vars': 'off', // Turn off base rule
      'prefer-const': ['error'],
      'no-var': ['error'],

      // TypeScript specific rules
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
        },
      ],

      // Vue specific rule to catch defineProps assignment
      'vue/no-setup-props-destructure': 'off', // This doesn't exist, but we'll create our own
      'no-restricted-syntax': [
        'error',
        {
          selector:
            'VariableDeclarator[id.type="Identifier"][id.name="props"][init.callee.name="defineProps"]',
          message:
            'Avoid "const props = defineProps()". Use destructuring instead: "const { prop1, prop2 } = defineProps()" or use defineProps() directly.',
        },
      ],

      // Browser compatibility
      'compat/compat': ['warn'],

      // Enforce TypeScript
      'vue/block-lang': [
        'error',
        {
          script: {
            lang: 'ts',
          },
        },
      ],

      // Enforce type-based syntax
      'vue/define-props-declaration': ['error', 'type-based'],
      'vue/define-emits-declaration': ['error', 'type-based'],

      // Enforce macro order
      'vue/define-macros-order': [
        'error',
        {
          order: ['defineProps', 'defineEmits', 'defineExpose', 'withDefaults'],
        },
      ],

      // Prevent unused props
      'vue/no-unused-properties': [
        'error',
        {
          groups: ['props', 'data', 'computed', 'methods', 'setup'],
        },
      ],

      // Spacing
      'vue/block-spacing': ['error', 'always'],

      // Disable formatting rules that conflict with Prettier
      'vue/max-attributes-per-line': 'off',
      'vue/singleline-html-element-content-newline': 'off',
      'vue/multiline-html-element-content-newline': 'off',
      'vue/html-indent': 'off',
      'vue/multi-word-component-names': 'off',

      // Vue - Enhanced rules for better code quality
      'vue/v-bind-style': ['error', 'shorthand', { sameNameShorthand: 'always' }],
      'vue/html-self-closing': [
        'error',
        {
          html: {
            void: 'always',
            normal: 'always',
            component: 'always',
          },
          svg: 'always',
          math: 'always',
        },
      ],
      'vue/component-name-in-template-casing': ['error', 'PascalCase'],
      'vue/no-useless-v-bind': ['error'],
      'vue/no-unused-refs': ['error'],
      'vue/padding-line-between-blocks': ['error', 'always'],
      'vue/prefer-separate-static-class': ['error'],
      'vue/prefer-true-attribute-shorthand': ['error'],
      'vue/block-order': ['error', { order: ['script', 'template', 'style'] }],
      'vue/html-comment-content-spacing': ['error', 'always'],
      'vue/no-duplicate-attr-inheritance': ['error'],
      'vue/no-empty-component-block': ['error'],
      'vue/require-macro-variable-name': ['error'],
    },
  },
  // Add JSON linting
  {
    files: ['**/*.json'],
    language: 'json/json',
    ...json.configs.recommended,
  },
  // Add Markdown linting
  {
    files: ['**/*.md'],
    language: 'markdown/gfm',
    ...markdown.configs.recommended,
  },
  {
    ignores: [
      'oldApp/**',
      '.nuxt/**',
      '.data/**',
      '.github/**',
      '.netlify/**',
      '.vscode/**',
      '.output/**',
      'node_modules',
    ],
  }
)
