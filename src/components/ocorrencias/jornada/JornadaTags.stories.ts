import type { Meta, StoryObj } from '@storybook/vue3-vite'
import JornadaTags from './JornadaTags.vue'

const meta: Meta<typeof JornadaTags> = {
  title: 'Ocorrências/Jornada/Primitivos/Tags',
  component: JornadaTags,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          '`JornadaTags` — chips de canal (contorno verde) usados no cartão de template ativo.',
      },
    },
  },
  args: { tags: ['WhatsApp', 'Push', 'E-mail'] },
  render: (args) => ({
    components: { JornadaTags },
    setup: () => ({ args }),
    template: `<JornadaTags v-bind="args" />`,
  }),
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
