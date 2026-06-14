import type { Meta, StoryObj } from '@storybook/vue3-vite'
import BaseTooltip from './BaseTooltip.vue'
import BaseButton from './BaseButton.vue'

const meta: Meta<typeof BaseTooltip> = {
  title: 'Components/Tooltips/BaseTooltip',
  component: BaseTooltip,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: [
          '`BaseTooltip` exibe uma dica contextual ao passar/focar no gatilho (slot default).',
          '',
          '**Boas práticas**: use para complementar (atalhos, detalhes secundários).',
          '',
          '**Anti-patterns**: colocar informação essencial só no tooltip — não fica acessível por leitor de tela/touch.',
        ].join('\n'),
      },
    },
  },
  argTypes: {
    placement: { control: 'inline-radio', options: ['top', 'bottom', 'left', 'right'] },
    disabled: { control: 'boolean' },
  },
  args: { content: 'Atualizar a lista', placement: 'top' },
  render: (args) => ({
    components: { BaseTooltip, BaseButton },
    setup: () => ({ args }),
    template: `
      <div class="flex justify-center py-6">
        <BaseTooltip v-bind="args"><BaseButton variant="secondary">Passe o mouse</BaseButton></BaseTooltip>
      </div>`,
  }),
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
export const Placements: Story = {
  parameters: { controls: { disable: true } },
  render: () => ({
    components: { BaseTooltip, BaseButton },
    template: `
      <div class="flex flex-wrap justify-center gap-8 py-10">
        <BaseTooltip content="Acima" placement="top"><BaseButton variant="secondary">Top</BaseButton></BaseTooltip>
        <BaseTooltip content="Abaixo" placement="bottom"><BaseButton variant="secondary">Bottom</BaseButton></BaseTooltip>
        <BaseTooltip content="Esquerda" placement="left"><BaseButton variant="secondary">Left</BaseButton></BaseTooltip>
        <BaseTooltip content="Direita" placement="right"><BaseButton variant="secondary">Right</BaseButton></BaseTooltip>
      </div>`,
  }),
}
