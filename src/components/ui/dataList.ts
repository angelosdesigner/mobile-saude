// Tipos do componente compartilhado DataList (separados do .vue para poderem
// ser importados pelos consumidores).
export interface DataListColumn {
  key: string
  label: string
  width?: string | number
  minWidth?: string | number
  align?: 'left' | 'center' | 'right'
  sortable?: boolean
  /**
   * Valor usado na ordenação quando a célula é formatada/customizada (ex.: TME
   * "6:14" → segundos, status → severidade). Se ausente, ordena por `row[key]`.
   * Implica `sortable`.
   */
  sortBy?: (row: Record<string, unknown>) => string | number
  /** Coluna inicia oculta (aparece no gerenciador de colunas para ser ativada). */
  defaultHidden?: boolean
  /** Impede ocultar a coluna no gerenciador (ex.: identificador principal). */
  locked?: boolean
}
