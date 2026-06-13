import type { StorybookConfig } from '@storybook/vue3-vite'

// Storybook (Vue 3 + Vite). O builder do Storybook reaproveita o vite.config.ts
// do projeto, então Tailwind v4, o alias `@` e o auto-import do Element Plus
// (ElButton, ElMessage…) já funcionam dentro das stories sem config extra.
const config: StorybookConfig = {
  framework: { name: '@storybook/vue3-vite', options: {} },
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(ts|tsx)'],
  addons: ['@storybook/addon-a11y', '@storybook/addon-themes'],
}

export default config
