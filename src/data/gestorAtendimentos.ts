// Fixtures da aba "Atendimentos" (Gestão tempo real) — Figma 7894:109478.
import { canalDistribuicao } from '@/data/gestorTempoReal'
import type { IndicadorGeral } from '@/data/gestorIndicadoresGerais'

export { canalDistribuicao }

// Indicadores gerais (4 cards de topo). Total e quebra por estágio coerentes
// com `andamento` (gestorTempoReal): automatizado 84 + fila 23 + humano 56 = 163.
// Convenção de cor: automatizado/BOT=primary, fila=warning, humano=success.
export const indicadoresGerais: IndicadorGeral[] = [
  {
    label: 'Atendimentos',
    value: 100,
    display: '163',
    delta: '↑ 4 hoje',
    deltaTone: 'up',
    meta: 'em andamento agora',
    tone: 'primary',
  },
  {
    label: 'No automatizado',
    value: 52,
    display: '84',
    meta: '52% do total · Chatbot + URA',
    tone: 'primary',
  },
  {
    label: 'Pessoas na fila',
    value: 14,
    display: '23',
    delta: '↑ 3 hoje',
    deltaTone: 'danger',
    meta: '14% do total · aguardando',
    tone: 'warning',
  },
  {
    label: 'Na fila humana',
    value: 34,
    display: '56',
    meta: '34% do total · em atendimento',
    tone: 'success',
  },
]

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
