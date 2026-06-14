import type { Meta, StoryObj } from '@storybook/vue3-vite'
import BaseCard from './BaseCard.vue'

const meta: Meta<typeof BaseCard> = {
  title: 'Components/Cards/BaseCard',
  component: BaseCard,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: [
          '`BaseCard` é o contêiner padrão de card (superfície, borda, raio, sombra) com slot ' +
            'default + footer.',
          '',
          '**Boas práticas**: use `interactive` para cards clicáveis — já vem acessível ' +
            '(role=button, foco e Enter/Espaço). `tone="danger"` para realce (ex.: risco).',
        ].join('\n'),
      },
    },
  },
  argTypes: { tone: { control: 'inline-radio', options: ['default', 'danger', 'primary'] } },
  args: { interactive: false, tone: 'default' },
  render: (args) => ({
    components: { BaseCard },
    setup: () => ({ args }),
    template: `
      <div class="max-w-xs">
        <BaseCard v-bind="args">
          <div class="text-sm font-semibold text-ms-text-primary">Título do card</div>
          <p class="mt-1 text-xs text-ms-text-regular">Conteúdo do card via slot default.</p>
          <template #footer><span class="text-ms-text-secondary">Rodapé</span></template>
        </BaseCard>
      </div>`,
  }),
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
export const Interactive: Story = { args: { interactive: true } }
export const RiscoRealce: Story = { args: { tone: 'danger' } }
