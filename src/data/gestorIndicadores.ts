// Fixtures do "Centro de Indicadores Operacionais" do gestor — Figma 7651:87503
// (+ detalhes 8008:*). Valores extraídos fielmente dos frames. A tela é
// parametrizada pelo indicador ativo (?ind=).

export type IndicadorKey = 'fcr' | 'resolucao' | 'tme' | 'tmef' | 'nps' | 'abandono'

export interface IndicadorKpi {
  key: IndicadorKey
  label: string
  value: string
  status: 'ok' | 'warning' | 'danger'
}

// Cards seletores (linha "Indicadores estratégicos") — 6 KPIs.
export const indicadorKpis: IndicadorKpi[] = [
  { key: 'fcr', label: 'FCR', value: '73%', status: 'warning' },
  { key: 'resolucao', label: 'Resol. de chamados', value: '91%', status: 'ok' },
  { key: 'tme', label: 'TME', value: '12min', status: 'danger' },
  { key: 'tmef', label: 'TMEF', value: '4,2min', status: 'warning' },
  { key: 'nps', label: 'NPS', value: '50', status: 'ok' },
  { key: 'abandono', label: 'Abandono', value: '6,4%', status: 'danger' },
]

export interface Comparacao {
  label: string
  value: string
  tone: 'up' | 'down' | 'neutral'
}

export interface IndicadorDetalhe {
  titulo: string
  subtitulo: string
  valor: string
  delta: string
  deltaSub: string
  deltaTone: 'up' | 'down' | 'neutral'
  meta: number
  serieAtual: number[]
  serieAnterior: number[]
  comparacoes: Comparacao[]
  pioresSegmentos: { label: string; value: string }[]
}

const dias = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom']

