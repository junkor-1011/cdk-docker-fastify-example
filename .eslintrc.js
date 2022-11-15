// @ts-check
const { builtinModules } = require('node:module');
const { defineConfig } = require('eslint-define-config');

module.exports = defineConfig({
  env: {
    es2021: true,
    node: true,
    browser: true,
  },
  extends: [
    'eslint:recommended',
    'standard-with-typescript',
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/recommended-requiring-type-checking',
    'plugin:jest/recommended',
    'plugin:jest/style',
    'prettier',
  ],
  plugins: ['@typescript-eslint', 'jest'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    project: ['tsconfig.json', 'packages/lambda/tsconfig.json'],
  },
  rules: {},
  overrides: [],
});
