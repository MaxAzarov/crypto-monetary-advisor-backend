const parser = require('@typescript-eslint/parser');
const simpleImportSort = require('eslint-plugin-simple-import-sort');

module.exports = [
  {
    files: ['src/**/*.ts', 'lib/**/*.ts', 'apps/**/*.ts', 'test/**/*.ts'],
    ignores: ['**/*.config.js'],
    rules: {
      '@typescript-eslint/interface-name-p refix': 'off',
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      'simple-import-sort/imports': 'error',
      'simple-import-sort/exports': 'error',
    },
    languageOptions: {
      parser,
    },
    plugins: {
      '@typescript-eslint': require('@typescript-eslint/eslint-plugin'),
      prettier: require('eslint-plugin-prettier'),
      'simple-import-sort': simpleImportSort,
    },
  },
];
