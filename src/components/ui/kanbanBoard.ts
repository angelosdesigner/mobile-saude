// Tipos do KanbanBoard compartilhado.
export type KanbanTone = 'primary' | 'warning' | 'teal' | 'success' | 'danger' | 'neutral'

export interface KanbanColumn {
  key: string
  label: string
  tone: KanbanTone
  /** Sub-contagens exibidas no header da coluna (ex.: TOTAL / MAIOR ESPERA). */
  meta?: { label: string; value: string | number }[]
}
