// Fixtures da aba "Início" (Visão Geral do Atendimento) do dashboard de gestão
// em tempo real do gestor — Figma 7728:98915. Valores fiéis ao frame.

// Alvo de navegação de um card: a tela de indicadores (com indicador) ou a tela
// de atendimentos (com um filtro). A UI usa isso para redirecionar pré-selecionado.
export type CardTarget =
  | { type: 'indicador'; ind: string }
  | { type: 'atendimentos'; filtro: string }

export interface KpiGauge {
  label: string
  value: number // valor exibido (0–100 para %, ou nota)
  display: string // texto central ("78%", "4.6")
  delta: string
  deltaTone: 'up' | 'down' | 'neutral'
  meta: string
  tone: 'primary' | 'success' | 'purple'
  target: CardTarget
}

export const kpiGauges: KpiGauge[] = [
  {
    label: 'Fix Call Resolution',
    value: 78,
    display: '78%',
    delta: '↑ 1% hoje',
    deltaTone: 'up',
    meta: 'Meta: 80%',
    tone: 'primary',
    target: { type: 'indicador', ind: 'fix-call-resolution' },
  },
  {
    label: 'Resolução de Chamados',
    value: 82,
    display: '82%',
    delta: '↑ 3% hoje',
    deltaTone: 'up',
    meta: 'Meta: 90%',
    tone: 'success',
    target: { type: 'indicador', ind: 'resolucao-chamados' },
  },
  {
    label: 'NPS / Satisfação',
    value: 92,
    display: '4.6',
    delta: '↓ 0.1 hoje',
    deltaTone: 'down',
    meta: 'Meta: 5.0',
    tone: 'purple',
    target: { type: 'indicador', ind: 'nps' },
  },
]

// 4º card do Resumo Executivo (Figma): "Chamadas na fila" — taxa de abandono.
export const chamadasNaFila = {
  abandono: 6.4, // % abandonadas
  atendidas: 93.6, // %
  delta: '↑ 1,1% hoje',
  critico: true,
}

export interface MetricTile {
  label: string
  value: string
  delta: string
  deltaTone: 'up' | 'down' | 'neutral'
  target: CardTarget
}

export const metricTiles: MetricTile[] = [
  {
    label: 'Atendimentos',
    value: '31',
    delta: '+4 hoje',
    deltaTone: 'up',
    target: { type: 'atendimentos', filtro: 'todos' },
  },
  {
    label: 'TMA',
    value: '14min',
    delta: '↓ 1.2min hoje',
    deltaTone: 'up',
    target: { type: 'indicador', ind: 'tma' },
  },
  {
    label: 'Tempo médio na fila',
    value: '4,2min',
    delta: '↓ 1.2min hoje',
    deltaTone: 'up',
    target: { type: 'indicador', ind: 'tmef' },
  },
  {
    label: 'TME',
    value: '12min',
    delta: '↓ 1min hoje',
    deltaTone: 'up',
    target: { type: 'indicador', ind: 'tme' },
  },
]

export const andamento = [
  { label: 'Automatizado', value: 84, tone: 'primary' as const, filtro: 'automatizado' },
  { label: 'Aguardando fila', value: 23, tone: 'warning' as const, filtro: 'fila' },
  { label: 'Atendimento humano', value: 56, tone: 'teal' as const, filtro: 'humano' },
]

export const ocupacaoFila = [
  { label: 'Financeiro (Boleto)', value: 92, caption: '92% (20min)' },
  { label: 'Reembolso', value: 90, caption: '90% (15min)' },
  { label: 'Dúvidas Adm.', value: 84, caption: '84% (10min)' },
  { label: 'Autorizações', value: 45, caption: '45% (5min)' },
]

