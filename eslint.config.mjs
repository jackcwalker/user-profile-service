import parser from '@typescript-eslint/parser';
import pluginTs from '@typescript-eslint/eslint-plugin';
import pluginImport from 'eslint-plugin-import';
import pluginUnusedImports from 'eslint-plugin-unused-imports';

/** @type {import("eslint").Linter.FlatConfig[]} */
export default [
  {
    ignores: ['cdk.out', 'dist', 'node_modules'],
  },
  {
    files: ['**/*.ts'],
    languageOptions: {
      parser,
      parserOptions: {
        ecmaVersion: 2020,
        sourceType: 'module',
        project: './tsconfig.json',
      },
    },
    plugins: {
      '@typescript-eslint': pluginTs,
      import: pluginImport,
      'unused-imports': pluginUnusedImports,
    },
    rules: {
      '@typescript-eslint/no-unused-vars': 'warn',
      'unused-imports/no-unused-imports': 'warn',
      'import/order': 'warn',
    },
  },
];
