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
    target: { kind: 'ocorrencias' },
  },
  {
    label: 'No automatizado',
    value: 52,
    display: '84',
    meta: '52% do total · Chatbot + URA',
    tone: 'primary',
    target: { kind: 'ocorrencias', query: { stage: 'automatizado' } },
  },
  {
    // Card 3: atendimento humano em curso vem antes da espera (macro→micro).
    label: 'Na fila humana',
    value: 34,
    display: '56',
    meta: '34% do total · em atendimento',
    tone: 'success',
    target: { kind: 'ocorrencias', query: { stage: 'humano' } },
  },
  {
    // Card 4: "Em espera na fila" (antes "Pessoas na fila"/"Fila em espera").
    label: 'Em espera na fila',
    value: 14,
    display: '23',
    delta: '↑ 3 hoje',
    deltaTone: 'danger',
    meta: '14% do total · aguardando',
    tone: 'warning',
    target: { kind: 'ocorrencias', query: { stage: 'fila' } },
  },
]

// Ocupação por canal vs capacidade (% de uso da capacidade operacional).
export const ocupacaoCanal = [
  { label: 'Chat/WhatsApp', value: 88 },
  { label: 'Telefone/Voz', value: 45 },
  { label: 'Balcão/Presencial', value: 30 },
]

// TME por canal (tempo médio de espera, em minutos). Card no padrão do
// "Capacidade Operacional": gauge semicircular + número central + linha de
// status colorida + subtexto; detalhamento por canal abaixo.
export const tmeCanal = {
  value: 12, // TME geral (min)
  max: 20, // escala do gauge
  meta: 5, // meta de TME (min)
  status: 'Crítico',
  statusTone: 'danger' as 'danger' | 'warning' | 'success',
  sub: 'meta 5 min · +7 acima',
  bars: [
    { label: 'Chat/WhatsApp', value: 12, tone: 'danger' as 'danger' | 'warning' | 'success' },
    { label: 'Telefone', value: 4, tone: 'success' as 'danger' | 'warning' | 'success' },
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
  { label: 'Taxa de retenção no automatizado', value: '68%', pct: 68, tone: 'success', delta: '↑ 2% hoje' },
  { label: 'Transferência para atendente', value: '32%', pct: 32, tone: 'warning' },
  { label: 'Taxa de abandono no automatizado', value: '9.3%', pct: 9.3, tone: 'danger' },
  { label: 'Tempo médio no fluxo', value: '4min', pct: null, tone: 'neutral' },
]

// Fluxos mais acessados no BOT (sessões ativas, média 24h).
export const fluxosMaisAcessados = {
  itens: [
    { label: 'Reembolsos', value: 42 },
    { label: 'Negativas e Exames', value: 26 },
    { label: 'Ouvidoria e Reanálise', value: 18 },
    { label: 'Alta Complex.', value: 10 },
  ],
  totalSessoes: 96,
  atendimentosDia: '1.247',
  delta: '↑ 12% vs semana anterior',
}

// Setores onde o BOT é mais eficiente (% resolvidos sem transbordo).
export const setoresBotEficiente = {
  meta: 70,
  itens: [
    { label: 'Ouvidoria e Reanálise', value: 80 },
    { label: 'Negativas e Exames', value: 75 },
    { label: 'Reembolsos', value: 60 },
    { label: 'Alta Complexidade', value: 40 },
  ],
  resumo: 'Setores acima da meta: 2/4 · revisar fluxos abaixo',
}

// Fluxos com maior taxa de abandono dentro do BOT (%).
export interface FluxoAbandono {
  label: string
  value: number
  tone: 'danger' | 'warning' | 'success'
}
export const fluxosMaiorAbandono: FluxoAbandono[] = [
  { label: 'Reembolsos Envio Docs', value: 15, tone: 'danger' },
  { label: 'Alta Complex.', value: 12, tone: 'warning' },
  { label: 'Negativas e Exames', value: 8, tone: 'warning' },
  { label: 'Autorizações', value: 5, tone: 'success' },
]
export const fluxosMaiorAbandonoResumo = {
  gargalo: 'Maior gargalo: nó "Envio de Documentos"',
  acao: 'Revisar UX de captura para reduzir abandono',
}

// Insights da automação (diagnóstico textual).
export const insightsAutomatizado = [
  'Taxa de retenção de 72% com tempo médio de 1m 45s indica automação eficiente em demandas simples — porém o abandono de 15% no nó de "Envio de Documentos" do fluxo de Reembolsos sugere falha na ferramenta de captura ou falta de clareza nas instruções.',
  'Alta Complexidade apresenta 58% de transbordo humano — considere revisar se esse fluxo deve permanecer no bot ou ser roteado diretamente para atendimento especializado, reduzindo tempo médio de espera na fila humana.',
]

export const bannerAutomatizado =
  'Usuários abandonam após etapa de envio de documentos — principal causa de transferência para atendente.'
