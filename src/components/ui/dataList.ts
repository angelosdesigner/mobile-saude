// Tipos do componente compartilhado DataList (separados do .vue para poderem
// ser importados pelos consumidores).
export interface DataListColumn {
  key: string
  label: string
  width?: string | number
  minWidth?: string | number
  align?: 'left' | 'center' | 'right'
  sortable?: boolean
}
