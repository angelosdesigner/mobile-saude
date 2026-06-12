// Fixtures do "Centro de Indicadores Operacionais" do gestor — Figma 7651:87503
// (+ detalhes 8008:*). A tela é parametrizada pelo indicador ativo (?ind=).

export type IndicadorKey = 'fcr' | 'resolucao' | 'tme' | 'tmef' | 'nps'

export interface IndicadorKpi {
  key: IndicadorKey
  label: string
  short: string
  value: string
  status: 'ok' | 'warning' | 'danger'
}

// Cards seletores (linha "Indicadores estratégicos").
export const indicadorKpis: IndicadorKpi[] = [
  { key: 'fcr', label: 'FCR', short: 'FCR', value: '73%', status: 'warning' },
  { key: 'resolucao', label: 'Resol. de chamados', short: 'Resolução', value: '91%', status: 'ok' },
  { key: 'tme', label: 'TME', short: 'TME', value: '12min', status: 'danger' },
  { key: 'tmef', label: 'TMEF', short: 'TMEF', value: '4,2min', status: 'warning' },
  { key: 'nps', label: 'NPS', short: 'NPS', value: '50', status: 'ok' },
]

export interface IndicadorDetalhe {
  titulo: string // "Evolução Temporal - TME"
  valor: string
  delta: string
  deltaTone: 'up' | 'down' | 'neutral'
  unidade: string
  serieAtual: number[]
  serieAnterior: number[]
  meta: number
  comparacoes: { label: string; value: string; tone: 'up' | 'down' | 'neutral' }[]
  pioresSegmentos: { label: string; value: string }[]
}

const dias = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom']

