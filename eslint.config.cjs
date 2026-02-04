const { defineConfig } = require('eslint/config');
const { FlatCompat } = require('@eslint/eslintrc');

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

module.exports = defineConfig([
  {
    ignores: ['node_modules/**', 'dist/**', '.expo/**', 'eslint.config.cjs'],
  },
  ...compat.extends('expo'),
  {
    rules: {
      'react-hooks/preserve-manual-memoization': 'off',
      'react-hooks/refs': 'off',
      'react-hooks/set-state-in-effect': 'off',
    },
  },
]);
