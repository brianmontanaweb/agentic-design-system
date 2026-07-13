import tseslint from 'typescript-eslint'
import jsxA11y from 'eslint-plugin-jsx-a11y'
import eslintReact from '@eslint-react/eslint-plugin'
import reactHooks from 'eslint-plugin-react-hooks'
import storybook from 'eslint-plugin-storybook'
import importX from 'eslint-plugin-import-x'
import { createTypeScriptImportResolver } from 'eslint-import-resolver-typescript'

export default tseslint.config(
  // --- Global ignores ---
  // .claude/workflows scripts run in the dynamic-workflow runtime (implicit
  // `args`/`agent`/`pipeline` globals, top-level return) — not parseable as
  // standard modules.
  {
    ignores: ['**/dist/**', '**/node_modules/**', '**/storybook-static/**', '.claude/workflows/**'],
  },

  // --- Linter options: disable comments must be justified and effective ---
  {
    linterOptions: {
      reportUnusedDisableDirectives: 'error',
      reportUnusedInlineConfigs: 'error',
    },
  },

  // --- All TS/TSX source (type-aware) ---
  // Every file matched by these globs is covered by its package tsconfig
  // (each includes `src`), so projectService needs no allowDefaultProject.
  // Requires packages to be built first — cross-package imports resolve
  // against sibling dist/*.d.ts, same as `tsc --noEmit` in each package.
  {
    files: ['packages/*/src/**/*.{ts,tsx}', 'apps/*/src/**/*.{ts,tsx}'],
    extends: [
      ...tseslint.configs.strictTypeChecked,
      ...tseslint.configs.stylisticTypeChecked,
      // Type-aware React linting (React 19-native successor to eslint-plugin-react).
      eslintReact.configs['recommended-type-checked'],
    ],
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    plugins: {
      'jsx-a11y': jsxA11y,
      'react-hooks': reactHooks,
    },
    rules: {
      // --- Accessibility: strict WCAG 2.x coverage ---
      // Catches: missing keyboard handlers on click elements, invalid ARIA,
      // color-only indicators, missing labels, and more.
      ...jsxA11y.flatConfigs.strict.rules,

      // --- React (@eslint-react) ---
      // Type-aware: prevents `count && <Badge/>` rendering a literal 0.
      '@eslint-react/no-leaked-conditional-rendering': 'error',
      '@eslint-react/no-nested-component-definitions': 'error',

      // --- Hooks ---
      ...reactHooks.configs['recommended-latest'].rules,
      'react-hooks/exhaustive-deps': 'error',

      // --- TypeScript best practices ---
      // Numbers interpolate deterministically; banning them adds String() noise.
      '@typescript-eslint/restrict-template-expressions': ['error', { allowNumber: true }],
      // Keep idiomatic React handlers: onClick={() => setState(...)}.
      '@typescript-eslint/no-confusing-void-expression': ['error', { ignoreArrowShorthand: true }],
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
          patterns: [
            {
              group: ['@agentic-ds/*/dist/*', '@agentic-ds/*/src/*'],
              message:
                'Deep imports into @agentic-ds packages are not allowed; import from the package entry point.',
            },
          ],
        },
      ],
    },
  },

  // --- Published package source: explicit public API types ---
  // Exported functions and components must declare their return types so the
  // public API surface is deliberate, not inferred. Apps and tests excluded.
  {
    files: ['packages/*/src/**/*.{ts,tsx}'],
    ignores: ['**/*.test.{ts,tsx}', '**/__tests__/**'],
    rules: {
      '@typescript-eslint/explicit-module-boundary-types': 'error',
    },
  },

  // --- Monorepo import hygiene ---
  // Enforces the tokens → core → agents dependency direction: no cycles, no
  // cross-package relative reaches, no imports a package does not declare.
  {
    files: ['packages/*/src/**/*.{ts,tsx}', 'apps/*/src/**/*.{ts,tsx}'],
    plugins: { 'import-x': importX },
    settings: {
      'import-x/resolver-next': [
        createTypeScriptImportResolver({
          project: ['packages/*/tsconfig.json', 'apps/*/tsconfig.json'],
          noWarnOnMultipleProjects: true,
        }),
      ],
    },
    rules: {
      'import-x/no-cycle': ['error', { maxDepth: 4 }],
      'import-x/no-relative-packages': 'error',
      'import-x/no-extraneous-dependencies': [
        'error',
        {
          // packages/agents declares core/tokens/chakra/react as peers.
          peerDependencies: true,
          devDependencies: ['**/*.test.{ts,tsx}', '**/__tests__/**', '**/*.stories.{ts,tsx}'],
        },
      ],
    },
  },

  // --- core: @agentic-ds/tokens is a devDependency by design ---
  // tsup `noExternal` inlines it into the core bundle (see packages/core/tsup.config.ts),
  // so it must not appear as a runtime dependency.
  {
    files: ['packages/core/src/**/*.{ts,tsx}'],
    rules: {
      'import-x/no-extraneous-dependencies': [
        'error',
        {
          peerDependencies: true,
          devDependencies: ['**/*.test.{ts,tsx}', '**/__tests__/**'],
          whitelist: ['@agentic-ds/tokens'],
        },
      ],
    },
  },

  // --- Package component source: enforce token usage ---
  // Hardcoded color and timing values are banned in core and agents packages,
  // in plain strings AND template literals. All values must reference a token
  // from @agentic-ds/tokens. Scoped away from packages/tokens (the definition
  // side) and from apps (stories / demos may use raw values for documentation).
  //
  // Selector notes: esquery regexes take no flags (hence explicit a-fA-F), the
  // hex alternation is longest-first so 6/8-digit colors aren't half-matched,
  // and template interpolations are separate AST nodes — so a token reference
  // like `${durations.fast.$value}` never trips the TemplateElement selectors.
  // Known gap: a numeric expression interpolated before a unit (`${i * 0.2}s`)
  // is not caught.
  {
    files: ['packages/core/src/**/*.{ts,tsx}', 'packages/agents/src/**/*.{ts,tsx}'],
    rules: {
      'no-restricted-syntax': [
        'error',
        {
          selector: 'Literal[value=/#([0-9a-fA-F]{8}|[0-9a-fA-F]{6}|[0-9a-fA-F]{3,4})\\b/]',
          message:
            'Hardcoded hex color in a string. Use a semantic token from @agentic-ds/tokens instead.',
        },
        {
          selector:
            'TemplateElement[value.raw=/#([0-9a-fA-F]{8}|[0-9a-fA-F]{6}|[0-9a-fA-F]{3,4})\\b/]',
          message:
            'Hardcoded hex color in a template literal. Use a semantic token from @agentic-ds/tokens instead.',
        },
        {
          selector: 'Literal[value=/\\b(rgba?|hsla?|oklch)\\(/]',
          message:
            'Raw color function (rgb/hsl/oklch). Use a semantic token from @agentic-ds/tokens instead.',
        },
        {
          selector: 'TemplateElement[value.raw=/\\b(rgba?|hsla?|oklch)\\(/]',
          message:
            'Raw color function (rgb/hsl/oklch). Use a semantic token from @agentic-ds/tokens instead.',
        },
        {
          selector: 'Literal[value=/\\b\\d+(\\.\\d+)?(ms|s)\\b/]',
          message:
            'Raw timing value. Use a duration token from @agentic-ds/tokens (durations.*) instead.',
        },
        {
          selector: 'TemplateElement[value.raw=/\\b\\d+(\\.\\d+)?(ms|s)\\b/]',
          message:
            'Raw timing value. Use a duration token from @agentic-ds/tokens (durations.*) instead.',
        },
      ],
    },
  },

  // --- core package: allow ChakraProvider (AgenticProvider wraps it) ---
  // Drops the system/ChakraProvider path bans but keeps the deep-import ban.
  {
    files: ['packages/core/src/**/*.{ts,tsx}'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['@agentic-ds/*/dist/*', '@agentic-ds/*/src/*'],
              message:
                'Deep imports into @agentic-ds packages are not allowed; import from the package entry point.',
            },
          ],
        },
      ],
    },
  },

  // --- mcp-builder: IIFE bundle entry re-exports everything from core including internals ---
  // Drops the system/ChakraProvider path bans but keeps the deep-import ban.
  {
    files: ['packages/mcp-builder/src/**/*.{ts,tsx}'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['@agentic-ds/*/dist/*', '@agentic-ds/*/src/*'],
              message:
                'Deep imports into @agentic-ds packages are not allowed; import from the package entry point.',
            },
          ],
        },
      ],
      // The MCP SDK deprecated the low-level Server class in favor of McpServer.
      // Migrating is part of implementing this package (CLAUDE.md known gap #7);
      // until then the deprecation warning is expected.
      '@typescript-eslint/no-deprecated': 'off',
    },
  },

  // --- Test files: relaxations for testing idioms only ---
  // expect(mock.method) references are the standard vitest assertion pattern;
  // unbound-method has no unintended-`this` risk there.
  {
    files: ['**/*.test.{ts,tsx}', '**/__tests__/**/*.{ts,tsx}'],
    rules: {
      '@typescript-eslint/unbound-method': 'off',
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

  // --- Tooling files: newly linted, not covered by any package tsconfig ---
  // These get the non-type-checked tier; adding them to a tsconfig (or using
  // allowDefaultProject) isn't worth the projectService overhead for scripts.
  {
    files: [
      '*.mjs',
      'scripts/**/*.ts',
      'packages/tokens/scripts/**/*.ts',
      'packages/mcp-builder/scripts/**/*.ts',
      'packages/*/vitest.config.ts',
      'apps/demo-web/vite.config.ts',
      'apps/storybook/.storybook/**/*.ts',
    ],
    extends: [...tseslint.configs.strict, ...tseslint.configs.stylistic],
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
  }
)
