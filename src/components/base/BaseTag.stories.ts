import type { Meta, StoryObj } from '@storybook/vue3-vite'
import BaseTag from './BaseTag.vue'

const meta: Meta<typeof BaseTag> = {
  title: 'Components/Tags/BaseTag',
  component: BaseTag,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: [
          '`BaseTag` é um rótulo curto (sobre el-tag) para **categorias/labels neutros** ' +
            '(canal, tipo, contagem).',
          '',
          '**Quando NÃO usar**: para indicar *status* do atendimento use `BaseBadge` ' +
            '(combina ícone + texto + cor).',
        ].join('\n'),
      },
    },
  },
  argTypes: {
    type: { control: 'select', options: ['primary', 'success', 'warning', 'danger', 'info'] },
    effect: { control: 'inline-radio', options: ['light', 'dark', 'plain'] },
    size: { control: 'inline-radio', options: ['small', 'default', 'large'] },
    round: { control: 'boolean' },
    closable: { control: 'boolean' },
  },
  args: { type: 'info', effect: 'light', size: 'default', round: false, closable: false },
  render: (args) => ({
    components: { BaseTag },
    setup: () => ({ args }),
    template: `<BaseTag v-bind="args">WhatsApp</BaseTag>`,
  }),
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Types: Story = {
  parameters: { controls: { disable: true } },
  render: () => ({
    components: { BaseTag },
    template: `
      <div class="flex flex-wrap items-center gap-2">
        <BaseTag type="primary">Primário</BaseTag>
        <BaseTag type="success">Sucesso</BaseTag>
        <BaseTag type="warning">Atenção</BaseTag>
        <BaseTag type="danger" effect="plain">Risco</BaseTag>
        <BaseTag type="info">Info</BaseTag>
      </div>`,
  }),
}

export const Closable: Story = {
  args: { closable: true, round: true },
  render: (args) => ({
    components: { BaseTag },
    setup: () => ({ args }),
    template: `<BaseTag v-bind="args">Filtro: Reembolso</BaseTag>`,
  }),
}
