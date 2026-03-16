import tseslint from 'typescript-eslint'
import pluginReactHooks from 'eslint-plugin-react-hooks'
import pluginNext from '@next/eslint-plugin-next'

/** @type {import('typescript-eslint').Config} */
export default tseslint.config(
  // Ignore build artefacts and generated files
  {
    ignores: [
      '.next/**',
      'node_modules/**',
      'sanity.types.ts',
      'public/**',
    ],
  },

  // TypeScript recommended
  ...tseslint.configs.recommended,

  // React Hooks + Next.js rules
  {
    plugins: {
      'react-hooks': pluginReactHooks,
      '@next/next': pluginNext,
    },
    rules: {
      ...pluginReactHooks.configs.recommended.rules,
      // Downgrade — setState-in-effect is valid for responding to route changes
      'react-hooks/set-state-in-effect': 'warn',
      // Core Next.js lint rules (subset of core-web-vitals)
      '@next/next/no-img-element':            'warn',
      '@next/next/no-html-link-for-pages':    'error',
      '@next/next/no-sync-scripts':           'error',
      '@next/next/no-duplicate-head':         'error',
    },
  },

  // Project overrides
  {
    rules: {
      '@typescript-eslint/no-empty-object-type': 'off',
      '@typescript-eslint/no-explicit-any':      'warn',
      '@typescript-eslint/no-unused-vars': [
        'warn',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
      'no-console': ['warn', { allow: ['error', 'warn'] }],
    },
  },
)
