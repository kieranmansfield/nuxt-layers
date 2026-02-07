import json from '@eslint/json'
import markdown from '@eslint/markdown'
import typescript from '@typescript-eslint/eslint-plugin'
import typescriptParser from '@typescript-eslint/parser'
import compat from 'eslint-plugin-compat'
import pluginOxlint from 'eslint-plugin-oxlint'
import prettier from 'eslint-plugin-prettier'
import unusedImports from 'eslint-plugin-unused-imports'
import vue from 'eslint-plugin-vue'


// import { defineConfigWithVueTs, vueTsConfigs } from '@vue/eslint-config-typescript'
// import pluginOxlint from 'eslint-plugin-oxlint'
// import pluginUnicorn from 'eslint-plugin-unicorn'

// import pluginVue from 'eslint-plugin-vue'





  // vue.configs['flat/essential'],
  // vueTsConfigs.recommended,
  // pluginUnicorn.configs.recommended,





export default defineConfigWithVueTs(
  // Global ignores
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
    ],
  },

  // Vue Rules

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
      'unused-imports': unusedImports,
    },
    settings: {
      browsers: ['>0.5%', 'last 2 versions', 'not dead', 'not op_mini all'],
    },
    rules: {
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
  'unused-imports/no-unused-imports': 'error',
  'no-unused-vars': 'off',
  '@typescript-eslint/no-unused-vars': 'off',
    },
  },

  // TS Rules
  {
    files: ['src/**/*.{ts,vue}'],
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
      'unused-imports': unusedImports,
    },
    settings: {
      browsers: ['>0.5%', 'last 2 versions', 'not dead', 'not op_mini all'],
    },
    rules: {
      ...sharedRules,
      ...nuxtAutoImportRules,
    },
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
      'unused-imports': unusedImports,
    },
    settings: {
      browsers: ['>0.5%', 'last 2 versions', 'not dead', 'not op_mini all'],
    },
    rules: {
      ...sharedRules,
      ...nuxtAutoImportRules,
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

  {
    ...pluginOxlint.buildFromOxlintConfigFile('./.oxlintrc.json'),
  }
)