export const detalhePorIndicador: Record<IndicadorKey, IndicadorDetalhe> = {
  fcr: {
    titulo: 'Evolução Temporal · FCR',
    subtitulo: '7 dias com comparativo vs semana anterior e vs meta 80%',
    valor: '73%',
    delta: '-3,2 pp',
    deltaSub: 'vs período anterior · meta 80%',
    deltaTone: 'down',
    meta: 80,
    serieAtual: [78, 77, 76, 75, 74, 73, 73],
    serieAnterior: [80, 79, 79, 78, 77, 76, 76],
    comparacoes: [
      { label: 'vs Meta (80%)', value: '-8 pp', tone: 'down' },
      { label: 'vs Semana anterior', value: '-3,2 pp', tone: 'down' },
      { label: 'vs Mesmo dia mês passado', value: '-2,5 pp', tone: 'down' },
    ],
    pioresSegmentos: [
      { label: 'Fila: Reembolso', value: '68%' },
      { label: 'Canal: Telefone', value: '70%' },
      { label: 'Equipe: Eq. B Renata', value: '65%' },
    ],
  },
  resolucao: {
    titulo: 'Evolução Temporal · Resolução',
    subtitulo: '7 dias com comparativo vs semana anterior e vs meta 95%',
    valor: '91%',
    delta: '-1,8 pp',
    deltaSub: 'vs período anterior · meta 95%',
    deltaTone: 'down',
    meta: 95,
    serieAtual: [93, 93, 92, 92, 91, 91, 91],
    serieAnterior: [94, 94, 93, 93, 93, 93, 93],
    comparacoes: [
      { label: 'vs Meta (95%)', value: '-8 pp', tone: 'down' },
      { label: 'vs Semana anterior', value: '-1,8 pp', tone: 'down' },
      { label: 'vs Mesmo dia mês passado', value: '-2,5 pp', tone: 'down' },
    ],
    pioresSegmentos: [
      { label: 'Fila: Carência', value: '78%' },
      { label: 'Canal: Telefone', value: '87%' },
      { label: 'Equipe: Eq. C Patricia', value: '82%' },
    ],
  },
  tme: {
    titulo: 'Evolução Temporal · TME',
    subtitulo: '7 dias com comparativo vs período anterior e vs meta',
    valor: '12min',
    delta: '-4,1min',
    deltaSub: 'vs período anterior · meta 12',
    deltaTone: 'down',
    meta: 12,
    serieAtual: [16, 15, 14, 13, 13, 12, 12],
    serieAnterior: [17, 17, 16, 16, 16, 16, 16],
    comparacoes: [
      { label: 'vs Meta (90%)', value: '-8 pp', tone: 'down' },
      { label: 'vs Semana anterior', value: '-4,1 pp', tone: 'down' },
      { label: 'vs Mesmo dia mês passado', value: '-2,5 pp', tone: 'down' },
    ],
    pioresSegmentos: [
      { label: 'Fila: Dúvidas Adm.', value: '65%' },
      { label: 'Canal: Telefone', value: '71%' },
      { label: 'Equipe: Supervisor B', value: '74%' },
    ],
  },
  tmef: {
    titulo: 'Evolução Temporal · TMEF',
    subtitulo: '24h com comparativo vs benchmark setor 4min',
    valor: '4,2min',
    delta: '+0,3min',
    deltaSub: 'vs período anterior · meta 4min',
    deltaTone: 'down',
    meta: 4,
    serieAtual: [3.8, 3.9, 4.0, 4.1, 4.2, 4.2, 4.2],
    serieAnterior: [3.6, 3.7, 3.8, 3.9, 3.9, 3.9, 3.9],
    comparacoes: [
      { label: 'vs Meta (4min)', value: '-8 pp', tone: 'down' },
      { label: 'vs Semana anterior', value: '+0,3min', tone: 'down' },
      { label: 'vs Mesmo dia mês passado', value: '-2,5 pp', tone: 'down' },
    ],
    pioresSegmentos: [
      { label: 'Fila: Dúvidas Adm.', value: '6,8min' },
      { label: 'Canal: Telefone', value: '5,4min' },
      { label: 'Equipe: Eq. B Renata', value: '6,2min' },
    ],
  },
  nps: {
    titulo: 'Evolução Temporal · NPS',
    subtitulo: 'Trimestre com comparativo vs período anterior',
    valor: '50',
    delta: '-8',
    deltaSub: 'vs período anterior · meta 65',
    deltaTone: 'down',
    meta: 65,
    serieAtual: [58, 56, 54, 53, 52, 51, 50],
    serieAnterior: [60, 60, 59, 59, 58, 58, 58],
    comparacoes: [
      { label: 'vs Meta (65)', value: '-8 pp', tone: 'down' },
      { label: 'vs Semana anterior', value: '-8', tone: 'down' },
      { label: 'vs Mesmo dia mês passado', value: '-2,5 pp', tone: 'down' },
    ],
    pioresSegmentos: [
      { label: 'Fila: Reembolso', value: '38' },
      { label: 'Canal: Telefone', value: '42' },
      { label: 'Equipe: Eq. B Renata', value: '36' },
    ],
  },
  abandono: {
    titulo: 'Evolução Temporal · Abandono',
    subtitulo: '7 dias com comparativo vs benchmark setor 5%',
    valor: '6,4%',
    delta: '+1,4 pp',
    deltaSub: 'vs período anterior · meta 5%',
    deltaTone: 'down',
    meta: 5,
    serieAtual: [4.8, 5.2, 5.6, 6.0, 6.2, 6.4, 6.4],
    serieAnterior: [4.5, 4.6, 4.8, 5.0, 5.0, 5.0, 5.0],
    comparacoes: [
      { label: 'vs Meta (5%)', value: '-8 pp', tone: 'down' },
      { label: 'vs Semana anterior', value: '+1,4 pp', tone: 'down' },
      { label: 'vs Mesmo dia mês passado', value: '-2,5 pp', tone: 'down' },
    ],
    pioresSegmentos: [
      { label: 'Fila: Reembolso', value: '18,2%' },
      { label: 'Canal: Telefone', value: '13,2%' },
      { label: 'Equipe: Eq. C Patricia', value: '8,4%' },
    ],
  },
}

export { dias }

// ── Segmentação (dispersão): Volume × TME, tamanho = volume da equipe, COR = fila.
export type FilaCor = 'duvidas' | 'reembolso' | 'autoriz'

export interface BolhaSegmento {
  nome: string
  volume: number // eixo X
  tme: number // eixo Y (min)
  size: number
  fila: FilaCor
  caption: string
  critico?: boolean
}

export const segmentacao: BolhaSegmento[] = [
  {
    nome: 'Eq.A · WhatsApp·Dúv.Adm',
    volume: 1800,
    tme: 7,
    size: 42,
    fila: 'duvidas',
    caption: '88% · 1.800 atend',
  },
  {
    nome: 'Eq.B · Telefone·Dúv.Adm',
    volume: 620,
    tme: 16,
    size: 28,
    fila: 'duvidas',
    caption: '71%',
  },
  {
    nome: 'Eq.C · Chat·Reembolso',
    volume: 760,
    tme: 8,
    size: 30,
    fila: 'reembolso',
    caption: '82%',
  },
  {
    nome: 'Eq.A · Balcão·Autorizações',
    volume: 300,
    tme: 4,
    size: 22,
    fila: 'autoriz',
    caption: '95%',
  },
  { nome: 'Eq.D · WA·Financeiro', volume: 2600, tme: 6, size: 48, fila: 'autoriz', caption: '98%' },
  {
    nome: 'Eq.B · Tel·Dúv.Adm·Renata',
    volume: 660,
    tme: 18,
    size: 30,
    fila: 'duvidas',
    caption: 'CRÍTICO 65%',
    critico: true,
  },
  { nome: 'Eq.C · Chat·Reemb.', volume: 1150, tme: 9, size: 36, fila: 'reembolso', caption: '82%' },
  {
    nome: 'Eq.A · Tel·Autorizações',
    volume: 2350,
    tme: 12,
    size: 46,
    fila: 'autoriz',
    caption: '84%',
  },
]

