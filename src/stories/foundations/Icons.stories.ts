import type { Meta, StoryObj } from '@storybook/vue3-vite'
import AppIcon from '@/components/ui/AppIcon.vue'

// Ícones de chrome do app via AppIcon (servido pelo Lucide). O nome em
// kebab-case mapeia para o componente do Lucide; o tamanho/cor vêm das
// utilitárias (h-*/w-*/text-*), herdando currentColor.
const names = [
  'chevron-left',
  'chevron-right',
  'chevron-down',
  'search',
  'close',
  'plus',
  'sun',
  'moon',
  'eye',
  'edit',
] as const

const meta: Meta = {
  title: 'Foundations/Icons',
  component: AppIcon,
  parameters: {
    layout: 'fullscreen',
    controls: { disable: true },
    docs: {
      description: {
        component:
          'Ícones via `<AppIcon name="..." />` (Lucide por baixo, `@lucide/vue`). ' +
          'Dimensione/colorize por utilitárias: `<AppIcon name="search" class="h-5 w-5 text-ms-primary" />`.',
      },
    },
  },
  render: () => ({
    components: { AppIcon },
    setup: () => ({ names }),
    template: `
      <div class="flex flex-wrap gap-4">
        <div
          v-for="n in names"
          :key="n"
          class="flex w-20 flex-col items-center gap-2 rounded-lg border border-ms-border-light bg-ms-surface py-3 text-ms-text-regular"
        >
          <AppIcon :name="n" class="h-5 w-5" />
          <span class="text-2xs text-ms-text-placeholder">{{ n }}</span>
        </div>
      </div>`,
  }),
}

export default meta
type Story = StoryObj<typeof meta>
export const Gallery: Story = {}
