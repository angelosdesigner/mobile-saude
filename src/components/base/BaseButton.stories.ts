import type { Meta, StoryObj } from '@storybook/vue3-vite'
import BaseButton from './BaseButton.vue'

const meta: Meta<typeof BaseButton> = {
  title: 'Components/Buttons/BaseButton',
  component: BaseButton,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: [
          '`BaseButton` é o wrapper de botão do Design System sobre o Element Plus.',
          '',
          '**Casos de uso**',
          '- Ações primárias de um contexto (`primary`) — uma por vista.',
          '- Ações secundárias/neutras (`secondary`).',
          '- Confirmações de status (`success`), alertas (`warning`) e ações destrutivas (`danger`).',
          '- Ações terciárias/links de comando (`text`).',
          '',
          '**Boas práticas**',
          '- No máximo **uma** ação `primary` visível por bloco — preserva a hierarquia.',
          '- Use `loading` em ações assíncronas (dá feedback imediato e evita duplo clique).',
          '- Combine cor + rótulo claro; em ações por ícone, forneça `aria-label`.',
          '',
          '**Anti-patterns**',
          '- Vários botões `primary` competindo na mesma área.',
          '- Comunicar destrutivo só pela cor, sem rótulo explícito ("Excluir").',
          '- Usar `<el-button>` direto na tela em vez do wrapper.',
        ].join('\n'),
      },
    },
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'success', 'warning', 'danger', 'text'],
      description: 'Intenção visual do botão.',
    },
    size: { control: 'inline-radio', options: ['small', 'default', 'large'] },
    loading: { control: 'boolean' },
    disabled: { control: 'boolean' },
    block: { control: 'boolean' },
    onClick: { action: 'click' },
  },
  args: { variant: 'primary', size: 'default', loading: false, disabled: false, block: false },
  render: (args) => ({
    components: { BaseButton },
    setup: () => ({ args }),
    template: `<BaseButton v-bind="args">Confirmar</BaseButton>`,
  }),
}

export default meta
type Story = StoryObj<typeof meta>

/** Playground — ajuste as props pelos controles. */
export const Default: Story = {}

/** Todas as variantes lado a lado. */
export const Variants: Story = {
  parameters: { controls: { disable: true } },
  render: () => ({
    components: { BaseButton },
    template: `
      <div class="flex flex-wrap items-center gap-3">
        <BaseButton variant="primary">Primário</BaseButton>
        <BaseButton variant="secondary">Secundário</BaseButton>
        <BaseButton variant="success">Sucesso</BaseButton>
        <BaseButton variant="warning">Atenção</BaseButton>
        <BaseButton variant="danger">Perigo</BaseButton>
        <BaseButton variant="text">Texto</BaseButton>
      </div>`,
  }),
}

/** Tamanhos disponíveis. */
export const Sizes: Story = {
  parameters: { controls: { disable: true } },
  render: () => ({
    components: { BaseButton },
    template: `
      <div class="flex flex-wrap items-center gap-3">
        <BaseButton size="small">Pequeno</BaseButton>
        <BaseButton size="default">Padrão</BaseButton>
        <BaseButton size="large">Grande</BaseButton>
      </div>`,
  }),
}

/** Estados: padrão, carregando e desabilitado. (hover/focus/active são
 *  interativos — o foco visível segue o padrão de acessibilidade do app.) */
export const States: Story = {
  parameters: { controls: { disable: true } },
  render: () => ({
    components: { BaseButton },
    template: `
      <div class="flex flex-wrap items-center gap-3">
        <BaseButton>Padrão</BaseButton>
        <BaseButton loading>Carregando</BaseButton>
        <BaseButton disabled>Desabilitado</BaseButton>
      </div>`,
  }),
}

/** Largura total (formulários, drawers, mobile). */
export const Block: Story = {
  parameters: { controls: { disable: true } },
  render: () => ({
    components: { BaseButton },
    template: `<div class="max-w-xs"><BaseButton block>Continuar</BaseButton></div>`,
  }),
}
