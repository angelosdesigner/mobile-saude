// Tipos da tela "Ocorrências — Gestão Operacional (Kanban)" da visão do gestor
// (Figma 8074:4666). Modelo diferente do board do atendente: 4 colunas por
// ESTÁGIO de atendimento, cada uma com um formato de card próprio.

export type GestorStage = 'automatizado' | 'fila' | 'humano' | 'concluido'

export type StageTone = 'primary' | 'warning' | 'teal' | 'success'

export interface StageMeta {
  key: GestorStage
  label: string
  tone: StageTone
}

// Metadados/cores de cada coluna (acento no topo + badge de contagem).
// Convenção de identidade (taxonomia): Automatizado/BOT = azul (primary),
// Atendimento humano = verde (success). Concluído usa teal; fila, amarelo.
export const stages: StageMeta[] = [
  { key: 'automatizado', label: 'Atendimento Automatizado', tone: 'primary' },
  { key: 'fila', label: 'Fila', tone: 'warning' },
  { key: 'humano', label: 'Atendimento Humano', tone: 'success' },
  { key: 'concluido', label: 'Concluídos hoje', tone: 'teal' },
]

// Chat e WhatsApp são o MESMO canal — tratados como "Chat/WhatsApp" nos
// agregados (ver normalizeCanal). No nível do card usamos 'WhatsApp'.
export type Canal = 'WhatsApp' | 'Portal' | 'App' | 'Telefone'

// Pílula de status do card (Novo, Chatbot, URA, App, Financeiro…).
export type PillTone = 'primary' | 'info' | 'warning' | 'success'
export interface CardPill {
  label: string
  tone: PillTone
}

// Estado de SLA do atendimento humano.
export type SlaState = 'Dentro' | 'Atenção' | 'Limite' | 'Estourou'

// Card único com campos opcionais por estágio (mock; o board renderiza o
// layout certo conforme `stage`).
export interface GestorCard {
  id: number
  stage: GestorStage
  beneficiary: string
  channel: Canal
  // automatizado
  fluxo?: string
  flag?: string
  risco?: boolean
  // fila
  filaTipo?: string
  posicao?: number
  espera?: string
  pill?: CardPill
  destaque?: boolean
  // humano
  atendente?: string
  tempoAtendimento?: string
  sla?: SlaState
  // concluído
  concluidoHora?: string
  total?: string
}

// Pílula da barra de status agregada (topo da tela).
export interface StatusPill {
  label: string
  value: number
  tone: StageTone | 'info'
}

// Card de métrica da linha de stats.
export interface GestorStat {
  label: string
  value: string
  tone: 'default' | 'danger' | 'warning' | 'success' | 'primary'
}

// Sub-contagens exibidas no header de cada coluna.
export interface StageHeader {
  key: GestorStage
  total: number
  metaLabel: string // ex.: "TRANSFERIDOS", "MAIOR ESPERA", "MÉDIA APÓS HMS"
  metaValue: string
}
