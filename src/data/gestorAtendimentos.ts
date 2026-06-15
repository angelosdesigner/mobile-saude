// Fixtures da aba "Atendimentos" (Gestão tempo real) — Figma 7894:109478.
import { canalDistribuicao } from '@/data/gestorTempoReal'

export { canalDistribuicao }

// Ocupação por canal vs capacidade (% de uso da capacidade operacional).
export const ocupacaoCanal = [
  { label: 'Chat/WhatsApp', value: 88 },
  { label: 'Telefone/Voz', value: 45 },
  { label: 'Balcão/Presencial', value: 30 },
]

// TME por canal (tempo médio de espera, em minutos).
export const tmeCanal = {
  gauge: { value: 12, max: 20, status: 'Crítico' as const },
  bars: [
    { label: 'Chat/WhatsApp', value: 12 },
    { label: 'Telefone', value: 4 },
  ],
}

// Atendimento automatizado — métricas com barra de progresso.
export interface AutomatizadoMetric {
  label: string
  value: string
  pct: number | null
  tone: 'success' | 'warning' | 'danger' | 'neutral'
  delta?: string
}

export const automatizado: AutomatizadoMetric[] = [
  { label: 'Taxa de retenção no bot', value: '68%', pct: 68, tone: 'success', delta: '↑ 2% hoje' },
  { label: 'Transferência para atendente', value: '32%', pct: 32, tone: 'warning' },
  { label: 'Taxa de abandono no bot', value: '9.3%', pct: 9.3, tone: 'danger' },
  { label: 'Tempo médio no fluxo', value: '4min', pct: null, tone: 'neutral' },
]

export const bannerAutomatizado =
  'Usuários abandonam após etapa de envio de documentos — principal causa de transferência para atendente.'
