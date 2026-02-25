import json from '@eslint/json'
import markdown from '@eslint/markdown'
import typescript from '@typescript-eslint/eslint-plugin'
import typescriptParser from '@typescript-eslint/parser'
import { defineConfigWithVueTs, vueTsConfigs } from '@vue/eslint-config-typescript'
import compat from 'eslint-plugin-compat'
import pluginOxlint from 'eslint-plugin-oxlint'
import { configs as pnpmConfigs } from 'eslint-plugin-pnpm'
import prettier from 'eslint-plugin-prettier'
// import pluginUnicorn from 'eslint-plugin-unicorn'
import vue from 'eslint-plugin-vue'

// import glsl from 'eslint-plugin-glsl'

export default defineConfigWithVueTs(
  {
    ignores: [
      '**/node_modules/**',
      '**/.nuxt/**',
      '**/.output/**',
      '**/.vscode/**',
      '**/.turbo/**',
      '**/.playground/**',
      '**/dist/**',
      '**/oldApp/**',
      '**/package-lock.json',
    ],
  },

  vue.configs['flat/essential'],
  vue.configs['flat/recommended'],
  vueTsConfigs.recommended,
  // pluginUnicorn.configs.recommended,

  // Vue/Nuxt
  {
    files: ['**/*.vue'],
    languageOptions: {
      parser: vue.parser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        extraFileExtensions: ['.vue'],
        parser: typescriptParser,
      },
    },
    plugins: {
      vue,
      '@typescript-eslint': typescript,
      prettier,
      compat,
    },
    rules: {
      'prettier/prettier': ['error'],
      semi: ['error', 'never'],
      quotes: ['error', 'single', { avoidEscape: true }],
      'no-console': 'warn',
      'no-debugger': 'error',
      // 'no-unused-vars': 'off',
      // '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      'prefer-const': 'error',
      'no-var': 'error',
      // 'compat/compat': 'warn',

      // Disable formatting rules that conflict with Prettier
      'vue/max-attributes-per-line': 'off',
      'vue/singleline-html-element-content-newline': 'off',
      'vue/multiline-html-element-content-newline': 'off',
      'vue/html-indent': 'off',
      'vue/multi-word-component-names': 'off',

      //   // Code quality rules
      'vue/block-spacing': ['error', 'always'],
      'vue/v-bind-style': ['error', 'shorthand', { sameNameShorthand: 'always' }],
      'vue/html-self-closing': [
        'error',
        {
          html: { void: 'always', normal: 'always', component: 'always' },
          svg: 'always',
          math: 'always',
        },
      ],
      'vue/component-name-in-template-casing': ['error', 'PascalCase'],
      'vue/no-useless-v-bind': 'error',
      'vue/no-unused-refs': 'error',
      'vue/padding-line-between-blocks': ['error', 'always'],
      'vue/prefer-separate-static-class': 'error',
      'vue/prefer-true-attribute-shorthand': 'error',
      'vue/block-order': ['error', { order: ['script', 'template', 'style'] }],
      'vue/html-comment-content-spacing': ['error', 'always'],
      'vue/no-empty-component-block': 'error',
      'vue/require-macro-variable-name': 'error',

      // Enforce TypeScript and type-based syntax
      'vue/block-lang': ['error', { script: { lang: 'ts' } }],
      'vue/define-props-declaration': ['error', 'type-based'],
      'vue/define-emits-declaration': ['error', 'type-based'],
      'vue/no-duplicate-attr-inheritance': 'off',

      'no-restricted-imports': [
        'error',
        {
          paths: [
            {
              name: 'vue',
              message: 'Vue APIs are auto-imported by Nuxt. Remove this import.',
            },
            {
              name: '#imports',
              message: 'Already auto-imported by Nuxt.',
            },
            {
              name: '#components',
              message: 'Components are auto-imported by Nuxt.',
            },
          ],
          patterns: ['@/components/**', '~/components/**'],
        },
      ],
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': 'off',
      'vue/prop-name-casing': ['error', 'camelCase'],
      'vue/custom-event-name-casing': ['error', 'camelCase'],
      'vue/no-unused-properties': ['error', { groups: ['props', 'data', 'computed', 'methods'] }],
      'vue/define-props-destructuring': 'error',
      'vue/prefer-use-template-ref': 'error',
      'vue/max-template-depth': ['error', { maxDepth: 8 }],
      // 'unicorn/filename-case': [
      //   'error',
      //   {
      //     cases: {
      //       camelCase: true,
      //       pascalCase: true,
      //     },
      //   },
      // ],

      'unicorn/filename-case': 'off',
    },
  },

  // TypeScript
  {
    files: ['**/*.ts'],
    languageOptions: {
      parser: typescriptParser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
    },
    plugins: {
      '@typescript-eslint': typescript,
      prettier,
      compat,
    },
    rules: {
      complexity: ['warn', { max: 10 }],
      'no-nested-ternary': 'error',
      '@typescript-eslint/consistent-type-assertions': ['error', { assertionStyle: 'never' }],
      'no-restricted-syntax': [
        'error',
        { selector: 'TSEnumDeclaration', message: 'Use literal unions instead of enums.' },
        {
          selector: 'IfStatement > :not(IfStatement).alternate',
          message: 'Avoid else. Use early returns.',
        },
        { selector: 'TryStatement', message: 'Use tryCatch() instead of try/catch.' },
      ],
    },
  },

  // JavaScript files
  {
    files: ['**/*.js', '**/*.mjs'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
    },
    plugins: {
      '@typescript-eslint': typescript,
      prettier,
      compat,
    },
  },

  // GLSL + TSL shaders
  // {
  //   files: ['**/*.glsl', '**/*.vert', '**/*.frag'],
  //   plugins: { glsl },
  //   rules: {
  //     'glsl/no-undef': 'error',
  //     'glsl/no-unused-vars': 'warn',
  //   },
  // },

  // TSL files (treat as TypeScript)
  {
    files: ['**/*.tsl'],
    languageOptions: {
      parser: typescriptParser,
    },
  },

  // JSON linting
  {
    files: ['**/*.json'],
    language: 'json/json',
    ...json.configs.recommended,
  },

  // Markdown linting
  {
    files: ['**/*.md'],
    language: 'markdown/gfm',
    ...markdown.configs.recommended,
  },

  // OXLint integration
  ...pluginOxlint.buildFromOxlintConfigFile('./.oxlintrc.json'),
  // pnpm catalog enforcement
  ...pnpmConfigs.recommended
)
