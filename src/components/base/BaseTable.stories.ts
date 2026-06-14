import type { Meta, StoryObj } from '@storybook/vue3-vite'
import BaseTable, { type BaseTableColumn } from './BaseTable.vue'
import BaseBadge from './BaseBadge.vue'

const columns: BaseTableColumn[] = [
  { prop: 'protocolo', label: 'Protocolo', width: 170 },
  { prop: 'beneficiario', label: 'Beneficiário', minWidth: 200 },
  { prop: 'fila', label: 'Fila', width: 160 },
  { prop: 'status', label: 'Status', width: 170 },
]

const data = [
  { id: 1, protocolo: 'OC-2026-001001', beneficiario: 'Maria Silva', fila: 'Reembolso', status: 'aberto' },
  { id: 2, protocolo: 'OC-2026-001002', beneficiario: 'João Pereira', fila: 'Autorização', status: 'analise' },
  { id: 3, protocolo: 'OC-2026-001003', beneficiario: 'Ana Costa', fila: 'Financeiro', status: 'aguardando' },
  { id: 4, protocolo: 'OC-2026-001004', beneficiario: 'Carlos Lima', fila: 'Reembolso', status: 'finalizado' },
]

const meta: Meta<typeof BaseTable> = {
  title: 'Components/Tables/BaseTable',
  component: BaseTable,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: [
          '`BaseTable` é a tabela enxuta do Design System (colunas tipadas + slot por célula).',
          '',
          '**Quando usar**: listas simples. Para a lista rica estilo Jira (seleção, accordion, ' +
            'gerenciador de colunas, paginação) use o `DataList`.',
          '',
          '**Boas práticas**: render de status via `BaseBadge` (cor + texto), não só cor.',
        ].join('\n'),
      },
    },
  },
  args: { columns, data, stripe: true },
  render: (args) => ({
    components: { BaseTable, BaseBadge },
    setup: () => {
      const tones: Record<string, { tone: 'info' | 'warning' | 'neutral' | 'success'; label: string }> = {
        aberto: { tone: 'info', label: 'Aberto' },
        analise: { tone: 'warning', label: 'Em análise' },
        aguardando: { tone: 'neutral', label: 'Aguardando usuário' },
        finalizado: { tone: 'success', label: 'Finalizado' },
      }
      return { args, tones }
    },
    template: `
      <BaseTable v-bind="args">
        <template #cell-status="{ value }">
          <BaseBadge
            :tone="tones[String(value)]?.tone"
            :label="tones[String(value)]?.label ?? String(value)"
          />
        </template>
      </BaseTable>`,
  }),
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
export const Empty: Story = { args: { data: [], emptyText: 'Nenhuma ocorrência para os filtros aplicados' } }
