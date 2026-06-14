import type { Meta, StoryObj } from '@storybook/vue3-vite'

// Escala de espaçamento do Tailwind (base 0.25rem = 4px). Usar as utilitárias
// (p-*, gap-*, mt-*…), nunca margens/paddings avulsos via style inline.
const scale = [
  { cls: 'w-1', label: '1 · 4px' },
  { cls: 'w-2', label: '2 · 8px' },
  { cls: 'w-3', label: '3 · 12px' },
  { cls: 'w-4', label: '4 · 16px' },
  { cls: 'w-5', label: '5 · 20px' },
  { cls: 'w-6', label: '6 · 24px' },
  { cls: 'w-8', label: '8 · 32px' },
  { cls: 'w-10', label: '10 · 40px' },
  { cls: 'w-12', label: '12 · 48px' },
]

const meta: Meta = {
  title: 'Foundations/Spacing',
  parameters: {
    layout: 'fullscreen',
    controls: { disable: true },
    docs: {
      description: {
        component:
          'Escala base de 4px (Tailwind). O contêiner de página usa `px-6 py-6`; ' +
          'gaps comuns: `gap-2`/`gap-3` (cards), `gap-4`/`gap-5` (seções).',
      },
    },
  },
  render: () => ({
    setup: () => ({ scale }),
    template: `
      <div class="space-y-2 rounded-lg border border-ms-border-light bg-ms-surface p-5">
        <div v-for="s in scale" :key="s.cls" class="flex items-center gap-3">
          <span class="w-20 shrink-0 text-2xs text-ms-text-secondary">{{ s.label }}</span>
          <div class="h-3 rounded-sm bg-ms-primary" :class="s.cls" />
        </div>
      </div>`,
  }),
}

export default meta
type Story = StoryObj<typeof meta>
export const Scale: Story = {}
