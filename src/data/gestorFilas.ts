// Fixtures da aba "Gestão de filas e atendimento humano" — Figma 7900:110616.
import { ocupacaoFila } from '@/data/gestorTempoReal'

export { ocupacaoFila }

export type MetricTone = 'default' | 'danger' | 'warning' | 'success' | 'primary'

export interface FilaMetric {
  label: string
  value: string
  sub: string
  tone: MetricTone
}

export const filaMetrics: FilaMetric[] = [
  { label: 'Total em fila', value: '29', sub: 'todos os canais', tone: 'default' },
  { label: 'Espera média', value: '6m 18s', sub: '↑ 2min vs. ontem', tone: 'danger' },
  { label: 'Capacidade livre', value: '22%', sub: '3 de 14 disponíveis', tone: 'warning' },
  { label: 'Maior espera', value: '14min', sub: 'WhatsApp · Fila N1', tone: 'danger' },
  { label: 'Alertas de fila', value: '8', sub: 'atend. acima do limite de TME', tone: 'danger' },
]

export const capacidade = {
  value: 18,
  max: 20,
  legend: '90% disponível',
  pausa: '2 atendentes em pausa',
}

export const equipeStatus = [
  { label: 'Disponível', value: 5, tone: 'success' as const },
  { label: 'Em atendimento', value: 14, tone: 'primary' as const },
  { label: 'Ocupados', value: 4, tone: 'warning' as const },
]

// Fila × TME por canal/equipe (dispersão): x = pessoas aguardando, y = TME (min),
// tamanho do ponto = % SLA cumprido.
export interface FilaPonto {
  nome: string
  pessoas: number
  tme: number
  sla: number
}

export const filaScatter: FilaPonto[] = [
  { nome: 'Reembolsos', pessoas: 12, tme: 14, sla: 45 },
  { nome: 'Autorizações', pessoas: 8, tme: 9, sla: 62 },
  { nome: 'Chat', pessoas: 6, tme: 6, sla: 78 },
  { nome: 'Telefone', pessoas: 3, tme: 3, sla: 95 },
  { nome: 'WhatsApp', pessoas: 4, tme: 4, sla: 92 },
]

export const bannerFilaWarn =
  'Fila Dúvidas Administrativas com 18 usuários em espera — TME acima do SLA (14min vs meta 8min).'
export const bannerFilaInfo =
  'Fila de Reembolsos crítica: 12 esperando + TME de 14min + SLA já em 45%. Alocar atendentes imediatamente.'
