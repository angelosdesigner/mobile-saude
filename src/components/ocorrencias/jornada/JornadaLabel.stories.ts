import type { Meta, StoryObj } from '@storybook/vue3-vite'
import JornadaLabel from './JornadaLabel.vue'

const meta: Meta<typeof JornadaLabel> = {
  title: 'Ocorrências/Jornada/Primitivos/Label',
  component: JornadaLabel,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          '`JornadaLabel` — rótulo pequeno acima de um card (nome do autor sobre balões/anotações/templates, ou títulos como "Resposta de pesquisa" / "Envio do formulário"). `align` define esquerda/direita.',
      },
    },
  },
  argTypes: {
    align: { control: 'inline-radio', options: ['left', 'right'] },
  },
  args: { text: 'Juliana Santos', align: 'right' },
  render: (args) => ({
    components: { JornadaLabel },
    setup: () => ({ args }),
    template: `<div class="w-[440px] max-w-full"><JornadaLabel v-bind="args" /></div>`,
  }),
}

export default meta
type Story = StoryObj<typeof meta>

export const Direita: Story = {}
export const Esquerda: Story = { args: { text: 'Envio do formulário', align: 'left' } }
