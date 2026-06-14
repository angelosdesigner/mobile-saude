import type { Meta, StoryObj } from '@storybook/vue3-vite'

// Escala tipográfica do produto (Inter). text-2xs (11px) é o piso; abaixo disso
// não usar. Pesos: 400 (regular), 500 (medium), 600 (semibold), 700 (bold).
const scale = [
  { cls: 'text-2xs', label: 'text-2xs · 11px (piso)' },
  { cls: 'text-xs', label: 'text-xs · 12px' },
  { cls: 'text-sm', label: 'text-sm · 14px' },
  { cls: 'text-base', label: 'text-base · 16px' },
  { cls: 'text-lg', label: 'text-lg · 18px' },
  { cls: 'text-xl', label: 'text-xl · 20px' },
  { cls: 'text-2xl', label: 'text-2xl · 24px' },
  { cls: 'text-3xl', label: 'text-3xl · 30px' },
]
const weights = [
  { cls: 'font-normal', label: 'font-normal · 400' },
  { cls: 'font-medium', label: 'font-medium · 500' },
  { cls: 'font-semibold', label: 'font-semibold · 600' },
  { cls: 'font-bold', label: 'font-bold · 700' },
]

const meta: Meta = {
  title: 'Foundations/Typography',
  parameters: {
    layout: 'fullscreen',
    controls: { disable: true },
    docs: {
      description: {
        component:
          'Família **Inter** (sobrescreve a fonte do Element Plus). Use sempre as utilitárias ' +
          'de tamanho (`text-2xs`…`text-3xl`) — nada de valores avulsos como `text-[13px]`.',
      },
    },
  },
  render: () => ({
    setup: () => ({ scale, weights }),
    template: `
      <div class="space-y-6">
        <section>
          <h3 class="mb-2 text-sm font-semibold text-ms-text-regular">Escala</h3>
          <div class="space-y-2 rounded-lg border border-ms-border-light bg-ms-surface p-5">
            <div v-for="t in scale" :key="t.cls" class="flex items-baseline gap-4">
              <span class="w-36 shrink-0 text-2xs text-ms-text-placeholder">{{ t.label }}</span>
              <span :class="t.cls" class="font-semibold text-ms-text-primary">Mobile Saúde</span>
            </div>
          </div>
        </section>
        <section>
          <h3 class="mb-2 text-sm font-semibold text-ms-text-regular">Pesos</h3>
          <div class="space-y-2 rounded-lg border border-ms-border-light bg-ms-surface p-5">
            <div v-for="w in weights" :key="w.cls" class="flex items-baseline gap-4">
              <span class="w-40 shrink-0 text-2xs text-ms-text-placeholder">{{ w.label }}</span>
              <span :class="w.cls" class="text-lg text-ms-text-primary">Atendimento omnichannel</span>
            </div>
          </div>
        </section>
      </div>`,
  }),
}

export default meta
type Story = StoryObj<typeof meta>
export const Type: Story = {}
