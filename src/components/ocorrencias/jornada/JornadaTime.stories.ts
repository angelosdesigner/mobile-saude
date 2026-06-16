import type { Meta, StoryObj } from '@storybook/vue3-vite'
import JornadaTime from './JornadaTime.vue'

const meta: Meta<typeof JornadaTime> = {
  title: 'Ocorrências/Jornada/Primitivos/Time',
  component: JornadaTime,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          '`JornadaTime` — rodapé de horário (cinza, 12px) reaproveitado por todos os cards. `author` adiciona o nome após um ponto separador (eventos de sistema); `align` posiciona à esquerda/direita.',
      },
    },
  },
  argTypes: {
    align: { control: 'inline-radio', options: ['left', 'right'] },
  },
  args: { time: '23/02/2026 às 16:15', align: 'left' },
  render: (args) => ({
    components: { JornadaTime },
    setup: () => ({ args }),
    template: `<div class="w-[440px] max-w-full"><JornadaTime v-bind="args" /></div>`,
  }),
}

export default meta
type Story = StoryObj<typeof meta>

export const SoHorario: Story = {}
export const ComAutor: Story = { args: { author: 'Juliana Santos' } }
export const Direita: Story = { args: { align: 'right' } }
