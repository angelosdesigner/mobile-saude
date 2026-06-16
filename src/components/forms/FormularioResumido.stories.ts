import type { Meta, StoryObj } from '@storybook/vue3-vite'
import FormularioResumido from './FormularioResumido.vue'

const meta: Meta<typeof FormularioResumido> = {
  title: 'Forms/FormularioResumido',
  component: FormularioResumido,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          '`FormularioResumido` — espelho do componente do Figma `2635:25501`. Resumo numerado de um formulário enviado: número + linha vertical + campos (rótulo sobre valor, separados por divisores) + seta de detalhe à direita. Genérico/reutilizável (origem em outra tela), recebe os campos por prop.',
      },
    },
  },
  args: {
    numero: 1,
    campos: [
      { label: 'CPF ou CNPJ', value: '07805206708' },
      { label: 'Cidade', value: 'Brasília' },
      { label: 'Data da despesa', value: '12/02/2026' },
      { label: 'Valor da despesa', value: '400,90' },
    ],
  },
  render: (args) => ({
    components: { FormularioResumido },
    setup: () => ({ args }),
    template: `<div class="w-[430px] max-w-full rounded-lg bg-ms-fill-light p-4"><FormularioResumido v-bind="args" /></div>`,
  }),
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
