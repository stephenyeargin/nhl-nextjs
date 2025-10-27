import js from '@eslint/js';
import reactPlugin from 'eslint-plugin-react';
import reactHooksPlugin from 'eslint-plugin-react-hooks';
import tseslint from 'typescript-eslint';
import nextPlugin from '@next/eslint-plugin-next';

export default tseslint.config(
  // Base recommended configs
  js.configs.recommended,
  ...tseslint.configs.recommended,

  // Global ignores
  {
    ignores: [
      'node_modules/**',
      '.next/**',
      'out/**',
      'coverage/**',
      'public/**',
      '*.config.js',
      '*.config.mjs',
      'next-env.d.ts', // Auto-generated file
    ],
  },

  // Main configuration
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    plugins: {
      react: reactPlugin,
      'react-hooks': reactHooksPlugin,
      '@next/next': nextPlugin,
    },
    languageOptions: {
      ecmaVersion: 2021,
      sourceType: 'module',
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
      globals: {
        // Browser globals
        window: 'readonly',
        document: 'readonly',
        navigator: 'readonly',
        console: 'readonly',
        Blob: 'readonly',
        // Node globals
        process: 'readonly',
        __dirname: 'readonly',
        __filename: 'readonly',
        module: 'readonly',
        require: 'readonly',
        global: 'readonly',
        // Jest globals
        describe: 'readonly',
        test: 'readonly',
        it: 'readonly',
        expect: 'readonly',
        beforeEach: 'readonly',
        afterEach: 'readonly',
        beforeAll: 'readonly',
        afterAll: 'readonly',
        jest: 'readonly',
      },
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
    rules: {
      // Next.js recommended rules
      '@next/next/no-html-link-for-pages': 'error',

      // Enforce consistent semicolon usage
      semi: ['error', 'always'],

      // Enforce the use of single quotes for strings
      quotes: ['error', 'single'],

      // Enforce consistent indentation (2 spaces)
      // Disabled due to recursion/stack overflow issues with some TSX files; rely on prettier/editor formatting instead
      indent: 'off',

      // Enforce consistent line breaks between functions and variables
      'newline-before-return': 'error',

      // Enforce the consistent use of curly braces for all control statements
      curly: ['error', 'all'],

      // Enforce no unused variables
      'no-unused-vars': 'off', // Disabled in favor of TypeScript version
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],

      // Enforce that all variables are declared using `const` or `let`
      'no-var': 'error',

      // Disallow unnecessary `else` statements after return
      'no-else-return': 'error',

      // Enforce the use of `===` and `!==` for comparisons
      eqeqeq: 'error',

      // Ensure that every `useEffect` hook has a dependency array
      'react-hooks/exhaustive-deps': 'warn',

      // Disallow `console.log` and other debugging tools in production code
      'no-console': ['warn', { allow: ['warn', 'error'] }],

      // React specific: enforce consistent naming of components
      'react/jsx-pascal-case': 'error',

      // React specific: prevent direct mutation of state
      'react/no-direct-mutation-state': 'error',

      // Enforce no extra spaces inside of arrays or objects
      'no-multi-spaces': 'error',

      // TypeScript specific rules
      '@typescript-eslint/consistent-type-imports': 'warn',
      '@typescript-eslint/no-explicit-any': ['warn', { ignoreRestArgs: true }],

      // Disable some overly strict React rules
      'react/react-in-jsx-scope': 'off', // Not needed in Next.js
      'react/prop-types': 'off', // Using TypeScript instead
    },
  },
);
