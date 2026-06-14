import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { ref } from 'vue'
import BaseDrawer from './BaseDrawer.vue'
import BaseButton from './BaseButton.vue'

const meta: Meta<typeof BaseDrawer> = {
  title: 'Components/Overlays/BaseDrawer',
  component: BaseDrawer,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: [
          '`BaseDrawer` é o painel lateral do Design System (sobre el-drawer).',
          '',
          '**Casos de uso**: filtros avançados, detalhes e formulários secundários sem perder o contexto da lista.',
          '',
          '**Boas práticas**: `title` sempre; ações no footer; largura confortável (~32%).',
        ].join('\n'),
      },
    },
  },
  argTypes: {
    direction: { control: 'inline-radio', options: ['rtl', 'ltr', 'ttb', 'btt'] },
  },
  args: { title: 'Filtros avançados', size: '32%', direction: 'rtl' },
  render: (args) => ({
    components: { BaseDrawer, BaseButton },
    setup: () => {
      const open = ref(false)
      return { args, open }
    },
    template: `
      <div>
        <BaseButton variant="secondary" @click="open = true">Abrir drawer</BaseButton>
        <BaseDrawer v-model="open" v-bind="args">
          <p class="text-sm text-ms-text-regular">Conteúdo do painel (ex.: filtros, detalhes do atendimento).</p>
          <template #footer>
            <BaseButton variant="secondary" @click="open = false">Limpar</BaseButton>
            <BaseButton variant="primary" @click="open = false">Aplicar</BaseButton>
          </template>
        </BaseDrawer>
      </div>`,
  }),
}

export default meta
type Story = StoryObj<typeof meta>
export const Default: Story = {}
