import type { Meta, StoryObj } from '@storybook/vue3-vite'
import JornadaSurveyResponse from './JornadaSurveyResponse.vue'

const meta: Meta<typeof JornadaSurveyResponse> = {
  title: 'Ocorrências/Jornada/SurveyResponse',
  component: JornadaSurveyResponse,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          '`JornadaSurveyResponse` — resposta da pesquisa de satisfação (do beneficiário, à esquerda). Cartão cinza com pergunta/resposta separadas por divisores e barra vertical à esquerda.',
      },
    },
  },
  args: {
    time: '29/02/2026 às 11:20',
    items: [
      { q: 'Como você avalia o atendimento recebido?', a: 'Excelente ⭐⭐⭐⭐⭐' },
      { q: 'Como você avalia a solução proposta para o seu problema?', a: 'Muito boa ⭐⭐⭐⭐☆' },
      { q: 'Como você avalia o tempo de resolução do seu atendimento?', a: '12/02/2026' },
      {
        q: 'Deseja fazer alguma observação sobre sua experiência?',
        a: 'Fui bem atendido e o problema foi resolvido, mas o tempo poderia ser um pouco mais rápido.',
      },
    ],
  },
  render: (args) => ({
    components: { JornadaSurveyResponse },
    setup: () => ({ args }),
    template: `<div class="w-[640px] max-w-full"><JornadaSurveyResponse v-bind="args" /></div>`,
  }),
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