export const segmentacaoLegenda = {
  cor: [
    { label: 'Dúvidas Adm.', fila: 'duvidas' as FilaCor },
    { label: 'Reembolso', fila: 'reembolso' as FilaCor },
    { label: 'Autorizações / Financeiro', fila: 'autoriz' as FilaCor },
  ],
}

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
  tendencia: string
  status: 'Crítico' | 'Atenção' | 'OK'
  acao: string
}

export const segmentosCriticos: SegmentoLinha[] = [
  {
    segmento: 'Telefone · Dúvidas Adm. · Eq. B',
    volume: 342,
    atendidos: 298,
    abandonados: 44,
    disponiveis: 12,
    tme: '14min',
    metaTme: '-1min',
    tma: '14min',
    csat: 3,
    tendencia: 'Piorando 7d',
    status: 'Crítico',
    acao: 'Investigar',
  },
  {
    segmento: 'Telefone · Reembolso · Eq. C',
    volume: 287,
    atendidos: 241,
    abandonados: 46,
    disponiveis: 8,
    tme: '10min',
    metaTme: '-16min',
    tma: '10min',
    csat: 3,
    tendencia: 'Piorando 3d',
    status: 'Atenção',
    acao: 'Investigar',
  },
  {
    segmento: 'Telefone · Autorizações · Eq. A',
    volume: 256,
    atendidos: 213,
    abandonados: 43,
    disponiveis: 10,
    tme: '11min',
    metaTme: '-19min',
    tma: '11min',
    csat: 3,
    tendencia: 'Estável',
    status: 'Atenção',
    acao: 'Investigar',
  },
  {
    segmento: 'Chat · Dúvidas Adm. · Eq. B',
    volume: 412,
    atendidos: 378,
    abandonados: 34,
    disponiveis: 15,
    tme: '5min',
    metaTme: '-8min',
    tma: '5min',
    csat: 5,
    tendencia: 'Estável',
    status: 'Atenção',
    acao: 'Investigar',
  },
  {
    segmento: 'WhatsApp · Dúvidas Adm. · Eq. A',
    volume: 528,
    atendidos: 489,
    abandonados: 39,
    disponiveis: 18,
    tme: '4min',
    metaTme: '-5min',
    tma: '4min',
    csat: 5,
    tendencia: 'Melhorando',
    status: 'OK',
    acao: '—',
  },
  {
    segmento: 'Chat · Reembolso · Eq. C',
    volume: 318,
    atendidos: 276,
    abandonados: 42,
    disponiveis: 11,
    tme: '6min',
    metaTme: '-9min',
    tma: '6min',
    csat: 3,
    tendencia: 'Estável',
    status: 'Atenção',
    acao: 'Investigar',
  },
  {
    segmento: 'WhatsApp · Autorizações · Eq. A',
    volume: 245,
    atendidos: 221,
    abandonados: 24,
    disponiveis: 14,
    tme: '3min',
    metaTme: '+8min',
    tma: '3min',
    csat: 5,
    tendencia: 'Melhorando',
    status: 'OK',
    acao: '—',
  },
  {
    segmento: 'Balcão · Autorizações · Eq. D',
    volume: 94,
    atendidos: 82,
    abandonados: 12,
    disponiveis: 7,
    tme: '2min',
    metaTme: '+7min',
    tma: '2min',
    csat: 5,
    tendencia: 'Estável',
    status: 'OK',
    acao: '—',
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
  'A queda de 4,1pp no SLA concentra-se na fila Dúvidas Administrativas (65% SLA, -8pp vs meta) durante a janela 13h-17h. Demanda atípica iniciada na 4ª feira (+27% vs base histórica) precedeu o impacto, com Equipe B como foco operacional.'

export const recomendacoes: Recomendacao[] = [
  {
    titulo: 'Aplicar Cenário B na fila Dúvidas Adm.',
    descricao:
      'Reforçar Equipe B com 2 atendentes da fila Reembolso durante 13h-17h. Cenário simulado prevê resolução do gargalo do SLA consolidado em ~25min.',
    impacto: 'SLA +9pp · resolução em ~25min',
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
    impacto: 'SLA +2pp · análise para próxima semana',
    acao: 'Detalhar',
    destaque: false,
  },
]
