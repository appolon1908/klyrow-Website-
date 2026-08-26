import vitest from '@vitest/eslint-plugin'
import { createConfigForNuxt } from '@nuxt/eslint-config/flat'

export default createConfigForNuxt().append(
  {
    ignores: [
      '**/.nuxt/**',
      '**/.output/**',
      '**/dist/**',
      '**/coverage/**',
      'playwright-report/**',
    ],
  },
  {
    files: ['**/*.{ts,tsx,vue}'],
    rules: {
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/consistent-type-imports': 'error',
      complexity: ['warn', 10],
      'max-lines': ['warn', { max: 400, skipBlankLines: true, skipComments: true }],
    },
  },
  {
    files: ['apps/web/app/**/*.{ts,vue}'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            { group: ['**/server/**'], message: 'Client/UI code cannot import server modules.' },
          ],
        },
      ],
    },
  },
  { files: ['apps/web/app/pages/**/*.vue'], rules: { 'vue/multi-word-component-names': 'off' } },
  { files: ['**/*.test.ts'], plugins: { vitest }, rules: { ...vitest.configs.recommended.rules } },
)
