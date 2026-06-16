import type { Meta, StoryObj } from '@storybook/vue3-vite'
import JornadaSurvey from './JornadaSurvey.vue'

const meta: Meta<typeof JornadaSurvey> = {
  title: 'Ocorrências/Jornada/Survey',
  component: JornadaSurvey,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          '`JornadaSurvey` — convite de pesquisa de satisfação enviado ao beneficiário (à direita), com texto e seletor de nota (5 estrelas).',
      },
    },
  },
  args: {
    text: 'Como foi o seu atendimento? Sua opinião é muito importante para nós. Acesse o link e avalie.',
    time: '29/02/2026 às 11:20',
  },
  render: (args) => ({
    components: { JornadaSurvey },
    setup: () => ({ args }),
    template: `<div class="w-[640px] max-w-full"><JornadaSurvey v-bind="args" /></div>`,
  }),
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
