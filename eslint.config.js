import neostandard from 'neostandard'
import globals from 'globals'
import prettierPlugin from 'eslint-plugin-prettier'
import { configs as wdioConfig } from 'eslint-plugin-wdio'

const customIgnores = [
  '.server',
  '.github',
  'node_modules',
  '.husky',
  '.prettierrc.js',
  'allure-results',
  'allure-report',
  'scripts'
]

export default [
  ...neostandard({
    env: ['node'],
    ignores: [...neostandard.resolveIgnoresFromGitignore(), ...customIgnores],
    noJsx: true,
    noStyle: true
  }),
  {
    languageOptions: {
      ecmaVersion: 'latest',
      globals: {
        ...globals.es2022,
        ...globals.node,
        ...globals.mocha,
        before: true,
        after: true
      }
    },
    plugins: {
      prettier: prettierPlugin
    },
    rules: {
      'prettier/prettier': 'error',
      'no-console': 'error'
    }
  },
  wdioConfig['flat/recommended']
]
