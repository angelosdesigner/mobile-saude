import type { Meta, StoryObj } from '@storybook/vue3-vite'
import JornadaNotification from './JornadaNotification.vue'

const TEXTO =
  'Sua solicitação registrada na data 01/03/2026 sob o número de protocolo: 123. Foi aprovado. O valor 450,00 será reembolsado até 01/04/2026.'

const meta: Meta<typeof JornadaNotification> = {
  title: 'Ocorrências/Jornada/Notification',
  component: JornadaNotification,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          '`JornadaNotification` — notificação enviada ao beneficiário (PUSH / E-mail / WhatsApp). Cartão tracejado à direita, com ícone de sino e os parágrafos do conteúdo.',
      },
    },
  },
  args: {
    channel: 'WhatsApp',
    time: '29/02/2026 às 11:20',
    paragraphs: [TEXTO],
  },
  render: (args) => ({
    components: { JornadaNotification },
    setup: () => ({ args }),
    template: `<div class="w-[640px] max-w-full"><JornadaNotification v-bind="args" /></div>`,
  }),
}

export default meta
type Story = StoryObj<typeof meta>

export const Push: Story = { args: { channel: 'PUSH' } }
export const Email: Story = { args: { channel: 'E-mail', paragraphs: [TEXTO, 'Lorem ipsum dolor sit amet consectetur.'] } }
export const WhatsApp: Story = {}