export const detalhePorIndicador: Record<IndicadorKey, IndicadorDetalhe> = {
  fcr: {
    titulo: 'Evolução Temporal — FCR',
    valor: '73%',
    delta: '↓ 2pp vs período anterior',
    deltaTone: 'down',
    unidade: '%',
    serieAtual: [76, 75, 74, 73, 72, 73, 73],
    serieAnterior: [78, 77, 77, 76, 75, 75, 75],
    meta: 80,
    comparacoes: [
      { label: 'vs Meta (80%)', value: '-7 pp', tone: 'down' },
      { label: 'vs Semana anterior', value: '-2 pp', tone: 'down' },
      { label: 'vs Mesmo dia mês passado', value: '-1,5 pp', tone: 'down' },
    ],
    pioresSegmentos: [
      { label: 'Fila Financeiro', value: '61%' },
      { label: 'Canal Telefone', value: '64%' },
      { label: 'Equipe Supervisor B', value: '66%' },
    ],
  },
  resolucao: {
    titulo: 'Evolução Temporal — Resolução de Chamados',
    valor: '91%',
    delta: '↑ 3pp vs período anterior',
    deltaTone: 'up',
    unidade: '%',
    serieAtual: [88, 89, 90, 90, 91, 91, 91],
    serieAnterior: [86, 86, 87, 88, 88, 88, 88],
    meta: 90,
    comparacoes: [
      { label: 'vs Meta (90%)', value: '+1 pp', tone: 'up' },
      { label: 'vs Semana anterior', value: '+3 pp', tone: 'up' },
      { label: 'vs Mesmo dia mês passado', value: '+2 pp', tone: 'up' },
    ],
    pioresSegmentos: [
      { label: 'Fila Autorizações', value: '82%' },
      { label: 'Canal Portal', value: '84%' },
      { label: 'Equipe Noturna', value: '85%' },
    ],
  },
  tme: {
    titulo: 'Evolução Temporal — TME',
    valor: '12min',
    delta: '↑ 1min vs período anterior',
    deltaTone: 'down',
    unidade: 'min',
    serieAtual: [13, 14, 13, 12, 12, 11, 12],
    serieAnterior: [11, 11, 12, 12, 11, 11, 11],
    meta: 10,
    comparacoes: [
      { label: 'vs Meta (10min)', value: '+2 min', tone: 'down' },
      { label: 'vs Semana anterior', value: '+1 min', tone: 'down' },
      { label: 'vs Mesmo dia mês passado', value: '+2,3 min', tone: 'down' },
    ],
    pioresSegmentos: [
      { label: 'Fila Dúvidas Adm.', value: '65%' },
      { label: 'Canal Telefone', value: '71%' },
      { label: 'Equipe Supervisor B', value: '74%' },
    ],
  },
  tmef: {
    titulo: 'Evolução Temporal — TMEF',
    valor: '4,2min',
    delta: '↓ 1,2min vs período anterior',
    deltaTone: 'up',
    unidade: 'min',
    serieAtual: [5.4, 5.0, 4.8, 4.5, 4.3, 4.2, 4.2],
    serieAnterior: [6.0, 5.8, 5.5, 5.2, 5.0, 4.9, 4.8],
    meta: 4,
    comparacoes: [
      { label: 'vs Meta (4min)', value: '+0,2 min', tone: 'down' },
      { label: 'vs Semana anterior', value: '-1,2 min', tone: 'up' },
      { label: 'vs Mesmo dia mês passado', value: '-0,8 min', tone: 'up' },
    ],
    pioresSegmentos: [
      { label: 'Fila Financeiro', value: '7,1min' },
      { label: 'Canal WhatsApp', value: '6,3min' },
      { label: 'Equipe Manhã', value: '5,9min' },
    ],
  },
  nps: {
    titulo: 'Evolução Temporal — NPS',
    valor: '50',
    delta: '↑ 4 pts vs período anterior',
    deltaTone: 'up',
    unidade: '',
    serieAtual: [44, 46, 47, 48, 49, 50, 50],
    serieAnterior: [40, 41, 43, 44, 45, 46, 46],
    meta: 55,
    comparacoes: [
      { label: 'vs Meta (55)', value: '-5 pts', tone: 'down' },
      { label: 'vs Semana anterior', value: '+4 pts', tone: 'up' },
      { label: 'vs Mesmo dia mês passado', value: '+6 pts', tone: 'up' },
    ],
    pioresSegmentos: [
      { label: 'Fila Reembolso', value: '38' },
      { label: 'Canal Telefone', value: '41' },
      { label: 'Equipe Supervisor B', value: '43' },
    ],
  },
}

export { dias }

// Pontos de segmentação (volume × indicador) — bolhas por canal/fila/equipe.
export interface BolhaSegmento {
  nome: string
  volume: number
  valor: number
  size: number
  status: 'ok' | 'warning' | 'danger'
}

export const segmentacao: BolhaSegmento[] = [
  { nome: 'Balcão Autoriz.', volume: 300, valor: 4, size: 22, status: 'ok' },
  { nome: 'Chat Reembolso', volume: 700, valor: 8, size: 30, status: 'warning' },
  { nome: 'WhatsApp Dúvidas', volume: 1100, valor: 9, size: 34, status: 'warning' },
  { nome: 'Tel. Dúvidas Adm.', volume: 600, valor: 16, size: 28, status: 'danger' },
  { nome: 'Telefone Reemb.', volume: 1500, valor: 13, size: 40, status: 'danger' },
  { nome: 'WhatsApp Financ.', volume: 2600, valor: 6, size: 46, status: 'ok' },
  { nome: 'Tel. Autoriz.', volume: 2400, valor: 12, size: 44, status: 'warning' },
]

export interface SegmentoLinha {
  segmento: string
  volume: number
  atendidos: number
  abandonados: number
  disponiveis: number
  tme: string
  metaTme: string
  tma: string
  csat: number
  tendencia: 'Piorando' | 'Estável' | 'Melhorando'
}

