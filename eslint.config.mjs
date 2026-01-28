import json from '@eslint/json'
import markdown from '@eslint/markdown'
import typescript from '@typescript-eslint/eslint-plugin'
import typescriptParser from '@typescript-eslint/parser'
import compat from 'eslint-plugin-compat'
import prettier from 'eslint-plugin-prettier'
import vue from 'eslint-plugin-vue'

const globalIgnores = [
  '**/node_modules/**',
  '**/.nuxt/**',
  '**/.output/**',
  '**/.vscode/**',
  '**/.turbo/**',
  '**/.playground/**',
  '**/dist/**',
  '**/oldApp/**',
]

// Shared rules for JS/TS
const sharedRules = {
  'prettier/prettier': ['error'],
  semi: ['error', 'never'],
  quotes: ['error', 'single', { avoidEscape: true }],
  'no-console': 'warn',
  'no-debugger': 'error',
  'no-unused-vars': 'off',
  '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
  'prefer-const': 'error',
  'no-var': 'error',
  'compat/compat': 'warn',
}

// Vue-specific rules
const vueRules = {
  // Disable formatting rules that conflict with Prettier
  'vue/max-attributes-per-line': 'off',
  'vue/singleline-html-element-content-newline': 'off',
  'vue/multiline-html-element-content-newline': 'off',
  'vue/html-indent': 'off',
  'vue/multi-word-component-names': 'off',

  // Code quality rules
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
  'vue/no-duplicate-attr-inheritance': 'error',
  'vue/no-empty-component-block': 'error',
  'vue/require-macro-variable-name': 'error',

  // Enforce TypeScript and type-based syntax
  'vue/block-lang': ['error', { script: { lang: 'ts' } }],
  'vue/define-props-declaration': ['error', 'type-based'],
  'vue/define-emits-declaration': ['error', 'type-based'],
  // 'vue/define-macros-order': [
  //   'error',
  //   { order: ['defineProps', 'defineEmits', 'defineExpose', 'withDefaults'] },
  // ],
}

export default [
  // Global ignores
  {
    ignores: globalIgnores,
  },

  // TypeScript files
  {
    files: ['**/*.ts'],
    ignores: globalIgnores,
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
    settings: {
      browsers: ['>0.5%', 'last 2 versions', 'not dead', 'not op_mini all'],
    },
    rules: sharedRules,
  },

  // JavaScript files
  {
    files: ['**/*.js', '**/*.mjs'],
    ignores: globalIgnores,
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
    },
    plugins: {
      '@typescript-eslint': typescript,
      prettier,
      compat,
    },
    settings: {
      browsers: ['>0.5%', 'last 2 versions', 'not dead', 'not op_mini all'],
    },
    rules: sharedRules,
  },

  // Vue recommended configs
  ...vue.configs['flat/recommended'].map((config) => ({
    ...config,
    files: ['**/*.vue'],
    ignores: globalIgnores,
  })),

  // Vue files with custom rules
  {
    files: ['**/*.vue'],
    ignores: globalIgnores,
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
    settings: {
      browsers: ['>0.5%', 'last 2 versions', 'not dead', 'not op_mini all'],
    },
    rules: {
      ...sharedRules,
      ...vueRules,
    },
  },

  // JSON linting
  {
    files: ['**/*.json'],
    ignores: ['**/package-lock.json', ...globalIgnores],
    language: 'json/json',
    ...json.configs.recommended,
  },

  // Markdown linting
  {
    files: ['**/*.md'],
    ignores: globalIgnores,
    language: 'markdown/gfm',
    ...markdown.configs.recommended,
  },
]
