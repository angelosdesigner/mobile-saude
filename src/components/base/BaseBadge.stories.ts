import type { Meta, StoryObj } from '@storybook/vue3-vite'
import BaseBadge from './BaseBadge.vue'

const meta: Meta<typeof BaseBadge> = {
  title: 'Components/Badges/BaseBadge',
  component: BaseBadge,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: [
          '`BaseBadge` comunica **status** combinando cor + ponto/ícone + texto — nunca só cor.',
          '',
          '**Casos de uso**: estados do produto (Aberto, Em análise, Aguardando usuário, Finalizado), SLA, sinalizações.',
          '',
          '**Boas práticas**: `label` sempre presente; escolha o `tone` pela semântica (success = ok, warning = atenção, danger = risco/estouro).',
          '',
          '**Anti-patterns**: usar só a cor (ex.: bolinha sem texto) para indicar estado.',
        ].join('\n'),
      },
    },
  },
  argTypes: {
    tone: { control: 'select', options: ['neutral', 'info', 'success', 'warning', 'danger'] },
    label: { control: 'text' },
  },
  args: { tone: 'info', label: 'Em análise' },
  render: (args) => ({
    components: { BaseBadge },
    setup: () => ({ args }),
    template: `<BaseBadge v-bind="args" />`,
  }),
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

/** Estados padrão do produto mapeados aos tons. */
export const ProductStates: Story = {
  parameters: { controls: { disable: true } },
  render: () => ({
    components: { BaseBadge },
    template: `
      <div class="flex flex-wrap gap-2">
        <BaseBadge tone="info" label="Aberto" />
        <BaseBadge tone="warning" label="Em análise" />
        <BaseBadge tone="neutral" label="Aguardando usuário" />
        <BaseBadge tone="success" label="Finalizado" />
      </div>`,
  }),
}

/** Todos os tons. */
export const Tones: Story = {
  parameters: { controls: { disable: true } },
  render: () => ({
    components: { BaseBadge },
    template: `
      <div class="flex flex-wrap gap-2">
        <BaseBadge tone="neutral" label="Neutro" />
        <BaseBadge tone="info" label="Informação" />
        <BaseBadge tone="success" label="Sucesso" />
        <BaseBadge tone="warning" label="Atenção" />
        <BaseBadge tone="danger" label="Risco" />
      </div>`,
  }),
}
