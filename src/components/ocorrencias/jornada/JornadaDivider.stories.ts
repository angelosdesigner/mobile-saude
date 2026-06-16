import type { Meta, StoryObj } from '@storybook/vue3-vite'
import JornadaDivider from './JornadaDivider.vue'

const meta: Meta<typeof JornadaDivider> = {
  title: 'Ocorrências/Jornada/Divider',
  component: JornadaDivider,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          '`JornadaDivider` — marcador de data (pílula central com linhas laterais) que separa os dias na timeline da jornada do atendimento.',
      },
    },
  },
  args: { date: '23/02/2026' },
  render: (args) => ({
    components: { JornadaDivider },
    setup: () => ({ args }),
    template: `<div class="w-[640px] max-w-full"><JornadaDivider v-bind="args" /></div>`,
  }),
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