// Caption = % de ocupação + quantidade de atendimentos entre parênteses.
export const ocupacaoAtendente = [
  { label: 'Fernanda Paz', value: 95, caption: '95% (34)', avatar: 'FP' },
  { label: 'Paula Reis', value: 78, caption: '78% (27)', avatar: 'PR' },
  { label: 'Carlos Lima', value: 72, caption: '72% (21)', avatar: 'CL' },
  { label: 'Ana Souza', value: 60, caption: '60% (18)', avatar: 'AS' },
  { label: 'João Melo', value: 58, caption: '58% (15)', avatar: 'JM' },
]

export const canalDistribuicao = [
  { name: 'Chat/WhatsApp', value: 84, pct: '71%' },
  { name: 'Telefone', value: 27, pct: '23%' },
  { name: 'Balcão/Presencial', value: 7, pct: '6%' },
]

// Resumo do card de distribuição (abaixo da legenda de canais), fiel ao Figma.
export const canalResumo = {
  reabertura: '8% (12 casos)',
  slaConformidade: '96%',
}

// Abandono por fluxo — BOT vs Humano (%).
export const abandonoFluxo = {
  fluxos: ['Dúvidas Adm.', 'Reembolso', 'Autorizações', 'Financeiro (Boleto)'],
  bot: [8, 15, 2, 10],
  humano: [4, 2, 0, 12],
}

// Demanda × capacidade ao longo do dia.
export const demandaCapacidade = {
  horas: ['08h', '10h', '12h', '14h', '16h', '18h', '20h', '22h'],
  demanda: [10, 16, 24, 30, 28, 18, 12, 8],
  capacidade: 22,
}

export interface SegmentoCritico {
  canal: string
  fila: string
  turno: string
  volume: number
  abandonados: number
  atendDisp: string
  sla: number
  tme: string
  status: 'OK' | 'ALERTA' | 'CRÍTICO'
}

export const segmentosCriticos: SegmentoCritico[] = [
  {
    canal: 'WhatsApp',
    fila: 'Financeiro',
    turno: 'Manhã',
    volume: 842,
    abandonados: 124,
    atendDisp: '5/12',
    sla: 72,
    tme: '6:14',
    status: 'CRÍTICO',
  },
  {
    canal: 'WhatsApp',
    fila: 'Financeiro',
    turno: 'Tarde',
    volume: 614,
    abandonados: 43,
    atendDisp: '8/12',
    sla: 91,
    tme: '4:02',
    status: 'OK',
  },
  {
    canal: 'Chat',
    fila: 'Suporte',
    turno: 'Manhã',
    volume: 531,
    abandonados: 87,
    atendDisp: '3/8',
    sla: 68,
    tme: '7:48',
    status: 'ALERTA',
  },
  {
    canal: 'Chat',
    fila: 'Suporte',
    turno: 'Tarde',
    volume: 389,
    abandonados: 21,
    atendDisp: '6/8',
    sla: 94,
    tme: '3:12',
    status: 'OK',
  },
  {
    canal: 'Telefone',
    fila: 'SAC',
    turno: 'Manhã',
    volume: 276,
    abandonados: 52,
    atendDisp: '2/6',
    sla: 61,
    tme: '9:23',
    status: 'CRÍTICO',
  },
  {
    canal: 'Telefone',
    fila: 'SAC',
    turno: 'Tarde',
    volume: 198,
    abandonados: 18,
    atendDisp: '4/6',
    sla: 87,
    tme: '5:41',
    status: 'OK',
  },
  {
    canal: 'Balcão',
    fila: 'Presencial',
    turno: 'Manhã',
    volume: 143,
    abandonados: 8,
    atendDisp: '4/5',
    sla: 96,
    tme: '2:34',
    status: 'OK',
  },
  {
    canal: 'Portal',
    fila: 'Self-serv.',
    turno: 'Manhã',
    volume: 412,
    abandonados: 63,
    atendDisp: '2/4',
    sla: 74,
    tme: '5:17',
    status: 'ALERTA',
  },
  {
    canal: 'App',
    fila: 'Digital',
    turno: 'Noite',
    volume: 89,
    abandonados: 31,
    atendDisp: '1/3',
    sla: 55,
    tme: '12:40',
    status: 'CRÍTICO',
  },
]
