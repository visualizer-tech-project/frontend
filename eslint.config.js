import js from '@eslint/js'
import react from 'eslint-plugin-react'
import importPlugin from 'eslint-plugin-import'
import prettier from 'eslint-config-prettier'
import prettierPlugin from 'eslint-plugin-prettier'
import { defineConfig } from 'eslint/config'
import globals from 'globals'
import tseslint from 'typescript-eslint'

export default defineConfig([
  {
    ignores: ['dist', 'node_modules', 'build', 'src/shared/api/generated'],
  },

  js.configs.recommended,
  ...tseslint.configs.recommended,
  react.configs.flat.recommended,

  prettier,

  {
    files: ['**/*.{js,jsx,ts,tsx}'],

    plugins: {
      import: importPlugin,
      prettier: prettierPlugin,
    },

    languageOptions: {
      globals: globals.browser,
    },

    settings: {
      react: {
        version: 'detect',
      },
    },

    rules: {
      'react/react-in-jsx-scope': 'off',

      quotes: 'off',

      'prettier/prettier': 'error',

      'import/extensions': [
        'error',
        'never',
        {
          ts: 'never',
          tsx: 'never',
          js: 'never',
          jsx: 'never',
          json: 'always',
          svg: 'always',
          jpg: 'always',
          jpeg: 'always',
          png: 'always',
        },
      ],
    },
  },
])
