// Tipos do componente compartilhado FilterChips (chips de estatística clicáveis,
// usados como filtros rápidos multi-seleção no painel do atendente e do gestor).

export type ChipTone = 'neutral' | 'primary' | 'warning' | 'success' | 'danger' | 'teal'

export interface FilterChip {
  key: string
  label: string
  value: number | string
  tone: ChipTone
  /** false = chip informativo que limpa a seleção ao ser clicado (ex.: "Total"). */
  filterable?: boolean
}
