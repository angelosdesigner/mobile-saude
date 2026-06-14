import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { ref } from 'vue'
import BaseModal from './BaseModal.vue'
import BaseButton from './BaseButton.vue'

const meta: Meta<typeof BaseModal> = {
  title: 'Components/Overlays/BaseModal',
  component: BaseModal,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: [
          '`BaseModal` é o diálogo modal do Design System (sobre el-dialog): foco preso, ' +
            'fechar por ESC/overlay e `role="dialog"`.',
          '',
          '**Casos de uso**: confirmações, formulários curtos, ações que exigem foco total.',
          '',
          '**Boas práticas**: `title` sempre (rótulo acessível); ação primária à direita no footer.',
          '',
          '**Anti-patterns**: modal para fluxos longos (use página/drawer); empilhar modais.',
        ].join('\n'),
      },
    },
  },
  args: { title: 'Confirmar ação', width: 480 },
  render: (args) => ({
    components: { BaseModal, BaseButton },
    setup: () => {
      const open = ref(false)
      return { args, open }
    },
    template: `
      <div>
        <BaseButton @click="open = true">Abrir modal</BaseButton>
        <BaseModal v-model="open" v-bind="args">
          <p class="text-sm text-ms-text-regular">
            Deseja finalizar este atendimento? Esta ação encerra a conversa e registra o protocolo.
          </p>
          <template #footer>
            <BaseButton variant="secondary" @click="open = false">Cancelar</BaseButton>
            <BaseButton variant="primary" @click="open = false">Finalizar</BaseButton>
          </template>
        </BaseModal>
      </div>`,
  }),
}

export default meta
type Story = StoryObj<typeof meta>
export const Default: Story = {}
