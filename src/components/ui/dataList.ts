// Tipos do componente compartilhado DataList (separados do .vue para poderem
// ser importados pelos consumidores).
export interface DataListColumn {
  key: string
  label: string
  width?: string | number
  minWidth?: string | number
  align?: 'left' | 'center' | 'right'
  sortable?: boolean
  /** Coluna inicia oculta (aparece no gerenciador de colunas para ser ativada). */
  defaultHidden?: boolean
  /** Impede ocultar a coluna no gerenciador (ex.: identificador principal). */
  locked?: boolean
}
