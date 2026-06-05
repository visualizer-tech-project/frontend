import js from '@eslint/js'
import importPlugin from 'eslint-plugin-import'
import react from 'eslint-plugin-react'
import { defineConfig } from 'eslint/config'
import globals from 'globals'
import tseslint from 'typescript-eslint'

export default defineConfig([
  {
    ignores: ['dist', 'node_modules', 'build', 'src/shared/api/generated/**'],
  },

  js.configs.recommended,

  ...tseslint.configs.recommended,

  react.configs.flat.recommended,

  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    languageOptions: {
      globals: globals.browser,
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
    plugins: {
      import: importPlugin,
    },
    rules: {
      'react/react-in-jsx-scope': 'off',
      'import/extensions': [
        'error',
        'never',
        {
          css: 'always',
          gen: 'always',
          ts: 'never',
          tsx: 'never',
          js: 'never',
          jsx: 'never',
        },
      ],
    },
  },
])
