import type { Meta, StoryObj } from '@storybook/vue3-vite'

// Raio de borda + sombra/elevação. Cards do produto usam rounded-lg/rounded-xl;
// elevação sobe com o nível (sm → md → lg) para cards interativos/flutuantes.
const radius = [
  { cls: 'rounded', label: 'rounded · 4px' },
  { cls: 'rounded-md', label: 'rounded-md · 6px' },
  { cls: 'rounded-lg', label: 'rounded-lg · 8px' },
  { cls: 'rounded-xl', label: 'rounded-xl · 12px' },
  { cls: 'rounded-full', label: 'rounded-full' },
]
const elevation = [
  { cls: 'shadow-sm', label: 'shadow-sm · card em repouso' },
  { cls: 'shadow', label: 'shadow · base' },
  { cls: 'shadow-md', label: 'shadow-md · hover/realce' },
  { cls: 'shadow-lg', label: 'shadow-lg · flutuante (FAB, popover)' },
]

const meta: Meta = {
  title: 'Foundations/Elevation',
  parameters: {
    layout: 'fullscreen',
    controls: { disable: true },
    docs: {
      description: {
        component: 'Raio de borda e elevação (sombra). Combinam para dar profundidade sem ruído.',
      },
    },
  },
  render: () => ({
    setup: () => ({ radius, elevation }),
    template: `
      <div class="space-y-6">
        <section>
          <h3 class="mb-3 text-sm font-semibold text-ms-text-regular">Raio de borda</h3>
          <div class="flex flex-wrap gap-4">
            <div v-for="r in radius" :key="r.cls" class="text-center">
              <div class="h-14 w-14 border-2 border-ms-primary bg-ms-primary-light" :class="r.cls" />
              <span class="mt-1 block text-2xs text-ms-text-secondary">{{ r.label }}</span>
            </div>
          </div>
        </section>
        <section>
          <h3 class="mb-3 text-sm font-semibold text-ms-text-regular">Elevação</h3>
          <div class="flex flex-wrap gap-6">
            <div v-for="e in elevation" :key="e.cls" class="text-center">
              <div class="h-14 w-20 rounded-lg border border-ms-border-lighter bg-ms-surface" :class="e.cls" />
              <span class="mt-2 block text-2xs text-ms-text-secondary">{{ e.label }}</span>
            </div>
          </div>
        </section>
      </div>`,
  }),
}

export default meta
type Story = StoryObj<typeof meta>
export const Tokens: Story = {}