export const segmentosCriticos: SegmentoLinha[] = [
  {
    segmento: 'Telefone - Dúvidas Adm. - Eq. B',
    volume: 342,
    atendidos: 298,
    abandonados: 44,
    disponiveis: 12,
    tme: '16min',
    metaTme: '-1min',
    tma: '14min',
    csat: 3,
    tendencia: 'Piorando',
  },
  {
    segmento: 'Telefone - Reembolso - Eq. C',
    volume: 287,
    atendidos: 241,
    abandonados: 46,
    disponiveis: 8,
    tme: '13min',
    metaTme: '-3min',
    tma: '10min',
    csat: 3,
    tendencia: 'Piorando',
  },
  {
    segmento: 'Telefone - Autorizações - Eq. A',
    volume: 256,
    atendidos: 213,
    abandonados: 43,
    disponiveis: 10,
    tme: '11min',
    metaTme: '-1min',
    tma: '11min',
    csat: 3,
    tendencia: 'Estável',
  },
  {
    segmento: 'Chat - Dúvidas Adm. - Eq. B',
    volume: 412,
    atendidos: 378,
    abandonados: 34,
    disponiveis: 16,
    tme: '5min',
    metaTme: '+8min',
    tma: '5min',
    csat: 3,
    tendencia: 'Estável',
  },
  {
    segmento: 'WhatsApp - Dúvidas Adm. - Eq. A',
    volume: 528,
    atendidos: 489,
    abandonados: 39,
    disponiveis: 14,
    tme: '4min',
    metaTme: '+5min',
    tma: '4min',
    csat: 4,
    tendencia: 'Melhorando',
  },
  {
    segmento: 'Chat - Reembolso - Eq. B',
    volume: 376,
    atendidos: 334,
    abandonados: 42,
    disponiveis: 10,
    tme: '8min',
    metaTme: '+2min',
    tma: '8min',
    csat: 3,
    tendencia: 'Estável',
  },
  {
    segmento: 'WhatsApp - Autorizações - Eq. A',
    volume: 245,
    atendidos: 221,
    abandonados: 24,
    disponiveis: 14,
    tme: '3min',
    metaTme: '+8min',
    tma: '3min',
    csat: 4,
    tendencia: 'Melhorando',
  },
  {
    segmento: 'Balcão - Autorizações - Eq. D',
    volume: 94,
    atendidos: 82,
    abandonados: 12,
    disponiveis: 7,
    tme: '2min',
    metaTme: '+7min',
    tma: '2min',
    csat: 4,
    tendencia: 'Estável',
  },
]

export interface Recomendacao {
  titulo: string
  descricao: string
  impacto: string
  acao: string
  destaque: boolean
}

export const diagnostico =
  'A queda de 4,1pp no SLA concentra-se na fila Dúvidas Administrativas (65% SLA, -6pp vs meta) durante a janela 13h-17h. Demanda atípica iniciada na 4ª feira (+27% vs base histórica) precedeu o impacto, com Equipe B como foco operacional.'

export const recomendacoes: Recomendacao[] = [
  {
    titulo: 'Aplicar Cenário B na fila Dúvidas Adm.',
    descricao:
      'Realocar 2 atendentes da fila Reembolso durante 13h-17h. Cenário simulado prevê resolução do gargalo de SLA consolidado em ~25min.',
    impacto: 'SLA +9pp · resolução ~25min',
    acao: 'Aplicar',
    destaque: true,
  },
  {
    titulo: 'Capacitação focada para Equipe B',
    descricao:
      'Programar 4h de treinamento em Dúvidas Adm. para Equipe B. Reduz TMA médio e aumenta autonomia da equipe nas próximas semanas.',
    impacto: 'SLA +4pp · em 7 dias',
    acao: 'Detalhar',
    destaque: false,
  },
  {
    titulo: 'Redimensionar canal Telefone',
    descricao:
      'Canal Telefone responde por 71% SLA com volume crescente. Avaliar redistribuição estrutural para próxima semana.',
    impacto: 'SLA +2pp · análise',
    acao: 'Detalhar',
    destaque: false,
  },
]
