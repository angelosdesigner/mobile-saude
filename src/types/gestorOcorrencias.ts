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
export const stages: StageMeta[] = [
  { key: 'automatizado', label: 'Atendimento Automatizado', tone: 'primary' },
  { key: 'fila', label: 'Fila', tone: 'warning' },
  { key: 'humano', label: 'Atendimento Humano', tone: 'success' },
  { key: 'concluido', label: 'Concluídos hoje', tone: 'teal' },
]

export type Canal = 'WhatsApp' | 'Portal' | 'App' | 'Telefone'

export type PillTone = 'primary' | 'info' | 'warning' | 'success'
export interface CardPill {
  label: string
  tone: PillTone
}

export type SlaState = 'Dentro' | 'Atenção' | 'Limite' | 'Estourou'

export type Prioridade = 'Alta' | 'Média' | 'Normal'

export interface GestorCard {
  id: number
  stage: GestorStage
  beneficiary: string
  channel: Canal
  // automatizado
  fluxo?: string
  no?: string        // nó atual do bot
  tempoBot?: string  // tempo no atendimento automatizado
  flag?: string
  risco?: boolean
  // fila
  filaTipo?: string
  posicao?: number
  espera?: string
  pill?: CardPill    // origem: Chatbot, App, URA…
  prioridade?: Prioridade
  destaque?: boolean
  // humano
  atendente?: string
  tempoAtendimento?: string
  sla?: SlaState
  // concluído
  concluidoHora?: string
  total?: string
  estrelas?: number  // avaliação de satisfação (NPS/CSAT do card)
}

export interface StatusPill {
  label: string
  value: number
  tone: StageTone | 'info'
}

export interface GestorStat {
  label: string
  value: string
  tone: 'default' | 'danger' | 'warning' | 'success' | 'primary'
}

export interface StageHeader {
  key: GestorStage
  total: number
  /** Sub-contagens do header da coluna. Tone opcional colore o valor. */
  meta: { label: string; value: string | number; tone?: 'warning' | 'danger' | 'success' }[]
}
