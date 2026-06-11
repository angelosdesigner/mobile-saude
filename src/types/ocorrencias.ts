// Tipos e constantes de domínio da feature "Ocorrências".
// As listas de opções são a fonte única da verdade: os union types são
// derivados delas (`as const`), evitando duplicação entre tipos e dados.

export type TagType = 'primary' | 'success' | 'warning' | 'info' | 'danger'

export type ColumnKey =
  | 'NOVO'
  | 'EM ATENDIMENTO'
  | 'EM ESPERA'
  | 'ENCAMINHAMENTOS'
  | 'CONCLUÍDOS NO DIA'

export const columns: ColumnKey[] = [
  'NOVO',
  'EM ATENDIMENTO',
  'EM ESPERA',
  'ENCAMINHAMENTOS',
  'CONCLUÍDOS NO DIA',
]

// Rótulo "humano" de cada coluna (usado no Configurar colunas e nas mensagens).
export const columnLabel: Record<ColumnKey, string> = {
  NOVO: 'Novo',
  'EM ATENDIMENTO': 'Em atendimento',
  'EM ESPERA': 'Em espera',
  ENCAMINHAMENTOS: 'Encaminhamentos',
  'CONCLUÍDOS NO DIA': 'Concluídos no dia',
}

// ── Opções dos filtros (fonte da verdade dos union types) ────────────────────
export const prioridadeOptions = ['Alta', 'Média', 'Baixa'] as const
export const slaOptions = ['Crítico', 'Vencido', 'Atenção', 'Dentro do prazo', 'Sem SLA'] as const
export const tipoOcorrenciaOptions = [
  'Autorização',
  'Reembolso',
  'Segunda via',
  'Reclamação',
  'Cancelamento',
] as const
export const tipoAtendimentoOptions = [
  'App',
  'WhatsApp',
  'Portal Web',
  'Telefone',
  'Presencial',
] as const
export const atendenteOptions = [
  'João Pereira',
  'Maria Santos',
  'Carlos Oliveira',
  'Ana Costa',
  'Não atribuídos',
] as const

export type Prioridade = (typeof prioridadeOptions)[number]
export type SlaStatus = (typeof slaOptions)[number]
export type TipoOcorrencia = (typeof tipoOcorrenciaOptions)[number]
export type Canal = (typeof tipoAtendimentoOptions)[number]
export type Atendente = (typeof atendenteOptions)[number]

export interface Ocorrencia {
  id: number
  protocol: string
  beneficiary: string
  tipo: string
  assunto: string
  status: string
  statusType: TagType
  risk: boolean
  time: string
  timeType: TagType // success | warning | danger
  channel: Canal
  assignee?: string
  column: ColumnKey
  // Dimensões usadas pelos filtros (multi-select).
  prioridade: Prioridade
  sla: SlaStatus
  tipoOcorrencia: TipoOcorrencia
  tipoAtendimento: Canal
  atendente: Atendente
}

export interface ColumnCfg {
  key: ColumnKey
  label: string
  visible: boolean
}

export interface NotificacaoItem {
  id: number
  type: 'warning' | 'info' | 'danger' | 'success'
  title: string
  desc: string
  time: string
  unread: boolean
}

// Chaves de filtro que um preset pode preencher.
export type PresetFilterKey =
  | 'prioridade'
  | 'sla'
  | 'tipoOcorrencia'
  | 'tipoAtendimento'
  | 'atendente'

export interface SavedFilter {
  name: string
  apply: Partial<Record<PresetFilterKey, string[]>>
}

// Estado de filtros (multi-select). Mantido como string[] porque os valores
// vêm de <el-select>/<el-check-tag> e são restringidos pelas opções na UI.
export interface FilterState {
  prioridade: string[]
  sla: string[]
  tipoOcorrencia: string[]
  tipoAtendimento: string[]
  atendente: string[]
  status: string[] // chaves de coluna (usado pelos filtros avançados)
  assunto: string
}
