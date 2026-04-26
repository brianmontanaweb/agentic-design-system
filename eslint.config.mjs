import tseslint from 'typescript-eslint'
import jsxA11y from 'eslint-plugin-jsx-a11y'
import react from 'eslint-plugin-react'
import reactHooks from 'eslint-plugin-react-hooks'
import storybook from 'eslint-plugin-storybook'

export default tseslint.config(
  // --- Global ignores ---
  {
    ignores: ['**/dist/**', '**/node_modules/**', '**/storybook-static/**'],
  },

  // --- All TS/TSX source ---
  {
    files: ['packages/*/src/**/*.{ts,tsx}', 'apps/*/src/**/*.{ts,tsx}'],
    extends: [...tseslint.configs.strict, ...tseslint.configs.stylistic],
    plugins: {
      'jsx-a11y': jsxA11y,
      react,
      'react-hooks': reactHooks,
    },
    settings: {
      react: { version: '19.0' },
    },
    rules: {
      // --- Accessibility: strict WCAG 2.x coverage ---
      // Catches: missing keyboard handlers on click elements, invalid ARIA,
      // color-only indicators, missing labels, and more.
      ...jsxA11y.flatConfigs.strict.rules,

      // --- React ---
      // Flat recommended + jsx-runtime disables the "React must be in scope" rule
      // for the modern JSX transform (React 17+ / React 19).
      ...react.configs.flat.recommended.rules,
      ...react.configs.flat['jsx-runtime'].rules,

      // --- Hooks ---
      ...reactHooks.configs['recommended-latest'].rules,
      'react-hooks/exhaustive-deps': 'error',

      // --- TypeScript best practices ---
      '@typescript-eslint/consistent-type-imports': [
        'error',
        { prefer: 'type-imports', fixStyle: 'inline-type-imports' },
      ],
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],

      // --- Theme protection ---
      // Consumers must use <AgenticProvider>; importing the raw Chakra system
      // or ChakraProvider directly bypasses design system constraints.
      'no-restricted-imports': [
        'error',
        {
          paths: [
            {
              name: '@agentic-ds/core',
              importNames: ['system'],
              message:
                'Do not use the Chakra system directly. Wrap your app in <AgenticProvider> from @agentic-ds/core.',
            },
            {
              name: '@chakra-ui/react',
              importNames: ['ChakraProvider'],
              message:
                'Do not use ChakraProvider directly. Use <AgenticProvider> from @agentic-ds/core instead.',
            },
          ],
        },
      ],
    },
  },

  // --- Package component source: enforce token usage ---
  // Hardcoded hex color literals are banned in core and agents packages.
  // All color values must reference a semantic token from @agentic-ds/tokens.
  // This rule is scoped away from packages/tokens (the token definition file)
  // and away from apps (stories / demos may use raw values for documentation).
  {
    files: ['packages/core/src/**/*.{ts,tsx}', 'packages/agents/src/**/*.{ts,tsx}'],
    rules: {
      'no-restricted-syntax': [
        'error',
        {
          selector:
            "Literal[value=/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/]",
          message:
            'Hardcoded color values are not allowed in component packages. Use a semantic token from @agentic-ds/tokens instead.',
        },
      ],
    },
  },

  // --- core package: allow ChakraProvider (AgenticProvider wraps it) ---
  {
    files: ['packages/core/src/**/*.{ts,tsx}'],
    rules: {
      'no-restricted-imports': 'off',
    },
  },

  // --- mcp-builder: IIFE bundle entry re-exports everything from core including internals ---
  {
    files: ['packages/mcp-builder/src/**/*.{ts,tsx}'],
    rules: {
      'no-restricted-imports': 'off',
    },
  },

  // --- theme.ts: color definitions are the authoritative source of truth ---
  // theme.ts maps token values into the Chakra semantic token system. Raw hex
  // values are expected here. All other files in core/agents must use tokens.
  {
    files: ['packages/core/src/theme.ts'],
    rules: {
      'no-restricted-syntax': 'off',
    },
  },

  // --- Storybook stories ---
  {
    files: ['apps/storybook/src/**/*.stories.{ts,tsx}'],
    extends: [storybook.configs['flat/recommended']],
    rules: {
      // In Storybook 10, Meta/StoryObj types are still correctly imported from
      // @storybook/react. This rule targets framework-specific runtime imports,
      // not type-only imports used in stories.
      'storybook/no-renderer-packages': 'off',
    },
  },
)
