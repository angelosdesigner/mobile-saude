import type { Meta, StoryObj } from '@storybook/vue3-vite'
import SlaBadge from './SlaBadge.vue'

const meta: Meta<typeof SlaBadge> = {
  title: 'Atendimento/SlaBadge',
  component: SlaBadge,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: [
          '`SlaBadge` mostra o estado de SLA combinando cor + texto (sobre `BaseBadge`).',
          '',
          '**Mapa**: Dentro → success · Atenção/Limite → warning · Estourou → danger.',
          '',
          '**Boas práticas**: fonte única do estado de SLA — use em cards e listas para consistência.',
        ].join('\n'),
      },
    },
  },
  argTypes: {
    state: { control: 'inline-radio', options: ['Dentro', 'Atenção', 'Limite', 'Estourou'] },
  },
  args: { state: 'Dentro' },
  render: (args) => ({
    components: { SlaBadge },
    setup: () => ({ args }),
    template: `<SlaBadge v-bind="args" />`,
  }),
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
export const Todos: Story = {
  parameters: { controls: { disable: true } },
  render: () => ({
    components: { SlaBadge },
    template: `
      <div class="flex flex-wrap gap-2">
        <SlaBadge state="Dentro" />
        <SlaBadge state="Atenção" />
        <SlaBadge state="Limite" />
        <SlaBadge state="Estourou" />
      </div>`,
  }),
}
