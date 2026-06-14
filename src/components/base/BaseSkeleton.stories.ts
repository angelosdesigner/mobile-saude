import type { Meta, StoryObj } from '@storybook/vue3-vite'
import BaseSkeleton from './BaseSkeleton.vue'

const meta: Meta<typeof BaseSkeleton> = {
  title: 'Components/Loaders/BaseSkeleton',
  component: BaseSkeleton,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: [
          '`BaseSkeleton` é o placeholder de carregamento (sobre el-skeleton). Mantém o layout ' +
            'estável e dá feedback imediato enquanto os dados chegam.',
          '',
          '**Boas práticas**: prefira skeleton ao spinner em listas/cards (menos "salto" visual). ' +
            'Use `aria-busy` (já incluso) para leitores de tela.',
          '',
          '**Anti-patterns**: spinner em tela cheia para conteúdo que pode ser esboçado.',
        ].join('\n'),
      },
    },
  },
  argTypes: {
    rows: { control: { type: 'number', min: 1, max: 8 } },
    loading: { control: 'boolean' },
    animated: { control: 'boolean' },
  },
  args: { rows: 3, loading: true, animated: true },
  render: (args) => ({
    components: { BaseSkeleton },
    setup: () => ({ args }),
    template: `<div class="max-w-md rounded-lg border border-ms-border-light bg-ms-surface p-4"><BaseSkeleton v-bind="args" /></div>`,
  }),
}

export default meta
type Story = StoryObj<typeof meta>

export const Loading: Story = {}
export const Loaded: Story = {
  args: { loading: false },
  render: (args) => ({
    components: { BaseSkeleton },
    setup: () => ({ args }),
    template: `
      <div class="max-w-md rounded-lg border border-ms-border-light bg-ms-surface p-4">
        <BaseSkeleton v-bind="args">
          <p class="text-sm text-ms-text-regular">Conteúdo carregado — o slot default substitui o esqueleto.</p>
        </BaseSkeleton>
      </div>`,
  }),
}
